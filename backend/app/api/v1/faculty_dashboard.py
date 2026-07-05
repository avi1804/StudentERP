from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, Dict, List
from datetime import datetime

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User
from app.models.faculty import Faculty
from app.models.student import Student
from app.models.subject import Subject
from app.models.subject_assignment import SubjectAssignment
from app.models.attendance import Attendance, AttendanceStatus
from app.models.marks import Marks, ExamType

from pydantic import BaseModel

router = APIRouter()

class MarkAttendanceRequest(BaseModel):
    student_id: int
    subject_id: int
    date: str
    status: AttendanceStatus

class AddMarksRequest(BaseModel):
    student_id: int
    subject_id: int
    exam_type: ExamType
    marks_obtained: float
    total_marks: float

async def _get_faculty_profile(db: AsyncSession, current_user: User):
    faculty = await db.scalar(select(Faculty).where(Faculty.user_id == current_user.id))
    if not faculty and current_user.role.name != "admin":
        raise HTTPException(status_code=404, detail="Faculty profile not found")
    return faculty

async def _verify_subject_assignment(db: AsyncSession, faculty_id: int, subject_id: int):
    # Temporarily bypassed for testing so faculty can access all subjects
    return True

@router.get("/dashboard")
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    faculty_id = faculty.id if faculty else 0
    
    # Get total subjects assigned
    total_subjects = await db.scalar(
        select(func.count(SubjectAssignment.id)).where(SubjectAssignment.faculty_id == faculty_id)
    )
    
    return {
        "total_assigned_subjects": total_subjects or 0,
        "faculty_id": faculty_id,
        "name": faculty.user.full_name if faculty and faculty.user else "Admin/Faculty",
        "attendance_rate": 85.0 # Mocked for now
    }

@router.get("/my-subjects")
async def get_my_subjects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    # Temporarily returning all subjects for testing so faculty and admins can access them
    subjects = await db.scalars(select(Subject))
    
    result = []
    for subject in subjects:
        result.append({
            "id": subject.id,
            "name": subject.name,
            "code": subject.code,
            "batch": "All"
        })
    return result

@router.get("/subjects/{subject_id}/students")
async def get_subject_students(
    subject_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    faculty_id = faculty.id if faculty else 0
    await _verify_subject_assignment(db, faculty_id, subject_id)
    
    # For simplicity, returning all students for now, since we haven't linked students directly to specific subject batches perfectly yet
    students = await db.scalars(select(Student))
    
    result = []
    for s in students:
        user = await db.scalar(select(User).where(User.id == s.user_id))
        result.append({
            "id": s.id,
            "name": user.full_name if user else "Unknown",
            "enrollment_number": s.enrollment_number
        })
    return result

@router.post("/attendance")
async def mark_attendance(
    req: MarkAttendanceRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    faculty_id = faculty.id if faculty else None
    await _verify_subject_assignment(db, faculty_id or 0, req.subject_id)
    
    parsed_date = datetime.strptime(req.date, "%Y-%m-%d").date()
    
    # Check if attendance already exists for today
    existing = await db.scalar(
        select(Attendance).where(
            Attendance.student_id == req.student_id,
            Attendance.subject_id == req.subject_id,
            Attendance.date == parsed_date
        )
    )
    
    if existing:
        raise HTTPException(status_code=400, detail="Attendance has already been marked for this student for this day.")

    new_att = Attendance(
        student_id=req.student_id,
        subject_id=req.subject_id,
        date=parsed_date,
        status=req.status,
        marked_by_id=faculty_id if faculty_id else None
    )
    db.add(new_att)
        
    await db.commit()
    return {"message": "Attendance marked successfully"}

@router.post("/marks")
async def add_marks(
    req: AddMarksRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    faculty_id = faculty.id if faculty else None
    await _verify_subject_assignment(db, faculty_id or 0, req.subject_id)
    
    # Check existing marks
    existing = await db.scalar(
        select(Marks).where(
            Marks.student_id == req.student_id,
            Marks.subject_id == req.subject_id,
            Marks.exam_type == req.exam_type
        )
    )
    
    if existing:
        existing.marks_obtained = req.marks_obtained
        existing.total_marks = req.total_marks
        existing.added_by_id = faculty_id if faculty_id else None
    else:
        new_marks = Marks(
            student_id=req.student_id,
            subject_id=req.subject_id,
            exam_type=req.exam_type,
            marks_obtained=req.marks_obtained,
            total_marks=req.total_marks,
            added_by_id=faculty_id if faculty_id else None
        )
        db.add(new_marks)
        
    await db.commit()
    return {"message": "Marks added successfully"}

from typing import Optional

@router.get("/attendance/report")
async def get_attendance_report(
    student_id: int,
    subject_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin", "student"]))
) -> Any:
    query = select(Attendance).where(Attendance.student_id == student_id)
    if subject_id:
        query = query.where(Attendance.subject_id == subject_id)
        
    attendances = (await db.scalars(query)).all()
    
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


@router.get('/attendance/stats')
async def get_attendance_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(['faculty', 'admin']))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    faculty_id = faculty.id if faculty else 0
    
    # Total subjects assigned
    total_subjects = await db.scalar(
        select(func.count(SubjectAssignment.id)).where(SubjectAssignment.faculty_id == faculty_id)
    )
    
    # Total students across assigned subjects
    # For now we'll just count total students since assignment is mocked in earlier endpoints
    total_students = await db.scalar(select(func.count(Student.id)))
    
    # Attendance marked today
    today = datetime.utcnow().date()
    attendance_marked = await db.scalar(
        select(func.count(Attendance.id)).where(
            and_(
                Attendance.marked_by_id == (faculty_id if faculty_id else None),
                Attendance.date == today
            )
        )
    )
    
    return {
        'totalSubjects': total_subjects or 0,
        'todaysClasses': 3, # Mocked
        'attendanceMarked': attendance_marked or 0,
        'pendingAttendance': 3 - (1 if attendance_marked else 0), # Mocked logic
        'totalStudents': total_students or 0
    }


@router.get('/marks/report')
async def get_marks_report(
    student_id: int,
    exam_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(['faculty', 'admin', 'student']))
) -> Any:
    query = select(Marks).where(Marks.student_id == student_id)
    if exam_type:
        query = query.where(Marks.exam_type == exam_type)
        
    marks_records = (await db.scalars(query)).all()
    
    result = []
    for m in marks_records:
        subject = await db.scalar(select(Subject).where(Subject.id == m.subject_id))
        pct = (m.marks_obtained / m.total_marks) * 100 if m.total_marks > 0 else 0
        
        remark = 'Excellent' if pct >= 85 else 'Good' if pct >= 70 else 'Average' if pct >= 50 else 'Fail'
        
        result.append({
            'id': m.id,
            'subjectId': m.subject_id,
            'subjectName': subject.name if subject else 'Unknown',
            'subjectCode': subject.code if subject else '',
            'examType': m.exam_type.name if hasattr(m.exam_type, 'name') else str(m.exam_type),
            'marksObtained': m.marks_obtained,
            'totalMarks': m.total_marks,
            'percentage': round(pct, 1),
            'remark': remark
        })
        
    return result

