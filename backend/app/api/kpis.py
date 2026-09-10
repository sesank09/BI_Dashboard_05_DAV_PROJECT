from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database.connection import get_db
from app.services.kpi_engine import KPIEngine

router = APIRouter(prefix="/kpis", tags=["KPIs"])

@router.get("")
def get_kpis(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    product_category: Optional[str] = Query(None),
    customer_segment: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    engine = KPIEngine(db)
    return engine.get_kpis(
        start_date=start_date,
        end_date=end_date,
        region=region,
        department=department,
        product_category=product_category,
        customer_segment=customer_segment
    )
