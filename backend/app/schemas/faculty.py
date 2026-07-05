from typing import Optional
from pydantic import BaseModel

class FacultyBase(BaseModel):
    employee_id: str
    designation: str
    department_id: Optional[int] = None
    contact_number: Optional[str] = None

class FacultyCreate(FacultyBase):
    user_id: int

class FacultyUpdate(BaseModel):
    designation: Optional[str] = None
    department_id: Optional[int] = None
    contact_number: Optional[str] = None
    full_name: Optional[str] = None
    employee_id: Optional[str] = None

class UserNested(BaseModel):
    full_name: str
    email: str
    
    model_config = {"from_attributes": True}

class FacultyResponse(FacultyBase):
    id: int
    user_id: int
    user: Optional[UserNested] = None
    
    model_config = {"from_attributes": True}

class FacultyEnroll(BaseModel):
    full_name: str
    email: str
    password: str
    employee_id: str
    designation: str
    department_id: Optional[int] = None
    phone: Optional[str] = None
