import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from app.database.base import Base
from app.core.config import settings

async def reset_db():
    engine = create_async_engine(settings.DATABASE_URL)
    from app.models import Base as AppBase
    from sqlalchemy import text
    async with engine.begin() as conn:
        print("Disabling foreign key checks...")
        await conn.execute(text("SET FOREIGN_KEY_CHECKS=0;"))
        print("Dropping alembic_version table...")
        await conn.execute(text("DROP TABLE IF EXISTS alembic_version;"))
        print("Dropping all tables...")
        await conn.run_sync(AppBase.metadata.drop_all)
        print("Tables dropped. Re-enabling foreign key checks...")
        await conn.execute(text("SET FOREIGN_KEY_CHECKS=1;"))
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(reset_db())
