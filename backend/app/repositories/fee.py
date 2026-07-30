from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.crud.base import CRUDBase
from app.models.fee import (
    FeeStructure, StudentFee, Scholarship, Discount, FineRule, Payment, Receipt, PaymentHistory
)
from app.schemas.fee import (
    FeeStructureCreate, FeeStructureUpdate,
    StudentFeeCreate, StudentFeeUpdate,
    ScholarshipCreate, ScholarshipUpdate,
    DiscountCreate, DiscountUpdate,
    FineRuleCreate, FineRuleUpdate,
    PaymentCreate, PaymentUpdate
)

class CRUDFeeStructure(CRUDBase[FeeStructure, FeeStructureCreate, FeeStructureUpdate]):
    pass

class CRUDScholarship(CRUDBase[Scholarship, ScholarshipCreate, ScholarshipUpdate]):
    pass

class CRUDDiscount(CRUDBase[Discount, DiscountCreate, DiscountUpdate]):
    pass

class CRUDFineRule(CRUDBase[FineRule, FineRuleCreate, FineRuleUpdate]):
    pass

class CRUDStudentFee(CRUDBase[StudentFee, StudentFeeCreate, StudentFeeUpdate]):
    async def get_by_student(self, db: AsyncSession, student_id: int) -> List[StudentFee]:
        result = await db.scalars(select(StudentFee).where(StudentFee.student_id == student_id))
        return list(result.all())

class CRUDPayment(CRUDBase[Payment, PaymentCreate, PaymentUpdate]):
    async def get_by_student_fee(self, db: AsyncSession, student_fee_id: int) -> List[Payment]:
        result = await db.scalars(select(Payment).where(Payment.student_fee_id == student_fee_id))
        return list(result.all())

fee_structure_repo = CRUDFeeStructure(FeeStructure)
scholarship_repo = CRUDScholarship(Scholarship)
discount_repo = CRUDDiscount(Discount)
fine_rule_repo = CRUDFineRule(FineRule)
student_fee_repo = CRUDStudentFee(StudentFee)
payment_repo = CRUDPayment(Payment)
