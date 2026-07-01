from typing import Optional
from pydantic import BaseModel

class MarksBase(BaseModel):
    student_id: int
    subject_id: int
    exam_type: str
    score: float
    total_score: float

class MarksCreate(MarksBase):
    faculty_id: int

class MarksUpdate(BaseModel):
    score: Optional[float] = None
    total_score: Optional[float] = None

class MarksResponse(MarksBase):
    id: int
    faculty_id: int
    
    model_config = {"from_attributes": True}
