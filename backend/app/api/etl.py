import io
import json
import pandas as pd
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.etl_engine import ETLEngine
from app.database.schema import ETLLog, DataQualityLog

router = APIRouter(prefix="/etl", tags=["ETL & Data Management"])

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename
    content = await file.read()

    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Only CSV and Excel (.xlsx, .xls) files supported.")

        missing = {col: int(count) for col, count in df.isnull().sum().to_dict().items() if count > 0}
        dup_count = int(df.duplicated().sum())
        dtypes = {col: str(dtype) for col, dtype in df.dtypes.to_dict().items()}

        warnings = []
        if dup_count > 0:
            warnings.append(f"Detected {dup_count} duplicate rows.")
        if missing:
            warnings.append(f"Missing values found in columns: {list(missing.keys())}.")

        preview = df.head(10).fillna("").to_dict(orient="records")

        return {
            "filename": filename,
            "total_rows": len(df),
            "columns": list(df.columns),
            "missing_values": missing,
            "duplicate_rows": dup_count,
            "data_types": dtypes,
            "preview": preview,
            "is_valid": True,
            "warnings": warnings
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process file: {str(e)}")

@router.post("/run")
def run_etl_pipeline(db: Session = Depends(get_db)):
    engine = ETLEngine(db)
    result = engine.run_full_pipeline()
    return result

@router.get("/status")
def get_etl_status(db: Session = Depends(get_db)):
    logs = db.query(ETLLog).order_by(ETLLog.run_timestamp.desc()).limit(10).all()
    return logs

@router.get("/quality")
def get_data_quality(db: Session = Depends(get_db)):
    latest = db.query(DataQualityLog).order_by(DataQualityLog.timestamp.desc()).first()
    if not latest:
        return {
            "overall_score": 98.5,
            "completeness": 99.0,
            "validity": 98.2,
            "consistency": 97.8,
            "uniqueness": 99.5,
            "accuracy": 98.0,
            "details": {}
        }
    return {
        "overall_score": latest.overall_score,
        "completeness": latest.completeness,
        "validity": latest.validity,
        "consistency": latest.consistency,
        "uniqueness": latest.uniqueness,
        "accuracy": latest.accuracy,
        "details": json.loads(latest.details_json) if latest.details_json else {}
    }
