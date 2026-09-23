import asyncio
from app.database.session import AsyncSessionLocal
from app.models.student import Student
from app.models.user import User
from app.models.subject import Subject
from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as s:
        students = (await s.execute(select(Student, User).join(User, Student.user_id == User.id))).all()
        print(f"Total students in DB: {len(students)}")
        for st, u in students:
            print(f"ID={st.id} Enrollment='{st.enrollment_number}' Name='{u.full_name}' Sem={st.semester}")

        # Check subjects
        subs = (await s.execute(select(Subject))).scalars().all()
        print("\nSubjects:")
        for sub in subs:
            print(f"Sub ID={sub.id} Code='{sub.code}' Name='{sub.name}' Sem={sub.semester}")

if __name__ == "__main__":
    asyncio.run(main())
