from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext

from app.models.user import User, Role
from app.schemas.student import StudentCreate, StudentEnroll
from app.repositories.student import student_repo
from app.core.exceptions import BadRequestException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class StudentService:
    @staticmethod
    async def enroll_student(db: AsyncSession, student_data: StudentEnroll):
        # 1. Check if email exists
        existing_user_query = await db.execute(select(User).where(User.email == student_data.email))
        if existing_user_query.scalars().first():
            raise BadRequestException("User with this email already exists.")
            
        # 2. Check if enrollment exists
        if await student_repo.get_by_enrollment_number(db, enrollment_number=student_data.enrollment_number):
            raise BadRequestException("Student with this enrollment number already exists.")

        # 3. Get student role
        role_query = await db.execute(select(Role).where(Role.name == "student"))
        student_role = role_query.scalars().first()
        if not student_role:
            raise BadRequestException("Student role not found in system.")

        # 4. Create User
        new_user = User(
            email=student_data.email,
            hashed_password=pwd_context.hash(student_data.password),
            full_name=student_data.full_name,
            role_id=student_role.id,
            is_active=True
        )
        db.add(new_user)
        await db.flush() # flush to get user ID
        
        # 5. Create Student Profile
        new_student = StudentCreate(
            user_id=new_user.id,
            enrollment_number=student_data.enrollment_number,
            batch=f"{student_data.branch} - Sem {student_data.semester}",
            contact_number=student_data.phone
        )
        
        created_student = await student_repo.create(db, obj_in=new_student)
        await db.commit()
        return created_student

    @staticmethod
    async def delete_student(db: AsyncSession, student_id: int):
        student = await student_repo.get(db, id=student_id)
        if not student:
            return False
            
        # Delete the associated user as well
        user_query = await db.execute(select(User).where(User.id == student.user_id))
        user = user_query.scalars().first()
        
        await student_repo.remove(db, id=student_id)
        if user:
            await db.delete(user)
            await db.commit()
            
        return True
