from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.notice import Notice
from app.schemas.notice import NoticeCreate, NoticeUpdate

class NoticeRepository(CRUDBase[Notice, NoticeCreate, NoticeUpdate]):
    async def get_active_notices(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[Notice]:
        result = await db.execute(
            select(Notice)
            .where(Notice.is_active == True)
            .order_by(Notice.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

notice_repo = NoticeRepository(Notice)
