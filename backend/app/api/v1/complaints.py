from typing import Any, List, Optional
import random
import time
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User
from app.models.student import Student
from app.models.communication import Complaint, ComplaintStatus, ComplaintPriority
from app.schemas.communication import ComplaintCreate, ComplaintResponse, ComplaintUpdateStatus

router = APIRouter()


async def get_or_create_student_profile(db: AsyncSession, user: User) -> Student:
    """Helper to retrieve student profile or create a fallback profile for logged in user."""
    student = await db.scalar(select(Student).where(Student.user_id == user.id))
    if not student:
        enrollment_num = f"STU-{user.id:04d}"
        student = Student(
            user_id=user.id,
            enrollment_number=enrollment_num,
            batch="2024-2028"
        )
        db.add(student)
        await db.commit()
        await db.refresh(student)
    return student


def generate_ticket_number() -> str:
    date_str = datetime.now().strftime("%Y%m%d")
    rand_num = random.randint(1000, 9999)
    return f"CMP-{date_str}-{rand_num}"


@router.post("/", response_model=ComplaintResponse)
async def create_complaint(
    complaint_in: ComplaintCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Student creates a new complaint."""
    student = await get_or_create_student_profile(db, current_user)
    
    # Generate unique ticket number
    ticket_num = generate_ticket_number()
    while await db.scalar(select(Complaint).where(Complaint.ticket_number == ticket_num)):
        ticket_num = generate_ticket_number()

    complaint = Complaint(
        ticket_number=ticket_num,
        student_id=student.id,
        subject=complaint_in.subject,
        description=complaint_in.description,
        category=complaint_in.category or "General",
        priority=complaint_in.priority or ComplaintPriority.MEDIUM,
        status=ComplaintStatus.OPEN,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(complaint)
    await db.commit()
    await db.refresh(complaint)

    response_data = ComplaintResponse.model_validate(complaint)
    response_data.student_name = current_user.full_name or "Student"
    response_data.student_enrollment = student.enrollment_number
    return response_data


@router.get("/my", response_model=List[ComplaintResponse])
async def get_my_complaints(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Retrieve logged-in student's complaints."""
    student = await get_or_create_student_profile(db, current_user)
    
    stmt = (
        select(Complaint)
        .where(Complaint.student_id == student.id)
        .order_by(desc(Complaint.created_at))
    )
    result = await db.scalars(stmt)
    complaints = result.all()

    response_list = []
    for c in complaints:
        item = ComplaintResponse.model_validate(c)
        item.student_name = current_user.full_name or "Student"
        item.student_enrollment = student.enrollment_number
        response_list.append(item)

    return response_list


@router.get("/kpi")
async def get_student_complaint_kpis(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get complaint count statistics for logged-in student."""
    student = await get_or_create_student_profile(db, current_user)

    stmt = select(Complaint).where(Complaint.student_id == student.id)
    complaints = (await db.scalars(stmt)).all()

    total = len(complaints)
    open_count = sum(1 for c in complaints if c.status == ComplaintStatus.OPEN)
    in_progress = sum(1 for c in complaints if c.status == ComplaintStatus.IN_PROGRESS)
    resolved = sum(1 for c in complaints if c.status == ComplaintStatus.RESOLVED)
    closed = sum(1 for c in complaints if c.status == ComplaintStatus.CLOSED)

    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress,
        "resolved": resolved,
        "closed": closed
    }


@router.get("/admin/all", response_model=List[ComplaintResponse])
async def get_all_complaints_admin(
    status_filter: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Admin view: Retrieve all student complaints in real-time."""
    stmt = select(Complaint, Student, User).join(Student, Complaint.student_id == Student.id).join(User, Student.user_id == User.id)

    if status_filter and status_filter.upper() != "ALL":
        try:
            status_enum = ComplaintStatus[status_filter.upper()]
            stmt = stmt.where(Complaint.status == status_enum)
        except KeyError:
            pass

    stmt = stmt.order_by(desc(Complaint.created_at))
    rows = (await db.execute(stmt)).all()

    result = []
    for complaint, student, user in rows:
        item = ComplaintResponse.model_validate(complaint)
        item.student_name = user.full_name or "Student"
        item.student_enrollment = student.enrollment_number
        result.append(item)

    return result


@router.get("/admin/stats")
async def get_admin_complaint_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Admin view: Retrieve overall complaint statistics."""
    complaints = (await db.scalars(select(Complaint))).all()

    total = len(complaints)
    open_count = sum(1 for c in complaints if c.status == ComplaintStatus.OPEN)
    in_progress = sum(1 for c in complaints if c.status == ComplaintStatus.IN_PROGRESS)
    resolved = sum(1 for c in complaints if c.status == ComplaintStatus.RESOLVED)
    closed = sum(1 for c in complaints if c.status == ComplaintStatus.CLOSED)

    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress,
        "resolved": resolved,
        "closed": closed
    }


@router.patch("/{complaint_id}/status", response_model=ComplaintResponse)
async def update_complaint_status(
    complaint_id: int,
    body: ComplaintUpdateStatus,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Admin endpoint to update complaint status and add resolution comments."""
    complaint = await db.get(Complaint, complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if body.status is not None:
        complaint.status = body.status
    if body.priority is not None:
        complaint.priority = body.priority
    if body.resolution is not None:
        complaint.resolution = body.resolution
    if body.assigned_to is not None:
        complaint.assigned_to = body.assigned_to

    complaint.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(complaint)

    # Fetch student and user details
    student = await db.get(Student, complaint.student_id)
    student_name = "Student"
    student_enrollment = "N/A"
    if student:
        user = await db.get(User, student.user_id)
        if user:
            student_name = user.full_name or "Student"
        student_enrollment = student.enrollment_number

    item = ComplaintResponse.model_validate(complaint)
    item.student_name = student_name
    item.student_enrollment = student_enrollment
    return item

