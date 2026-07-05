from typing import Optional
from pydantic import BaseModel
from datetime import date

class StudentBase(BaseModel):
    enrollment_number: str
    course_id: Optional[int] = None
    batch: str
    date_of_birth: Optional[date] = None
    contact_number: Optional[str] = None

class StudentCreate(StudentBase):
    user_id: int

class StudentUpdate(BaseModel):
    course_id: Optional[int] = None
    batch: Optional[str] = None
    date_of_birth: Optional[date] = None
    contact_number: Optional[str] = None
    full_name: Optional[str] = None
    enrollment_number: Optional[str] = None

class UserNested(BaseModel):
    full_name: str
    email: str
    
    model_config = {"from_attributes": True}

class StudentResponse(StudentBase):
    id: int
    user_id: int
    user: Optional[UserNested] = None
    
    model_config = {"from_attributes": True}

class StudentEnroll(BaseModel):
    full_name: str
    email: str
    password: str
    enrollment_number: str
    branch: str
    semester: str
    phone: Optional[str] = None
