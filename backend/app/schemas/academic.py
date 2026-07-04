from typing import Optional
from pydantic import BaseModel

# Department
class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    head_of_department_id: Optional[int] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(DepartmentBase):
    name: Optional[str] = None

class DepartmentResponse(DepartmentBase):
    id: int
    model_config = {"from_attributes": True}


# Course
class CourseBase(BaseModel):
    name: str
    duration_years: int
    department_id: int

class CourseCreate(CourseBase):
    pass

class CourseUpdate(CourseBase):
    name: Optional[str] = None
    duration_years: Optional[int] = None
    department_id: Optional[int] = None

class CourseResponse(CourseBase):
    id: int
    model_config = {"from_attributes": True}


# Subject
class SubjectBase(BaseModel):
    name: str
    code: str
    credits: int
    department_id: int
    semester: Optional[int] = None
    faculty_id: Optional[int] = None

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(SubjectBase):
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = None
    department_id: Optional[int] = None
    semester: Optional[int] = None
    faculty_id: Optional[int] = None

class UserNested(BaseModel):
    full_name: str
    email: str
    
    model_config = {"from_attributes": True}

class FacultyNested(BaseModel):
    id: int
    employee_id: str
    designation: str
    user: Optional[UserNested] = None

class SubjectResponse(SubjectBase):
    id: int
    model_config = {"from_attributes": True}
    faculty: Optional[FacultyNested] = None


# Subject Assignment
class SubjectAssignmentBase(BaseModel):
    subject_id: int
    faculty_id: int
    course_id: Optional[int] = None
    academic_year: str
    semester: str

class SubjectAssignmentCreate(SubjectAssignmentBase):
    pass

class SubjectAssignmentUpdate(SubjectAssignmentBase):
    subject_id: Optional[int] = None
    faculty_id: Optional[int] = None
    academic_year: Optional[str] = None
    semester: Optional[str] = None

class SubjectAssignmentResponse(SubjectAssignmentBase):
    id: int
    model_config = {"from_attributes": True}
