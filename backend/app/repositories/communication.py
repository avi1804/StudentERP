from app.crud.base import CRUDBase
from app.models.communication import Notice, Notification, Complaint
from app.schemas.communication import NoticeCreate, NoticeUpdate, NotificationCreate, NotificationUpdate, ComplaintCreate, ComplaintUpdate

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

class NoticeRepository(CRUDBase[Notice, NoticeCreate, NoticeUpdate]):
    async def get_active_notices(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[Notice]:
        result = await db.execute(
            select(Notice).where(Notice.is_active == True).order_by(Notice.created_at.desc()).offset(skip).limit(limit)
        )
        return result.scalars().all()

notice_repo = NoticeRepository(Notice)
notification_repo = CRUDBase[Notification, NotificationCreate, NotificationUpdate](Notification)
complaint_repo = CRUDBase[Complaint, ComplaintCreate, ComplaintUpdate](Complaint)
