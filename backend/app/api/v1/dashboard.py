from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, Dict

from app.models.student import Student
from app.models.faculty import Faculty
from app.models.department import Department
from app.models.subject import Subject
from app.models.attendance import Attendance
from app.models.fees import Fees, FeeStatus
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role

router = APIRouter()

@router.get("/admin", response_model=Dict[str, Any])
async def get_admin_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Get aggregated stats for Admin Dashboard.
    """
    total_students = await db.scalar(select(func.count(Student.id)))
    total_faculty = await db.scalar(select(func.count(Faculty.id)))
    total_departments = await db.scalar(select(func.count(Department.id)))
    total_subjects = await db.scalar(select(func.count(Subject.id)))
    
    pending_fees_total = await db.scalar(
        select(func.sum(Fees.amount)).where(Fees.status == FeeStatus.PENDING)
    )
    
    return {
        "total_students": total_students or 0,
        "total_faculty": total_faculty or 0,
        "total_departments": total_departments or 0,
        "total_subjects": total_subjects or 0,
        "pending_fees_total": pending_fees_total or 0.0
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
        
    total_attendance_records = await db.scalar(
        select(func.count(Attendance.id)).where(Attendance.student_id == student.id)
    )
    present_attendance_records = await db.scalar(
        select(func.count(Attendance.id)).where(Attendance.student_id == student.id, Attendance.is_present == True)
    )
    
    attendance_percentage = 0.0
    if total_attendance_records and total_attendance_records > 0:
        attendance_percentage = (present_attendance_records / total_attendance_records) * 100

    pending_fees = await db.scalar(
        select(func.sum(Fees.amount)).where(Fees.student_id == student.id, Fees.status == FeeStatus.PENDING)
    )

    return {
        "attendance_percentage": round(attendance_percentage, 2),
        "pending_fees": pending_fees or 0.0
    }
