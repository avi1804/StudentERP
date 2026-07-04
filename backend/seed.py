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
            
if __name__ == "__main__":
    asyncio.run(seed())
