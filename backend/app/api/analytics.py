from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.analytics_engine import AnalyticsEngine

router = APIRouter(prefix="/analytics", tags=["Analytics & EDA"])

@router.get("/eda")
def get_eda(dataset: str = Query("sales"), db: Session = Depends(get_db)):
    engine = AnalyticsEngine(db)
    return engine.get_eda_summary(dataset)

@router.post("/rfm")
def get_rfm_segmentation(n_clusters: int = 5, db: Session = Depends(get_db)):
    engine = AnalyticsEngine(db)
    return engine.run_rfm_segmentation(n_clusters)

@router.get("/forecast")
def get_forecast(months: int = 6, db: Session = Depends(get_db)):
    engine = AnalyticsEngine(db)
    return engine.generate_revenue_forecast(months)

@router.get("/anomalies")
def get_anomalies(db: Session = Depends(get_db)):
    engine = AnalyticsEngine(db)
    return engine.detect_anomalies()
