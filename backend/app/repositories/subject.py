from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate

class SubjectRepository(CRUDBase[Subject, SubjectCreate, SubjectUpdate]):
    async def get_by_code(self, db: AsyncSession, *, code: str) -> Optional[Subject]:
        result = await db.execute(select(Subject).where(Subject.code == code))
        return result.scalars().first()

subject_repo = SubjectRepository(Subject)
