from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime, date
from app.models.fee import FeeStatus, PaymentMode, PaymentStatus, DiscountType

# ----------------- Fee Structure -----------------
class FeeStructureBase(BaseModel):
    academic_year: str
    department_id: int
    semester: int
    category: str
    tuition_fee: float = 0.0
    exam_fee: float = 0.0
    library_fee: float = 0.0
    sports_fee: float = 0.0
    development_fee: float = 0.0
    laboratory_fee: float = 0.0
    hostel_fee: float = 0.0
    bus_fee: float = 0.0
    miscellaneous_fee: float = 0.0
    gst: float = 0.0
    total_amount: float
    scholarship_allowed: bool = True
    installments_allowed: bool = False

class FeeStructureCreate(FeeStructureBase):
    pass

class FeeStructureUpdate(BaseModel):
    category: Optional[str] = None
    tuition_fee: Optional[float] = None
    exam_fee: Optional[float] = None
    total_amount: Optional[float] = None
    scholarship_allowed: Optional[bool] = None
    installments_allowed: Optional[bool] = None

class FeeStructureResponse(FeeStructureBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ----------------- Scholarship -----------------
class ScholarshipBase(BaseModel):
    name: str
    percentage: Optional[float] = None
    amount: Optional[float] = None
    eligibility_criteria: Optional[str] = None
    department_id: Optional[int] = None
    semester: Optional[int] = None

class ScholarshipCreate(ScholarshipBase):
    pass

class ScholarshipUpdate(BaseModel):
    name: Optional[str] = None
    percentage: Optional[float] = None
    amount: Optional[float] = None
    eligibility_criteria: Optional[str] = None

class ScholarshipResponse(ScholarshipBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ----------------- Discount -----------------
class DiscountBase(BaseModel):
    name: str
    discount_type: DiscountType
    value: float

class DiscountCreate(DiscountBase):
    pass

class DiscountUpdate(BaseModel):
    name: Optional[str] = None
    discount_type: Optional[DiscountType] = None
    value: Optional[float] = None

class DiscountResponse(DiscountBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ----------------- Fine Rule -----------------
class FineRuleBase(BaseModel):
    name: str
    daily_fine: float = 0.0
    weekly_fine: float = 0.0
    max_fine: float

class FineRuleCreate(FineRuleBase):
    pass

class FineRuleUpdate(BaseModel):
    name: Optional[str] = None
    daily_fine: Optional[float] = None
    weekly_fine: Optional[float] = None
    max_fine: Optional[float] = None

class FineRuleResponse(FineRuleBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ----------------- Student Fee (Bill) -----------------
class StudentFeeBase(BaseModel):
    student_id: int
    fee_structure_id: int
    due_date: date
    scholarship_id: Optional[int] = None
    discount_id: Optional[int] = None

class StudentFeeCreate(StudentFeeBase):
    pass

class StudentFeeUpdate(BaseModel):
    paid_amount: Optional[float] = None
    pending_amount: Optional[float] = None
    status: Optional[FeeStatus] = None
    fine_amount: Optional[float] = None

class StudentFeeResponse(StudentFeeBase):
    id: int
    total_fee: float
    paid_amount: float
    pending_amount: float
    status: FeeStatus
    scholarship_amount: float
    discount_amount: float
    fine_amount: float
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ----------------- Payment -----------------
class PaymentBase(BaseModel):
    student_fee_id: int
    amount: float
    payment_mode: PaymentMode
    transaction_id: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    status: PaymentStatus
    verified_by: Optional[int] = None

class PaymentResponse(PaymentBase):
    id: int
    receipt_no: str
    payment_date: datetime
    status: PaymentStatus
    verified_by: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)


# ----------------- Receipt -----------------
class ReceiptResponse(BaseModel):
    id: int
    payment_id: int
    receipt_url: Optional[str] = None
    generated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ----------------- Payment History -----------------
class PaymentHistoryResponse(BaseModel):
    id: int
    student_id: int
    action: str
    amount: Optional[float] = None
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)
