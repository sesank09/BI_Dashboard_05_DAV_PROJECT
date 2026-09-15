import os
import sys
import shutil

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.abspath(os.path.join(root_dir, "backend"))

for path in [backend_dir, root_dir, current_dir]:
    if path not in sys.path:
        sys.path.insert(0, path)

# Ensure DATABASE_URL is valid or reset to SQLite before loading app
raw_db = os.environ.get("DATABASE_URL", "").strip()
if not raw_db or "example.com" in raw_db:
    os.environ["DATABASE_URL"] = "sqlite:////tmp/bi_warehouse.db"
elif raw_db.startswith("postgres://"):
    os.environ["DATABASE_URL"] = raw_db.replace("postgres://", "postgresql://", 1)

# Seed /tmp database if running on Vercel
tmp_db_path = "/tmp/bi_warehouse.db"
try:
    if not os.path.exists(tmp_db_path) or os.path.getsize(tmp_db_path) < 100000:
        candidates = [
            os.path.join(current_dir, "bi_warehouse.db"),
            os.path.join(root_dir, "bi_warehouse.db"),
            os.path.join(backend_dir, "bi_warehouse.db"),
            "/var/task/api/bi_warehouse.db",
            "/var/task/bi_warehouse.db",
            "/var/task/backend/bi_warehouse.db"
        ]
        for candidate in candidates:
            if os.path.exists(candidate) and os.path.getsize(candidate) > 100000:
                shutil.copy2(candidate, tmp_db_path)
                print(f"[Vercel Handler] Initialized /tmp/bi_warehouse.db from {candidate}")
                break
except Exception as err:
    print(f"[Vercel Handler] Note on db pre-seed: {err}")

from app.main import app

handler = app
