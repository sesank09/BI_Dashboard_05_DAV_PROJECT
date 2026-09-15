import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import make_url
from app.config import settings

db_url = settings.DATABASE_URL
if not db_url or not db_url.strip() or "example.com" in db_url:
    db_url = "sqlite:////tmp/bi_warehouse.db" if settings.IS_VERCEL else "sqlite:///./bi_warehouse.db"

try:
    make_url(db_url)
except Exception:
    db_url = "sqlite:////tmp/bi_warehouse.db" if settings.IS_VERCEL else "sqlite:///./bi_warehouse.db"

# Handle Vercel / Serverless ephemeral /tmp database initialization
if db_url.startswith("sqlite:////tmp/") or ("sqlite" in db_url and settings.IS_VERCEL):
    target_tmp_path = "/tmp/bi_warehouse.db"
    try:
        if not os.path.exists(target_tmp_path) or os.path.getsize(target_tmp_path) < 100000:
            candidate_sources = [
                os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "api", "bi_warehouse.db")),
                os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "bi_warehouse.db")),
                os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "bi_warehouse.db")),
                "/var/task/api/bi_warehouse.db",
                "/var/task/bi_warehouse.db",
                "/var/task/backend/bi_warehouse.db",
                os.path.abspath("api/bi_warehouse.db"),
                os.path.abspath("bi_warehouse.db"),
                os.path.abspath("backend/bi_warehouse.db"),
            ]
            seeded = False
            for src in candidate_sources:
                if os.path.exists(src) and os.path.getsize(src) > 100000:
                    shutil.copy2(src, target_tmp_path)
                    print(f"[Database] Successfully initialized /tmp/bi_warehouse.db from {src} ({os.path.getsize(target_tmp_path)} bytes)")
                    seeded = True
                    break
            if not seeded:
                print("[Database] Warning: Bundled bi_warehouse.db source not found for /tmp seeding.")
    except Exception as e:
        print(f"[Database] Error during /tmp database seeding: {e}")

# Handle sqlite specific arguments
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(db_url, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

