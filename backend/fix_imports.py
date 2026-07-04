import os
import glob

router_dir = r"c:\Users\HARSH\OneDrive\Desktop\StudentERP\backend\app\api\v1"
files = glob.glob(os.path.join(router_dir, "*.py"))

replacements = {
    "app.schemas.department": "app.schemas.academic",
    "app.repositories.department": "app.repositories.academic",
    "app.schemas.subject": "app.schemas.academic",
    "app.repositories.subject": "app.repositories.academic",
    "app.schemas.notice": "app.schemas.communication",
    "app.repositories.notice": "app.repositories.communication",
}

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    modified = False
    for old, new in replacements.items():
        if old in content:
            content = content.replace(old, new)
            modified = True
            
    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {os.path.basename(file_path)}")
