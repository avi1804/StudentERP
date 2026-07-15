from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, Optional
from datetime import datetime, date
from pydantic import BaseModel

from app.dependencies.database import get_db
from app.dependencies.auth import RequireRole
from app.models.user import User
from app.models.student import Student
from app.models.course import Course
from app.models.department import Department
from app.models.subject import Subject
from app.models.attendance import Attendance
from app.models.marks import Marks

router = APIRouter()

async def get_current_student(db: AsyncSession, current_user: User) -> Student:
    student = await db.scalar(select(Student).where(Student.user_id == current_user.id))
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student

@router.get("/dashboard")
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    student = await get_current_student(db, current_user)
    
    # Calculate attendance
    total_classes = await db.scalar(select(func.count(Attendance.id)).where(Attendance.student_id == student.id))
    present_classes = await db.scalar(select(func.count(Attendance.id)).where(
        Attendance.student_id == student.id,
        Attendance.status.in_(["PRESENT", "LATE"])
    ))
    
    attendance_rate = (present_classes / total_classes * 100) if total_classes and total_classes > 0 else 0
    
    return {
        "student_id": student.id,
        "name": current_user.full_name or "Student",
        "enrollment_number": student.enrollment_number,
        "attendance_rate": round(attendance_rate, 1),
        "total_subjects": 5, # Could be dynamic if subjects are explicitly mapped to student course
        "recent_announcements": [
            {"id": 1, "title": "Mid Semester Exam Schedule Released", "date": "2026-10-15"},
            {"id": 2, "title": "Holiday on Friday", "date": "2026-10-10"}
        ],
        "todays_classes": [
            {"subject": "Software Engineering", "faculty": "Dr. Smith", "time": "10:00 AM", "room": "Room 302"},
            {"subject": "Database Systems", "faculty": "Prof. Johnson", "time": "11:30 AM", "room": "Lab 1"}
        ]
    }

@router.get("/profile")
async def get_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    student = await get_current_student(db, current_user)
    
    course_name = "Unknown"
    dept_name = "Unknown"
    
    if student.course_id:
        course = await db.scalar(select(Course).where(Course.id == student.course_id))
        if course:
            course_name = course.name
            dept = await db.scalar(select(Department).where(Department.id == course.department_id))
            if dept:
                dept_name = dept.name
                
    return {
        "id": student.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "enrollment_number": student.enrollment_number,
        "course": course_name,
        "department": dept_name,
        "batch": student.batch,
        "date_of_birth": student.date_of_birth.isoformat() if student.date_of_birth else None,
        "contact_number": student.contact_number,
        "semester": 5 # Mocked for now, depending on course structure
    }

class UpdateProfileRequest(BaseModel):
    contact_number: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None

@router.put("/profile")
async def update_profile(
    req: UpdateProfileRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    student = await get_current_student(db, current_user)
    
    if req.contact_number is not None:
        student.contact_number = req.contact_number
        
    if req.date_of_birth is not None:
        student.date_of_birth = req.date_of_birth
        
    user_record = await db.scalar(select(User).where(User.id == current_user.id))
    
    if req.full_name is not None and user_record:
        user_record.full_name = req.full_name
        
    if req.email is not None:
        # Check if email is already taken
        existing = await db.scalar(select(User).where(User.email == req.email, User.id != current_user.id))
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        if user_record:
            user_record.email = req.email
            
    await db.commit()
    return {"message": "Profile updated successfully"}

@router.get("/attendance")
async def get_attendance(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    student = await get_current_student(db, current_user)
    
    attendances = (await db.scalars(select(Attendance).where(Attendance.student_id == student.id))).all()
    
    report = {}
    for att in attendances:
        sub_id = att.subject_id
        if sub_id not in report:
            subject = await db.scalar(select(Subject).where(Subject.id == sub_id))
            report[sub_id] = {
                "subjectId": sub_id,
                "subjectName": subject.name if subject else "Unknown",
                "present": 0,
                "absent": 0,
                "late": 0,
                "totalClasses": 0
            }
        
        report[sub_id]["totalClasses"] += 1
        if att.status.name == "PRESENT":
            report[sub_id]["present"] += 1
        elif att.status.name == "ABSENT":
            report[sub_id]["absent"] += 1
        elif att.status.name == "LATE":
            report[sub_id]["late"] += 1

    result = []
    for sub_id, data in report.items():
        present_count = data["present"] + data["late"]
        pct = (present_count / data["totalClasses"]) * 100 if data["totalClasses"] > 0 else 0
        data["percentage"] = round(pct, 1)
        
        if pct >= 80:
            data["remark"] = "Good"
        elif pct >= 65:
            data["remark"] = "Average"
        else:
            data["remark"] = "Low"
            
        result.append(data)
        
    return result

@router.get("/results")
async def get_results(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    student = await get_current_student(db, current_user)
    
    marks_records = (await db.scalars(select(Marks).where(Marks.student_id == student.id))).all()
    
    result = []
    for m in marks_records:
        subject = await db.scalar(select(Subject).where(Subject.id == m.subject_id))
        pct = (m.marks_obtained / m.total_marks) * 100 if m.total_marks > 0 else 0
        
        remark = "Excellent" if pct >= 85 else "Good" if pct >= 70 else "Average" if pct >= 50 else "Fail"
        
        result.append({
            "id": m.id,
            "subjectId": m.subject_id,
            "subjectName": subject.name if subject else "Unknown",
            "subjectCode": subject.code if subject else "",
            "examType": m.exam_type.name if hasattr(m.exam_type, "name") else str(m.exam_type),
            "marksObtained": m.marks_obtained,
            "totalMarks": m.total_marks,
            "percentage": round(pct, 1),
            "remark": remark
        })
        
    return result

from app.models.faculty import Faculty

@router.get("/subjects")
async def get_subjects(
    semester: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    student = await get_current_student(db, current_user)
    
    # Get student's department from their course
    department_id = None
    if student.course_id:
        course = await db.scalar(select(Course).where(Course.id == student.course_id))
        if course:
            department_id = course.department_id
            
    if not department_id:
        # Default or fallback if no course is assigned
        return []

    # If semester is not provided, we could default to 7 based on mock or fetch all. Let's fetch all matching department if None
    query = select(Subject).where(Subject.department_id == department_id)
    if semester:
        query = query.where(Subject.semester == semester)
        
    subjects = (await db.scalars(query)).all()
    
    result = []
    for sub in subjects:
        prof_name = "Not Assigned"
        if sub.faculty_id:
            faculty = await db.scalar(select(Faculty).where(Faculty.id == sub.faculty_id))
            if faculty:
                fac_user = await db.scalar(select(User).where(User.id == faculty.user_id))
                if fac_user and fac_user.full_name:
                    prof_name = fac_user.full_name

        # Calculate a mock or actual average grade for this subject for the student
        marks = await db.scalar(select(Marks).where(Marks.student_id == student.id, Marks.subject_id == sub.id))
        grade = "N/A"
        if marks and marks.total_marks > 0:
            pct = (marks.marks_obtained / marks.total_marks) * 100
            if pct >= 90: grade = "A+"
            elif pct >= 80: grade = "A"
            elif pct >= 70: grade = "B"
            elif pct >= 60: grade = "C"
            elif pct >= 50: grade = "D"
            else: grade = "F"
            
        result.append({
            "id": sub.id,
            "code": sub.code,
            "name": sub.name,
            "credits": sub.credits,
            "professor": prof_name,
            "grade": grade
        })
        
    return result
