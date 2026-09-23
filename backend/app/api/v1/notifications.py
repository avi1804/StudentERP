from datetime import datetime, date
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select, or_, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role
from app.models.communication import Notification, Notice
from app.models.assignment import Assignment, AssignmentSubmission
from app.models.placement import PlacementDrive, PlacementCompany, PlacementApplication
from app.models.communication import Complaint
from app.models.subject import Subject
from app.models.faculty import Faculty
from app.models.student import Student

router = APIRouter()


def format_time_ago(dt: Optional[datetime]) -> str:
    if not dt:
        return "Recent"
    now = datetime.utcnow()
    diff = (now - dt).total_seconds()
    if diff < 0:
        # Future date
        future_days = int(abs(diff) // 86400)
        if future_days == 0:
            return "Today"
        return f"In {future_days}d"
    if diff < 60:
        return "Just now"
    elif diff < 3600:
        mins = max(1, int(diff // 60))
        return f"{mins}m ago"
    elif diff < 86400:
        hours = max(1, int(diff // 3600))
        return f"{hours}h ago"
    elif diff < 172800:
        return "Yesterday"
    else:
        days = int(diff // 86400)
        if days < 30:
            return f"{days}d ago"
        return dt.strftime("%b %d")


class NotificationItem(BaseModel):
    id: str
    type: str
    badge: str
    title: str
    subtitle: str
    time: str
    link: Optional[str] = None
    is_read: bool = False
    created_at: str
    sender_role: Optional[str] = None
    sender_name: Optional[str] = None


class NotificationCreateRequest(BaseModel):
    title: str
    message: str
    category: Optional[str] = "NOTICE"
    target_role: Optional[str] = "student"  # 'all', 'student', 'faculty', 'placement', 'admin'
    sender_name: Optional[str] = None
    link: Optional[str] = None
    user_id: Optional[int] = None


def get_user_role_str(user: User) -> str:
    if hasattr(user, "role") and user.role:
        if hasattr(user.role, "name"):
            return str(user.role.name).lower()
        return str(user.role).lower()
    return "student"


@router.get("/my-notifications", response_model=List[NotificationItem])
async def get_my_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get real-time dynamic notifications for the current user's role:
    Aggregates explicit notifications and live cross-role triggers (faculty, admin, placement, student).
    """
    notifications: List[dict] = []
    user_role = get_user_role_str(current_user)
    user_id = getattr(current_user, "id", None)

    # 1. Fetch explicit records from notifications table
    role_targets = ["all", user_role]
    if user_role in ["placement", "placement_admin"]:
        role_targets.extend(["placement", "placement_admin"])

    try:
        where_conds = [Notification.target_role.in_(role_targets)]
        if user_id is not None:
            where_conds.append(Notification.user_id == user_id)

        notif_stmt = (
            select(Notification)
            .where(or_(*where_conds))
            .order_by(desc(Notification.created_at))
            .limit(15)
        )
        notif_res = await db.execute(notif_stmt)
        for n in notif_res.scalars().all():
            badge = (n.sender_role or "SYSTEM").upper()
            if badge == "PLACEMENT_ADMIN":
                badge = "PLACEMENT"
            notifications.append({
                "id": f"notif-{n.id}",
                "type": n.category or "Notice",
                "badge": badge,
                "title": n.title,
                "subtitle": n.message[:75] + ("..." if len(n.message) > 75 else ""),
                "time": format_time_ago(n.created_at),
                "link": n.link or ("/dashboard/notices" if user_role == "student" else "/faculty/notices" if user_role == "faculty" else "/placement-admin/notifications"),
                "is_read": n.is_read,
                "created_at": n.created_at or datetime.utcnow(),
                "sender_role": n.sender_role,
                "sender_name": n.sender_name or "Campus Administration"
            })
    except Exception as e:
        print("Error fetching explicit notifications:", e)

    # 2. Cross-role live database event feeds
    try:
        if user_role == "student":
            # (A) Faculty assignments
            asg_stmt = (
                select(Assignment, Subject, Faculty, User)
                .join(Subject, Assignment.subject_id == Subject.id)
                .join(Faculty, Assignment.faculty_id == Faculty.id)
                .join(User, Faculty.user_id == User.id)
                .order_by(desc(Assignment.created_at))
                .limit(4)
            )
            asg_res = await db.execute(asg_stmt)
            for asg, subj, fac, fac_user in asg_res.all():
                notifications.append({
                    "id": f"asg-{asg.id}",
                    "type": "Assignment",
                    "badge": "FACULTY",
                    "title": f"Assignment: {asg.title}",
                    "subtitle": f"Prof. {fac_user.full_name} · {subj.name} · Due {asg.due_date}",
                    "time": format_time_ago(asg.created_at),
                    "link": "/dashboard/assignments",
                    "is_read": False,
                    "created_at": asg.created_at,
                    "sender_role": "faculty",
                    "sender_name": fac_user.full_name
                })

            # (B) Placement drives
            drv_stmt = (
                select(PlacementDrive, PlacementCompany)
                .join(PlacementCompany, PlacementDrive.company_id == PlacementCompany.id)
                .order_by(desc(PlacementDrive.id))
                .limit(4)
            )
            drv_res = await db.execute(drv_stmt)
            for drv, comp in drv_res.all():
                deadline_str = drv.registration_deadline.strftime("%b %d") if drv.registration_deadline else "Open"
                notifications.append({
                    "id": f"drv-{drv.id}",
                    "type": "Placement",
                    "badge": "PLACEMENT",
                    "title": f"Drive: {comp.name} - {drv.title}",
                    "subtitle": f"Package: {drv.package_offered or 'Competitive'} · Apply by {deadline_str}",
                    "time": format_time_ago(drv.registration_deadline or datetime.utcnow()),
                    "link": "/dashboard/placement",
                    "is_read": False,
                    "created_at": drv.registration_deadline or datetime.utcnow(),
                    "sender_role": "placement",
                    "sender_name": "Placement Cell"
                })

            # (C) Admin & Faculty Notices
            notice_stmt = (
                select(Notice, User, Role)
                .outerjoin(User, Notice.author_id == User.id)
                .outerjoin(Role, User.role_id == Role.id)
                .where(Notice.is_active == True)
                .order_by(desc(Notice.created_at))
                .limit(4)
            )
            notice_res = await db.execute(notice_stmt)
            for notice, author, author_role in notice_res.all():
                role_name = (author_role.name if author_role else "admin").upper()
                badge = "ADMIN" if "ADMIN" in role_name else "FACULTY"
                notifications.append({
                    "id": f"notice-{notice.id}",
                    "type": notice.category.value if hasattr(notice.category, "value") else str(notice.category),
                    "badge": badge,
                    "title": notice.title,
                    "subtitle": notice.content[:70] + ("..." if len(notice.content) > 70 else ""),
                    "time": format_time_ago(notice.created_at),
                    "link": "/dashboard/notices",
                    "is_read": False,
                    "created_at": notice.created_at,
                    "sender_role": role_name.lower(),
                    "sender_name": author.full_name if author else "Admin Office"
                })

        elif user_role == "faculty":
            # (A) Student submissions
            sub_stmt = (
                select(AssignmentSubmission, Assignment, Student, User)
                .join(Assignment, AssignmentSubmission.assignment_id == Assignment.id)
                .join(Student, AssignmentSubmission.student_id == Student.id)
                .join(User, Student.user_id == User.id)
                .order_by(desc(AssignmentSubmission.submitted_at))
                .limit(5)
            )
            sub_res = await db.execute(sub_stmt)
            for sub, asg, std, std_user in sub_res.all():
                notifications.append({
                    "id": f"sub-{sub.id}",
                    "type": "Submission",
                    "badge": "STUDENT",
                    "title": f"Assignment Submitted: {asg.title}",
                    "subtitle": f"{std_user.full_name} ({std.enrollment_number}) submitted solution",
                    "time": format_time_ago(sub.submitted_at),
                    "link": "/faculty/assignments",
                    "is_read": False,
                    "created_at": sub.submitted_at,
                    "sender_role": "student",
                    "sender_name": std_user.full_name
                })

            # (B) Admin Notices
            notice_stmt = (
                select(Notice, User)
                .outerjoin(User, Notice.author_id == User.id)
                .where(Notice.is_active == True)
                .order_by(desc(Notice.created_at))
                .limit(4)
            )
            notice_res = await db.execute(notice_stmt)
            for notice, author in notice_res.all():
                notifications.append({
                    "id": f"notice-{notice.id}",
                    "type": "Notice",
                    "badge": "ADMIN",
                    "title": notice.title,
                    "subtitle": notice.content[:70] + ("..." if len(notice.content) > 70 else ""),
                    "time": format_time_ago(notice.created_at),
                    "link": "/faculty/notices",
                    "is_read": False,
                    "created_at": notice.created_at,
                    "sender_role": "admin",
                    "sender_name": author.full_name if author else "Administration"
                })

            # (C) Placement Updates
            drv_stmt = (
                select(PlacementDrive, PlacementCompany)
                .join(PlacementCompany, PlacementDrive.company_id == PlacementCompany.id)
                .order_by(desc(PlacementDrive.id))
                .limit(3)
            )
            drv_res = await db.execute(drv_stmt)
            for drv, comp in drv_res.all():
                notifications.append({
                    "id": f"drv-{drv.id}",
                    "type": "Placement",
                    "badge": "PLACEMENT",
                    "title": f"Placement Drive: {comp.name}",
                    "subtitle": f"{drv.title} · Date: {drv.drive_date}",
                    "time": format_time_ago(datetime.combine(drv.drive_date, datetime.min.time()) if drv.drive_date else datetime.utcnow()),
                    "link": "/faculty/dashboard",
                    "is_read": False,
                    "created_at": datetime.combine(drv.drive_date, datetime.min.time()) if drv.drive_date else datetime.utcnow(),
                    "sender_role": "placement",
                    "sender_name": "Placement Cell"
                })

        elif user_role in ["placement", "placement_admin"]:
            # (A) Student Applications for Placement Drives
            app_stmt = (
                select(PlacementApplication, PlacementDrive, PlacementCompany, Student, User)
                .join(PlacementDrive, PlacementApplication.drive_id == PlacementDrive.id)
                .join(PlacementCompany, PlacementDrive.company_id == PlacementCompany.id)
                .join(Student, PlacementApplication.student_id == Student.id)
                .join(User, Student.user_id == User.id)
                .order_by(desc(PlacementApplication.applied_on))
                .limit(6)
            )
            app_res = await db.execute(app_stmt)
            for app, drv, comp, std, std_user in app_res.all():
                notifications.append({
                    "id": f"app-{app.id}",
                    "type": "Application",
                    "badge": "STUDENT",
                    "title": f"New Application: {comp.name}",
                    "subtitle": f"{std_user.full_name} ({std.enrollment_number}) applied for {drv.title}",
                    "time": format_time_ago(app.applied_on),
                    "link": "/placement-admin/applications",
                    "is_read": False,
                    "created_at": app.applied_on,
                    "sender_role": "student",
                    "sender_name": std_user.full_name
                })

            # (B) Drives milestones / active drives
            drv_stmt = (
                select(PlacementDrive, PlacementCompany)
                .join(PlacementCompany, PlacementDrive.company_id == PlacementCompany.id)
                .order_by(desc(PlacementDrive.id))
                .limit(4)
            )
            drv_res = await db.execute(drv_stmt)
            for drv, comp in drv_res.all():
                notifications.append({
                    "id": f"drv-{drv.id}",
                    "type": "Drive",
                    "badge": "DRIVE",
                    "title": f"{comp.name} Drive Scheduled",
                    "subtitle": f"{drv.title} · Date: {drv.drive_date} · Min CGPA: {drv.eligibility_cgpa}",
                    "time": format_time_ago(datetime.combine(drv.drive_date, datetime.min.time()) if drv.drive_date else datetime.utcnow()),
                    "link": "/placement-admin/drives",
                    "is_read": False,
                    "created_at": datetime.combine(drv.drive_date, datetime.min.time()) if drv.drive_date else datetime.utcnow(),
                    "sender_role": "placement",
                    "sender_name": "Placement Admin"
                })

            # (C) Admin announcements
            notice_stmt = (
                select(Notice, User)
                .outerjoin(User, Notice.author_id == User.id)
                .where(Notice.is_active == True)
                .order_by(desc(Notice.created_at))
                .limit(3)
            )
            notice_res = await db.execute(notice_stmt)
            for notice, author in notice_res.all():
                notifications.append({
                    "id": f"notice-{notice.id}",
                    "type": "Notice",
                    "badge": "ADMIN",
                    "title": notice.title,
                    "subtitle": notice.content[:70] + ("..." if len(notice.content) > 70 else ""),
                    "time": format_time_ago(notice.created_at),
                    "link": "/placement-admin/notifications",
                    "is_read": False,
                    "created_at": notice.created_at,
                    "sender_role": "admin",
                    "sender_name": author.full_name if author else "Admin Office"
                })

        elif user_role == "admin":
            # (A) Student Complaints
            cmp_stmt = (
                select(Complaint, Student, User)
                .join(Student, Complaint.student_id == Student.id)
                .join(User, Student.user_id == User.id)
                .order_by(desc(Complaint.created_at))
                .limit(4)
            )
            cmp_res = await db.execute(cmp_stmt)
            for cmp, std, std_user in cmp_res.all():
                prio = cmp.priority.value if hasattr(cmp.priority, "value") else str(cmp.priority)
                stat = cmp.status.value if hasattr(cmp.status, "value") else str(cmp.status)
                notifications.append({
                    "id": f"cmp-{cmp.id}",
                    "type": "Complaint",
                    "badge": "STUDENT",
                    "title": f"Complaint: {cmp.subject}",
                    "subtitle": f"By {std_user.full_name} · Priority: {prio} ({stat})",
                    "time": format_time_ago(cmp.created_at),
                    "link": "/admin/complaints",
                    "is_read": False,
                    "created_at": cmp.created_at,
                    "sender_role": "student",
                    "sender_name": std_user.full_name
                })

            # (B) Faculty Assignments
            asg_stmt = (
                select(Assignment, Subject, Faculty, User)
                .join(Subject, Assignment.subject_id == Subject.id)
                .join(Faculty, Assignment.faculty_id == Faculty.id)
                .join(User, Faculty.user_id == User.id)
                .order_by(desc(Assignment.created_at))
                .limit(4)
            )
            asg_res = await db.execute(asg_stmt)
            for asg, subj, fac, fac_user in asg_res.all():
                notifications.append({
                    "id": f"asg-{asg.id}",
                    "type": "Assignment",
                    "badge": "FACULTY",
                    "title": f"Faculty Assignment: {asg.title}",
                    "subtitle": f"Created by Prof. {fac_user.full_name} for {subj.name}",
                    "time": format_time_ago(asg.created_at),
                    "link": "/admin/dashboard",
                    "is_read": False,
                    "created_at": asg.created_at,
                    "sender_role": "faculty",
                    "sender_name": fac_user.full_name
                })

            # (C) Placement Drives
            drv_stmt = (
                select(PlacementDrive, PlacementCompany)
                .join(PlacementCompany, PlacementDrive.company_id == PlacementCompany.id)
                .order_by(desc(PlacementDrive.id))
                .limit(4)
            )
            drv_res = await db.execute(drv_stmt)
            for drv, comp in drv_res.all():
                notifications.append({
                    "id": f"drv-{drv.id}",
                    "type": "Placement",
                    "badge": "PLACEMENT",
                    "title": f"Placement Drive: {comp.name}",
                    "subtitle": f"{drv.title} · Package: {drv.package_offered or 'N/A'}",
                    "time": format_time_ago(datetime.combine(drv.drive_date, datetime.min.time()) if drv.drive_date else datetime.utcnow()),
                    "link": "/admin/dashboard",
                    "is_read": False,
                    "created_at": datetime.combine(drv.drive_date, datetime.min.time()) if drv.drive_date else datetime.utcnow(),
                    "sender_role": "placement",
                    "sender_name": "Placement Cell"
                })

    except Exception as e:
        print("Error fetching cross-role live feeds:", e)

    # 3. Sort unified list by created_at descending
    def get_sort_key(item: dict) -> datetime:
        ca = item.get("created_at")
        if isinstance(ca, datetime):
            return ca
        if isinstance(ca, date):
            return datetime.combine(ca, datetime.min.time())
        return datetime.min

    notifications.sort(key=get_sort_key, reverse=True)

    # Convert created_at to ISO string for frontend JSON serialization
    results: List[NotificationItem] = []
    seen_ids = set()
    for item in notifications:
        if item["id"] in seen_ids:
            continue
        seen_ids.add(item["id"])
        ca = item["created_at"]
        iso_str = ca.isoformat() if hasattr(ca, "isoformat") else str(ca)
        results.append(NotificationItem(
            id=str(item["id"]),
            type=item["type"],
            badge=item["badge"],
            title=item["title"],
            subtitle=item["subtitle"],
            time=item["time"],
            link=item.get("link"),
            is_read=item.get("is_read", False),
            created_at=iso_str,
            sender_role=item.get("sender_role"),
            sender_name=item.get("sender_name")
        ))
        if len(results) >= 15:
            break

    # If empty, provide a clean default welcome
    if not results:
        results.append(NotificationItem(
            id="default-welcome",
            type="System",
            badge="LIVE",
            title="Welcome to StudentERP",
            subtitle="Campus system notifications and cross-role updates will appear here.",
            time="Just now",
            link="/dashboard",
            is_read=False,
            created_at=datetime.utcnow().isoformat(),
            sender_role="system",
            sender_name="System"
        ))

    return results


@router.post("/", response_model=NotificationItem, status_code=status.HTTP_201_CREATED)
async def create_notification(
    payload: NotificationCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin", "faculty", "placement", "placement_admin"]))
) -> Any:
    """
    Broadcast or send direct notifications (Admin, Faculty, Placement Officer).
    """
    user_role = get_user_role_str(current_user)
    sender_name = payload.sender_name or current_user.full_name or "Campus Authority"
    sender_role = "placement" if user_role in ["placement", "placement_admin"] else user_role

    notif = Notification(
        user_id=payload.user_id,
        title=payload.title,
        message=payload.message,
        category=payload.category or "NOTICE",
        sender_role=sender_role,
        sender_name=sender_name,
        target_role=payload.target_role or "all",
        link=payload.link,
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.add(notif)
    await db.commit()
    await db.refresh(notif)

    return NotificationItem(
        id=f"notif-{notif.id}",
        type=notif.category or "Notice",
        badge=sender_role.upper(),
        title=notif.title,
        subtitle=notif.message,
        time="Just now",
        link=notif.link,
        is_read=notif.is_read,
        created_at=notif.created_at.isoformat(),
        sender_role=notif.sender_role,
        sender_name=notif.sender_name
    )


@router.put("/{id}/read")
async def mark_notification_as_read(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Mark an explicit notification as read.
    """
    if id.startswith("notif-"):
        real_id = int(id.replace("notif-", ""))
        stmt = select(Notification).where(Notification.id == real_id)
        res = await db.execute(stmt)
        notif = res.scalar_one_or_none()
        if notif:
            notif.is_read = True
            await db.commit()
    return {"status": "success", "id": id}
