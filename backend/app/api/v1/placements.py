from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, date

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.schemas.placement import (
    PlacementDriveCreate, PlacementDriveResponse, PlacementDriveUpdate,
    PlacementCompanyResponse, PlacementCompanyCreate, PlacementCompanyUpdate,
    PlacementApplicationResponse, PlacementApplicationUpdate
)
from app.repositories.placement import placement_company_repo, placement_drive_repo, placement_application_repo
from app.models.placement import PlacementCompany, PlacementDrive, PlacementApplication, ApplicationStatus
from app.models.student import Student
from app.models.user import User
from app.core.exceptions import NotFoundException

router = APIRouter()

PLACEMENT_WRITE_ROLES = ["admin", "placement_admin"]

# ─────────── DASHBOARD KPIs ───────────
@router.get("/dashboard")
async def get_placement_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Return KPI metrics for Placement Admin dashboard."""
    total_companies = await db.scalar(select(func.count(PlacementCompany.id))) or 0
    total_drives = await db.scalar(select(func.count(PlacementDrive.id))) or 0
    total_applications = await db.scalar(select(func.count(PlacementApplication.id))) or 0
    placed_count = await db.scalar(
        select(func.count(PlacementApplication.id)).where(PlacementApplication.status == ApplicationStatus.SELECTED)
    ) or 0
    pending_count = await db.scalar(
        select(func.count(PlacementApplication.id)).where(PlacementApplication.status == ApplicationStatus.APPLIED)
    ) or 0
    interview_count = await db.scalar(
        select(func.count(PlacementApplication.id)).where(PlacementApplication.status == ApplicationStatus.INTERVIEW)
    ) or 0
    total_students = await db.scalar(select(func.count(Student.id))) or 0
    
    # Recent companies
    recent_companies = (await db.scalars(
        select(PlacementCompany).order_by(desc(PlacementCompany.id)).limit(5)
    )).all()
    
    # Upcoming drives
    today = date.today()
    upcoming_drives_raw = (await db.scalars(
        select(PlacementDrive).where(PlacementDrive.drive_date >= today).order_by(PlacementDrive.drive_date).limit(5)
    )).all()
    
    upcoming_drives = []
    for drive in upcoming_drives_raw:
        company = await db.get(PlacementCompany, drive.company_id)
        upcoming_drives.append({
            "id": drive.id,
            "title": drive.title,
            "company_name": company.name if company else "Unknown",
            "company_industry": company.industry if company else "",
            "drive_date": drive.drive_date.isoformat(),
            "registration_deadline": drive.registration_deadline.isoformat(),
            "package_offered": drive.package_offered,
            "eligibility_cgpa": drive.eligibility_cgpa,
        })
    
    # Recent activity
    recent_applications = (await db.scalars(
        select(PlacementApplication).order_by(desc(PlacementApplication.applied_on)).limit(8)
    )).all()
    
    recent_activity = []
    for app in recent_applications:
        drive = await db.get(PlacementDrive, app.drive_id)
        student = await db.get(Student, app.student_id)
        student_user = await db.get(User, student.user_id) if student else None
        company = await db.get(PlacementCompany, drive.company_id) if drive else None
        recent_activity.append({
            "id": app.id,
            "student_name": student_user.full_name if student_user else "Student",
            "company_name": company.name if company else "Company",
            "drive_title": drive.title if drive else "Drive",
            "status": app.status.value,
            "applied_on": app.applied_on.isoformat(),
        })

    return {
        "kpis": {
            "total_companies": total_companies,
            "total_drives": total_drives,
            "placed_students": placed_count,
            "total_applications": total_applications,
            "pending_applications": pending_count,
            "interview_stage": interview_count,
            "total_students": total_students,
            "average_package": "8.5 LPA",  # placeholder
            "highest_package": "24 LPA",   # placeholder
        },
        "upcoming_drives": upcoming_drives,
        "recent_activity": recent_activity,
        "recent_companies": [{"id": c.id, "name": c.name, "industry": c.industry} for c in recent_companies],
    }


# ─────────── COMPANIES ───────────
@router.get("/companies", response_model=List[PlacementCompanyResponse])
async def get_companies(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return await placement_company_repo.get_multi(db)

@router.post("/companies", response_model=PlacementCompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    company_in: PlacementCompanyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(PLACEMENT_WRITE_ROLES))
) -> Any:
    return await placement_company_repo.create(db, obj_in=company_in)

@router.put("/companies/{id}", response_model=PlacementCompanyResponse)
async def update_company(
    id: int,
    company_in: PlacementCompanyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(PLACEMENT_WRITE_ROLES))
) -> Any:
    company = await placement_company_repo.get(db, id=id)
    if not company:
        raise NotFoundException("Company not found")
    return await placement_company_repo.update(db, db_obj=company, obj_in=company_in)

@router.delete("/companies/{id}", response_model=PlacementCompanyResponse)
async def delete_company(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(PLACEMENT_WRITE_ROLES))
) -> Any:
    company = await placement_company_repo.get(db, id=id)
    if not company:
        raise NotFoundException("Company not found")
    return await placement_company_repo.remove(db, id=id)


# ─────────── DRIVES ───────────
@router.get("/drives", response_model=List[PlacementDriveResponse])
async def get_drives(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return await placement_drive_repo.get_multi(db)

@router.post("/drives", response_model=PlacementDriveResponse, status_code=status.HTTP_201_CREATED)
async def create_drive(
    drive_in: PlacementDriveCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(PLACEMENT_WRITE_ROLES))
) -> Any:
    return await placement_drive_repo.create(db, obj_in=drive_in)

@router.put("/drives/{id}", response_model=PlacementDriveResponse)
async def update_drive(
    id: int,
    drive_in: PlacementDriveUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(PLACEMENT_WRITE_ROLES))
) -> Any:
    drive = await placement_drive_repo.get(db, id=id)
    if not drive:
        raise NotFoundException("Drive not found")
    return await placement_drive_repo.update(db, db_obj=drive, obj_in=drive_in)

@router.delete("/drives/{id}", response_model=PlacementDriveResponse)
async def delete_drive(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(PLACEMENT_WRITE_ROLES))
) -> Any:
    drive = await placement_drive_repo.get(db, id=id)
    if not drive:
        raise NotFoundException("Drive not found")
    return await placement_drive_repo.remove(db, id=id)


# ─────────── APPLICATIONS ───────────
@router.get("/applications")
async def get_applications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(PLACEMENT_WRITE_ROLES)),
    status_filter: Optional[str] = Query(None, alias="status"),
    drive_id: Optional[int] = Query(None)
) -> Any:
    query = select(PlacementApplication)
    if status_filter:
        query = query.where(PlacementApplication.status == status_filter)
    if drive_id:
        query = query.where(PlacementApplication.drive_id == drive_id)
    query = query.order_by(desc(PlacementApplication.applied_on))
    applications = (await db.scalars(query)).all()

    result = []
    for app in applications:
        drive = await db.get(PlacementDrive, app.drive_id)
        student = await db.get(Student, app.student_id)
        student_user = await db.get(User, student.user_id) if student else None
        company = await db.get(PlacementCompany, drive.company_id) if drive else None
        result.append({
            "id": app.id,
            "student_id": app.student_id,
            "student_name": student_user.full_name if student_user else "Student",
            "student_email": student_user.email if student_user else "",
            "enrollment_number": student.enrollment_number if student else "",
            "drive_id": app.drive_id,
            "drive_title": drive.title if drive else "",
            "company_name": company.name if company else "",
            "package_offered": drive.package_offered if drive else "",
            "status": app.status.value,
            "applied_on": app.applied_on.isoformat(),
        })
    return result

@router.patch("/applications/{id}/status")
async def update_application_status(
    id: int,
    update_in: PlacementApplicationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(PLACEMENT_WRITE_ROLES))
) -> Any:
    app_obj = await placement_application_repo.get(db, id=id)
    if not app_obj:
        raise NotFoundException("Application not found")
    updated = await placement_application_repo.update(db, db_obj=app_obj, obj_in=update_in)
    return {"id": updated.id, "status": updated.status.value}
