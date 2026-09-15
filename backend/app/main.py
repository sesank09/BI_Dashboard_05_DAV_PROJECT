import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, kpis, dashboards, analytics, insights, etl, export

app = FastAPI(
    title=settings.PROJECT_NAME or "Enterprise Business Intelligence Platform",
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
    try:
        from app.database.connection import SessionLocal, engine
        from app.database.schema import Base, User, FactSales
        from app.services.auth import get_password_hash

        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        user_count = db.query(User).count()
        sales_count = db.query(FactSales).count()
        print(f"[Startup] Database status: {user_count} users, {sales_count} sales records present.")

        if user_count == 0:
            print("[Startup] Seeding default demo users...")
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

            # Only run ETL if sales table is also empty and raw data directory exists
            if sales_count == 0:
                try:
                    from app.services.etl_engine import ETLEngine, DATA_RAW_DIR
                    if os.path.exists(DATA_RAW_DIR):
                        print("[Startup] Running initial ETL pipeline...")
                        etl = ETLEngine(db)
                        etl.run_full_pipeline()
                except Exception as etl_err:
                    print(f"[Startup] Non-critical ETL notice: {etl_err}")

        db.close()
    except Exception as e:
        print(f"[Startup] Database verification note: {e}")

# Include API Routers with dual prefixes for full Vercel compatibility
from fastapi import APIRouter
api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(kpis.router)
api_router.include_router(dashboards.router)
api_router.include_router(analytics.router)
api_router.include_router(insights.router)
api_router.include_router(etl.router)
api_router.include_router(export.router)

# Mount both with and without prefix so requests to /api/... or direct /... both resolve flawlessly
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(api_router)

@app.get("/")
@app.get("/api")
@app.get("/health")
@app.get("/api/health")
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
