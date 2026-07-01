from typing import Optional
from pydantic import BaseModel
from app.schemas.user import UserResponse

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

class FacultyResponse(FacultyBase):
    id: int
    user_id: int
    
    model_config = {"from_attributes": True}
