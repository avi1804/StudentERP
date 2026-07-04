import os
import glob

router_dir = r"c:\Users\HARSH\OneDrive\Desktop\StudentERP\backend\app\api\v1"
files = glob.glob(os.path.join(router_dir, "*.py"))

replacements = {
    "Role.ADMIN": '"admin"',
    "Role.FACULTY": '"faculty"',
    "Role.STUDENT": '"student"',
    "current_user.role ==": "current_user.role.name ==",
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
