from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.simulator import DecisionSimulator

router = APIRouter(prefix="/simulation", tags=["Decision Simulation"])

class SimulationRequest(BaseModel):
    marketing_spend_delta_pct: float = 0.0
    headcount_delta_pct: float = 0.0
    opex_reduction_pct: float = 0.0
    discount_delta_pct: float = 0.0

@router.post("")
@router.post("/")
def run_simulation(req: SimulationRequest, db: Session = Depends(get_db)):
    simulator = DecisionSimulator(db)
    return simulator.simulate_scenario(
        marketing_spend_delta_pct=req.marketing_spend_delta_pct,
        headcount_delta_pct=req.headcount_delta_pct,
        opex_reduction_pct=req.opex_reduction_pct,
        discount_delta_pct=req.discount_delta_pct
    )

@router.get("/baseline")
def get_simulation_baseline(db: Session = Depends(get_db)):
    simulator = DecisionSimulator(db)
    return simulator.simulate_scenario(0.0, 0.0, 0.0, 0.0)
