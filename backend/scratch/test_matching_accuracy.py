import os, sys
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.attendance_agent import AttendanceAgentService
from app.models.ai_attendance import AIAttendanceMatchStatus

# Simulate the exact 12 handwritten roll numbers from the user's test
tokens = [
    {"raw": "CS629", "source_line": "CS629"},
    {"raw": "STU25002", "source_line": "STU25002"},
    {"raw": "STU25003", "source_line": "STU25003"},
    {"raw": "STU25005", "source_line": "STU25005"},
    {"raw": "STU25006", "source_line": "STU25006"},
    {"raw": "STU25008", "source_line": "STU25008"},
    {"raw": "STU25009", "source_line": "STU25009"},
    {"raw": "STU25010", "source_line": "STU25010"},
    {"raw": "STU25011", "source_line": "STU25011"},
    {"raw": "STU25013", "source_line": "STU25013"},
    {"raw": "STU25014", "source_line": "STU25014"},
    {"raw": "STU25015", "source_line": "STU25015"},
]

# Build mock students matching the real DB
class MockStudent:
    def __init__(self, id, user_id, enrollment_number, semester, batch):
        self.id = id
        self.user_id = user_id
        self.enrollment_number = enrollment_number
        self.semester = semester
        self.batch = batch

class MockUser:
    def __init__(self, id, full_name):
        self.id = id
        self.full_name = full_name

students = [
    MockStudent(1, 2, "CS629", 7, "2023-2027"),
    MockStudent(5, 13, "STU25002", 7, "2023-2027"),
    MockStudent(6, 15, "STU25003", 5, "2023-2027"),
    MockStudent(7, 16, "STU25004", 7, "2023-2027"),
    MockStudent(8, 17, "STU25005", 5, "2023-2027"),
    MockStudent(9, 18, "STU25006", 3, "2023-2027"),
    MockStudent(10, 19, "STU25007", 1, "2023-2027"),
    MockStudent(11, 20, "STU25008", 7, "2023-2027"),
    MockStudent(12, 21, "STU25009", 5, "2023-2027"),
    MockStudent(13, 22, "STU25010", 3, "2023-2027"),
    MockStudent(14, 23, "STU25011", 7, "2023-2027"),
    MockStudent(15, 24, "STU25012", 5, "2023-2027"),
    MockStudent(16, 25, "STU25013", 1, "2023-2027"),
    MockStudent(17, 26, "STU25014", 7, "2023-2027"),
    MockStudent(18, 27, "STU25015", 3, "2023-2027"),
]

users = {
    2: MockUser(2, "Harsh Rao"),
    13: MockUser(13, "Diya Patel"),
    15: MockUser(15, "Vivaan Mehta"),
    16: MockUser(16, "Anaya Desai"),
    17: MockUser(17, "Reyansh Verma"),
    18: MockUser(18, "Kiara Joshi"),
    19: MockUser(19, "Aditya Rao"),
    20: MockUser(20, "Myra Shah"),
    21: MockUser(21, "Arjun Nair"),
    22: MockUser(22, "Siya Kapoor"),
    23: MockUser(23, "Kabir Singh"),
    24: MockUser(24, "Ishita Trivedi"),
    25: MockUser(25, "Rohan Gupta"),
    26: MockUser(26, "Meera Iyer"),
    27: MockUser(27, "Yash Malhotra"),
}

results = AttendanceAgentService.match_tokens_against_database(
    tokens=tokens,
    subject_students=students,
    all_students=students,
    student_user_map=users
)

print()
print("=" * 80)
print("MATCHING RESULTS: %d matches for %d tokens" % (len(results), len(tokens)))
print("=" * 80)

auto_matched = 0
diya_count = 0
kabir_count = 0
unique_ids = set()

for r in results:
    icon = "OK" if r["status"] == "AUTO_MATCHED" else "WARN" if r["status"] == "REVIEW_REQUIRED" else "FAIL"
    print("%s  %-12s -> %-20s (ID=%s) confidence=%.2f status=%s reason=%s" % (
        icon, r["enrollment_number"], r["student_name"], r["student_id"],
        r["confidence"], r["status"], r["match_reason"]
    ))
    if r["status"] == "AUTO_MATCHED":
        auto_matched += 1
    if r["student_name"] == "Diya Patel":
        diya_count += 1
    if r["student_name"] == "Kabir Singh":
        kabir_count += 1
    if r["student_id"]:
        unique_ids.add(r["student_id"])

print()
print("Auto-matched: %d/%d" % (auto_matched, len(tokens)))
print("Unique student IDs: %d" % len(unique_ids))
print("Diya Patel matches: %d (should be 1)" % diya_count)
print("Kabir Singh matches: %d (should be 1)" % kabir_count)
print("ACCURACY: %.0f%%" % (auto_matched / len(tokens) * 100))
print("ALL UNIQUE: %s" % ("PASS" if len(unique_ids) == len(tokens) else "FAIL"))
