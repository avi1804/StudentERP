from typing import Optional
from datetime import date
from pydantic import BaseModel
from app.models.fees import FeeStatus

class FeesBase(BaseModel):
    student_id: int
    amount: float
    due_date: date
    semester: str

class FeesCreate(FeesBase):
    pass

class FeesUpdate(BaseModel):
    status: Optional[FeeStatus] = None
    transaction_id: Optional[str] = None

class FeesResponse(FeesBase):
    id: int
    status: FeeStatus
    transaction_id: Optional[str] = None
    
    model_config = {"from_attributes": True}
