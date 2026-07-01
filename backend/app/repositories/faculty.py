from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.faculty import Faculty
from app.schemas.faculty import FacultyCreate, FacultyUpdate

class FacultyRepository(CRUDBase[Faculty, FacultyCreate, FacultyUpdate]):
    async def get_by_user_id(self, db: AsyncSession, *, user_id: int) -> Optional[Faculty]:
        result = await db.execute(select(Faculty).where(Faculty.user_id == user_id))
        return result.scalars().first()

    async def get_by_employee_id(self, db: AsyncSession, *, employee_id: str) -> Optional[Faculty]:
        result = await db.execute(select(Faculty).where(Faculty.employee_id == employee_id))
        return result.scalars().first()

faculty_repo = FacultyRepository(Faculty)
