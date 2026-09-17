import sys
import os
import io
import pandas as pd

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.etl_engine import ETLEngine
from backend.app.database.connection import SessionLocal

client = TestClient(app)

def test_dynamic_replacement():
    print("Testing Dynamic Dataset Replacement & Pipeline Re-execution...")
    
    # Check baseline revenue
    res1 = client.get("/api/dashboards/executive")
    assert res1.status_code == 200
    rev1 = res1.json()["kpis"]["total_revenue"]["value"]
    print(f"Initial Total Revenue: ₹{rev1:,.2f}")
    
    # Path to sales data
    sales_path = os.path.abspath("input/sales_data.csv")
    df = pd.read_csv(sales_path)
    
    # Inject a known modification
    original_val = df.at[0, "unit_price"]
    df.at[0, "unit_price"] = original_val + 500000.0
    df.at[0, "total_amount"] = (original_val + 500000.0) * df.at[0, "quantity"]
    df.to_csv(sales_path, index=False)
    print("Injected test transaction +₹500,000 in input/sales_data.csv")
    
    # Trigger full ETL re-execution
    db = SessionLocal()
    etl = ETLEngine(db)
    etl.run_full_pipeline()
    db.close()
    
    # Check updated revenue
    res2 = client.get("/api/dashboards/executive")
    assert res2.status_code == 200
    rev2 = res2.json()["kpis"]["total_revenue"]["value"]
    print(f"Updated Total Revenue: ₹{rev2:,.2f}")
    assert rev2 > rev1, f"Expected rev2 ({rev2}) > rev1 ({rev1})"
    print(f"[OK] Dynamic update verified: +₹{rev2 - rev1:,.2f} reflected in real-time warehouse queries!")
    
    # Restore original data
    df.at[0, "unit_price"] = original_val
    df.at[0, "total_amount"] = original_val * df.at[0, "quantity"]
    df.to_csv(sales_path, index=False)
    
    db = SessionLocal()
    etl = ETLEngine(db)
    etl.run_full_pipeline()
    db.close()
    
    res3 = client.get("/api/dashboards/executive")
    rev3 = res3.json()["kpis"]["total_revenue"]["value"]
    print(f"Restored Total Revenue: ₹{rev3:,.2f}")
    assert abs(rev3 - rev1) < 1.0, f"Expected rev3 ({rev3}) == rev1 ({rev1})"
    print("[OK] Dynamic Dataset Replacement Test Passed Flawlessly!")

if __name__ == "__main__":
    test_dynamic_replacement()
