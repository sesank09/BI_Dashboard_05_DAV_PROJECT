import os
import shutil
import io
import pandas as pd
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.data_profiler import DataProfiler
from app.services.reliability_engine import DataReliabilityEngine
from app.services.semantic_mapper import SemanticSchemaMapper
from app.services.etl_engine import ETLEngine

router = APIRouter(prefix="/data", tags=["Data Intelligence & Quality"])

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
BASE_INPUT_DIR = os.path.join(PROJECT_ROOT, "input")
BASE_RAW_DIR = os.path.join(PROJECT_ROOT, "data", "raw")
BASE_SAMPLE_DIR = os.path.join(PROJECT_ROOT, "sample_upload_csvs")

def get_writable_dir(dir_name: str, fallback_path: str) -> str:
    """
    Returns a writable directory path.
    If the project directory is read-only (e.g., on Vercel serverless / AWS Lambda),
    automatically uses /tmp and synchronizes bundled seed files.
    """
    try:
        if os.path.exists(fallback_path) and os.access(fallback_path, os.W_OK):
            return fallback_path
        os.makedirs(fallback_path, exist_ok=True)
        # Test write
        test_file = os.path.join(fallback_path, ".write_test")
        with open(test_file, "w") as f:
            f.write("ok")
        os.remove(test_file)
        return fallback_path
    except Exception:
        # Fallback to /tmp in serverless environments
        tmp_dir = os.path.join("/tmp", dir_name)
        os.makedirs(tmp_dir, exist_ok=True)
        # Seed bundled files if empty
        if os.path.exists(fallback_path):
            try:
                for fname in os.listdir(fallback_path):
                    src = os.path.join(fallback_path, fname)
                    dst = os.path.join(tmp_dir, fname)
                    if not os.path.exists(dst) and os.path.isfile(src):
                        shutil.copy2(src, dst)
            except Exception:
                pass
        return tmp_dir

def get_input_dir() -> str:
    return get_writable_dir("input", BASE_INPUT_DIR)

def get_raw_dir() -> str:
    return get_writable_dir("data_raw", BASE_RAW_DIR)

def get_sample_dir() -> str:
    if os.path.exists(BASE_SAMPLE_DIR):
        return BASE_SAMPLE_DIR
    tmp_sample = "/tmp/sample_upload_csvs"
    if os.path.exists(tmp_sample):
        return tmp_sample
    return BASE_SAMPLE_DIR

DATASET_NAME_MAP = {
    "sales": ("sales_data.csv", "sales.csv"),
    "finance": ("finance_data.csv", "finance.csv"),
    "marketing": ("marketing_data.csv", "marketing.csv"),
    "hr": ("hr_data.csv", "hr.csv"),
    "operations": ("operations_data.csv", "operations.csv"),
    "customer": ("customer_data.csv", "customers.csv"),
    "customers": ("customer_data.csv", "customers.csv"),
    "product": ("product_data.csv", "products.csv"),
    "products": ("product_data.csv", "products.csv"),
}

@router.get("/files")
def list_files():
    input_dir = get_input_dir()
    profiler = DataProfiler(input_dir)
    return profiler.list_available_files()

@router.get("/profile")
def get_data_profile(dataset: str = None):
    input_dir = get_input_dir()
    profiler = DataProfiler(input_dir)
    if dataset:
        target_path = os.path.join(input_dir, f"{dataset}_data.csv" if not dataset.endswith(".csv") else dataset)
        if not os.path.exists(target_path):
            alt_path = os.path.join(input_dir, f"{dataset}.csv")
            if os.path.exists(alt_path):
                target_path = alt_path
            else:
                raise HTTPException(status_code=404, detail=f"Dataset {dataset} not found")
        return profiler.profile_file(target_path)
    return profiler.profile_all()

@router.get("/quality")
def get_data_quality(dataset: str = None):
    input_dir = get_input_dir()
    engine = DataReliabilityEngine(data_dir=input_dir)
    if dataset:
        target_path = os.path.join(input_dir, f"{dataset}_data.csv" if not dataset.endswith(".csv") else dataset)
        if not os.path.exists(target_path):
            alt_path = os.path.join(input_dir, f"{dataset}.csv")
            if os.path.exists(alt_path):
                target_path = alt_path
            else:
                raise HTTPException(status_code=404, detail=f"Dataset {dataset} not found")
        return engine.calculate_dataset_reliability(target_path)
    return engine.evaluate_all()

@router.get("/mapping")
def get_semantic_mapping(dataset: str = None):
    input_dir = get_input_dir()
    mapper = SemanticSchemaMapper(data_dir=input_dir)
    if dataset:
        target_path = os.path.join(input_dir, f"{dataset}_data.csv" if not dataset.endswith(".csv") else dataset)
        if not os.path.exists(target_path):
            alt_path = os.path.join(input_dir, f"{dataset}.csv")
            if os.path.exists(alt_path):
                target_path = alt_path
            else:
                raise HTTPException(status_code=404, detail=f"Dataset {dataset} not found")
        return mapper.map_file(target_path)
    return mapper.map_all()

@router.post("/upload")
async def upload_dataset_file(
    file: UploadFile = File(...), 
    target_type: str = Form(None),
    auto_etl: bool = Form(True), 
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV format files are accepted (.csv).")
    
    input_dir = get_input_dir()
    raw_dir = get_raw_dir()
    
    # Determine canonical filename
    target_key = (target_type or "").lower().strip()
    if not target_key:
        fname_lower = file.filename.lower()
        for key in DATASET_NAME_MAP.keys():
            if key in fname_lower:
                target_key = key
                break
                
    if target_key in DATASET_NAME_MAP:
        input_filename, raw_filename = DATASET_NAME_MAP[target_key]
    else:
        input_filename = file.filename if file.filename.endswith(".csv") else f"{file.filename}.csv"
        raw_filename = input_filename
        
    destination_input = os.path.join(input_dir, input_filename)
    destination_raw = os.path.join(raw_dir, raw_filename)
    
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
            
        with open(destination_input, "wb") as buffer:
            buffer.write(content)
        try:
            with open(destination_raw, "wb") as buffer:
                buffer.write(content)
        except Exception:
            pass
            
        profiler = DataProfiler(input_dir)
        profile_result = profiler.profile_file(destination_input)
        
        etl_result = None
        if auto_etl:
            try:
                etl = ETLEngine(db, source_dir=input_dir)
                etl_result = etl.run_full_pipeline()
            except Exception as etl_err:
                print(f"[Upload ETL Warning]: {etl_err}")
            
        return {
            "status": "UPLOAD_SUCCESS",
            "filename": file.filename,
            "target_mapped": input_filename,
            "rows": profile_result.get("total_rows", 0),
            "columns": profile_result.get("total_columns", 0),
            "profile": profile_result,
            "etl_executed": bool(etl_result is not None),
            "etl_summary": etl_result
        }
    except HTTPException:
        raise
    except Exception as err:
        print(f"[Upload Error]: {err}")
        raise HTTPException(status_code=500, detail=f"Data ingestion error: {str(err)}")

class LoadSampleRequest(BaseModel):
    scenario_filename: str

@router.get("/samples")
def list_sample_scenarios():
    sample_dir = get_sample_dir()
    if not os.path.exists(sample_dir):
        return {"samples": []}
    files = [f for f in os.listdir(sample_dir) if f.endswith(".csv")]
    descriptions = {
        "scenario_1_high_growth_sales.csv": {
            "title": "High-Growth Revenue Surge (Sales)",
            "target": "sales",
            "impact": "Increases revenue and net profit to peak levels; sharp positive trajectory in ML forecast.",
            "badge": "Growth Surge"
        },
        "scenario_2_market_recession_sales.csv": {
            "title": "Market Slump / Crisis Scenario (Sales)",
            "target": "sales",
            "impact": "Drops margins with high discounts (up to 40%); triggers Business Impact Anomaly alerts.",
            "badge": "Crisis Anomaly"
        },
        "scenario_3_aggressive_marketing.csv": {
            "title": "Aggressive Growth Campaigns (Marketing)",
            "target": "marketing",
            "impact": "Multiplies lead generation and ad spend; updates Marketing ➔ Sales ROI feature fusion.",
            "badge": "Marketing ROI"
        },
        "scenario_4_supply_chain_disruption_operations.csv": {
            "title": "Supply Chain Bottleneck & Delay (Operations)",
            "target": "operations",
            "impact": "Lowers fulfillment SLA to ~65%; activates cross-department anomaly disruption chains.",
            "badge": "SLA Bottleneck"
        },
        "scenario_5_workforce_expansion_hr.csv": {
            "title": "Workforce Expansion & Top Productivity (HR)",
            "target": "hr",
            "impact": "Boosts team performance scores to 95%+ and updates workforce productivity index.",
            "badge": "Workforce Scale"
        }
    }
    return {
        "samples": [
            {
                "filename": f,
                "title": descriptions.get(f, {}).get("title", f),
                "target": descriptions.get(f, {}).get("target", "sales"),
                "impact": descriptions.get(f, {}).get("impact", "Custom scenario file"),
                "badge": descriptions.get(f, {}).get("badge", "Sample Dataset")
            }
            for f in sorted(files)
        ]
    }

@router.post("/load-sample")
def load_sample_scenario(req: LoadSampleRequest, db: Session = Depends(get_db)):
    sample_dir = get_sample_dir()
    sample_path = os.path.join(sample_dir, req.scenario_filename)
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail=f"Sample file {req.scenario_filename} not found.")
        
    fname_lower = req.scenario_filename.lower()
    target_key = "sales"
    for key in DATASET_NAME_MAP.keys():
        if key in fname_lower:
            target_key = key
            break
            
    input_filename, raw_filename = DATASET_NAME_MAP[target_key]
    input_dir = get_input_dir()
    raw_dir = get_raw_dir()
    
    try:
        shutil.copy2(sample_path, os.path.join(input_dir, input_filename))
        try:
            shutil.copy2(sample_path, os.path.join(raw_dir, raw_filename))
        except Exception:
            pass
        
        etl = ETLEngine(db, source_dir=input_dir)
        etl_result = etl.run_full_pipeline()
        
        return {
            "status": "SAMPLE_APPLIED_SUCCESS",
            "scenario_loaded": req.scenario_filename,
            "target_file": input_filename,
            "etl_summary": etl_result
        }
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Failed to load scenario: {str(err)}")
