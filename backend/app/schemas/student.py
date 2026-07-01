from typing import Optional
from datetime import date
from pydantic import BaseModel
from app.schemas.user import UserResponse

class StudentBase(BaseModel):
    enrollment_number: str
    course: str
    batch: str
    date_of_birth: Optional[date] = None
    contact_number: Optional[str] = None

class StudentCreate(StudentBase):
    user_id: int

class StudentUpdate(BaseModel):
    course: Optional[str] = None
    batch: Optional[str] = None
    date_of_birth: Optional[date] = None
    contact_number: Optional[str] = None

class StudentResponse(StudentBase):
    id: int
    user_id: int
    
    model_config = {"from_attributes": True}
