from fastapi import APIRouter
from app.api.v1 import auth, users, students, faculty, departments, subjects, attendance, marks, fees, timetable, notices, dashboard

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(faculty.router, prefix="/faculty", tags=["faculty"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
api_router.include_router(marks.router, prefix="/marks", tags=["marks"])
api_router.include_router(fees.router, prefix="/fees", tags=["fees"])
api_router.include_router(timetable.router, prefix="/timetable", tags=["timetable"])
api_router.include_router(notices.router, prefix="/notices", tags=["notices"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
