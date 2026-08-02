from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from typing import Any
import secrets
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.dependencies.database import get_db
from app.dependencies.auth import RequireRole
from app.models.user import User
from app.models.qr_attendance import QRSession, QRScanLog
from app.models.student import Student
from app.models.faculty import Faculty

router = APIRouter()

class GenerateQRRequest(BaseModel):
    lecture_instance_id: str

class GenerateQRResponse(BaseModel):
    token: str
    expires_at: datetime
    lecture_instance_id: str

class ScanQRRequest(BaseModel):
    lecture_instance_id: str
    token: str

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
    # Validate faculty
    faculty = await db.scalar(select(Faculty).where(Faculty.user_id == current_user.id))
    if not faculty:
        raise HTTPException(status_code=403, detail="Only faculty can generate QR codes.")

    # Invalidate old active sessions for this lecture instance
    await db.execute(
        update(QRSession)
        .where(QRSession.lecture_instance_id == req.lecture_instance_id, QRSession.status == "active")
        .values(status="expired")
    )
    
    # Generate new session
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(seconds=60)
    
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
    
    return GenerateQRResponse(
        token=qr_session.token,
        expires_at=qr_session.expires_at,
        lecture_instance_id=qr_session.lecture_instance_id
    )

@router.post("/scan", response_model=ScanQRResponse)
async def scan_qr(
    req: ScanQRRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
) -> Any:
    student = await db.scalar(select(Student).where(Student.user_id == current_user.id))
    if not student:
        raise HTTPException(status_code=403, detail="Only students can scan attendance QR codes.")

    # Find the active session
    qr_session = await db.scalar(
        select(QRSession).where(
            QRSession.lecture_instance_id == req.lecture_instance_id,
            QRSession.token == req.token
        )
    )
    
    if not qr_session:
        raise HTTPException(status_code=400, detail="Invalid QR code.")
        
    if qr_session.status != "active" or qr_session.expires_at < datetime.utcnow():
        # Log expired scan attempt
        scan_log = QRScanLog(qr_session_id=qr_session.id, student_id=student.id, result="expired")
        db.add(scan_log)
        await db.commit()
        raise HTTPException(status_code=400, detail="QR code has expired.")
        
    # Check if already scanned
    existing_scan = await db.scalar(
        select(QRScanLog).where(
            QRScanLog.qr_session_id == qr_session.id,
            QRScanLog.student_id == student.id,
            QRScanLog.result == "success"
        )
    )
    if existing_scan:
        return ScanQRResponse(status="duplicate", message="You have already marked attendance for this lecture.")
        
    # Log success
    scan_log = QRScanLog(qr_session_id=qr_session.id, student_id=student.id, result="success")
    db.add(scan_log)
    await db.commit()
    
    return ScanQRResponse(status="success", message="Attendance marked successfully.")

@router.get("/stats/{lecture_instance_id}", response_model=QRStatsResponse)
async def get_qr_stats(
    lecture_instance_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty", "admin"]))
) -> Any:
    # Get active session
    qr_session = await db.scalar(
        select(QRSession).where(
            QRSession.lecture_instance_id == lecture_instance_id,
            QRSession.status == "active"
        )
    )
    if not qr_session:
        return QRStatsResponse(scanned_count=0, total_students=30)
        
    from sqlalchemy import func
    scanned = await db.scalar(
        select(func.count(QRScanLog.id)).where(
            QRScanLog.qr_session_id == qr_session.id,
            QRScanLog.result == "success"
        )
    ) or 0
    
    return QRStatsResponse(scanned_count=scanned, total_students=30)
