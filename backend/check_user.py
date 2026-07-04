import asyncio
from app.database.session import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import select

async def check():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).where(User.email == 'admin@example.com'))
        user = res.scalars().first()
        if user:
            print(f"Found user: {user.email}")
            print(f"Role: {user.role.name if user.role else 'None'}")
            print(f"Hashed Password: {user.hashed_password}")
        else:
            print("User admin@example.com not found in the database!")

        # Also check all users to see what's actually there
        print("\nAll users:")
        all_users = await db.execute(select(User))
        for u in all_users.scalars().all():
            print(f"- {u.email} (Role: {u.role.name if u.role else 'None'})")

asyncio.run(check())
