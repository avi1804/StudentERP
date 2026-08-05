from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, func
from typing import Any, Optional
import secrets
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

from app.dependencies.database import get_db
from app.dependencies.auth import RequireRole
from app.models.user import User
from app.models.qr_attendance import QRSession, QRScanLog
from app.models.student import Student
from app.models.faculty import Faculty
from app.models.attendance import Attendance, AttendanceStatus
from app.models.subject import Subject

router = APIRouter()

# ── Request / Response Schemas ──

class GenerateQRRequest(BaseModel):
    lecture_instance_id: str
    subject_id: Optional[int] = None
    department: Optional[str] = None
    semester: Optional[int] = None
    section: Optional[str] = None
    expiry_seconds: int = 180  # default 3 minutes (configurable 120-300)

class QRPayload(BaseModel):
    lecture_instance_id: str
    token: str
    subject_id: Optional[int]
    faculty_id: int
    department: Optional[str]
    semester: Optional[int]
    section: Optional[str]
    date: str
    expires_at: str  # ISO string

class GenerateQRResponse(BaseModel):
    token: str
    expires_at: datetime
    lecture_instance_id: str
    qr_payload: str  # JSON string to be encoded in QR

class ScanQRRequest(BaseModel):
    lecture_instance_id: str
    token: str
    subject_id: Optional[int] = None

class ScanQRResponse(BaseModel):
    status: str
    message: str

class QRStatsResponse(BaseModel):
    scanned_count: int
    total_students: int


@router.post("/generate", response_model=GenerateQRResponse)
async def generate_qr(
    req: GenerateQRRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty"]))
) -> Any:
    """Generate a QR session for the given lecture instance (faculty only)."""
    faculty = await db.scalar(select(Faculty).where(Faculty.user_id == current_user.id))
    if not faculty:
        raise HTTPException(status_code=403, detail="Only faculty can generate QR codes.")

    # Validate expiry window (2–5 minutes)
    expiry_seconds = max(120, min(req.expiry_seconds, 300))

    # Invalidate any previous active sessions for this lecture
    await db.execute(
        update(QRSession)
        .where(
            QRSession.lecture_instance_id == req.lecture_instance_id,
            QRSession.status == "active"
        )
        .values(status="expired")
    )

    token = secrets.token_urlsafe(32)
    now_utc = datetime.now(timezone.utc)
    expires_at = now_utc + timedelta(seconds=expiry_seconds)
    today_str = now_utc.strftime("%Y-%m-%d")

    qr_session = QRSession(
        lecture_instance_id=req.lecture_instance_id,
        token=token,
        expires_at=expires_at,
        status="active",
        faculty_id=faculty.id
    )
    db.add(qr_session)
    await db.commit()
    await db.refresh(qr_session)

    import json
    payload_dict = {
        "lectureInstanceId": req.lecture_instance_id,
        "token": token,
        "subjectId": req.subject_id,
        "facultyId": faculty.id,
        "department": req.department,
        "semester": req.semester,
        "section": req.section,
        "date": today_str,
        "expiresAt": expires_at.isoformat()
    }

    return GenerateQRResponse(
        token=qr_session.token,
        expires_at=expires_at,  # Use local tz-aware value, NOT qr_session.expires_at (DB strips timezone)
        lecture_instance_id=qr_session.lecture_instance_id,
        qr_payload=json.dumps(payload_dict)
    )


@router.post("/scan", response_model=ScanQRResponse)
async def scan_qr(
    req: ScanQRRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    """Student scans the QR and is automatically marked Present (if valid)."""
    student = await db.scalar(select(Student).where(Student.user_id == current_user.id))
    if not student:
        raise HTTPException(status_code=403, detail="Only students can scan attendance QR codes.")

    # Look up the QR session
    qr_session = await db.scalar(
        select(QRSession).where(
            QRSession.lecture_instance_id == req.lecture_instance_id,
            QRSession.token == req.token
        )
    )

    if not qr_session:
        raise HTTPException(status_code=400, detail="Invalid QR code.")

    # Check expiry (compare timezone-aware datetimes)
    expires_at_aware = qr_session.expires_at
    if expires_at_aware.tzinfo is None:
        expires_at_aware = expires_at_aware.replace(tzinfo=timezone.utc)
    if qr_session.status != "active" or expires_at_aware < datetime.now(timezone.utc):
        # Log expired scan attempt
        scan_log = QRScanLog(qr_session_id=qr_session.id, student_id=student.id, result="expired")
        db.add(scan_log)
        await db.commit()
        return ScanQRResponse(status="expired", message="QR Code has expired. Please ask your faculty to regenerate.")

    # Check if already scanned successfully
    existing_scan = await db.scalar(
        select(QRScanLog).where(
            QRScanLog.qr_session_id == qr_session.id,
            QRScanLog.student_id == student.id,
            QRScanLog.result == "success"
        )
    )
    if existing_scan:
        return ScanQRResponse(status="duplicate", message="Attendance Already Marked for this lecture.")

    # Check if an Attendance record already exists for this student in this lecture
    existing_att = await db.scalar(
        select(Attendance).where(
            Attendance.student_id == student.id,
            Attendance.lecture_id == req.lecture_instance_id
        )
    )
    if existing_att:
        return ScanQRResponse(status="duplicate", message="Attendance Already Marked for this lecture.")

    # All valid — create Attendance record
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    from datetime import date
    today_date = date.today()
    now_time = datetime.utcnow().strftime("%H:%M")

    # Get subject_id from QR session or request
    subject_id = req.subject_id

    # Write attendance to DB
    new_att = Attendance(
        student_id=student.id,
        subject_id=subject_id if subject_id else 1,  # fallback for demo
        date=today_date,
        status=AttendanceStatus.PRESENT,
        marked_by_id=qr_session.faculty_id,
        lecture_id=req.lecture_instance_id,
        time=now_time,
        attendance_method="QR"
    )
    db.add(new_att)

    # Log success
    scan_log = QRScanLog(qr_session_id=qr_session.id, student_id=student.id, result="success")
    db.add(scan_log)

    await db.commit()

    return ScanQRResponse(status="success", message="Attendance marked successfully! You are marked Present.")


@router.get("/stats/{lecture_instance_id}", response_model=QRStatsResponse)
async def get_qr_stats(
    lecture_instance_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    """Get scan stats for a QR session (faculty/admin only)."""
    qr_session = await db.scalar(
        select(QRSession).where(
            QRSession.lecture_instance_id == lecture_instance_id,
            QRSession.status == "active"
        )
    )

    total_students = await db.scalar(select(func.count(Student.id))) or 30

    if not qr_session:
        # Count from attendance records instead
        scanned = await db.scalar(
            select(func.count(Attendance.id)).where(
                Attendance.lecture_id == lecture_instance_id,
                Attendance.attendance_method == "QR"
            )
        ) or 0
        return QRStatsResponse(scanned_count=scanned, total_students=total_students)

    scanned = await db.scalar(
        select(func.count(QRScanLog.id)).where(
            QRScanLog.qr_session_id == qr_session.id,
            QRScanLog.result == "success"
        )
    ) or 0

    return QRStatsResponse(scanned_count=scanned, total_students=total_students)
