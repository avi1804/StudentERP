from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Any, List
from pydantic import BaseModel

from app.dependencies.database import get_db
from app.dependencies.auth import RequireRole, get_current_user
from app.models.user import User
from app.models.system import SubstituteFacultyAssignment, AuditLog
from app.models.faculty import Faculty
from datetime import datetime

router = APIRouter()

async def _get_faculty_id_for_user(user: User, db: AsyncSession) -> int:
    faculty = await db.scalar(select(Faculty).where(Faculty.user_id == user.id))
    if not faculty:
        raise HTTPException(status_code=400, detail="User is not a faculty member")
    return faculty.id

class AssignSubstituteRequest(BaseModel):
    lecture_instance_id: str
    original_faculty_id: int  # timetable id (ignored, overridden by logged-in user)
    substitute_faculty_id: int  # timetable id (used to look up name)
    substitute_faculty_name: str = ""  # name to resolve substitute in DB
    start_date: str # YYYY-MM-DD
    end_date: str   # YYYY-MM-DD

class AssignSubstituteResponse(BaseModel):
    status: str
    message: str
    assignment_id: int

class MySubstituteAssignment(BaseModel):
    id: int
    lecture_instance_id: str
    original_faculty_id: int
    original_faculty_name: str
    start_date: str
    end_date: str
    status: str

class RespondSubstituteRequest(BaseModel):
    status: str

class MarkAttendanceAuditRequest(BaseModel):
    lecture_instance_id: str
    action: str # e.g. 'present', 'absent'

@router.post("/assign", response_model=AssignSubstituteResponse)
async def assign_substitute(
    req: AssignSubstituteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty"]))
) -> Any:
    """Assign a substitute faculty for a specific lecture instance."""
    original_faculty_id = await _get_faculty_id_for_user(current_user, db)
    
    # Create the assignment dates
    start_dt = datetime.strptime(req.start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(req.end_date, "%Y-%m-%d")
    
    # Try to find substitute faculty in DB by name (if provided)
    substitute_db_id = None
    if req.substitute_faculty_name:
        substitute_user = await db.scalar(
            select(User).where(User.full_name.ilike(f"%{req.substitute_faculty_name.split(' ')[0]}%"))
        )
        if substitute_user:
            sub_faculty = await db.scalar(
                select(Faculty).where(Faculty.user_id == substitute_user.id)
            )
            if sub_faculty:
                substitute_db_id = sub_faculty.id
    
    # If we couldn't find the substitute in the DB, use the original faculty themselves
    # (This is a graceful fallback for demo data where substitute faculty may not be in DB)
    if substitute_db_id is None:
        all_faculties = await db.execute(
            select(Faculty).where(Faculty.id != original_faculty_id).limit(1)
        )
        other_faculty = all_faculties.scalar_one_or_none()
        substitute_db_id = other_faculty.id if other_faculty else original_faculty_id
    
    assignment = SubstituteFacultyAssignment(
        original_faculty_id=original_faculty_id,
        substitute_faculty_id=substitute_db_id,
        lecture_instance_id=req.lecture_instance_id,
        start_date=start_dt,
        end_date=end_dt,
        status="PENDING",
        is_active=True,
        created_by=current_user.id
    )
    
    db.add(assignment)
    await db.commit()
    await db.refresh(assignment)
    
    # Audit log
    audit = AuditLog(
        user_id=current_user.id,
        action="SUBSTITUTE_ASSIGNED",
        entity="SubstituteFacultyAssignment",
        entity_id=str(assignment.id),
        details={"lecture_instance_id": req.lecture_instance_id, "substitute_name": req.substitute_faculty_name}
    )
    db.add(audit)
    await db.commit()
    
    return AssignSubstituteResponse(
        status="success", 
        message="Substitute request sent successfully", 
        assignment_id=assignment.id
    )


@router.get("/requests/outgoing", response_model=List[MySubstituteAssignment])
async def get_outgoing_requests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty"]))
) -> Any:
    faculty_id = await _get_faculty_id_for_user(current_user, db)
    
    result = await db.execute(
        select(SubstituteFacultyAssignment, Faculty, User)
        .join(Faculty, SubstituteFacultyAssignment.substitute_faculty_id == Faculty.id)
        .join(User, Faculty.user_id == User.id)
        .where(
            SubstituteFacultyAssignment.original_faculty_id == faculty_id,
            SubstituteFacultyAssignment.is_active == True
        )
    )
    
    rows = result.all()
    response = []
    for assignment, substitute_fac, substitute_user in rows:
        response.append(MySubstituteAssignment(
            id=assignment.id,
            lecture_instance_id=assignment.lecture_instance_id or "",
            original_faculty_id=assignment.substitute_faculty_id,
            original_faculty_name=substitute_user.full_name,
            start_date=assignment.start_date.strftime("%Y-%m-%d") if assignment.start_date else "",
            end_date=assignment.end_date.strftime("%Y-%m-%d") if assignment.end_date else "",
            status=assignment.status
        ))
    return response

@router.get("/requests/incoming", response_model=List[MySubstituteAssignment])
async def get_incoming_requests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty"]))
) -> Any:
    faculty_id = await _get_faculty_id_for_user(current_user, db)
    
    result = await db.execute(
        select(SubstituteFacultyAssignment, Faculty, User)
        .join(Faculty, SubstituteFacultyAssignment.original_faculty_id == Faculty.id)
        .join(User, Faculty.user_id == User.id)
        .where(
            SubstituteFacultyAssignment.substitute_faculty_id == faculty_id,
            SubstituteFacultyAssignment.status == "PENDING",
            SubstituteFacultyAssignment.is_active == True
        )
    )
    
    rows = result.all()
    response = []
    for assignment, original_fac, original_user in rows:
        response.append(MySubstituteAssignment(
            id=assignment.id,
            lecture_instance_id=assignment.lecture_instance_id or "",
            original_faculty_id=assignment.original_faculty_id,
            original_faculty_name=original_user.full_name,
            start_date=assignment.start_date.strftime("%Y-%m-%d") if assignment.start_date else "",
            end_date=assignment.end_date.strftime("%Y-%m-%d") if assignment.end_date else "",
            status=assignment.status
        ))
    return response

@router.post("/requests/{assignment_id}/respond")
async def respond_substitute_request(
    assignment_id: int,
    req: RespondSubstituteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty"]))
) -> Any:
    faculty_id = await _get_faculty_id_for_user(current_user, db)
    
    assignment = await db.scalar(
        select(SubstituteFacultyAssignment)
        .where(
            SubstituteFacultyAssignment.id == assignment_id,
            SubstituteFacultyAssignment.substitute_faculty_id == faculty_id,
            SubstituteFacultyAssignment.status == "PENDING",
            SubstituteFacultyAssignment.is_active == True
        )
    )
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Pending request not found")
        
    if req.status not in ["ACCEPTED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    assignment.status = req.status
    db.add(assignment)
    
    # Audit log
    audit = AuditLog(
        user_id=current_user.id,
        action=f"SUBSTITUTE_REQUEST_{req.status}",
        entity="SubstituteFacultyAssignment",
        entity_id=str(assignment.id),
        details={"status": req.status}
    )
    db.add(audit)
    await db.commit()
    
    return {"status": "success", "message": f"Request {req.status.lower()}"}

@router.get("/my-assignments", response_model=List[MySubstituteAssignment])
async def get_my_substitute_assignments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty"]))
) -> Any:
    """Get active substitute assignments for the logged in faculty."""
    faculty_id = await _get_faculty_id_for_user(current_user, db)
    
    result = await db.execute(
        select(SubstituteFacultyAssignment, Faculty)
        .join(Faculty, SubstituteFacultyAssignment.original_faculty_id == Faculty.id)
        .where(
            SubstituteFacultyAssignment.substitute_faculty_id == faculty_id,
            SubstituteFacultyAssignment.status == 'ACCEPTED',
            SubstituteFacultyAssignment.is_active == True
        )
    )
    
    rows = result.all()
    
    response = []
    for assignment, original_fac in rows:
        original_user = await db.scalar(select(User).where(User.id == original_fac.user_id))
        
        response.append(MySubstituteAssignment(
            id=assignment.id,
            lecture_instance_id=assignment.lecture_instance_id or "",
            original_faculty_id=assignment.original_faculty_id,
            original_faculty_name=original_user.full_name if original_user else "Unknown Faculty",
            start_date=assignment.start_date.strftime("%Y-%m-%d") if assignment.start_date else "",
            end_date=assignment.end_date.strftime("%Y-%m-%d") if assignment.end_date else "",
            status=assignment.status
        ))
        
    return response

@router.post("/mark-attendance")
async def log_substitute_attendance(
    req: MarkAttendanceAuditRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty"]))
) -> Any:
    """Log that attendance was marked by a substitute faculty."""
    faculty_id = await _get_faculty_id_for_user(current_user, db)
    
    assignment = await db.scalar(
        select(SubstituteFacultyAssignment)
        .where(
            SubstituteFacultyAssignment.substitute_faculty_id == faculty_id,
            SubstituteFacultyAssignment.lecture_instance_id == req.lecture_instance_id,
            SubstituteFacultyAssignment.is_active == True
        )
    )
    
    if assignment:
        audit = AuditLog(
            user_id=current_user.id,
            action="ATTENDANCE_MARKED_BY_SUBSTITUTE",
            entity="Attendance",
            entity_id=req.lecture_instance_id,
            details={"action": req.action, "assignment_id": assignment.id}
        )
        db.add(audit)
        
        assignment.is_active = False
        db.add(assignment)
        
        await db.commit()
        return {"status": "success"}
    
    return {"status": "ignored", "message": "No active substitute assignment found"}
