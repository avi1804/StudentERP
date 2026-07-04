from app.database.base import Base
from app.models.user import User, Role
from app.models.student import Student
from app.models.faculty import Faculty
from app.models.department import Department
from app.models.course import Course
from app.models.subject import Subject
from app.models.subject_assignment import SubjectAssignment
from app.models.attendance import AttendanceSession, AttendanceLog, Attendance
from app.models.marks import Exam, Marks, ExamResult
from app.models.fees import Fees, Payment
from app.models.timetable import Timetable
from app.models.communication import Notice, Notification, Complaint
from app.models.placement import PlacementCompany, PlacementDrive, PlacementApplication
from app.models.system import AuditLog, DashboardStat, SystemSetting, ImportExportHistory, SubstituteFacultyAssignment

# Export all models for Alembic and convenient imports
__all__ = [
    "Base",
    "User", "Role",
    "Student",
    "Faculty",
    "Department", "Course", "Subject", "SubjectAssignment",
    "AttendanceSession", "AttendanceLog", "Attendance",
    "Exam", "Marks", "ExamResult",
    "Fees", "Payment",
    "Timetable",
    "Notice", "Notification", "Complaint",
    "PlacementCompany", "PlacementDrive", "PlacementApplication",
    "AuditLog", "DashboardStat", "SystemSetting", "ImportExportHistory", "SubstituteFacultyAssignment"
]
