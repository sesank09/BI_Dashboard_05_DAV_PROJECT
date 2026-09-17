from fastapi import APIRouter, HTTPException
from app.services.model_registry import ModelRegistry

router = APIRouter(prefix="/models", tags=["Model Registry & Benchmarks"])

@router.get("")
@router.get("/")
def list_registered_models():
    registry = ModelRegistry()
    models = registry.list_models()
    return {
        "total_registered_models": len(models),
        "models": models
    }

@router.get("/{model_id}")
def get_model_details(model_id: str):
    registry = ModelRegistry()
    model = registry.get_model(model_id)
    if not model:
        raise HTTPException(status_code=404, detail=f"Model {model_id} not found in registry")
    return model
