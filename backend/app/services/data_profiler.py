import os
import glob
import numpy as np
import pandas as pd
from typing import Dict, Any, List

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
INPUT_DIR = os.path.join(PROJECT_ROOT, "input")
DATA_RAW_DIR = os.path.join(PROJECT_ROOT, "data", "raw")

class DataProfiler:
    """
    Automatic Data Profiling Engine for ACDIE.
    Computes comprehensive structural and statistical profiles for every input dataset.
    """
    def __init__(self, data_dir: str = None):
        if data_dir and os.path.exists(data_dir):
            self.data_dir = data_dir
        elif os.path.exists(INPUT_DIR):
            self.data_dir = INPUT_DIR
        else:
            self.data_dir = DATA_RAW_DIR

    def list_available_files(self) -> List[Dict[str, Any]]:
        files = []
        if not os.path.exists(self.data_dir):
            return files
        for filepath in glob.glob(os.path.join(self.data_dir, "*.csv")):
            filename = os.path.basename(filepath)
            size_kb = round(os.path.getsize(filepath) / 1024, 2)
            mtime = os.path.getmtime(filepath)
            files.append({
                "filename": filename,
                "dataset_name": filename.replace("_data.csv", "").replace(".csv", ""),
                "filepath": filepath,
                "size_kb": size_kb,
                "last_modified": pd.to_datetime(mtime, unit="s").strftime("%Y-%m-%d %H:%M:%S")
            })
        return files

    def profile_file(self, filepath: str) -> Dict[str, Any]:
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"File not found: {filepath}")
        
        df = pd.read_csv(filepath)
        total_rows, total_cols = df.shape
        duplicate_rows = int(df.duplicated().sum())
        
        column_profiles = []
        date_ranges = {}
        
        for col in df.columns:
            col_series = df[col]
            missing_count = int(col_series.isna().sum())
            missing_pct = round((missing_count / max(1, total_rows)) * 100.0, 2)
            unique_count = int(col_series.nunique(dropna=True))
            cardinality_ratio = round(unique_count / max(1, total_rows), 4)
            dtype_str = str(col_series.dtype)
            
            profile = {
                "column_name": col,
                "data_type": dtype_str,
                "missing_count": missing_count,
                "missing_pct": missing_pct,
                "unique_count": unique_count,
                "cardinality_ratio": cardinality_ratio,
                "is_unique_id": bool(unique_count == total_rows and missing_count == 0),
                "stats": {}
            }
            
            # Numeric column stats
            if pd.api.types.is_numeric_dtype(col_series):
                clean_num = col_series.dropna()
                if not clean_num.empty:
                    profile["stats"] = {
                        "min": round(float(clean_num.min()), 2),
                        "max": round(float(clean_num.max()), 2),
                        "mean": round(float(clean_num.mean()), 2),
                        "median": round(float(clean_num.median()), 2),
                        "std": round(float(clean_num.std()), 2) if len(clean_num) > 1 else 0.0,
                        "skewness": round(float(clean_num.skew()), 2) if len(clean_num) > 2 else 0.0
                    }
            
            # Date detection & ranges
            elif "date" in col.lower() or "time" in col.lower():
                try:
                    parsed_dates = pd.to_datetime(col_series.dropna(), errors="coerce").dropna()
                    if not parsed_dates.empty:
                        min_date = parsed_dates.min().strftime("%Y-%m-%d")
                        max_date = parsed_dates.max().strftime("%Y-%m-%d")
                        profile["stats"] = {
                            "min_date": min_date,
                            "max_date": max_date,
                            "days_span": (parsed_dates.max() - parsed_dates.min()).days
                        }
                        date_ranges[col] = f"{min_date} to {max_date}"
                except Exception:
                    pass
            
            # Categorical stats
            else:
                top_vals = col_series.value_counts().head(5).to_dict()
                profile["stats"] = {
                    "top_values": {str(k): int(v) for k, v in top_vals.items()}
                }
                
            column_profiles.append(profile)
            
        return {
            "filename": os.path.basename(filepath),
            "total_rows": total_rows,
            "total_columns": total_cols,
            "duplicate_rows": duplicate_rows,
            "duplicate_pct": round((duplicate_rows / max(1, total_rows)) * 100.0, 2),
            "date_ranges": date_ranges,
            "columns": column_profiles
        }

    def profile_all(self) -> Dict[str, Any]:
        profiles = {}
        for f in self.list_available_files():
            try:
                profiles[f["dataset_name"]] = self.profile_file(f["filepath"])
            except Exception as e:
                profiles[f["dataset_name"]] = {"error": str(e)}
        return profiles
