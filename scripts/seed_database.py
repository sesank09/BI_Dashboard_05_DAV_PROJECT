import os
import sys
from sqlalchemy.orm import Session

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend"))

from app.database.connection import Base, engine, SessionLocal
from app.database.schema import User
from app.services.auth import get_password_hash
from app.services.etl_engine import ETLEngine

print("Seeding database and creating demo accounts...")

# Create tables
Base.metadata.create_all(bind=engine)

db: Session = SessionLocal()

# Demo users as specified in project requirements
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
    existing = db.query(User).filter(User.email == u["email"]).first()
    if not existing:
        user_obj = User(
            email=u["email"],
            hashed_password=default_password,
            full_name=u["full_name"],
            role=u["role"],
            is_active=True
        )
        db.add(user_obj)
        print(f"Created user: {u['email']} [{u['role']}]")

db.commit()

# Execute ETL Pipeline
print("\nRunning initial ETL Pipeline import into Star Schema Data Warehouse...")
etl = ETLEngine(db)
result = etl.run_full_pipeline()
print(f"ETL Result: {result}")

db.close()
print("DATABASE SEEDING COMPLETE!")
