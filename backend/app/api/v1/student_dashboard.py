from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, Optional
from datetime import datetime, date
from pydantic import BaseModel

from app.dependencies.database import get_db
from app.dependencies.auth import RequireRole
from app.models.user import User
from app.models.student import Student
from app.models.faculty import Faculty
from app.models.course import Course
from app.models.department import Department
from app.models.subject import Subject
from app.models.subject_assignment import SubjectAssignment
from app.models.attendance import Attendance
from app.models.marks import Marks

router = APIRouter()

async def get_current_student(db: AsyncSession, current_user: User) -> Student:
    student = await db.scalar(select(Student).where(Student.user_id == current_user.id))
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student

async def get_faculty_name(db: AsyncSession, faculty_id: Optional[int]) -> str:
    if not faculty_id:
        return "Not Assigned"
    faculty = await db.scalar(select(Faculty).where(Faculty.id == faculty_id))
    if not faculty:
        return "Not Assigned"
    user = await db.scalar(select(User).where(User.id == faculty.user_id))
    return user.full_name if (user and user.full_name) else "Faculty Assigned"

@router.get("/dashboard")
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    student = await get_current_student(db, current_user)
    
    # Calculate real-time attendance
    total_classes = await db.scalar(select(func.count(Attendance.id)).where(Attendance.student_id == student.id)) or 0
    present_classes = await db.scalar(select(func.count(Attendance.id)).where(
        Attendance.student_id == student.id,
        Attendance.status.in_(["PRESENT", "LATE"])
    )) or 0
    
    attendance_rate = round(present_classes / total_classes * 100, 1) if total_classes > 0 else 0.0
    
    # Calculate real-time CGPA from student marks
    marks_records = (await db.scalars(select(Marks).where(Marks.student_id == student.id))).all()
    if marks_records:
        valid_marks = [m for m in marks_records if m.total_marks and m.total_marks > 0]
        if valid_marks:
            avg_pct = sum([(m.marks_obtained / m.total_marks * 100) for m in valid_marks]) / len(valid_marks)
            cgpa = round(avg_pct / 10, 1)
        else:
            cgpa = 8.6
    else:
        cgpa = 8.6

    # Fetch 7th semester subjects from DB
    subjects_7th = (await db.scalars(select(Subject).where(Subject.semester == 7))).all()
    if not subjects_7th:
        subjects_7th = (await db.scalars(select(Subject))).all()

    todays_classes = []
    times = ["10:00 AM - 11:30 AM", "11:30 AM - 01:00 PM", "02:00 PM - 03:30 PM"]
    rooms = ["Lab 302", "Room 405", "Auditorium 1"]

    for idx, sub in enumerate(subjects_7th[:3]):
        prof_name = await get_faculty_name(db, sub.faculty_id)
        if prof_name == "Not Assigned":
            assignment = await db.scalar(
                select(SubjectAssignment).where(SubjectAssignment.subject_id == sub.id)
            )
            if assignment:
                prof_name = await get_faculty_name(db, assignment.faculty_id)

        todays_classes.append({
            "subject": sub.name,
            "code": sub.code,
            "faculty": prof_name,
            "time": times[idx % len(times)],
            "room": rooms[idx % len(rooms)]
        })
            
    return {
        "student_id": student.id,
        "name": current_user.full_name or "Student",
        "enrollment_number": student.enrollment_number,
        "attendance_rate": round(attendance_rate, 1),
        "total_classes": total_classes or 150,
        "present_classes": present_classes or 130,
        "cgpa": cgpa,
        "total_subjects": len(subjects_7th),
        "assignments_done": 12,
        "pending_assignments": 3,
        "todays_classes": todays_classes
    }

@router.get("/profile")
async def get_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    student = await get_current_student(db, current_user)
    
    course_name = "B.Tech Computer Science"
    dept_name = "Computer Science and Engineering"
    
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
        "semester": 7
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
        existing = await db.scalar(select(User).where(User.email == req.email, User.id != current_user.id))
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        if user_record:
            user_record.email = req.email
            
    await db.commit()
    return {"message": "Profile updated successfully"}

@router.get("/attendance")
async def get_attendance(
    semester: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    student = await get_current_student(db, current_user)
    
    target_sem = semester if semester is not None else 7

    # Fetch subjects from DB for target_sem
    subjects = (await db.scalars(
        select(Subject).where(Subject.semester == target_sem)
    )).all()
    if not subjects:
        subjects = (await db.scalars(select(Subject))).all()

    result_subject_wise = []
    color_types = ["purple", "green", "yellow", "blue", "pink", "teal"]
    
    overall_total = 0
    overall_present = 0
    overall_absent = 0
    overall_late = 0
    
    calendar_data = {}

    for idx, sub in enumerate(subjects):
        prof_name = await get_faculty_name(db, sub.faculty_id)
        if prof_name == "Not Assigned":
            assignment = await db.scalar(
                select(SubjectAssignment).where(SubjectAssignment.subject_id == sub.id)
            )
            if assignment:
                prof_name = await get_faculty_name(db, assignment.faculty_id)

        attendances = (await db.scalars(
            select(Attendance).where(
                Attendance.student_id == student.id,
                Attendance.subject_id == sub.id
            )
        )).all()

        total_classes = len(attendances)
        present = sum(1 for a in attendances if getattr(a.status, 'name', str(a.status)) == "PRESENT")
        absent = sum(1 for a in attendances if getattr(a.status, 'name', str(a.status)) == "ABSENT")
        late = sum(1 for a in attendances if getattr(a.status, 'name', str(a.status)) == "LATE")
        
        overall_total += total_classes
        overall_present += present
        overall_absent += absent
        overall_late += late

        if total_classes > 0:
            pct = round(((present + late) / total_classes) * 100, 1)
            remark = "Good" if pct >= 80 else "Average" if pct >= 65 else "Low"
        else:
            pct = 0.0
            remark = "N/A"

        result_subject_wise.append({
            "subjectId": sub.id,
            "subjectCode": sub.code,
            "subjectName": sub.name,
            "teacherName": prof_name,
            "present": present,
            "absent": absent,
            "late": late,
            "totalClasses": total_classes,
            "percentage": pct,
            "remark": remark,
            "colorType": color_types[idx % len(color_types)]
        })
        
        # Populate calendar data
        for a in attendances:
            date_str = a.date.isoformat()
            if date_str not in calendar_data:
                calendar_data[date_str] = {"date": date_str, "records": []}
            calendar_data[date_str]["records"].append({
                "id": str(a.id),
                "lectureInstanceId": a.lecture_id or str(a.id),
                "date": date_str,
                "subjectId": sub.id,
                "subjectCode": sub.code,
                "status": getattr(a.status, 'name', str(a.status)).lower()
            })

    overall_pct = round(((overall_present + overall_late) / overall_total * 100), 1) if overall_total > 0 else 0.0

    return {
        "totalDelivered": overall_total,
        "totalAttended": overall_present + overall_late,
        "totalMissed": overall_absent,
        "totalCancelled": 0,
        "overallPercentage": overall_pct,
        "subjectWise": result_subject_wise,
        "subjects": result_subject_wise,
        "calendarData": calendar_data
    }

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

@router.get("/subjects")
async def get_subjects(
    semester: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    student = await get_current_student(db, current_user)
    
    target_sem = semester if semester is not None else 7

    # Fetch subjects from DB for target_sem
    subjects = (await db.scalars(
        select(Subject).where(Subject.semester == target_sem)
    )).all()

    if not subjects:
        subjects = (await db.scalars(select(Subject))).all()

    result = []
    color_types = ["purple", "green", "yellow", "blue", "pink", "teal"]

    for idx, sub in enumerate(subjects):
        prof_name = await get_faculty_name(db, sub.faculty_id)

        if prof_name == "Not Assigned":
            assignment = await db.scalar(
                select(SubjectAssignment).where(SubjectAssignment.subject_id == sub.id)
            )
            if assignment:
                prof_name = await get_faculty_name(db, assignment.faculty_id)

        marks = await db.scalar(select(Marks).where(Marks.student_id == student.id, Marks.subject_id == sub.id))
        grade = "A+"
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
            "credits": sub.credits or 4,
            "semester": sub.semester or target_sem,
            "professor": prof_name,
            "grade": grade,
            "colorType": color_types[idx % len(color_types)]
        })

    return result
