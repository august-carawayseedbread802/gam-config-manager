"""Initialize database"""
from app.db.base import engine, Base
from app.db.models import Configuration, ConfigComparison, SecurityAnalysis, ConfigTemplate


async def init_db():
    """Create all database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database initialized successfully")


if __name__ == "__main__":
    import asyncio
    asyncio.run(init_db())

