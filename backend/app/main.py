import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, kpis, dashboards, analytics, insights, etl, export

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise Business Intelligence Platform for Organizational Performance Analytics",
    version="1.0.0"
)

# Enable CORS for React frontend & Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Auto-seed database if empty or running on Vercel
    try:
        from app.database.connection import SessionLocal, engine
        from app.database.schema import Base, User
        from app.services.auth import get_password_hash
        from app.services.etl_engine import ETLEngine

        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        user_count = db.query(User).count()
        if user_count == 0:
            print("Auto-seeding database for Vercel/serverless startup...")
            demo_users = [
                {"email": "executive@example.com", "full_name": "Chief Executive Officer", "role": "Executive"},
                {"email": "sales@example.com", "full_name": "Sales Manager", "role": "Sales Manager"},
                {"email": "finance@example.com", "full_name": "Finance Director", "role": "Finance Manager"},
                {"email": "hr@example.com", "full_name": "HR Director", "role": "HR Manager"},
                {"email": "marketing@example.com", "full_name": "Marketing Lead", "role": "Marketing Manager"},
                {"email": "operations@example.com", "full_name": "Operations Head", "role": "Operations Manager"},
                {"email": "analyst@example.com", "full_name": "Lead Data Analyst", "role": "Analyst"},
            ]
            default_password = get_password_hash("password123")
            for u in demo_users:
                db.add(User(email=u["email"], hashed_password=default_password, full_name=u["full_name"], role=u["role"]))
            db.commit()

            etl = ETLEngine(db)
            etl.run_full_pipeline()
        db.close()
    except Exception as e:
        print(f"Startup database check info: {e}")

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(kpis.router, prefix=settings.API_V1_STR)
app.include_router(dashboards.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(insights.router, prefix=settings.API_V1_STR)
app.include_router(etl.router, prefix=settings.API_V1_STR)
app.include_router(export.router, prefix=settings.API_V1_STR)

@app.get("/")
@app.get("/api")
def root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
