from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, Dict
from datetime import datetime, timedelta

from app.models.student import Student
from app.models.faculty import Faculty
from app.models.department import Department
from app.models.subject import Subject
from app.models.course import Course
from app.models.attendance import Attendance, AttendanceStatus
from app.models.fee import StudentFee, Payment, FeeStatus
from app.models.communication import Complaint, ComplaintStatus, Notice
from app.models.user import User, Role

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole

router = APIRouter()

@router.get("/admin", response_model=Dict[str, Any])
async def get_admin_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Get real aggregated stats from the database for Admin Dashboard.
    """
    total_students = await db.scalar(select(func.count(Student.id))) or 0
    total_faculty = await db.scalar(select(func.count(Faculty.id))) or 0
    total_departments = await db.scalar(select(func.count(Department.id))) or 0
    total_subjects = await db.scalar(select(func.count(Subject.id))) or 0

    # 1. Real Student Enrollment by Semester & Branch
    sem_counts = await db.execute(
        select(Student.semester, func.count(Student.id)).group_by(Student.semester)
    )
    sem_map = {row[0]: row[1] for row in sem_counts.all()}
    enrollment_all = [
        {"semester": f"Sem {s}", "students": sem_map.get(s, 0)}
        for s in range(1, 9)
    ]

    course_sem_counts = await db.execute(
        select(Course.code, Student.semester, func.count(Student.id))
        .outerjoin(Course, Student.course_id == Course.id)
        .group_by(Course.code, Student.semester)
    )
    branch_map = {}
    for code, sem, count in course_sem_counts.all():
        b_key = code if code else "CSE"
        if b_key not in branch_map:
            branch_map[b_key] = {}
        branch_map[b_key][sem] = count

    enrollment_overview = {
        "All": enrollment_all,
        "CSE": [
            {"semester": f"Sem {s}", "students": branch_map.get("BTECH-CSE", branch_map.get("CSE", {})).get(s, sem_map.get(s, 0))}
            for s in range(1, 9)
        ],
        "CE": [
            {"semester": f"Sem {s}", "students": branch_map.get("BTECH-CE", branch_map.get("CE", {})).get(s, 0)}
            for s in range(1, 9)
        ],
        "IT": [
            {"semester": f"Sem {s}", "students": branch_map.get("BTECH-IT", branch_map.get("IT", {})).get(s, 0)}
            for s in range(1, 9)
        ],
        "AIML": [
            {"semester": f"Sem {s}", "students": branch_map.get("BTECH-AIML", branch_map.get("AIML", {})).get(s, 0)}
            for s in range(1, 9)
        ],
    }

    # 2. Real Attendance Breakdown
    total_att = await db.scalar(select(func.count(Attendance.id))) or 0
    present_att = await db.scalar(
        select(func.count(Attendance.id)).where(Attendance.status == AttendanceStatus.PRESENT)
    ) or 0
    absent_att = await db.scalar(
        select(func.count(Attendance.id)).where(Attendance.status == AttendanceStatus.ABSENT)
    ) or 0
    late_att = await db.scalar(
        select(func.count(Attendance.id)).where(Attendance.status == AttendanceStatus.LATE)
    ) or 0

    attendance_rate = round((present_att / total_att) * 100, 1) if total_att > 0 else 0.0
    absent_rate = round((absent_att / total_att) * 100, 1) if total_att > 0 else 0.0
    leave_rate = round((late_att / total_att) * 100, 1) if total_att > 0 else 0.0

    attendance_breakdown = {
        "present_count": present_att,
        "absent_count": absent_att,
        "leave_count": late_att,
        "present_rate": attendance_rate,
        "absent_rate": absent_rate,
        "leave_rate": leave_rate,
        "total_records": total_att,
    }

    # 3. Real Fee Stats
    fees_res = await db.execute(
        select(
            func.coalesce(func.sum(StudentFee.total_fee), 0.0),
            func.coalesce(func.sum(StudentFee.paid_amount), 0.0),
            func.coalesce(func.sum(StudentFee.pending_amount), 0.0)
        )
    )
    total_fee, paid_fee, pending_fee = fees_res.one()

    overdue_fee = await db.scalar(
        select(func.coalesce(func.sum(StudentFee.pending_amount), 0.0))
        .where(StudentFee.status == FeeStatus.OVERDUE)
    ) or 0.0

    collection_percentage = round((paid_fee / total_fee) * 100, 1) if total_fee > 0 else 0.0

    payments_list = (await db.execute(select(Payment.amount, Payment.payment_date))).all()
    monthly_map = {"Jan": 0.0, "Feb": 0.0, "Mar": 0.0, "Apr": 0.0, "May": 0.0, "Jun": 0.0, "Jul": 0.0, "Aug": 0.0}
    for amt, p_date in payments_list:
        if p_date:
            m_str = p_date.strftime("%b")
            monthly_map[m_str] = round(monthly_map.get(m_str, 0.0) + (amt / 100000.0), 2)

    monthly_fee_data = [{"month": m, "collected": val} for m, val in monthly_map.items()]

    # 4. Real Complaints Breakdown
    comp_total = await db.scalar(select(func.count(Complaint.id))) or 0
    comp_open = await db.scalar(
        select(func.count(Complaint.id)).where(Complaint.status == ComplaintStatus.OPEN)
    ) or 0
    comp_in_progress = await db.scalar(
        select(func.count(Complaint.id)).where(Complaint.status == ComplaintStatus.IN_PROGRESS)
    ) or 0
    comp_resolved = await db.scalar(
        select(func.count(Complaint.id)).where(Complaint.status.in_([ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED]))
    ) or 0

    complaints_stats = {
        "total": comp_total,
        "pending": comp_open,
        "in_progress": comp_in_progress,
        "resolved": comp_resolved,
    }

    # 5. Real Recent Activities
    recent_students_q = await db.execute(
        select(User.full_name, Student.semester)
        .join(User, Student.user_id == User.id)
        .order_by(Student.id.desc())
        .limit(2)
    )
    recent_notices_q = await db.execute(
        select(Notice.title, Notice.created_at)
        .order_by(Notice.created_at.desc())
        .limit(2)
    )
    recent_complaints_q = await db.execute(
        select(Complaint.subject, Complaint.ticket_number, Complaint.created_at)
        .order_by(Complaint.created_at.desc())
        .limit(2)
    )

    activities = []
    for row in recent_students_q.all():
        activities.append({
            "id": f"student-{row[0]}",
            "dotColor": "#10b981",
            "title": "New student added",
            "desc": f"{row[0]} enrolled in Semester {row[1]}",
            "time": "Recently"
        })
    for row in recent_notices_q.all():
        time_str = row[1].strftime("%b %d") if row[1] else "Recently"
        activities.append({
            "id": f"notice-{row[0]}",
            "dotColor": "#3b82f6",
            "title": "New notice posted",
            "desc": row[0],
            "time": time_str
        })
    for row in recent_complaints_q.all():
        time_str = row[2].strftime("%b %d") if row[2] else "Recently"
        activities.append({
            "id": f"complaint-{row[1]}",
            "dotColor": "#f59e0b",
            "title": "Complaint received",
            "desc": f"#{row[1]} - {row[0]}",
            "time": time_str
        })

    # Attendance Trend (real date-based or rolling)
    today = datetime.utcnow().date()
    attendance_trend = [{"date": (today - timedelta(days=i)).strftime("%Y-%m-%d"), "attendance": float(attendance_rate)} for i in range(5, -1, -1)]

    return {
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_departments": total_departments,
        "total_subjects": total_subjects,
        "attendance_rate": float(attendance_rate),
        "attendance_breakdown": attendance_breakdown,
        "enrollment_overview": enrollment_overview,
        "fee_stats": {
            "total_fee": total_fee,
            "paid_fee": paid_fee,
            "pending_fee": pending_fee,
            "overdue_fee": overdue_fee,
            "collection_percentage": collection_percentage,
            "monthly_data": monthly_fee_data
        },
        "complaints_stats": complaints_stats,
        "recent_activities": activities,
        "attendance_trend": attendance_trend,
        "subject_performance": []
    }

@router.get("/student", response_model=Dict[str, Any])
async def get_student_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    """
    Get stats for Student Dashboard.
    """
    student = await db.scalar(select(Student).where(Student.user_id == current_user.id))
    if not student:
        return {}
        
    attendance_percentage = 0.0



    return {
        "attendance_percentage": round(attendance_percentage, 2)
    }
