from typing import Optional
from pydantic import BaseModel
from datetime import date, datetime
from app.models.placement import ApplicationStatus

class PlacementCompanyBase(BaseModel):
    name: str
    industry: str
    website: Optional[str] = None
    contact_email: Optional[str] = None

class PlacementCompanyCreate(PlacementCompanyBase):
    pass

class PlacementCompanyUpdate(PlacementCompanyBase):
    name: Optional[str] = None
    industry: Optional[str] = None

class PlacementCompanyResponse(PlacementCompanyBase):
    id: int
    model_config = {"from_attributes": True}


class PlacementDriveBase(BaseModel):
    company_id: int
    title: str
    description: str
    drive_date: date
    registration_deadline: datetime
    eligibility_cgpa: float = 0.0
    package_offered: Optional[str] = None

class PlacementDriveCreate(PlacementDriveBase):
    pass

class PlacementDriveUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    drive_date: Optional[date] = None
    registration_deadline: Optional[datetime] = None
    eligibility_cgpa: Optional[float] = None
    package_offered: Optional[str] = None

class PlacementDriveResponse(PlacementDriveBase):
    id: int
    model_config = {"from_attributes": True}


class PlacementApplicationBase(BaseModel):
    drive_id: int
    student_id: int

class PlacementApplicationCreate(PlacementApplicationBase):
    pass

class PlacementApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None

class PlacementApplicationResponse(PlacementApplicationBase):
    id: int
    status: ApplicationStatus
    applied_on: datetime
    model_config = {"from_attributes": True}
