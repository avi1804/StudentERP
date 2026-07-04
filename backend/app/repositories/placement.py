from app.crud.base import CRUDBase
from app.models.placement import PlacementCompany, PlacementDrive, PlacementApplication
from app.schemas.placement import (
    PlacementCompanyCreate, PlacementCompanyUpdate,
    PlacementDriveCreate, PlacementDriveUpdate,
    PlacementApplicationCreate, PlacementApplicationUpdate
)

placement_company_repo = CRUDBase[PlacementCompany, PlacementCompanyCreate, PlacementCompanyUpdate](PlacementCompany)
placement_drive_repo = CRUDBase[PlacementDrive, PlacementDriveCreate, PlacementDriveUpdate](PlacementDrive)
placement_application_repo = CRUDBase[PlacementApplication, PlacementApplicationCreate, PlacementApplicationUpdate](PlacementApplication)
