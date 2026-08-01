import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def clear_attendance_table():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        print("Clearing all records from 'attendance' database table...")
        await conn.execute(text("DELETE FROM attendance;"))
        print("Successfully deleted all attendance records from database!")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(clear_attendance_table())
