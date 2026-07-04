from typing import Optional
from pydantic import BaseModel
from datetime import date, datetime
from app.models.fees import FeeStatus, FeeType, PaymentMethod

class FeesBase(BaseModel):
    student_id: int
    fee_type: FeeType
    amount_total: float
    due_date: date
    academic_year: str
    remarks: Optional[str] = None

class FeesCreate(FeesBase):
    pass

class FeesUpdate(BaseModel):
    amount_total: Optional[float] = None
    amount_paid: Optional[float] = None
    due_date: Optional[date] = None
    status: Optional[FeeStatus] = None
    remarks: Optional[str] = None

class FeesResponse(FeesBase):
    id: int
    amount_paid: float
    status: FeeStatus
    model_config = {"from_attributes": True}

from app.schemas.student import StudentResponse

class FeesWithStudentResponse(FeesResponse):
    student: Optional[StudentResponse] = None
    model_config = {"from_attributes": True}

class FeeStats(BaseModel):
    total_collected: float
    total_pending: float
    paid_count: int
    partial_count: int
    overdue_count: int
    pending_count: int

class PaymentBase(BaseModel):
    fee_id: int
    amount: float
    payment_method: PaymentMethod
    transaction_id: Optional[str] = None
    status: str = "SUCCESS"

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    status: Optional[str] = None

class PaymentResponse(PaymentBase):
    id: int
    payment_date: datetime
    model_config = {"from_attributes": True}
