from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, Dict

from app.models.student import Student
from app.models.faculty import Faculty
from app.models.department import Department
from app.models.subject import Subject

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role

from datetime import datetime, timedelta

router = APIRouter()

@router.get("/admin", response_model=Dict[str, Any])
async def get_admin_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Get aggregated stats for Admin Dashboard.
    """
    total_students = await db.scalar(select(func.count(Student.id))) or 0
    total_faculty = await db.scalar(select(func.count(Faculty.id))) or 0
    total_departments = await db.scalar(select(func.count(Department.id))) or 0
    total_subjects = await db.scalar(select(func.count(Subject.id))) or 0
    


    attendance_rate = 0.0

    # Attendance Trend (mocked)
    today = datetime.utcnow().date()
    attendance_trend = [{"date": (today - timedelta(days=i)).strftime("%Y-%m-%d"), "attendance": 0.0} for i in range(5, -1, -1)]

    # Subject Performance (mocked)
    subject_performance = []

    return {
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_departments": total_departments,
        "total_subjects": total_subjects,
        "attendance_rate": float(attendance_rate),
        "attendance_trend": attendance_trend,
        "subject_performance": subject_performance
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
