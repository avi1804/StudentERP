import asyncio
from app.database.session import AsyncSessionLocal
from app.models.attendance import Attendance
from datetime import datetime

async def test():
    async with AsyncSessionLocal() as db:
        new_att = Attendance(
            student_id=1,
            subject_id=1,
            date=datetime.strptime("2026-07-05", "%Y-%m-%d").date(),
            status="PRESENT",
            marked_by_id=None
        )
        db.add(new_att)
        try:
            await db.commit()
            print("SUCCESS (Parsed)")
        except Exception as e:
            print(f"FAILED (Parsed): {e}")

        new_att_2 = Attendance(
            student_id=1,
            subject_id=1,
            date="2026-07-05",
            status="PRESENT",
            marked_by_id=None
        )
        db.add(new_att_2)
        try:
            await db.commit()
            print("SUCCESS (String)")
        except Exception as e:
            print(f"FAILED (String): {e}")

asyncio.run(test())
