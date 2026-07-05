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

from datetime import datetime, timedelta
from app.models.marks import Marks

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
    
    pending_fees_total = await db.scalar(
        select(func.sum(Fees.amount_total - Fees.amount_paid)).where(Fees.status != FeeStatus.PAID)
    ) or 0.0

    fees_collected_total = await db.scalar(
        select(func.sum(Fees.amount_paid))
    ) or 0.0

    # Calculate overall attendance rate
    total_attendance = await db.scalar(select(func.count(Attendance.id))) or 0
    present_attendance = await db.scalar(
        select(func.count(Attendance.id)).where(Attendance.is_present == True)
    ) or 0
    
    attendance_rate = 0.0
    if total_attendance > 0:
        attendance_rate = (present_attendance / total_attendance) * 100

    # Attendance Trend (last 30 days)
    thirty_days_ago = datetime.utcnow().date() - timedelta(days=30)
    recent_attendance = await db.execute(
        select(Attendance.date, Attendance.is_present).where(Attendance.date >= thirty_days_ago)
    )
    
    trend_map = {}
    for row in recent_attendance.all():
        d = row.date.strftime("%Y-%m-%d")
        if d not in trend_map:
            trend_map[d] = {"total": 0, "present": 0}
        trend_map[d]["total"] += 1
        if row.is_present:
            trend_map[d]["present"] += 1
            
    attendance_trend = []
    for d in sorted(trend_map.keys()):
        att = trend_map[d]
        rate = att["present"] / att["total"] if att["total"] > 0 else 0
        attendance_trend.append({"date": d, "attendance": rate})

    if not attendance_trend:
        today = datetime.utcnow().date()
        attendance_trend = [{"date": (today - timedelta(days=i)).strftime("%Y-%m-%d"), "attendance": 0.0} for i in range(5, -1, -1)]

    # Subject Performance (Attendance & Marks)
    subjects_res = await db.execute(select(Subject.id, Subject.name))
    subjects = {row.id: row.name for row in subjects_res.all()}
    
    marks_res = await db.execute(select(Marks.subject_id, Marks.score, Marks.total_score))
    subject_marks = {}
    for row in marks_res.all():
        if row.subject_id not in subject_marks:
            subject_marks[row.subject_id] = {"obtained": 0.0, "total": 0.0}
        subject_marks[row.subject_id]["obtained"] += row.score
        subject_marks[row.subject_id]["total"] += row.total_score

    att_res = await db.execute(select(Attendance.subject_id, Attendance.is_present))
    subject_att = {}
    for row in att_res.all():
        if row.subject_id not in subject_att:
            subject_att[row.subject_id] = {"present": 0, "total": 0}
        subject_att[row.subject_id]["total"] += 1
        if row.is_present:
            subject_att[row.subject_id]["present"] += 1

    subject_performance = []
    for sid, sname in subjects.items():
        att_rate = 0.0
        if sid in subject_att and subject_att[sid]["total"] > 0:
            att_rate = subject_att[sid]["present"] / subject_att[sid]["total"]
            
        mark_rate = 0.0
        if sid in subject_marks and subject_marks[sid]["total"] > 0:
            mark_rate = subject_marks[sid]["obtained"] / subject_marks[sid]["total"]
            
        subject_performance.append({
            "subject": sname,
            "attendance": att_rate,
            "marks": mark_rate
        })

    fees_analytics = [
        {"name": "Collected", "value": float(fees_collected_total), "color": "#22c55e"},
        {"name": "Pending", "value": float(pending_fees_total), "color": "#ef4444"}
    ]

    return {
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_departments": total_departments,
        "total_subjects": total_subjects,
        "pending_fees_total": float(pending_fees_total),
        "fees_collected_total": float(fees_collected_total),
        "attendance_rate": float(attendance_rate),
        "attendance_trend": attendance_trend,
        "fees_analytics": fees_analytics,
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
        select(func.sum(Fees.amount_total - Fees.amount_paid)).where(Fees.student_id == student.id, Fees.status != FeeStatus.PAID)
    )

    return {
        "attendance_percentage": round(attendance_percentage, 2),
        "pending_fees": pending_fees or 0.0
    }
