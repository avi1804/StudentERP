from typing import Optional
from datetime import time
from pydantic import BaseModel

class TimetableBase(BaseModel):
    department_id: int
    subject_id: int
    faculty_id: int
    day_of_week: str
    start_time: time
    end_time: time
    room_number: str

class TimetableCreate(TimetableBase):
    pass

class TimetableUpdate(BaseModel):
    faculty_id: Optional[int] = None
    day_of_week: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    room_number: Optional[str] = None

class TimetableResponse(TimetableBase):
    id: int
    
    model_config = {"from_attributes": True}
