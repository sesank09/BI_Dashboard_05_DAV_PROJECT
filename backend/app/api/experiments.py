from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.experiment_engine import ResearchExperimentEngine

router = APIRouter(prefix="/experiments", tags=["Research Experiments & Ablation"])

@router.post("/run")
@router.get("/results")
def get_experiment_results(db: Session = Depends(get_db)):
    engine = ResearchExperimentEngine(db)
    paradigm_res = engine.run_paradigm_comparison()
    ablation_res = engine.run_ablation_study()
    return {
        "paradigm_comparison": paradigm_res,
        "ablation_study": ablation_res
    }

@router.get("/ablation")
def get_ablation_study(db: Session = Depends(get_db)):
    engine = ResearchExperimentEngine(db)
    return engine.run_ablation_study()
