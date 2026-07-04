from typing import Optional
from pydantic import BaseModel
from datetime import date, datetime

class AttendanceSessionBase(BaseModel):
    faculty_id: int
    subject_assignment_id: int
    date: date
    start_time: datetime
    end_time: datetime
    qr_code_hash: Optional[str] = None
    is_active: bool = True

class AttendanceSessionCreate(AttendanceSessionBase):
    pass

class AttendanceSessionUpdate(BaseModel):
    end_time: Optional[datetime] = None
    qr_code_hash: Optional[str] = None
    is_active: Optional[bool] = None

class AttendanceSessionResponse(AttendanceSessionBase):
    id: int
    model_config = {"from_attributes": True}


class AttendanceLogBase(BaseModel):
    session_id: int
    student_id: int
    scan_time: datetime
    ip_address: Optional[str] = None
    status: str

class AttendanceLogCreate(AttendanceLogBase):
    pass

class AttendanceLogResponse(AttendanceLogBase):
    id: int
    model_config = {"from_attributes": True}


class AttendanceBase(BaseModel):
    student_id: int
    subject_id: int
    faculty_id: int
    date: date
    is_present: bool

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    is_present: Optional[bool] = None

class AttendanceResponse(AttendanceBase):
    id: int
    model_config = {"from_attributes": True}
