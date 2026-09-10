import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Enterprise Business Intelligence Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-enterprise-bi-key-2026-dav-project")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # SQLite default fallback with PostgreSQL compatibility
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./bi_warehouse.db")
    
    class Config:
        case_sensitive = True

settings = Settings()
