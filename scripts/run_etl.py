import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend"))

from app.database.connection import SessionLocal
from app.services.etl_engine import ETLEngine

def main():
    print("==================================================")
    print("ORGANIZATIONAL PERFORMANCE ANALYTICS - ETL PIPELINE")
    print("==================================================")
    db = SessionLocal()
    etl = ETLEngine(db)
    res = etl.run_full_pipeline()
    db.close()
    if res.get("status") == "SUCCESS":
        print("\n[SUCCESS] ETL process finished without errors.")
        print(f"Extracted: {res['extracted']} records")
        print(f"Transformed: {res['transformed']} records")
        print(f"Loaded: {res['loaded']} records")
        print(f"Data Quality Score: {res['quality_score']}%")
        print(f"Execution Time: {res['processing_time']} seconds")
    else:
        print(f"\n[FAILED] ETL process failed with error: {res.get('error')}")

if __name__ == "__main__":
    main()
