from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from app.crud.base import CRUDBase
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate

class StudentRepository(CRUDBase[Student, StudentCreate, StudentUpdate]):
    async def get_by_user_id(self, db: AsyncSession, *, user_id: int) -> Optional[Student]:
        result = await db.execute(select(Student).where(Student.user_id == user_id))
        return result.scalars().first()

    async def get_by_enrollment_number(self, db: AsyncSession, *, enrollment_number: str) -> Optional[Student]:
        result = await db.execute(select(Student).options(joinedload(Student.user)).where(Student.enrollment_number == enrollment_number))
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, *, skip: int = 0, limit: int = 100):
        result = await db.execute(select(Student).options(joinedload(Student.user)).offset(skip).limit(limit))
        return result.scalars().all()

student_repo = StudentRepository(Student)
