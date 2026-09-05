import asyncio
import datetime
import random
import sys
import os

# Set up paths
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings
from app.models.student import Student
from app.models.user import User
from app.models.subject import Subject
from app.models.attendance import Attendance, AttendanceStatus

# Master timetable slot definitions matching frontend and backend
TIMETABLE_SLOTS = {
    "monday": [
        {"slot_id": "tt_mon_1", "subject_id": 1, "faculty_id": 1, "time": "09:00"},
        {"slot_id": "tt_mon_2", "subject_id": 2, "faculty_id": 3, "time": "10:00"},
        {"slot_id": "tt_mon_3", "subject_id": 3, "faculty_id": 6, "time": "11:00"},
        {"slot_id": "tt_mon_4", "subject_id": 4, "faculty_id": 5, "time": "12:00"},
        {"slot_id": "tt_mon_5", "subject_id": 5, "faculty_id": 4, "time": "14:00"},
        {"slot_id": "tt_mon_6", "subject_id": 1, "faculty_id": 1, "time": "15:00"},
    ],
    "tuesday": [
        {"slot_id": "tt_tue_1", "subject_id": 2, "faculty_id": 3, "time": "09:00"},
        {"slot_id": "tt_tue_2", "subject_id": 3, "faculty_id": 6, "time": "10:00"},
        {"slot_id": "tt_tue_3", "subject_id": 5, "faculty_id": 4, "time": "11:00"},
        {"slot_id": "tt_tue_4", "subject_id": 1, "faculty_id": 1, "time": "12:00"},
        {"slot_id": "tt_tue_5", "subject_id": 4, "faculty_id": 5, "time": "14:00"},
        {"slot_id": "tt_tue_6", "subject_id": 2, "faculty_id": 3, "time": "15:00"},
    ],
    "wednesday": [
        {"slot_id": "tt_wed_1", "subject_id": 4, "faculty_id": 5, "time": "09:00"},
        {"slot_id": "tt_wed_2", "subject_id": 5, "faculty_id": 4, "time": "10:00"},
        {"slot_id": "tt_wed_3", "subject_id": 1, "faculty_id": 1, "time": "11:00"},
        {"slot_id": "tt_wed_4", "subject_id": 2, "faculty_id": 3, "time": "12:00"},
        {"slot_id": "tt_wed_5", "subject_id": 3, "faculty_id": 6, "time": "14:00"},
        {"slot_id": "tt_wed_6", "subject_id": 3, "faculty_id": 6, "time": "15:00"},
    ],
    "thursday": [
        {"slot_id": "tt_thu_1", "subject_id": 3, "faculty_id": 6, "time": "09:00"},
        {"slot_id": "tt_thu_2", "subject_id": 1, "faculty_id": 1, "time": "10:00"},
        {"slot_id": "tt_thu_3", "subject_id": 2, "faculty_id": 3, "time": "11:00"},
        {"slot_id": "tt_thu_4", "subject_id": 5, "faculty_id": 4, "time": "12:00"},
        {"slot_id": "tt_thu_5", "subject_id": 4, "faculty_id": 5, "time": "14:00"},
        {"slot_id": "tt_thu_6", "subject_id": 4, "faculty_id": 5, "time": "15:00"},
    ],
    "friday": [
        {"slot_id": "tt_fri_1", "subject_id": 5, "faculty_id": 4, "time": "09:00"},
        {"slot_id": "tt_fri_2", "subject_id": 4, "faculty_id": 5, "time": "10:00"},
        {"slot_id": "tt_fri_3", "subject_id": 1, "faculty_id": 1, "time": "11:00"},
        {"slot_id": "tt_fri_4", "subject_id": 3, "faculty_id": 6, "time": "12:00"},
        {"slot_id": "tt_fri_5", "subject_id": 2, "faculty_id": 3, "time": "14:00"},
        {"slot_id": "tt_fri_6", "subject_id": 5, "faculty_id": 4, "time": "15:00"},
    ]
}

async def generate_random_attendance():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    async with async_session() as db:
        print("Fetching students and subjects from database...")
        students = (await db.scalars(select(Student))).all()
        subjects = (await db.scalars(select(Subject).where(Subject.semester == 7))).all()
        if not subjects:
            subjects = (await db.scalars(select(Subject))).all()

        print(f"Found {len(students)} students and {len(subjects)} subjects.")

        # Clear existing attendance
        print("Clearing existing attendance records...")
        await db.execute(text("DELETE FROM attendance;"))
        await db.commit()

        # Date range: 2026-08-01 to 2026-08-24
        start_date = datetime.date(2026, 8, 1)
        end_date = datetime.date(2026, 8, 24)

        # Collect all weekday dates
        lecture_dates = []
        curr = start_date
        while curr <= end_date:
            weekday = curr.weekday() # 0 = Monday, 4 = Friday, 5 = Sat, 6 = Sun
            if weekday < 5: # Monday to Friday
                lecture_dates.append(curr)
            curr += datetime.timedelta(days=1)

        print(f"Total active lecture days (Monday-Friday) from {start_date} to {end_date}: {len(lecture_dates)} days.")

        # Assign each student a target attendance probability
        # At least 50% of students will have high attendance (80% - 94%, strictly > 75%)
        # The remainder will have medium/lower attendance (50% - 68%, strictly < 75%)
        random.seed(123) # Deterministic pseudo-random seed for reproducibility
        student_list = list(students)
        total_students = len(student_list)
        high_att_count = (total_students + 1) // 2  # At least 50% (9 out of 17 = 52.9%)

        high_group = []
        low_group = []

        # Find Harsh Rao (id=1) to include in high_group
        for s in student_list:
            if s.id == 1:
                high_group.append(s)
                break
        
        remaining_students = [s for s in student_list if s not in high_group]
        random.shuffle(remaining_students)

        while len(high_group) < high_att_count:
            high_group.append(remaining_students.pop(0))
        low_group = remaining_students

        student_target_prob = {}
        for s in high_group:
            # Target probability between 0.82 and 0.94 (Attendance > 75%)
            student_target_prob[s.id] = random.uniform(0.82, 0.94)
        for s in low_group:
            # Target probability between 0.50 and 0.68 (Attendance < 75%)
            student_target_prob[s.id] = random.uniform(0.50, 0.68)

        print(f"Assigned {len(high_group)} students to >75% group and {len(low_group)} students to <75% group.")

        # Generate attendance records
        records_to_insert = []
        student_stats = {s.id: {"present": 0, "total": 0, "subject_wise": {sub.id: {"present": 0, "total": 0} for sub in subjects}} for s in student_list}

        day_names = ["monday", "tuesday", "wednesday", "thursday", "friday"]

        for d in lecture_dates:
            d_str = d.isoformat()
            weekday_name = day_names[d.weekday()]
            slots = TIMETABLE_SLOTS.get(weekday_name, [])

            for slot in slots:
                slot_id = slot["slot_id"]
                sub_id = slot["subject_id"]
                fac_id = slot["faculty_id"]
                slot_time = slot["time"]
                lecture_id = f"inst_{d_str}_{slot_id}"

                for s in student_list:
                    p = student_target_prob[s.id]
                    # Randomize presence based on target probability
                    is_present = (random.random() < p)
                    status = AttendanceStatus.PRESENT if is_present else AttendanceStatus.ABSENT

                    att = Attendance(
                        student_id=s.id,
                        subject_id=sub_id,
                        date=d,
                        status=status,
                        marked_by_id=fac_id,
                        lecture_id=lecture_id,
                        time=slot_time,
                        attendance_method="Manual"
                    )
                    records_to_insert.append(att)

                    # Update stats
                    student_stats[s.id]["total"] += 1
                    if is_present:
                        student_stats[s.id]["present"] += 1
                    
                    if sub_id in student_stats[s.id]["subject_wise"]:
                        student_stats[s.id]["subject_wise"][sub_id]["total"] += 1
                        if is_present:
                            student_stats[s.id]["subject_wise"][sub_id]["present"] += 1

        print(f"Total attendance records to insert: {len(records_to_insert)}")
        db.add_all(records_to_insert)
        await db.commit()
        print("Successfully saved all attendance records to database!")

        # Print detailed report
        print("\n" + "="*80)
        print("ATTENDANCE SUMMARY REPORT (Aug 1, 2026 to Aug 24, 2026)")
        print("="*80)
        print(f"{'ID':<4} {'Enrollment':<12} {'Name':<20} {'Attended/Total':<16} {'Percentage':<12} {'Status (>75%)'}")
        print("-"*80)

        above_75_count = 0
        for s in student_list:
            u = await db.scalar(select(User).where(User.id == s.user_id))
            name = u.full_name if u else "Unknown"
            stat = student_stats[s.id]
            pct = round((stat["present"] / stat["total"] * 100), 1) if stat["total"] > 0 else 0
            is_above = pct >= 75.0
            if is_above:
                above_75_count += 1
            print(f"{s.id:<4} {s.enrollment_number:<12} {name:<20} {stat['present']}/{stat['total']:<12} {pct:>6.1f}%      {'YES (>=75%)' if is_above else 'NO (<75%)'}")

        print("="*80)
        print(f"Total Students: {total_students}")
        print(f"Students with >= 75% Attendance: {above_75_count} ({round(above_75_count / total_students * 100, 1)}%)")
        print(f"Students with < 75% Attendance: {total_students - above_75_count} ({round((total_students - above_75_count) / total_students * 100, 1)}%)")
        print("="*80)

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(generate_random_attendance())
