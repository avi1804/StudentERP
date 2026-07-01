from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.timetable import Timetable
from app.schemas.timetable import TimetableCreate, TimetableUpdate

class TimetableRepository(CRUDBase[Timetable, TimetableCreate, TimetableUpdate]):
    async def get_multi_by_department(self, db: AsyncSession, *, department_id: int, skip: int = 0, limit: int = 100) -> List[Timetable]:
        result = await db.execute(
            select(Timetable)
            .where(Timetable.department_id == department_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

timetable_repo = TimetableRepository(Timetable)
