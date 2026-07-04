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

    async def get_all_with_students(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Fees]:
        from sqlalchemy.orm import selectinload
        from app.models.student import Student
        result = await db.execute(
            select(Fees)
            .options(selectinload(Fees.student).selectinload(Student.user))
            .order_by(Fees.due_date.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_stats(self, db: AsyncSession) -> dict:
        from sqlalchemy import func
        from app.models.fees import FeeStatus

        total_collected = await db.scalar(select(func.sum(Fees.amount_paid)))
        
        # Total pending is total amount minus paid amount across all records
        # Or just sum of amount_total where status is not PAID minus amount_paid
        # Simplified: total amount - amount_paid
        total_amount = await db.scalar(select(func.sum(Fees.amount_total)))
        
        total_collected = total_collected or 0.0
        total_amount = total_amount or 0.0
        total_pending = total_amount - total_collected

        paid_count = await db.scalar(select(func.count(Fees.id)).where(Fees.status == FeeStatus.PAID))
        partial_count = await db.scalar(select(func.count(Fees.id)).where(Fees.status == FeeStatus.PARTIAL))
        overdue_count = await db.scalar(select(func.count(Fees.id)).where(Fees.status == FeeStatus.OVERDUE))
        pending_count = await db.scalar(select(func.count(Fees.id)).where(Fees.status == FeeStatus.PENDING))

        return {
            "total_collected": total_collected,
            "total_pending": total_pending,
            "paid_count": paid_count or 0,
            "partial_count": partial_count or 0,
            "overdue_count": overdue_count or 0,
            "pending_count": pending_count or 0,
        }

fees_repo = FeesRepository(Fees)

from app.models.fees import Payment
from app.schemas.fees import PaymentCreate, PaymentUpdate

payment_repo = CRUDBase[Payment, PaymentCreate, PaymentUpdate](Payment)
