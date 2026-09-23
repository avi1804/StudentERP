from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy import select, func, and_, or_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, Dict, List, Optional
from datetime import datetime, date
from pydantic import BaseModel

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User
from app.models.faculty import Faculty
from app.models.student import Student
from app.models.subject import Subject
from app.models.attendance import Attendance, AttendanceStatus
from app.models.ai_attendance import (
    AIAttendanceSession,
    AIAttendanceMatch,
    AIAttendanceSessionStatus,
    AIAttendanceMatchStatus
)
from app.services.attendance_agent import AttendanceAgentService

router = APIRouter()


class AnalyzeTextRequest(BaseModel):
    text: str
    subject_id: int
    date: str


class UpdateMatchRequest(BaseModel):
    student_id: Optional[int] = None
    marked_present: Optional[bool] = None
    status: Optional[str] = None


async def _get_faculty_profile(db: AsyncSession, current_user: User) -> Optional[Faculty]:
    """Retrieve the faculty profile for the logged in user."""
    faculty = await db.scalar(select(Faculty).where(Faculty.user_id == current_user.id))
    return faculty


@router.post("/analyze")
async def analyze_attendance_file(
    file: UploadFile = File(...),
    subject_id: int = Form(...),
    date_str: str = Form(..., alias="date"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    """Upload a PDF, Image, or Text file, extract enrollments, match students, and create a review session."""
    faculty = await _get_faculty_profile(db, current_user)
    faculty_id = faculty.id if faculty else 0

    # 1. Strict Server-Side Subject Authorization Check
    is_authorized = await AttendanceAgentService.verify_faculty_subject_assignment(
        faculty_id=faculty_id,
        subject_id=subject_id,
        db=db,
        current_user=current_user
    )
    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to record attendance for this subject."
        )

    # 2. Date Validation
    try:
        parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Expected YYYY-MM-DD.")

    # 3. Read & Validate File
    file_bytes = await file.read()
    try:
        file_type = AttendanceAgentService.validate_upload_file(file.filename or "uploaded_file", file_bytes, file.content_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 4. Extract Text & OCR
    extracted_text = await AttendanceAgentService.extract_text_from_file(file_bytes, file.filename or "", file_type)
    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract readable text from the document. Try uploading a clearer image or pasting the numbers manually."
        )

    # 5. Extract Candidate Enrollment Tokens
    tokens = AttendanceAgentService.extract_enrollment_tokens(extracted_text)
    # AI Fallback extraction pass if dense/tabular or few tokens found
    tokens = await AttendanceAgentService.extract_enrollments_with_ai_fallback(extracted_text, tokens)

    if not tokens:
        raise HTTPException(
            status_code=400,
            detail="No student enrollment numbers were detected in this document. Please ensure enrollment numbers are legible or enter them manually."
        )

    # 6. Fetch Candidates from Database
    # Subject info
    subject_model = await db.get(Subject, subject_id)
    subject_name = subject_model.name if subject_model else f"Subject #{subject_id}"

    # All university students (used for both matching pools)
    all_students = (await db.scalars(select(Student))).all()
    # Use ALL students as subject students too - matching faculty_dashboard.py behavior
    subject_students = list(all_students)

    # User lookup map
    student_user_ids = [s.user_id for s in all_students]
    users_list = (await db.scalars(select(User).where(User.id.in_(student_user_ids)))).all()
    student_user_map = {u.id: u for u in users_list}

    # 7. Match Tokens against Database
    matches_data = AttendanceAgentService.match_tokens_against_database(
        tokens=tokens,
        subject_students=subject_students,
        all_students=all_students,
        student_user_map=student_user_map
    )

    # 8. Check Existing Attendance
    existing_check = await AttendanceAgentService.check_existing_attendance(subject_id, parsed_date, db)

    # 9. Create Session & Matches in MySQL
    auto_count = sum(1 for m in matches_data if m["status"] == AIAttendanceMatchStatus.AUTO_MATCHED.value)
    review_count = sum(1 for m in matches_data if m["status"] == AIAttendanceMatchStatus.REVIEW_REQUIRED.value)
    not_found_count = sum(1 for m in matches_data if m["status"] == AIAttendanceMatchStatus.NOT_FOUND.value)

    session = AIAttendanceSession(
        faculty_id=faculty_id,
        subject_id=subject_id,
        date=parsed_date,
        file_name=file.filename,
        file_type=file_type,
        extracted_text=extracted_text[:10000],
        status=AIAttendanceSessionStatus.PENDING_REVIEW.value,
        total_detected=len(matches_data),
        total_matched=auto_count,
        total_review=review_count,
        total_unmatched=not_found_count
    )
    db.add(session)
    await db.flush()

    db_matches = []
    for m in matches_data:
        match_record = AIAttendanceMatch(
            session_id=session.id,
            enrollment_number=m["enrollment_number"],
            normalized_enrollment=m.get("normalized_enrollment"),
            student_id=m.get("student_id"),
            confidence=m["confidence"],
            status=m["status"],
            source_text=m.get("source_text"),
            match_reason=m.get("match_reason"),
            marked_present=m.get("marked_present", True)
        )
        db_matches.append(match_record)

    db.add_all(db_matches)
    await db.commit()
    await db.refresh(session)

    # Prepare response items with student names
    response_matches = []
    for db_m, raw_m in zip(db_matches, matches_data):
        response_matches.append({
            "id": db_m.id,
            "enrollment_number": db_m.enrollment_number,
            "student_id": db_m.student_id,
            "student_name": raw_m["student_name"],
            "student_enrollment": raw_m.get("student_enrollment") or db_m.enrollment_number,
            "confidence": db_m.confidence,
            "status": db_m.status,
            "match_reason": db_m.match_reason,
            "source_text": db_m.source_text,
            "marked_present": db_m.marked_present
        })

    # Available subject roster for manual correction dropdowns
    available_students = []
    for s in subject_students:
        u = student_user_map.get(s.user_id)
        available_students.append({
            "id": s.id,
            "name": u.full_name if u else "Student",
            "enrollment_number": s.enrollment_number
        })

    return {
        "session_id": session.id,
        "subject_id": subject_id,
        "subject_name": subject_name,
        "date": parsed_date.strftime("%Y-%m-%d"),
        "status": session.status,
        "summary": {
            "total_detected": session.total_detected,
            "total_matched": session.total_matched,
            "total_review": session.total_review,
            "total_unmatched": session.total_unmatched
        },
        "existing_attendance": existing_check,
        "matches": response_matches,
        "available_students": available_students
    }


@router.post("/analyze-text")
async def analyze_attendance_text(
    req: AnalyzeTextRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    """Analyze plain pasted text containing enrollment numbers."""
    faculty = await _get_faculty_profile(db, current_user)
    faculty_id = faculty.id if faculty else 0

    # 1. Authorization
    is_authorized = await AttendanceAgentService.verify_faculty_subject_assignment(
        faculty_id=faculty_id,
        subject_id=req.subject_id,
        db=db,
        current_user=current_user
    )
    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to record attendance for this subject."
        )

    # 2. Date
    try:
        parsed_date = datetime.strptime(req.date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Expected YYYY-MM-DD.")

    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Please paste enrollment numbers to analyze.")

    # 3. Extract tokens
    tokens = AttendanceAgentService.extract_enrollment_tokens(req.text)
    tokens = await AttendanceAgentService.extract_enrollments_with_ai_fallback(req.text, tokens)

    if not tokens:
        raise HTTPException(
            status_code=400,
            detail="No enrollment numbers could be identified in the text. Format example: 24CSE001, 24CSE002"
        )

    # 4. Fetch DB Candidates
    subject_model = await db.get(Subject, req.subject_id)
    subject_name = subject_model.name if subject_model else f"Subject #{req.subject_id}"

    all_students = (await db.scalars(select(Student))).all()
    subject_semester = subject_model.semester if subject_model and subject_model.semester else 7
    subject_students = [s for s in all_students if s.semester == subject_semester]
    if not subject_students:
        subject_students = all_students

    student_user_ids = [s.user_id for s in all_students]
    users_list = (await db.scalars(select(User).where(User.id.in_(student_user_ids)))).all()
    student_user_map = {u.id: u for u in users_list}

    # 5. Match
    matches_data = AttendanceAgentService.match_tokens_against_database(
        tokens=tokens,
        subject_students=subject_students,
        all_students=all_students,
        student_user_map=student_user_map
    )

    existing_check = await AttendanceAgentService.check_existing_attendance(req.subject_id, parsed_date, db)

    auto_count = sum(1 for m in matches_data if m["status"] == AIAttendanceMatchStatus.AUTO_MATCHED.value)
    review_count = sum(1 for m in matches_data if m["status"] == AIAttendanceMatchStatus.REVIEW_REQUIRED.value)
    not_found_count = sum(1 for m in matches_data if m["status"] == AIAttendanceMatchStatus.NOT_FOUND.value)

    session = AIAttendanceSession(
        faculty_id=faculty_id,
        subject_id=req.subject_id,
        date=parsed_date,
        file_name="pasted_text.txt",
        file_type="text",
        extracted_text=req.text[:10000],
        status=AIAttendanceSessionStatus.PENDING_REVIEW.value,
        total_detected=len(matches_data),
        total_matched=auto_count,
        total_review=review_count,
        total_unmatched=not_found_count
    )
    db.add(session)
    await db.flush()

    db_matches = []
    for m in matches_data:
        match_record = AIAttendanceMatch(
            session_id=session.id,
            enrollment_number=m["enrollment_number"],
            normalized_enrollment=m.get("normalized_enrollment"),
            student_id=m.get("student_id"),
            confidence=m["confidence"],
            status=m["status"],
            source_text=m.get("source_text"),
            match_reason=m.get("match_reason"),
            marked_present=m.get("marked_present", True)
        )
        db_matches.append(match_record)

    db.add_all(db_matches)
    await db.commit()
    await db.refresh(session)

    response_matches = []
    for db_m, raw_m in zip(db_matches, matches_data):
        response_matches.append({
            "id": db_m.id,
            "enrollment_number": db_m.enrollment_number,
            "student_id": db_m.student_id,
            "student_name": raw_m["student_name"],
            "student_enrollment": raw_m.get("student_enrollment") or db_m.enrollment_number,
            "confidence": db_m.confidence,
            "status": db_m.status,
            "match_reason": db_m.match_reason,
            "source_text": db_m.source_text,
            "marked_present": db_m.marked_present
        })

    available_students = []
    for s in subject_students:
        u = student_user_map.get(s.user_id)
        available_students.append({
            "id": s.id,
            "name": u.full_name if u else "Student",
            "enrollment_number": s.enrollment_number
        })

    return {
        "session_id": session.id,
        "subject_id": req.subject_id,
        "subject_name": subject_name,
        "date": parsed_date.strftime("%Y-%m-%d"),
        "status": session.status,
        "summary": {
            "total_detected": session.total_detected,
            "total_matched": session.total_matched,
            "total_review": session.total_review,
            "total_unmatched": session.total_unmatched
        },
        "existing_attendance": existing_check,
        "matches": response_matches,
        "available_students": available_students
    }


@router.get("/{session_id}")
async def get_attendance_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    """Retrieve full details of an existing AI attendance review session."""
    session = await db.get(AIAttendanceSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="AI Attendance Session not found.")

    subject_model = await db.get(Subject, session.subject_id)
    subject_name = subject_model.name if subject_model else f"Subject #{session.subject_id}"

    matches_query = select(AIAttendanceMatch).where(AIAttendanceMatch.session_id == session_id)
    matches = (await db.scalars(matches_query)).all()

    # Students map
    all_students = (await db.scalars(select(Student))).all()
    student_user_ids = [s.user_id for s in all_students]
    users_list = (await db.scalars(select(User).where(User.id.in_(student_user_ids)))).all()
    user_map = {u.id: u for u in users_list}
    student_map = {s.id: (s, user_map.get(s.user_id)) for s in all_students}

    response_matches = []
    for m in matches:
        stu_tuple = student_map.get(m.student_id) if m.student_id else None
        stu_obj = stu_tuple[0] if stu_tuple else None
        u_obj = stu_tuple[1] if stu_tuple else None

        response_matches.append({
            "id": m.id,
            "enrollment_number": m.enrollment_number,
            "student_id": m.student_id,
            "student_name": u_obj.full_name if u_obj else "Unknown Student",
            "student_enrollment": stu_obj.enrollment_number if stu_obj else m.enrollment_number,
            "confidence": m.confidence,
            "status": m.status,
            "match_reason": m.match_reason,
            "source_text": m.source_text,
            "marked_present": m.marked_present
        })

    subject_semester = subject_model.semester if subject_model and subject_model.semester else 7
    subject_students = [s for s in all_students if s.semester == subject_semester]
    if not subject_students:
        subject_students = all_students

    available_students = []
    for s in subject_students:
        u = user_map.get(s.user_id)
        available_students.append({
            "id": s.id,
            "name": u.full_name if u else "Student",
            "enrollment_number": s.enrollment_number
        })

    existing_check = await AttendanceAgentService.check_existing_attendance(session.subject_id, session.date, db)

    return {
        "session_id": session.id,
        "subject_id": session.subject_id,
        "subject_name": subject_name,
        "date": session.date.strftime("%Y-%m-%d"),
        "status": session.status,
        "summary": {
            "total_detected": session.total_detected,
            "total_matched": session.total_matched,
            "total_review": session.total_review,
            "total_unmatched": session.total_unmatched
        },
        "existing_attendance": existing_check,
        "matches": response_matches,
        "available_students": available_students
    }


@router.patch("/{session_id}/matches/{match_id}")
async def update_match_record(
    session_id: int,
    match_id: int,
    req: UpdateMatchRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    """Allow faculty to manually correct or assign an AI match."""
    session = await db.get(AIAttendanceSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    if session.status == AIAttendanceSessionStatus.CONFIRMED.value:
        raise HTTPException(status_code=400, detail="Cannot edit a confirmed attendance session.")

    match_record = await db.get(AIAttendanceMatch, match_id)
    if not match_record or match_record.session_id != session_id:
        raise HTTPException(status_code=404, detail="Match record not found.")

    if req.student_id is not None:
        student = await db.get(Student, req.student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Selected student does not exist.")
        match_record.student_id = student.id
        match_record.status = AIAttendanceMatchStatus.CONFIRMED.value
        match_record.confidence = 1.0
        match_record.match_reason = f"Manually verified by faculty as {student.enrollment_number}"

    if req.marked_present is not None:
        match_record.marked_present = req.marked_present

    if req.status is not None:
        match_record.status = req.status

    await db.commit()
    await db.refresh(match_record)

    # Recalculate summary stats for session
    all_matches = (await db.scalars(select(AIAttendanceMatch).where(AIAttendanceMatch.session_id == session_id))).all()
    session.total_matched = sum(1 for m in all_matches if m.status in [AIAttendanceMatchStatus.AUTO_MATCHED.value, AIAttendanceMatchStatus.CONFIRMED.value])
    session.total_review = sum(1 for m in all_matches if m.status == AIAttendanceMatchStatus.REVIEW_REQUIRED.value)
    session.total_unmatched = sum(1 for m in all_matches if m.status in [AIAttendanceMatchStatus.NOT_FOUND.value, AIAttendanceMatchStatus.REJECTED.value])
    await db.commit()

    return {"message": "Match updated successfully.", "id": match_record.id, "status": match_record.status, "marked_present": match_record.marked_present}


@router.post("/{session_id}/confirm")
async def confirm_attendance_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    """Finalize attendance. Validates authorization, creates attendance records inside an atomic transaction."""
    faculty = await _get_faculty_profile(db, current_user)
    faculty_id = faculty.id if faculty else 0

    session = await db.get(AIAttendanceSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="AI Attendance Session not found.")

    if session.status == AIAttendanceSessionStatus.CONFIRMED.value:
        raise HTTPException(status_code=400, detail="This session has already been finalized and committed.")

    # 1. Re-validate authorization at confirmation time (Never trust frontend)
    is_authorized = await AttendanceAgentService.verify_faculty_subject_assignment(
        faculty_id=faculty_id,
        subject_id=session.subject_id,
        db=db,
        current_user=current_user
    )
    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: You do not have permissions to record attendance for this subject."
        )

    # 2. Fetch all matches for this session
    matches = (await db.scalars(
        select(AIAttendanceMatch).where(AIAttendanceMatch.session_id == session_id)
    )).all()

    # Filter students to be marked present (must have valid student_id and marked_present=True)
    present_matches = [m for m in matches if m.marked_present and m.student_id is not None]

    # Deduplicate student IDs marked present
    present_student_ids = set(m.student_id for m in present_matches)

    now_time = datetime.utcnow().strftime("%H:%M")

    # 3. Resolve proper timetable-aligned lecture_id
    # Map weekday to the frontend's MASTER_TIMETABLE entry IDs
    # The frontend generates: inst_{YYYY-MM-DD}_{tt_entry_id}
    TIMETABLE_MAP = {
        # subject_id -> { day_abbrev: entry_id }
        2: {  # Machine Learning (CS02) - Babita Patel
            "monday": "tt_mon_2",
            "tuesday": "tt_tue_1",
            "wednesday": "tt_wed_4",
            "thursday": "tt_thu_3",
            "friday": "tt_fri_5",
        },
        1: {  # Software Group Project (CS01) - Parth Nirmal
            "monday": "tt_mon_1",
            "tuesday": "tt_tue_4",
            "wednesday": "tt_wed_3",
            "thursday": "tt_thu_2",
            "friday": "tt_fri_3",
        },
        3: {  # NLP (CS03) - Ashwin Patni
            "monday": "tt_mon_3",
            "tuesday": "tt_tue_2",
            "wednesday": "tt_wed_5",
            "thursday": "tt_thu_1",
            "friday": "tt_fri_4",
        },
        4: {  # Cloud Computing (CS04) - Vrushali
            "monday": "tt_mon_4",
            "tuesday": "tt_tue_5",
            "wednesday": "tt_wed_1",
            "thursday": "tt_thu_5",
            "friday": "tt_fri_2",
        },
        5: {  # Flat (CS05) - Dipali Jeetya
            "monday": "tt_mon_5",
            "tuesday": "tt_tue_3",
            "wednesday": "tt_wed_2",
            "thursday": "tt_thu_4",
            "friday": "tt_fri_1",
        },
    }

    date_str = session.date.strftime("%Y-%m-%d")
    weekday = session.date.strftime("%A").lower()

    # Try to find the matching timetable entry
    subject_map = TIMETABLE_MAP.get(session.subject_id, {})
    tt_entry_id = subject_map.get(weekday)

    if tt_entry_id:
        lecture_uid = f"inst_{date_str}_{tt_entry_id}"
    else:
        # Fallback: use a deterministic ID that can still be found via date+subject fallback
        lecture_uid = f"inst_{date_str}_ai_sub{session.subject_id}"

    # 4. Delete any existing attendance for this lecture_id OR (date+subject) to avoid duplicates
    await db.execute(
        delete(Attendance).where(
            or_(
                Attendance.lecture_id == lecture_uid,
                and_(
                    Attendance.subject_id == session.subject_id,
                    Attendance.date == session.date
                )
            )
        )
    )

    # 5. Fetch ALL students in the class roster
    all_students = (await db.scalars(select(Student))).all()

    # 6. Build complete attendance: present for detected, absent for the rest
    records_to_insert = []
    for stu in all_students:
        is_present = stu.id in present_student_ids
        att = Attendance(
            student_id=stu.id,
            subject_id=session.subject_id,
            date=session.date,
            status=AttendanceStatus.PRESENT if is_present else AttendanceStatus.ABSENT,
            marked_by_id=faculty_id if faculty_id else None,
            lecture_id=lecture_uid,
            time=now_time,
            attendance_method="AI"
        )
        records_to_insert.append(att)

    if records_to_insert:
        db.add_all(records_to_insert)

    session.status = AIAttendanceSessionStatus.CONFIRMED.value
    session.confirmed_at = datetime.utcnow()

    await db.commit()

    subject_model = await db.get(Subject, session.subject_id)
    subject_name = subject_model.name if subject_model else "Subject"

    return {
        "success": True,
        "message": f"Successfully marked attendance for {len(present_student_ids)} students.",
        "subject_name": subject_name,
        "date": session.date.strftime("%d %B %Y"),
        "total_marked_present": len(present_student_ids),
        "total_marked_absent": len(all_students) - len(present_student_ids),
        "lecture_id": lecture_uid,
        "skipped_duplicates": 0,
        "session_id": session.id
    }
