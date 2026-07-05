from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.subject import Subject
from app.models.faculty import Faculty
from app.schemas.academic import SubjectCreate, SubjectUpdate

class SubjectRepository(CRUDBase[Subject, SubjectCreate, SubjectUpdate]):
    async def get_by_code(self, db: AsyncSession, *, code: str) -> Optional[Subject]:
        result = await db.execute(select(Subject).where(Subject.code == code))
        return result.scalars().first()

    async def get_with_relations(self, db: AsyncSession, id: int) -> Optional[Subject]:
        query = select(Subject).options(
            joinedload(Subject.faculty).joinedload(Faculty.user)
        ).where(Subject.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, *, skip: int = 0, limit: int = 100):
        query = select(Subject).options(
            joinedload(Subject.faculty).joinedload(Faculty.user)
        ).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

subject_repo = SubjectRepository(Subject)
