from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.fees import Fees
from app.schemas.fees import FeesCreate, FeesUpdate

class FeesRepository(CRUDBase[Fees, FeesCreate, FeesUpdate]):
    async def get_multi_by_student(self, db: AsyncSession, *, student_id: int, skip: int = 0, limit: int = 100) -> List[Fees]:
        result = await db.execute(
            select(Fees)
            .where(Fees.student_id == student_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

fees_repo = FeesRepository(Fees)
