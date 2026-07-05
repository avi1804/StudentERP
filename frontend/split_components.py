import re

# Clean up AttendanceManager.tsx
with open("C:/Users/HARSH/OneDrive/Desktop/StudentERP/frontend/src/pages/faculty/AttendanceManager.tsx", "r", encoding="utf-8") as f:
    am_content = f.read()

parts1 = am_content.split('{/* Report panel */}')
if len(parts1) == 2:
    parts2 = parts1[1].split('{/* Low attendance */}')
    if len(parts2) == 2:
        am_content = parts1[0] + '</div>\n\n      {/* Low attendance */}' + parts2[1]

with open("C:/Users/HARSH/OneDrive/Desktop/StudentERP/frontend/src/pages/faculty/AttendanceManager.tsx", "w", encoding="utf-8") as f:
    f.write(am_content)

# Clean up AttendanceReport.tsx
with open("C:/Users/HARSH/OneDrive/Desktop/StudentERP/frontend/src/pages/faculty/AttendanceReport.tsx", "r", encoding="utf-8") as f:
    ar_content = f.read()

ar_content = ar_content.replace("export const AttendanceManager: React.FC = () => {", "export const AttendanceReport: React.FC = () => {")

parts1 = ar_content.split('{/* Mark panel */}')
if len(parts1) == 2:
    parts2 = parts1[1].split('{/* Report panel */}')
    if len(parts2) == 2:
        ar_content = parts1[0] + '{/* Report panel */}' + parts2[1]

parts1 = ar_content.split('{/* Low attendance */}')
if len(parts1) == 2:
    ar_content = parts1[0] + '</div>\n  );\n};\n'

with open("C:/Users/HARSH/OneDrive/Desktop/StudentERP/frontend/src/pages/faculty/AttendanceReport.tsx", "w", encoding="utf-8") as f:
    f.write(ar_content)

print("Done splitting")
