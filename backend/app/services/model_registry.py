import datetime
from typing import Dict, Any, List

class ModelRegistry:
    """
    ACDIE Model Registry.
    Tracks all machine learning models, training metadata, validation scores, and execution metrics.
    """
    _instance = None
    _models: Dict[str, Dict[str, Any]] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelRegistry, cls).__new__(cls)
            cls._instance._models = {}
        return cls._instance

    def register_model(
        self,
        model_id: str,
        model_name: str,
        model_type: str,
        dataset: str,
        features: List[str],
        target: str,
        train_rows: int,
        test_rows: int,
        parameters: Dict[str, Any],
        metrics: Dict[str, Any],
        execution_time_ms: float,
        description: str = ""
    ) -> Dict[str, Any]:
        record = {
            "model_id": model_id,
            "model_name": model_name,
            "model_type": model_type,
            "dataset": dataset,
            "features": features,
            "target": target,
            "training_rows": train_rows,
            "testing_rows": test_rows,
            "parameters": parameters,
            "metrics": metrics,
            "execution_time_ms": round(execution_time_ms, 2),
            "status": "DEPLOYED",
            "registered_at": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "description": description
        }
        self._models[model_id] = record
        return record

    def get_model(self, model_id: str) -> Dict[str, Any]:
        return self._models.get(model_id, None)

    def list_models(self) -> List[Dict[str, Any]]:
        return list(self._models.values())

    def clear(self):
        self._models.clear()
