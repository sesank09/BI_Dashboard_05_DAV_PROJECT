import sys
import os
import io

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database.connection import SessionLocal
from backend.app.services.etl_engine import ETLEngine

client = TestClient(app)

def test_samples_and_modules():
    print("Testing /api/data/samples...")
    res = client.get("/api/data/samples")
    assert res.status_code == 200, f"Failed samples: {res.text}"
    samples = res.json().get("samples", [])
    print(f"[OK] Found {len(samples)} sample scenarios.")
    assert len(samples) >= 5

    # Test loading Scenario 1 (High Growth)
    print("Testing /api/data/load-sample for Scenario 1...")
    res_load1 = client.post("/api/data/load-sample", json={"scenario_filename": "scenario_1_high_growth_sales.csv"})
    assert res_load1.status_code == 200, f"Failed load sample 1: {res_load1.text}"
    print("[OK] Scenario 1 loaded and ETL executed successfully!")

    # Check executive dashboard revenue
    res_exec = client.get("/api/dashboards/executive")
    assert res_exec.status_code == 200
    rev_high = res_exec.json()["kpis"]["total_revenue"]["value"]
    print(f"Scenario 1 Total Revenue: ₹{rev_high:,.2f}")

    # Test loading Scenario 2 (Slump)
    print("Testing /api/data/load-sample for Scenario 2...")
    res_load2 = client.post("/api/data/load-sample", json={"scenario_filename": "scenario_2_market_recession_sales.csv"})
    assert res_load2.status_code == 200
    print("[OK] Scenario 2 loaded and ETL executed successfully!")

    res_exec2 = client.get("/api/dashboards/executive")
    rev_slump = res_exec2.json()["kpis"]["total_revenue"]["value"]
    print(f"Scenario 2 Total Revenue: ₹{rev_slump:,.2f}")
    assert rev_high > rev_slump, f"Expected High Growth ({rev_high}) > Slump ({rev_slump})"
    print(f"[OK] Value change confirmed: High Growth (₹{rev_high:,.2f}) > Slump (₹{rev_slump:,.2f})")

    # Restore deterministic baseline with generate_data.py
    print("Restoring standard seed=42 dataset...")
    import subprocess
    subprocess.run(["python", "input_generator/generate_data.py"], check=True)
    db = SessionLocal()
    etl = ETLEngine(db)
    etl.run_full_pipeline()
    db.close()
    
    res_restored = client.get("/api/dashboards/executive")
    rev_restored = res_restored.json()["kpis"]["total_revenue"]["value"]
    print(f"Restored Total Revenue: ₹{rev_restored:,.2f}")
    print("[OK] All test scenarios and pipeline recalculations passed with flying colors!")

if __name__ == "__main__":
    test_samples_and_modules()
