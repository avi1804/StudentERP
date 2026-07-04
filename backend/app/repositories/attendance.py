from typing import Optional, List
from datetime import date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate

class AttendanceRepository(CRUDBase[Attendance, AttendanceCreate, AttendanceUpdate]):
    async def get_by_student_and_subject(self, db: AsyncSession, *, student_id: int, subject_id: int, date: date) -> Optional[Attendance]:
        result = await db.execute(
            select(Attendance)
            .where(Attendance.student_id == student_id)
            .where(Attendance.subject_id == subject_id)
            .where(Attendance.date == date)
        )
        return result.scalars().first()
        
    async def get_multi_by_student(self, db: AsyncSession, *, student_id: int, skip: int = 0, limit: int = 100) -> List[Attendance]:
        result = await db.execute(
            select(Attendance)
            .where(Attendance.student_id == student_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

attendance_repo = AttendanceRepository(Attendance)

from app.models.attendance import AttendanceSession, AttendanceLog
from app.schemas.attendance import AttendanceSessionCreate, AttendanceSessionUpdate, AttendanceLogCreate, AttendanceLogResponse

attendance_session_repo = CRUDBase[AttendanceSession, AttendanceSessionCreate, AttendanceSessionUpdate](AttendanceSession)
# Pydantic base is used as update for log to avoid creating a dedicated one
attendance_log_repo = CRUDBase[AttendanceLog, AttendanceLogCreate, AttendanceLogCreate](AttendanceLog)

