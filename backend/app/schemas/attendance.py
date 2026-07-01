from typing import Optional
from datetime import date
from pydantic import BaseModel

class AttendanceBase(BaseModel):
    student_id: int
    subject_id: int
    date: date
    is_present: bool

class AttendanceCreate(AttendanceBase):
    faculty_id: int

class AttendanceUpdate(BaseModel):
    is_present: Optional[bool] = None

class AttendanceResponse(AttendanceBase):
    id: int
    faculty_id: int
    
    model_config = {"from_attributes": True}
