import asyncio
from app.database.session import AsyncSessionLocal
from app.models.user import User, Role
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed():
    async with AsyncSessionLocal() as db:
        # Check if roles exist
        from sqlalchemy import select
        admin_role = (await db.execute(select(Role).where(Role.name == "admin"))).scalars().first()
        if not admin_role:
            admin_role = Role(name="admin", description="System Administrator")
            faculty_role = Role(name="faculty", description="Faculty Member")
            student_role = Role(name="student", description="Student")
            db.add_all([admin_role, faculty_role, student_role])
            await db.commit()
            await db.refresh(admin_role)
            print("Created roles: admin, faculty, student")

        # Check if admin user exists
        admin_user = (await db.execute(select(User).where(User.email == "admin@example.com"))).scalars().first()
        if not admin_user:
            admin_user = User(
                email="admin@example.com",
                hashed_password=pwd_context.hash("admin"),
                full_name="System Admin",
                role_id=admin_role.id,
                is_active=True,
                is_superuser=True
            )
            db.add(admin_user)
            await db.commit()
            print("Created admin user: admin@example.com / admin")
        else:
            print("Admin user already exists!")
            
        # Check if departments exist
        from app.models.department import Department
        from app.models.course import Course
        
        dept_cs = (await db.execute(select(Department).where(Department.code == "CSE"))).scalars().first()
        if not dept_cs:
            dept_cs = Department(name="Computer Science and Engineering", code="CSE", description="Department of CSE")
            dept_ee = Department(name="Electrical Engineering", code="EE", description="Department of EE")
            dept_me = Department(name="Mechanical Engineering", code="ME", description="Department of ME")
            
            db.add_all([dept_cs, dept_ee, dept_me])
            await db.commit()
            await db.refresh(dept_cs)
            
            course_cs = Course(name="B.Tech Computer Science", code="BTECH-CSE", department_id=dept_cs.id)
            course_ee = Course(name="B.Tech Electrical", code="BTECH-EE", department_id=dept_ee.id)
            db.add_all([course_cs, course_ee])
            await db.commit()
            print("Created seed departments and courses")
        else:
            print("Departments already exist!")
            
if __name__ == "__main__":
    asyncio.run(seed())
