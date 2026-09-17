from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.insights_engine import InsightsEngine

router = APIRouter(prefix="/insights", tags=["Business Insights"])

@router.get("")
@router.get("/")
@router.get("/traceable")
def get_insights(db: Session = Depends(get_db)):
    engine = InsightsEngine(db)
    return engine.generate_insights()
