import sys
import os
import io

# Fix Windows cp1252 stdout
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def run_tests():
    print("========================================")
    print("STARTING ACDIE FULL SYSTEM VERIFICATION")
    print("========================================")

    endpoints = [
        ("GET", "/api/health"),
        ("GET", "/api/data/files"),
        ("GET", "/api/data/profile"),
        ("GET", "/api/data/quality"),
        ("GET", "/api/data/mapping"),
        ("GET", "/api/cross-functional"),
        ("GET", "/api/cross-functional/anomaly-propagation"),
        ("GET", "/api/cross-functional/kpi-dependencies"),
        ("GET", "/api/cross-functional/adaptive/status"),
        ("GET", "/api/models"),
        ("GET", "/api/analytics/forecast"),
        ("GET", "/api/analytics/anomalies"),
        ("GET", "/api/simulation/baseline"),
        ("GET", "/api/insights/traceable"),
        ("GET", "/api/experiments/results"),
        ("GET", "/api/experiments/ablation"),
    ]

    passed = 0
    for method, path in endpoints:
        if method == "GET":
            res = client.get(path)
        print(f"[{res.status_code}] {method} {path}")
        assert res.status_code == 200, f"Failed {path}: {res.text}"
        passed += 1

    # Test POST /api/simulation
    sim_payload = {
        "marketing_spend_delta": 20.0,
        "headcount_delta": 5.0,
        "opex_delta": -5.0,
        "discount_delta": 2.0
    }
    sim_res = client.post("/api/simulation", json=sim_payload)
    print(f"[{sim_res.status_code}] POST /api/simulation")
    assert sim_res.status_code == 200, f"Failed simulation: {sim_res.text}"
    sim_data = sim_res.json()
    assert "simulated_kpis" in sim_data
    assert "confidence_intervals" in sim_data
    passed += 1

    # Test POST /api/experiments/run
    exp_res = client.post("/api/experiments/run")
    print(f"[{exp_res.status_code}] POST /api/experiments/run")
    assert exp_res.status_code == 200, f"Failed experiment run: {exp_res.text}"
    passed += 1

    print("========================================")
    print(f"[OK] ALL {passed} TESTS PASSED SUCCESSFULLY!")
    print("========================================")

if __name__ == "__main__":
    run_tests()
