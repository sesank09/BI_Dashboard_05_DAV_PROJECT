import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.data_profiler import DataProfiler
from app.services.reliability_engine import DataReliabilityEngine
from app.services.semantic_mapper import SemanticSchemaMapper
from app.services.etl_engine import ETLEngine

router = APIRouter(prefix="/data", tags=["Data Intelligence & Quality"])

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
INPUT_DIR = os.path.join(PROJECT_ROOT, "input")

@router.get("/files")
def list_files():
    profiler = DataProfiler(INPUT_DIR)
    return profiler.list_available_files()

@router.get("/profile")
def get_data_profile(dataset: str = None):
    profiler = DataProfiler(INPUT_DIR)
    if dataset:
        target_path = os.path.join(INPUT_DIR, f"{dataset}_data.csv" if not dataset.endswith(".csv") else dataset)
        if not os.path.exists(target_path):
            alt_path = os.path.join(INPUT_DIR, f"{dataset}.csv")
            if os.path.exists(alt_path):
                target_path = alt_path
            else:
                raise HTTPException(status_code=404, detail=f"Dataset {dataset} not found")
        return profiler.profile_file(target_path)
    return profiler.profile_all()

@router.get("/quality")
def get_data_quality(dataset: str = None):
    engine = DataReliabilityEngine(data_dir=INPUT_DIR)
    if dataset:
        target_path = os.path.join(INPUT_DIR, f"{dataset}_data.csv" if not dataset.endswith(".csv") else dataset)
        if not os.path.exists(target_path):
            alt_path = os.path.join(INPUT_DIR, f"{dataset}.csv")
            if os.path.exists(alt_path):
                target_path = alt_path
            else:
                raise HTTPException(status_code=404, detail=f"Dataset {dataset} not found")
        return engine.calculate_dataset_reliability(target_path)
    return engine.evaluate_all()

@router.get("/mapping")
def get_semantic_mapping(dataset: str = None):
    mapper = SemanticSchemaMapper(data_dir=INPUT_DIR)
    if dataset:
        target_path = os.path.join(INPUT_DIR, f"{dataset}_data.csv" if not dataset.endswith(".csv") else dataset)
        if not os.path.exists(target_path):
            alt_path = os.path.join(INPUT_DIR, f"{dataset}.csv")
            if os.path.exists(alt_path):
                target_path = alt_path
            else:
                raise HTTPException(status_code=404, detail=f"Dataset {dataset} not found")
        return mapper.map_file(target_path)
    return mapper.map_all()

@router.post("/upload")
async def upload_dataset_file(file: UploadFile = File(...), auto_etl: bool = Form(False), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV format files are accepted.")
    
    os.makedirs(INPUT_DIR, exist_ok=True)
    destination = os.path.join(INPUT_DIR, file.filename)
    
    with open(destination, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    profiler = DataProfiler(INPUT_DIR)
    profile_result = profiler.profile_file(destination)
    
    etl_result = None
    if auto_etl:
        etl = ETLEngine(db, source_dir=INPUT_DIR)
        etl_result = etl.run_full_pipeline()
        
    return {
        "status": "UPLOAD_SUCCESS",
        "filename": file.filename,
        "rows": profile_result["total_rows"],
        "columns": profile_result["total_columns"],
        "profile": profile_result,
        "etl_executed": bool(etl_result is not None),
        "etl_summary": etl_result
    }
