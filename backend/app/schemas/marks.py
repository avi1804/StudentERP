from typing import Optional
from pydantic import BaseModel
from datetime import date

class ExamBase(BaseModel):
    name: str
    academic_year: str
    start_date: date
    end_date: date

class ExamCreate(ExamBase):
    pass

class ExamUpdate(BaseModel):
    name: Optional[str] = None
    academic_year: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ExamResponse(ExamBase):
    id: int
    model_config = {"from_attributes": True}


class MarksBase(BaseModel):
    student_id: int
    subject_id: int
    faculty_id: Optional[int] = None
    exam_type: str
    score: float
    total_score: float

class MarksCreate(MarksBase):
    pass

class MarksUpdate(BaseModel):
    score: Optional[float] = None
    total_score: Optional[float] = None

class MarksResponse(MarksBase):
    id: int
    model_config = {"from_attributes": True}


class ExamResultBase(BaseModel):
    exam_id: int
    student_id: int
    total_marks: float
    obtained_marks: float
    percentage: float
    grade: str
    status: str

class ExamResultCreate(ExamResultBase):
    pass

class ExamResultUpdate(BaseModel):
    total_marks: Optional[float] = None
    obtained_marks: Optional[float] = None
    percentage: Optional[float] = None
    grade: Optional[str] = None
    status: Optional[str] = None

class ExamResultResponse(ExamResultBase):
    id: int
    model_config = {"from_attributes": True}
