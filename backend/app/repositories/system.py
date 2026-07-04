from app.crud.base import CRUDBase
from app.models.system import DashboardStat, ImportExportHistory, SystemSetting, SubstituteFacultyAssignment
from app.schemas.system import (
    DashboardStatCreate, DashboardStatUpdate,
    ImportExportHistoryCreate, ImportExportHistoryBase,
    SystemSettingCreate, SystemSettingUpdate,
    SubstituteFacultyAssignmentCreate, SubstituteFacultyAssignmentUpdate
)

dashboard_stat_repo = CRUDBase[DashboardStat, DashboardStatCreate, DashboardStatUpdate](DashboardStat)
import_export_repo = CRUDBase[ImportExportHistory, ImportExportHistoryCreate, ImportExportHistoryBase](ImportExportHistory)
system_setting_repo = CRUDBase[SystemSetting, SystemSettingCreate, SystemSettingUpdate](SystemSetting)
substitute_faculty_repo = CRUDBase[SubstituteFacultyAssignment, SubstituteFacultyAssignmentCreate, SubstituteFacultyAssignmentUpdate](SubstituteFacultyAssignment)
