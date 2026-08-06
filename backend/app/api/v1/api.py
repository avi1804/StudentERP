from fastapi import APIRouter
from app.api.v1 import (
    users, auth, students, faculty, departments,
    subjects, timetable, fees,
    assignments, events, notices, complaints, placements, dashboard,
    student_dashboard, faculty_dashboard, qr_attendance, substitutes,
    chatbot
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(student_dashboard.router, prefix="/student-dash", tags=["student-dashboard"])
api_router.include_router(faculty_dashboard.router, prefix="/faculty-dash", tags=["faculty-dashboard"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(faculty.router, prefix="/faculty", tags=["faculty"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(timetable.router, prefix="/timetable", tags=["timetable"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(notices.router, prefix="/notices", tags=["notices"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["complaints"])
api_router.include_router(assignments.router, prefix="/assignments", tags=["assignments"])
api_router.include_router(placements.router, prefix="/placements", tags=["placements"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(fees.router, prefix="/fees", tags=["fees"])
api_router.include_router(qr_attendance.router, prefix="/qr", tags=["qr_attendance"])
api_router.include_router(substitutes.router, prefix="/substitutes", tags=["substitutes"])
api_router.include_router(chatbot.router, prefix="/chatbot", tags=["chatbot"])
