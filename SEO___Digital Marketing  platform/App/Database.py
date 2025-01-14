from sqlalchemy.ext.asyncio import AsyncSessuserion, create_async_engine
from sqlalchemy.orm import sessionmaker 

DATABASE_URL = "postgresql+asyncpg://username:password@localhost/dbname" 

engine  = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_comit =False)
