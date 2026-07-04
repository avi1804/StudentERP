import os
import re

models_dir = r"c:\Users\HARSH\OneDrive\Desktop\StudentERP\backend\app\models"

# Map class names to their module
class_to_module = {
    "User": "user",
    "Student": "student",
    "Faculty": "faculty",
    "Department": "department",
    "Course": "course",
    "Subject": "subject",
    "SubjectAssignment": "subject_assignment",
    "Timetable": "timetable",
    "Marks": "marks",
    "Exam": "marks",
    "ExamResult": "marks",
    "Attendance": "attendance",
    "AttendanceSession": "attendance",
    "AttendanceLog": "attendance",
    "Fees": "fees",
    "Payment": "fees",
    "PlacementCompany": "placement",
    "PlacementDrive": "placement",
    "PlacementApplication": "placement",
    "Notice": "communication",
    "Notification": "communication",
    "Complaint": "communication",
    "AuditLog": "system",
    "DashboardStat": "system",
    "SystemSetting": "system",
    "ImportExportHistory": "system",
    "SubstituteFacultyAssignment": "system",
}

for filename in os.listdir(models_dir):
    if not filename.endswith(".py") or filename == "__init__.py":
        continue
    filepath = os.path.join(models_dir, filename)
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Find all type hints like Mapped["ClassName"] or Mapped[Optional["ClassName"]]
    # Or Mapped[List["ClassName"]]
    classes_needed = set()
    matches = re.findall(r'Mapped\[.*?\"([A-Za-z0-9_]+)\".*?\]', content)
    for match in matches:
        classes_needed.add(match)
        
    if not classes_needed:
        continue
        
    # filter out classes defined in this same file
    current_module = filename.replace(".py", "")
    imports_to_add = set()
    for cls in classes_needed:
        mod = class_to_module.get(cls)
        if mod and mod != current_module:
            imports_to_add.add(f"    from app.models.{mod} import {cls}")
            
    if not imports_to_add:
        continue
        
    # Add TYPE_CHECKING import if not there
    if "from typing import TYPE_CHECKING" not in content:
        content = content.replace("from typing import ", "from typing import TYPE_CHECKING, ")
        if "from typing import TYPE_CHECKING, " not in content: # if there was no 'from typing import '
            content = "from typing import TYPE_CHECKING\n" + content
            
    # Add TYPE_CHECKING block after Base import
    import_block = "\nif TYPE_CHECKING:\n" + "\n".join(sorted(imports_to_add)) + "\n"
    
    # insert after `from app.database.base import Base`
    if "from app.database.base import Base" in content and import_block not in content:
        content = content.replace("from app.database.base import Base", "from app.database.base import Base\n" + import_block)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Done fixing type checking imports.")
