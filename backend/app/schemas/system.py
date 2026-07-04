from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    action: str
    entity: str
    entity_id: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}


class DashboardStatBase(BaseModel):
    metric_name: str
    metric_value: Dict[str, Any]

class DashboardStatCreate(DashboardStatBase):
    pass

class DashboardStatUpdate(BaseModel):
    metric_value: Optional[Dict[str, Any]] = None

class DashboardStatResponse(DashboardStatBase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}


class SystemSettingBase(BaseModel):
    key: str
    value: Dict[str, Any]

class SystemSettingCreate(SystemSettingBase):
    pass

class SystemSettingUpdate(BaseModel):
    value: Optional[Dict[str, Any]] = None

class SystemSettingResponse(SystemSettingBase):
    id: int
    model_config = {"from_attributes": True}


class ImportExportHistoryBase(BaseModel):
    action_type: str
    entity: str
    file_name: str
    status: str

class ImportExportHistoryCreate(ImportExportHistoryBase):
    user_id: int
    error_report: Optional[Dict[str, Any]] = None

class ImportExportHistoryResponse(ImportExportHistoryBase):
    id: int
    user_id: int
    error_report: Optional[Dict[str, Any]] = None
    created_at: datetime
    model_config = {"from_attributes": True}


class SubstituteFacultyAssignmentBase(BaseModel):
    original_faculty_id: int
    substitute_faculty_id: int
    subject_assignment_id: int
    start_date: datetime
    end_date: datetime
    is_active: bool = True

class SubstituteFacultyAssignmentCreate(SubstituteFacultyAssignmentBase):
    pass

class SubstituteFacultyAssignmentUpdate(BaseModel):
    substitute_faculty_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None

class SubstituteFacultyAssignmentResponse(SubstituteFacultyAssignmentBase):
    id: int
    created_by: Optional[int] = None
    created_at: datetime
    model_config = {"from_attributes": True}
