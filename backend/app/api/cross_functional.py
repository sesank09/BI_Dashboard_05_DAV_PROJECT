from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.cross_functional import CrossFunctionalFeatureFusion
from app.services.anomaly_propagation import AnomalyPropagationEngine
from app.services.kpi_graph import KPIDependencyGraph
from app.services.adaptive_engine import AdaptiveAnalyticsSelectionEngine

router = APIRouter(tags=["Cross-Functional Intelligence & Dependency"])

@router.get("/cross-functional")
def get_cross_functional_features(db: Session = Depends(get_db)):
    engine = CrossFunctionalFeatureFusion(db)
    return engine.get_fused_features()

@router.get("/cross-functional/anomaly-propagation")
@router.get("/anomaly-propagation")
def get_anomaly_propagation(db: Session = Depends(get_db)):
    engine = AnomalyPropagationEngine(db)
    return engine.trace_propagation_chains()

@router.get("/cross-functional/kpi-dependencies")
@router.get("/kpi-dependencies")
def get_kpi_dependencies(db: Session = Depends(get_db)):
    engine = KPIDependencyGraph(db)
    return engine.build_graph()

@router.get("/cross-functional/adaptive/status")
@router.get("/adaptive/status")
def get_adaptive_status(db: Session = Depends(get_db)):
    engine = AdaptiveAnalyticsSelectionEngine(db)
    return engine.evaluate_analytical_capabilities()
