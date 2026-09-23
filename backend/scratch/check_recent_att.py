import asyncio
from app.database.session import AsyncSessionLocal
from app.models.attendance import Attendance
from app.models.student import Student
from app.models.user import User
from app.models.ai_attendance import AIAttendanceSession, AIAttendanceMatch
from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as s:
        # Check sessions
        sessions = (await s.execute(select(AIAttendanceSession).order_by(AIAttendanceSession.id.desc()).limit(5))).scalars().all()
        print(f"Recent AI Sessions ({len(sessions)}):")
        for sess in sessions:
            print(f"Session {sess.id}: sub={sess.subject_id} date={sess.date} status={sess.status} detected={sess.total_detected} confirmed_at={sess.confirmed_at}")
            matches = (await s.execute(select(AIAttendanceMatch).where(AIAttendanceMatch.session_id == sess.id))).scalars().all()
            for m in matches:
                print(f"  Match {m.id}: enr={m.enrollment_number} stu_id={m.student_id} conf={m.confidence} status={m.status} present={m.marked_present}")

        # Check latest attendances
        atts = (await s.execute(select(Attendance, Student, User).join(Student, Attendance.student_id == Student.id).join(User, Student.user_id == User.id).order_by(Attendance.id.desc()).limit(15))).all()
        print(f"\nRecent Attendance Records ({len(atts)}):")
        for a, st, u in atts:
            print(f"Att {a.id}: sub={a.subject_id} date={a.date} stu='{u.full_name}' ({st.enrollment_number}) status={a.status} method={a.attendance_method} lecture_id='{a.lecture_id}'")

if __name__ == "__main__":
    asyncio.run(main())
