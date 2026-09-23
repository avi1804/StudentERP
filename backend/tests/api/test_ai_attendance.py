import pytest
from datetime import date, datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.services.attendance_agent import AttendanceAgentService
from app.models.student import Student
from app.models.faculty import Faculty
from app.models.department import Department
from app.models.subject import Subject
from app.models.subject_assignment import SubjectAssignment
from app.models.user import User, Role
from app.models.attendance import Attendance, AttendanceStatus
from app.models.ai_attendance import (
    AIAttendanceSession,
    AIAttendanceMatch,
    AIAttendanceSessionStatus,
    AIAttendanceMatchStatus
)


# ─────────────────────────────────────────────────────────────
# 1. UNIT TESTS: Token Extraction, OCR Normalization & Metrics
# ─────────────────────────────────────────────────────────────

def test_extract_enrollment_tokens():
    raw_text = """
    Present students list for Machine Learning:
    1. 24CSE001 (Aarav)
    2. 24CSE002
    3. STU-2025-09
    4. CS629
    5. STU0042
    6. NonStudentText 123456
    """
    token_dicts = AttendanceAgentService.extract_enrollment_tokens(raw_text)
    tokens = [t["raw"] for t in token_dicts]
    
    assert "24CSE001" in tokens
    assert "24CSE002" in tokens
    assert "STU-2025-09" in tokens
    assert "CS629" in tokens
    assert "STU0042" in tokens
    # Ensure English word "students" was not captured as an enrollment number
    assert "students" not in tokens
    assert "STUDENTS" not in tokens


def test_normalize_ocr_enrollment():
    # 'I' or 'l' at the end of roll numbers often OCR mistranscribes '1'
    assert AttendanceAgentService.normalize_ocr_enrollment("24CSE00I") == "24CSE001"
    assert AttendanceAgentService.normalize_ocr_enrollment("24CSE00l") == "24CSE001"
    
    # 'O' inside digits often OCR mistranscribes '0'
    assert AttendanceAgentService.normalize_ocr_enrollment("STU250O2") == "STU25002"
    
    # 'B' vs '8' or 'S' vs '5'
    assert AttendanceAgentService.normalize_ocr_enrollment("CS629") == "CS629"


def test_levenshtein_ratio():
    # Exact
    assert AttendanceAgentService.calculate_levenshtein_ratio("CS629", "CS629") == 1.0
    
    # Single character difference
    ratio = AttendanceAgentService.calculate_levenshtein_ratio("24CSE001", "24CSE002")
    assert 0.85 <= ratio < 1.0
    
    # Very different
    diff_ratio = AttendanceAgentService.calculate_levenshtein_ratio("24CSE001", "MECH999")
    assert diff_ratio < 0.5


def test_validate_upload_file():
    # Valid
    assert AttendanceAgentService.validate_upload_file("test.pdf", b"dummy pdf content") == "pdf"
    assert AttendanceAgentService.validate_upload_file("photo.jpg", b"image bytes") == "image"
    assert AttendanceAgentService.validate_upload_file("screenshot.PNG", b"image bytes") == "image"
    assert AttendanceAgentService.validate_upload_file("notes.txt", b"plain text") == "text"
    
    # Invalid extension
    with pytest.raises(ValueError):
        AttendanceAgentService.validate_upload_file("payload.exe", b"executable bytes")
        
    # Empty file
    with pytest.raises(ValueError):
        AttendanceAgentService.validate_upload_file("sheet.pdf", b"")


# ─────────────────────────────────────────────────────────────
# 2. INTEGRATION TESTS: Database Matching, Assignment & Session
# ─────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_match_tokens_against_database():
    from tests.conftest import TestingSessionLocal
    async with TestingSessionLocal() as session:
        # Create department
        dept = Department(id=1, name="Computer Engineering", code="CE")
        session.add(dept)

        # Create student role
        role_stu = Role(id=2, name="student", description="Student Role")
        session.add(role_stu)
        await session.flush()

        # Create users for students
        u1 = User(id=1, email="s1@test.com", hashed_password="pw", full_name="Aarav Sharma", role_id=2)
        u2 = User(id=2, email="s2@test.com", hashed_password="pw", full_name="Priya Patel", role_id=2)
        u3 = User(id=3, email="s3@test.com", hashed_password="pw", full_name="Rohan Verma", role_id=2)
        session.add_all([u1, u2, u3])
        await session.flush()

        # Create test Subject
        sub = Subject(id=1, name="Machine Learning", code="CS629", semester=7, credits=4, department_id=1)
        session.add(sub)
        
        # Create test Students
        s1 = Student(id=1, user_id=1, enrollment_number="24CSE001", semester=7, batch="2023-2027")
        s2 = Student(id=2, user_id=2, enrollment_number="STU25002", semester=7, batch="2023-2027")
        s3 = Student(id=3, user_id=3, enrollment_number="CS629-99", semester=7, batch="2023-2027")
        session.add_all([s1, s2, s3])
        await session.commit()
        
        tokens = [
            {"raw": "24CSE001", "source_line": "1. 24CSE001 (Aarav)"},
            {"raw": "STU250O2", "source_line": "2. STU250O2"},
            {"raw": "RANDOM999", "source_line": "3. RANDOM999"}
        ]
        
        matches = AttendanceAgentService.match_tokens_against_database(
            tokens=tokens,
            subject_students=[s1, s2, s3],
            all_students=[s1, s2, s3],
            student_user_map={1: u1, 2: u2, 3: u3}
        )
        
        m_map = {m["enrollment_number"]: m for m in matches}
        
        # 24CSE001 -> AUTO_MATCHED with Student 1
        assert m_map["24CSE001"]["status"] == AIAttendanceMatchStatus.AUTO_MATCHED.value
        assert m_map["24CSE001"]["student_id"] == 1
        assert m_map["24CSE001"]["confidence"] >= 0.95
        assert m_map["24CSE001"]["marked_present"] is True
        
        # STU250O2 -> AUTO_MATCHED (corrected OCR typo to STU25002, high confidence)
        assert m_map["STU250O2"]["status"] == AIAttendanceMatchStatus.AUTO_MATCHED.value
        assert m_map["STU250O2"]["student_id"] == 2
        assert m_map["STU250O2"]["confidence"] >= 0.90
        assert m_map["STU250O2"]["marked_present"] is True
        
        # RANDOM999 -> NOT_FOUND
        assert m_map["RANDOM999"]["status"] == AIAttendanceMatchStatus.NOT_FOUND.value
        assert m_map["RANDOM999"]["student_id"] is None
        assert m_map["RANDOM999"]["marked_present"] is False


@pytest.mark.asyncio
async def test_faculty_subject_assignment_verification():
    from tests.conftest import TestingSessionLocal
    async with TestingSessionLocal() as session:
        # Create department
        dept = Department(id=2, name="Information Technology", code="IT")
        session.add(dept)

        # Create faculty role
        role_fac = Role(id=1, name="faculty", description="Faculty Role")
        session.add(role_fac)
        await session.flush()

        # Create Users
        u_fac1 = User(id=10, email="fac1@test.com", hashed_password="pw", full_name="Faculty One", role_id=1, is_superuser=False)
        u_fac2 = User(id=20, email="fac2@test.com", hashed_password="pw", full_name="Faculty Two", role_id=1, is_superuser=False)
        session.add_all([u_fac1, u_fac2])
        await session.flush()
        
        # Create Faculty profiles
        fac1 = Faculty(id=1, user_id=10, employee_id="FAC001", designation="Assistant Professor")
        fac2 = Faculty(id=2, user_id=20, employee_id="FAC002", designation="Professor")
        session.add_all([fac1, fac2])
        await session.flush()
        
        # Create Subject assigned directly to fac1.id
        sub1 = Subject(id=101, name="Database Systems", code="CS301", semester=5, credits=4, department_id=2, faculty_id=fac1.id)
        session.add(sub1)
        await session.commit()
        
        # fac1 should be authorized for sub1
        is_fac1_auth = await AttendanceAgentService.verify_faculty_subject_assignment(
            faculty_id=fac1.id,
            subject_id=101,
            db=session,
            current_user=u_fac1
        )
        assert is_fac1_auth is True
        
        # fac2 should NOT be authorized for sub1
        is_fac2_auth = await AttendanceAgentService.verify_faculty_subject_assignment(
            faculty_id=fac2.id,
            subject_id=101,
            db=session,
            current_user=u_fac2
        )
        assert is_fac2_auth is False


@pytest.mark.asyncio
async def test_check_existing_attendance():
    from tests.conftest import TestingSessionLocal
    async with TestingSessionLocal() as session:
        dept = Department(id=3, name="Computer Science Dept", code="CSD")
        session.add(dept)

        role_stu = Role(id=2, name="student", description="Student Role")
        session.add(role_stu)
        await session.flush()

        u_stu = User(id=30, email="stu@test.com", hashed_password="pw", full_name="Test Student", role_id=2)
        session.add(u_stu)
        await session.flush()
        
        sub = Subject(id=201, name="Compilers", code="CS401", semester=6, credits=4, department_id=3)
        s1 = Student(id=10, user_id=30, enrollment_number="ENR10", semester=6, batch="2023-2027")
        session.add_all([sub, s1])
        await session.commit()
        
        target_date = date(2026, 9, 23)
        
        # Before adding attendance
        exists_info = await AttendanceAgentService.check_existing_attendance(
            subject_id=201,
            target_date=target_date,
            db=session
        )
        assert exists_info["already_exists"] is False
        assert exists_info["existing_count"] == 0
        
        # Add attendance record
        att = Attendance(
            student_id=10,
            subject_id=201,
            date=target_date,
            status=AttendanceStatus.PRESENT
        )
        session.add(att)
        await session.commit()
        
        # After adding attendance
        exists_info2 = await AttendanceAgentService.check_existing_attendance(
            subject_id=201,
            target_date=target_date,
            db=session
        )
        assert exists_info2["already_exists"] is True
        assert exists_info2["existing_count"] == 1


@pytest.mark.asyncio
async def test_confirm_attendance_session():
    from tests.conftest import TestingSessionLocal
    async with TestingSessionLocal() as session:
        dept = Department(id=4, name="Robotics Dept", code="ROB")
        session.add(dept)

        role_fac = Role(id=1, name="faculty", description="Faculty Role")
        role_stu = Role(id=2, name="student", description="Student Role")
        session.add_all([role_fac, role_stu])
        await session.flush()

        # Create user, faculty, subject, students
        u_fac = User(id=50, email="lead@test.com", hashed_password="pw", full_name="Lead Fac", role_id=1, is_superuser=False)
        u_s1 = User(id=51, email="s1@test.com", hashed_password="pw", full_name="Student One", role_id=2)
        session.add_all([u_fac, u_s1])
        await session.flush()
        
        fac = Faculty(id=15, user_id=50, employee_id="EMP015", designation="Lead")
        session.add(fac)
        await session.flush()
        
        sub = Subject(id=301, name="AI & Robotics", code="AIR701", semester=7, credits=4, department_id=4, faculty_id=fac.id)
        s1 = Student(id=101, user_id=51, enrollment_number="AIR001", semester=7, batch="2023-2027")
        session.add_all([sub, s1])
        await session.commit()
        
        # Create session
        target_date = date(2026, 9, 23)
        ai_session = AIAttendanceSession(
            faculty_id=fac.id,
            subject_id=301,
            date=target_date,
            status=AIAttendanceSessionStatus.PENDING_REVIEW.value,
            file_type="text",
            total_detected=2,
            total_matched=1,
            total_unmatched=1,
        )
        session.add(ai_session)
        await session.flush()
        
        # Add matches
        m1 = AIAttendanceMatch(
            session_id=ai_session.id,
            enrollment_number="AIR001",
            student_id=101,
            confidence=0.98,
            status=AIAttendanceMatchStatus.AUTO_MATCHED.value,
            marked_present=True
        )
        m2 = AIAttendanceMatch(
            session_id=ai_session.id,
            enrollment_number="UNKNOWN",
            student_id=None,
            confidence=0.3,
            status=AIAttendanceMatchStatus.NOT_FOUND.value,
            marked_present=False
        )
        session.add_all([m1, m2])
        await session.commit()
        
        # Simulate Confirmation:
        # 1. verify authorization
        is_auth = await AttendanceAgentService.verify_faculty_subject_assignment(
            faculty_id=fac.id,
            subject_id=ai_session.subject_id,
            db=session,
            current_user=u_fac
        )
        assert is_auth is True
        
        # 2. Insert attendance with attendance_method="AI"
        now_time = datetime.utcnow().strftime("%H:%M")
        att = Attendance(
            student_id=m1.student_id,
            subject_id=ai_session.subject_id,
            date=ai_session.date,
            status=AttendanceStatus.PRESENT,
            marked_by_id=fac.id,
            lecture_id=f"ai-lecture-{ai_session.subject_id}-{ai_session.date.strftime('%Y%m%d')}",
            time=now_time,
            attendance_method="AI"
        )
        session.add(att)
        ai_session.status = AIAttendanceSessionStatus.CONFIRMED.value
        ai_session.confirmed_at = datetime.utcnow()
        await session.commit()
        
        # Check Attendance record in database
        stmt = select(Attendance).where(
            Attendance.subject_id == 301,
            Attendance.student_id == 101,
            Attendance.date == target_date
        )
        saved_att = (await session.execute(stmt)).scalars().first()
        assert saved_att is not None
        assert saved_att.attendance_method == "AI"
        assert saved_att.status == AttendanceStatus.PRESENT
