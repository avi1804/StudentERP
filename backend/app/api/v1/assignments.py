from datetime import datetime, date
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_, update, delete

from app.dependencies.database import get_db
from app.dependencies.auth import RequireRole, get_current_active_user
from app.models.user import User
from app.models.faculty import Faculty
from app.models.student import Student
from app.models.subject import Subject
from app.models.subject_assignment import SubjectAssignment
from app.models.assignment import Assignment, AssignmentSubmission

router = APIRouter()

# --------------------------------------------------------------------------
# Pydantic Schemas
# --------------------------------------------------------------------------

class AssignmentCreateSchema(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    subject_id: int
    semester: int = 7
    section: str = "A"
    description: Optional[str] = None
    instructions: Optional[str] = None
    assignment_type: str = "Homework"  # Homework, Lab, Project, Presentation, Case Study, Research, Quiz
    max_marks: float = 20.0
    attachment_url: Optional[str] = None
    due_date: str  # YYYY-MM-DD
    due_time: str = "23:59"
    allow_late_submission: bool = True
    max_file_size_mb: int = 10
    allowed_file_types: str = "pdf,docx,pptx,zip,png,jpg"


class AssignmentUpdateSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    assignment_type: Optional[str] = None
    max_marks: Optional[float] = None
    attachment_url: Optional[str] = None
    due_date: Optional[str] = None
    due_time: Optional[str] = None
    allow_late_submission: Optional[bool] = None


class GradeSubmissionSchema(BaseModel):
    submission_id: int
    marks: float
    remarks: Optional[str] = None


class StudentSubmitSchema(BaseModel):
    submission_url: str
    file_name: Optional[str] = "assignment_submission.pdf"


# --------------------------------------------------------------------------
# Helper Functions
# --------------------------------------------------------------------------

async def _get_faculty_profile(db: AsyncSession, current_user: User) -> Optional[Faculty]:
    faculty = await db.scalar(select(Faculty).where(Faculty.user_id == current_user.id))
    return faculty

async def _verify_faculty_subject_access(db: AsyncSession, faculty: Optional[Faculty], subject_id: int, user: User) -> bool:
    if user.role.name == "admin":
        return True
    if not faculty:
        return True
    subject = await db.scalar(select(Subject).where(Subject.id == subject_id))
    if subject and subject.faculty_id == faculty.id:
        return True
    assignment = await db.scalar(
        select(SubjectAssignment).where(
            and_(SubjectAssignment.faculty_id == faculty.id, SubjectAssignment.subject_id == subject_id)
        )
    )
    if assignment:
        return True
    return True


# --------------------------------------------------------------------------
# FACULTY APIS
# --------------------------------------------------------------------------

@router.get("/faculty/statistics")
async def get_faculty_assignment_statistics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    faculty_id = faculty.id if faculty else 0

    query = select(Assignment)
    if current_user.role.name != "admin" and faculty_id:
        query = query.where(Assignment.faculty_id == faculty_id)

    assignments = (await db.scalars(query)).all()
    total_assignments = len(assignments)

    today = date.today()
    active_assignments = sum(1 for a in assignments if a.due_date >= today)
    completed_assignments = total_assignments - active_assignments

    assignment_ids = [a.id for a in assignments]
    if assignment_ids:
        total_subs = await db.scalar(
            select(func.count(AssignmentSubmission.id)).where(AssignmentSubmission.assignment_id.in_(assignment_ids))
        ) or 0
        pending_reviews = await db.scalar(
            select(func.count(AssignmentSubmission.id)).where(
                and_(
                    AssignmentSubmission.assignment_id.in_(assignment_ids),
                    AssignmentSubmission.submission_status.in_(["SUBMITTED", "LATE", "PENDING_REVIEW"])
                )
            )
        ) or 0
        late_submissions = await db.scalar(
            select(func.count(AssignmentSubmission.id)).where(
                and_(
                    AssignmentSubmission.assignment_id.in_(assignment_ids),
                    AssignmentSubmission.submission_status == "LATE"
                )
            )
        ) or 0
    else:
        total_subs = 0
        pending_reviews = 0
        late_submissions = 0

    total_students = await db.scalar(select(func.count(Student.id))) or 1
    expected_subs = total_assignments * total_students if total_assignments > 0 else 1
    avg_submission_rate = round((total_subs / expected_subs) * 100, 1) if expected_subs > 0 else 85.0

    return {
        "total_assignments": total_assignments,
        "active_assignments": active_assignments,
        "completed_assignments": completed_assignments,
        "pending_reviews": pending_reviews,
        "late_submissions": late_submissions,
        "average_submission_rate": avg_submission_rate
    }


@router.get("/faculty")
async def get_faculty_assignments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    faculty_id = faculty.id if faculty else 0

    query = select(Assignment).order_by(Assignment.created_at.desc())
    if current_user.role.name != "admin" and faculty_id:
        query = query.where(Assignment.faculty_id == faculty_id)

    assignments = (await db.scalars(query)).all()

    res = []
    today = date.today()

    for a in assignments:
        sub_count = await db.scalar(
            select(func.count(AssignmentSubmission.id)).where(AssignmentSubmission.assignment_id == a.id)
        ) or 0
        graded_count = await db.scalar(
            select(func.count(AssignmentSubmission.id)).where(
                and_(AssignmentSubmission.assignment_id == a.id, AssignmentSubmission.submission_status == "GRADED")
            )
        ) or 0
        subject = await db.scalar(select(Subject).where(Subject.id == a.subject_id))

        status_str = "ACTIVE" if a.due_date >= today else "EXPIRED"

        res.append({
            "id": a.id,
            "title": a.title,
            "subject_id": a.subject_id,
            "subject_name": subject.name if subject else "Unknown",
            "subject_code": subject.code if subject else "CS00",
            "semester": a.semester,
            "section": a.section,
            "description": a.description,
            "instructions": a.instructions,
            "assignment_type": a.assignment_type,
            "max_marks": a.max_marks,
            "attachment_url": a.attachment_url,
            "assigned_at": a.assigned_at.strftime("%Y-%m-%d") if a.assigned_at else "",
            "due_date": a.due_date.strftime("%Y-%m-%d") if a.due_date else "",
            "due_time": a.due_time,
            "allow_late_submission": a.allow_late_submission,
            "submission_count": sub_count,
            "graded_count": graded_count,
            "status": status_str
        })

    return res


@router.post("/faculty")
async def create_assignment(
    payload: AssignmentCreateSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    if not faculty:
        faculty = await db.scalar(select(Faculty))

    faculty_id = faculty.id if faculty else 1

    try:
        if "T" in payload.due_date:
            due_d = datetime.fromisoformat(payload.due_date.replace("Z", "+00:00")).date()
        else:
            due_d = datetime.strptime(payload.due_date.split(" ")[0], "%Y-%m-%d").date()
    except Exception:
        due_d = date.today()

    subject = await db.scalar(select(Subject).where(Subject.id == payload.subject_id))
    if not subject:
        first_sub = await db.scalar(select(Subject))
        subject_id = first_sub.id if first_sub else 1
    else:
        subject_id = payload.subject_id

    assignment = Assignment(
        faculty_id=faculty_id,
        subject_id=subject_id,
        semester=payload.semester,
        section=payload.section or "A",
        title=payload.title,
        description=payload.description,
        instructions=payload.instructions,
        assignment_type=payload.assignment_type,
        max_marks=payload.max_marks,
        attachment_url=payload.attachment_url,
        due_date=due_d,
        due_time=payload.due_time or "23:59",
        allow_late_submission=payload.allow_late_submission,
        max_file_size_mb=payload.max_file_size_mb,
        allowed_file_types=payload.allowed_file_types
    )

    db.add(assignment)
    await db.commit()
    await db.refresh(assignment)

    return {"message": "Assignment created successfully", "id": assignment.id}


@router.put("/faculty/{assignment_id}")
async def update_assignment(
    assignment_id: int,
    payload: AssignmentUpdateSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    assignment = await db.scalar(select(Assignment).where(Assignment.id == assignment_id))
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if current_user.role.name != "admin" and faculty and assignment.faculty_id != faculty.id:
        raise HTTPException(status_code=403, detail="Permission denied: You do not own this assignment")

    if payload.title is not None:
        assignment.title = payload.title
    if payload.description is not None:
        assignment.description = payload.description
    if payload.instructions is not None:
        assignment.instructions = payload.instructions
    if payload.assignment_type is not None:
        assignment.assignment_type = payload.assignment_type
    if payload.max_marks is not None:
        assignment.max_marks = payload.max_marks
    if payload.attachment_url is not None:
        assignment.attachment_url = payload.attachment_url
    if payload.due_date is not None:
        try:
            assignment.due_date = datetime.strptime(payload.due_date, "%Y-%m-%d").date()
        except ValueError:
            pass
    if payload.due_time is not None:
        assignment.due_time = payload.due_time
    if payload.allow_late_submission is not None:
        assignment.allow_late_submission = payload.allow_late_submission

    await db.commit()
    return {"message": "Assignment updated successfully"}


@router.delete("/faculty/{assignment_id}")
async def delete_assignment(
    assignment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    assignment = await db.scalar(select(Assignment).where(Assignment.id == assignment_id))
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if current_user.role.name != "admin" and faculty and assignment.faculty_id != faculty.id:
        raise HTTPException(status_code=403, detail="Permission denied: You do not own this assignment")

    await db.delete(assignment)
    await db.commit()
    return {"message": "Assignment deleted successfully"}


@router.get("/faculty/{assignment_id}")
async def get_assignment_details(
    assignment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    assignment = await db.scalar(select(Assignment).where(Assignment.id == assignment_id))
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    subject = await db.scalar(select(Subject).where(Subject.id == assignment.subject_id))

    return {
        "id": assignment.id,
        "title": assignment.title,
        "subject_name": subject.name if subject else "Unknown",
        "subject_code": subject.code if subject else "CS00",
        "semester": assignment.semester,
        "section": assignment.section,
        "description": assignment.description,
        "instructions": assignment.instructions,
        "assignment_type": assignment.assignment_type,
        "max_marks": assignment.max_marks,
        "attachment_url": assignment.attachment_url,
        "assigned_at": assignment.assigned_at.strftime("%Y-%m-%d"),
        "due_date": assignment.due_date.strftime("%Y-%m-%d"),
        "due_time": assignment.due_time,
        "allow_late_submission": assignment.allow_late_submission
    }


@router.get("/faculty/{assignment_id}/submissions")
async def get_assignment_submissions(
    assignment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    assignment = await db.scalar(select(Assignment).where(Assignment.id == assignment_id))
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if current_user.role.name != "admin" and faculty and assignment.faculty_id != faculty.id:
        raise HTTPException(status_code=403, detail="Permission denied: You do not own this assignment")

    # Fetch all students
    all_students = (await db.scalars(select(Student))).all()
    # Fetch all existing submissions for this assignment
    submissions = (await db.scalars(
        select(AssignmentSubmission).where(AssignmentSubmission.assignment_id == assignment_id)
    )).all()

    sub_map = {s.student_id: s for s in submissions}

    submitted_list = []
    not_submitted_list = []

    today = date.today()
    is_overdue = assignment.due_date < today

    for std in all_students:
        std_user = await db.scalar(select(User).where(User.id == std.user_id)) if std.user_id else None
        std_name = std_user.full_name if std_user else f"Student {std.enrollment_number}"
        std_email = std_user.email if std_user else f"{std.enrollment_number.lower()}@studenterp.edu"

        if std.id in sub_map:
            sub = sub_map[std.id]
            submitted_list.append({
                "submission_id": sub.id,
                "student_id": std.id,
                "student_name": std_name,
                "enrollment_number": std.enrollment_number,
                "semester": getattr(std, "semester", assignment.semester),
                "section": getattr(std, "section", assignment.section),
                "submission_url": sub.submission_url,
                "file_name": sub.file_name or "submission.pdf",
                "submitted_at": sub.submitted_at.strftime("%Y-%m-%d %H:%M"),
                "submission_status": sub.submission_status,  # SUBMITTED, LATE, GRADED
                "marks": sub.marks,
                "remarks": sub.remarks or ""
            })
        else:
            days_diff = (today - assignment.due_date).days if is_overdue else (assignment.due_date - today).days
            overdue_label = f"{days_diff} days overdue" if is_overdue else f"{days_diff} days remaining"

            not_submitted_list.append({
                "student_id": std.id,
                "student_name": std_name,
                "enrollment_number": std.enrollment_number,
                "email": std_email,
                "semester": getattr(std, "semester", assignment.semester),
                "section": getattr(std, "section", assignment.section),
                "overdue_info": overdue_label,
                "status": "OVERDUE" if is_overdue else "PENDING"
            })

    total_students = len(all_students)
    total_submitted = len(submitted_list)
    total_not_submitted = len(not_submitted_list)
    total_late = sum(1 for s in submitted_list if s["submission_status"] == "LATE")

    submission_pct = round((total_submitted / total_students * 100), 1) if total_students > 0 else 0.0

    return {
        "assignment_id": assignment_id,
        "title": assignment.title,
        "max_marks": assignment.max_marks,
        "statistics": {
            "total_students": total_students,
            "submitted": total_submitted,
            "not_submitted": total_not_submitted,
            "late_submissions": total_late,
            "submission_percentage": submission_pct
        },
        "submitted_students": submitted_list,
        "not_submitted_students": not_submitted_list
    }


@router.post("/faculty/{assignment_id}/grade")
async def grade_assignment_submission(
    assignment_id: int,
    payload: GradeSubmissionSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    faculty = await _get_faculty_profile(db, current_user)
    assignment = await db.scalar(select(Assignment).where(Assignment.id == assignment_id))
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if current_user.role.name != "admin" and faculty and assignment.faculty_id != faculty.id:
        raise HTTPException(status_code=403, detail="Permission denied: You do not own this assignment")

    submission = await db.scalar(
        select(AssignmentSubmission).where(
            and_(
                AssignmentSubmission.id == payload.submission_id,
                AssignmentSubmission.assignment_id == assignment_id
            )
        )
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    if payload.marks > assignment.max_marks:
        raise HTTPException(status_code=400, detail=f"Marks cannot exceed maximum marks ({assignment.max_marks})")

    submission.marks = payload.marks
    submission.remarks = payload.remarks
    submission.submission_status = "GRADED"
    submission.graded_by = faculty.id if faculty else 1
    submission.graded_at = datetime.utcnow()

    await db.commit()
    return {"message": "Submission graded successfully"}


# --------------------------------------------------------------------------
# STUDENT APIS
# --------------------------------------------------------------------------

@router.get("/student")
async def get_student_assignments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    # Get student record
    student = await db.scalar(select(Student).where(Student.user_id == current_user.id))
    student_id = student.id if student else 1
    student_sem = getattr(student, "semester", 7) if student else 7

    # Query assignments for student's semester or semester 7, falling back to all assignments
    assignments = (await db.scalars(
        select(Assignment).where(or_(Assignment.semester == student_sem, Assignment.semester == 7)).order_by(Assignment.due_date.asc())
    )).all()

    if not assignments:
        assignments = (await db.scalars(
            select(Assignment).order_by(Assignment.created_at.desc())
        )).all()

    today = date.today()
    res = []

    for a in assignments:
        subject = await db.scalar(select(Subject).where(Subject.id == a.subject_id))
        faculty = await db.scalar(select(Faculty).where(Faculty.id == a.faculty_id))
        fac_user = await db.scalar(select(User).where(User.id == faculty.user_id)) if faculty else None
        fac_name = fac_user.full_name if fac_user else "Faculty Staff"

        # Check if student submitted
        submission = await db.scalar(
            select(AssignmentSubmission).where(
                and_(AssignmentSubmission.assignment_id == a.id, AssignmentSubmission.student_id == student_id)
            )
        )

        is_overdue = a.due_date < today
        if submission:
            sub_status = submission.submission_status
        elif is_overdue:
            sub_status = "OVERDUE"
        else:
            sub_status = "PENDING"

        res.append({
            "id": a.id,
            "title": a.title,
            "subject_code": subject.code if subject else "CS01",
            "subject_name": subject.name if subject else "General Subject",
            "assignment_type": a.assignment_type,
            "faculty_name": fac_name,
            "assigned_on": a.assigned_at.strftime("%d %b %Y") if a.assigned_at else "",
            "due_date": a.due_date.strftime("%d %b %Y") if a.due_date else "",
            "due_time": a.due_time or "23:59",
            "max_marks": a.max_marks,
            "description": a.description or "",
            "instructions": a.instructions or "",
            "attachment_url": a.attachment_url or "",
            "status": sub_status,
            "submitted_file": submission.submission_url if submission else None,
            "submitted_at": submission.submitted_at.strftime("%d %b %Y, %I:%M %p") if (submission and submission.submitted_at) else None,
            "marks": f"{submission.marks} / {a.max_marks}" if (submission and submission.marks is not None) else "-",
            "remarks": submission.remarks if submission else ""
        })

    return res


@router.post("/student/{assignment_id}/submit")
async def submit_student_assignment(
    assignment_id: int,
    payload: StudentSubmitSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    student = await db.scalar(select(Student).where(Student.user_id == current_user.id))
    student_id = student.id if student else 1

    assignment = await db.scalar(select(Assignment).where(Assignment.id == assignment_id))
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    today = date.today()
    is_late = assignment.due_date < today

    if is_late and not assignment.allow_late_submission:
        raise HTTPException(status_code=400, detail="Submission closed: Late submissions are not allowed for this assignment.")

    status_str = "LATE" if is_late else "SUBMITTED"

    existing_sub = await db.scalar(
        select(AssignmentSubmission).where(
            and_(AssignmentSubmission.assignment_id == assignment_id, AssignmentSubmission.student_id == student_id)
        )
    )

    if existing_sub:
        existing_sub.submission_url = payload.submission_url
        existing_sub.file_name = payload.file_name
        existing_sub.submitted_at = datetime.utcnow()
        existing_sub.submission_status = status_str
    else:
        new_sub = AssignmentSubmission(
            assignment_id=assignment_id,
            student_id=student_id,
            submission_url=payload.submission_url,
            file_name=payload.file_name,
            submission_status=status_str
        )
        db.add(new_sub)

    await db.commit()
    return {"message": "Assignment submitted successfully!", "status": status_str}
