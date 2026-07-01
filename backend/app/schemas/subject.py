from typing import Optional
from pydantic import BaseModel
from app.schemas.department import DepartmentResponse

class SubjectBase(BaseModel):
    name: str
    code: str
    credits: int
    department_id: int

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = None
    department_id: Optional[int] = None

class SubjectResponse(SubjectBase):
    id: int
    
    model_config = {"from_attributes": True}
