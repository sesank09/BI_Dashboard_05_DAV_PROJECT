from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.simulator import DecisionSimulator

router = APIRouter(prefix="/simulation", tags=["Decision Simulation"])

class SimulationRequest(BaseModel):
    marketing_spend_delta_pct: Optional[float] = None
    marketing_spend_delta: Optional[float] = None
    headcount_delta_pct: Optional[float] = None
    headcount_delta: Optional[float] = None
    opex_reduction_pct: Optional[float] = None
    opex_delta: Optional[float] = None
    discount_delta_pct: Optional[float] = None
    discount_delta: Optional[float] = None

@router.post("")
@router.post("/")
def run_simulation(req: SimulationRequest, db: Session = Depends(get_db)):
    mkt = req.marketing_spend_delta_pct if req.marketing_spend_delta_pct is not None else (req.marketing_spend_delta or 0.0)
    hc = req.headcount_delta_pct if req.headcount_delta_pct is not None else (req.headcount_delta or 0.0)
    opex = req.opex_reduction_pct if req.opex_reduction_pct is not None else (req.opex_delta or 0.0)
    disc = req.discount_delta_pct if req.discount_delta_pct is not None else (req.discount_delta or 0.0)

    simulator = DecisionSimulator(db)
    return simulator.simulate_scenario(
        marketing_spend_delta_pct=float(mkt),
        headcount_delta_pct=float(hc),
        opex_reduction_pct=float(opex),
        discount_delta_pct=float(disc)
    )

@router.get("/baseline")
def get_simulation_baseline(db: Session = Depends(get_db)):
    simulator = DecisionSimulator(db)
    return simulator.simulate_scenario(0.0, 0.0, 0.0, 0.0)
