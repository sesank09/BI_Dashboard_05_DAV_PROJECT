import os
from pydantic_settings import BaseSettings
from pydantic import model_validator

def get_database_url() -> str:
    raw = os.getenv("DATABASE_URL", "").strip()
    is_vercel = bool("VERCEL" in os.environ or "VERCEL_ENV" in os.environ)
    fallback = "sqlite:////tmp/bi_warehouse.db" if is_vercel else "sqlite:///./bi_warehouse.db"
    
    if not raw or "example.com" in raw:
        return fallback
    
    if raw.startswith("postgres://"):
        raw = raw.replace("postgres://", "postgresql://", 1)
        
    try:
        from sqlalchemy.engine import make_url
        parsed = make_url(raw)
        if parsed.drivername:
            return raw
    except Exception as e:
        print(f"[Config] Invalid DATABASE_URL '{raw}', falling back to {fallback}: {e}")
        return fallback
        
    return fallback

class Settings(BaseSettings):
    PROJECT_NAME: str = "Enterprise Business Intelligence Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-enterprise-bi-key-2026-dav-project")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Check if running on Vercel serverless environment
    IS_VERCEL: bool = "VERCEL" in os.environ or "VERCEL_ENV" in os.environ
    
    # SQLite default fallback with PostgreSQL compatibility
    DATABASE_URL: str = get_database_url()
    
    @model_validator(mode='after')
    def ensure_non_empty(self):
        if not self.PROJECT_NAME or not self.PROJECT_NAME.strip():
            self.PROJECT_NAME = "Enterprise Business Intelligence Platform"
        if not self.API_V1_STR or not self.API_V1_STR.strip():
            self.API_V1_STR = "/api"
        return self

    class Config:
        case_sensitive = True

settings = Settings()
