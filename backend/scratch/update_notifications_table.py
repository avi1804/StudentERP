import asyncio
from app.database.session import AsyncSessionLocal
from sqlalchemy import text

async def update_schema():
    async with AsyncSessionLocal() as db:
        print("Checking notifications table schema...")
        res = await db.execute(text("DESCRIBE notifications"))
        cols = {r[0] for r in res.fetchall()}
        print("Existing columns:", cols)

        # 1. Modify user_id to be nullable
        print("Making user_id NULLable...")
        try:
            await db.execute(text("ALTER TABLE notifications MODIFY user_id INT NULL"))
            print("user_id altered successfully.")
        except Exception as e:
            print("ALTER user_id error (may already be nullable):", e)

        # 2. Add category if missing
        if "category" not in cols:
            print("Adding category column...")
            await db.execute(text("ALTER TABLE notifications ADD COLUMN category VARCHAR(50) DEFAULT 'GENERAL'"))

        # 3. Add sender_role if missing
        if "sender_role" not in cols:
            print("Adding sender_role column...")
            await db.execute(text("ALTER TABLE notifications ADD COLUMN sender_role VARCHAR(50) DEFAULT 'admin'"))

        # 4. Add sender_name if missing
        if "sender_name" not in cols:
            print("Adding sender_name column...")
            await db.execute(text("ALTER TABLE notifications ADD COLUMN sender_name VARCHAR(100) NULL"))

        # 5. Add target_role if missing
        if "target_role" not in cols:
            print("Adding target_role column...")
            await db.execute(text("ALTER TABLE notifications ADD COLUMN target_role VARCHAR(50) DEFAULT 'all'"))

        # 6. Add link if missing
        if "link" not in cols:
            print("Adding link column...")
            await db.execute(text("ALTER TABLE notifications ADD COLUMN link VARCHAR(255) NULL"))

        await db.commit()
        print("Notifications table updated successfully!")

        res = await db.execute(text("DESCRIBE notifications"))
        for r in res.fetchall():
            print("Col:", r)

if __name__ == "__main__":
    asyncio.run(update_schema())
