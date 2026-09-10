from pydantic import BaseModel
from typing import Optional, List, Any, Dict

# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool

# Upload & Data Management Schemas
class FileValidationResult(BaseModel):
    filename: str
    total_rows: int
    columns: List[str]
    missing_values: Dict[str, int]
    duplicate_rows: int
    data_types: Dict[str, str]
    preview: List[Dict[str, Any]]
    is_valid: bool
    warnings: List[str]

# ETL Response
class ETLRunResponse(BaseModel):
    status: str
    extracted: int
    transformed: int
    loaded: int
    failed: int
    processing_time: float
    quality_score: float

# Analytics Request
class RFMRequest(BaseModel):
    n_clusters: int = 5
