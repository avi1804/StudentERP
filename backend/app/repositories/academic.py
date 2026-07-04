from app.crud.base import CRUDBase
from app.models import Department, Course, Subject, SubjectAssignment
from app.schemas.academic import DepartmentCreate, DepartmentUpdate, CourseCreate, CourseUpdate, SubjectCreate, SubjectUpdate, SubjectAssignmentCreate, SubjectAssignmentUpdate

department_repo = CRUDBase[Department, DepartmentCreate, DepartmentUpdate](Department)
course_repo = CRUDBase[Course, CourseCreate, CourseUpdate](Course)
subject_repo = CRUDBase[Subject, SubjectCreate, SubjectUpdate](Subject)
subject_assignment_repo = CRUDBase[SubjectAssignment, SubjectAssignmentCreate, SubjectAssignmentUpdate](SubjectAssignment)
