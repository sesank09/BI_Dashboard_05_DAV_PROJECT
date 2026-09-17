import os
import shutil
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
INPUT_DIR = os.path.join(PROJECT_ROOT, "input")
RAW_DIR = os.path.join(PROJECT_ROOT, "data", "raw")
SAMPLE_DIR = os.path.join(PROJECT_ROOT, "sample_upload_csvs")

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
async def upload_dataset_file(
    file: UploadFile = File(...), 
    target_type: str = Form(None),
    auto_etl: bool = Form(True), 
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV format files are accepted.")
    
    os.makedirs(INPUT_DIR, exist_ok=True)
    os.makedirs(RAW_DIR, exist_ok=True)
    
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
        input_filename = file.filename
        raw_filename = file.filename
        
    destination_input = os.path.join(INPUT_DIR, input_filename)
    destination_raw = os.path.join(RAW_DIR, raw_filename)
    
    content = await file.read()
    with open(destination_input, "wb") as buffer:
        buffer.write(content)
    with open(destination_raw, "wb") as buffer:
        buffer.write(content)
        
    profiler = DataProfiler(INPUT_DIR)
    profile_result = profiler.profile_file(destination_input)
    
    etl_result = None
    if auto_etl:
        etl = ETLEngine(db, source_dir=INPUT_DIR)
        etl_result = etl.run_full_pipeline()
        
    return {
        "status": "UPLOAD_SUCCESS",
        "filename": file.filename,
        "target_mapped": input_filename,
        "rows": profile_result["total_rows"],
        "columns": profile_result["total_columns"],
        "profile": profile_result,
        "etl_executed": bool(etl_result is not None),
        "etl_summary": etl_result
    }

class LoadSampleRequest(BaseModel):
    scenario_filename: str

@router.get("/samples")
def list_sample_scenarios():
    if not os.path.exists(SAMPLE_DIR):
        return {"samples": []}
    files = [f for f in os.listdir(SAMPLE_DIR) if f.endswith(".csv")]
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
    sample_path = os.path.join(SAMPLE_DIR, req.scenario_filename)
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail=f"Sample file {req.scenario_filename} not found.")
        
    fname_lower = req.scenario_filename.lower()
    target_key = "sales"
    for key in DATASET_NAME_MAP.keys():
        if key in fname_lower:
            target_key = key
            break
            
    input_filename, raw_filename = DATASET_NAME_MAP[target_key]
    os.makedirs(INPUT_DIR, exist_ok=True)
    os.makedirs(RAW_DIR, exist_ok=True)
    
    shutil.copy2(sample_path, os.path.join(INPUT_DIR, input_filename))
    shutil.copy2(sample_path, os.path.join(RAW_DIR, raw_filename))
    
    etl = ETLEngine(db, source_dir=INPUT_DIR)
    etl_result = etl.run_full_pipeline()
    
    return {
        "status": "SAMPLE_APPLIED_SUCCESS",
        "scenario_loaded": req.scenario_filename,
        "target_file": input_filename,
        "etl_summary": etl_result
    }
