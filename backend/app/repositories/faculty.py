from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from app.crud.base import CRUDBase
from app.models.faculty import Faculty
from app.schemas.faculty import FacultyCreate, FacultyUpdate

class FacultyRepository(CRUDBase[Faculty, FacultyCreate, FacultyUpdate]):
    async def get_by_user_id(self, db: AsyncSession, *, user_id: int) -> Optional[Faculty]:
        result = await db.execute(select(Faculty).where(Faculty.user_id == user_id))
        return result.scalars().first()

    async def get_by_employee_id(self, db: AsyncSession, *, employee_id: str) -> Optional[Faculty]:
        result = await db.execute(select(Faculty).options(joinedload(Faculty.user)).where(Faculty.employee_id == employee_id))
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, *, skip: int = 0, limit: int = 100):
        result = await db.execute(select(Faculty).options(joinedload(Faculty.user)).offset(skip).limit(limit))
        return result.scalars().all()

faculty_repo = FacultyRepository(Faculty)
