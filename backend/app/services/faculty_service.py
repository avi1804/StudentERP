from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext

from app.models.user import User, Role
from app.schemas.faculty import FacultyCreate, FacultyEnroll
from app.repositories.faculty import faculty_repo
from app.core.exceptions import BadRequestException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class FacultyService:
    @staticmethod
    async def enroll_faculty(db: AsyncSession, faculty_data: FacultyEnroll):
        # 1. Check if email exists
        existing_user_query = await db.execute(select(User).where(User.email == faculty_data.email))
        if existing_user_query.scalars().first():
            raise BadRequestException("User with this email already exists.")
            
        # 2. Check if employee ID exists
        if await faculty_repo.get_by_employee_id(db, employee_id=faculty_data.employee_id):
            raise BadRequestException("Faculty with this employee ID already exists.")

        # 3. Get faculty role
        role_query = await db.execute(select(Role).where(Role.name == "faculty"))
        faculty_role = role_query.scalars().first()
        if not faculty_role:
            raise BadRequestException("Faculty role not found in system.")

        # 4. Create User
        new_user = User(
            email=faculty_data.email,
            hashed_password=pwd_context.hash(faculty_data.password),
            full_name=faculty_data.full_name,
            role_id=faculty_role.id,
            is_active=True
        )
        db.add(new_user)
        await db.flush() # flush to get user ID
        
        # 5. Create Faculty Profile
        new_faculty = FacultyCreate(
            user_id=new_user.id,
            employee_id=faculty_data.employee_id,
            designation=faculty_data.designation,
            department_id=faculty_data.department_id,
            contact_number=faculty_data.phone
        )
        
        created_faculty = await faculty_repo.create(db, obj_in=new_faculty)
        created_faculty.user = new_user
        
        await db.commit()
        return created_faculty

    @staticmethod
    async def delete_faculty(db: AsyncSession, faculty_id: int):
        faculty = await faculty_repo.get(db, id=faculty_id)
        if not faculty:
            return False
            
        # Delete the associated user as well
        user_query = await db.execute(select(User).where(User.id == faculty.user_id))
        user = user_query.scalars().first()
        
        await faculty_repo.remove(db, id=faculty_id)
        if user:
            await db.delete(user)
            await db.commit()
            
        return True
