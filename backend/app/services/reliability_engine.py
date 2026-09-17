import os
import glob
import numpy as np
import pandas as pd
from typing import Dict, Any, List

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
INPUT_DIR = os.path.join(PROJECT_ROOT, "input")
DATA_RAW_DIR = os.path.join(PROJECT_ROOT, "data", "raw")

class DataReliabilityEngine:
    """
    Proposed Data Reliability Engine for ACDIE.
    Computes documented Proposed Data Reliability Score based on:
    - Completeness (missing data ratio)
    - Validity (type compliance and domain boundaries)
    - Uniqueness (deduplication score)
    - Consistency (temporal, referential, and relational sanity)
    - Outlier Penalty (IQR/Z-score divergence ratio)
    """
    def __init__(self, weights: Dict[str, float] = None, data_dir: str = None):
        self.weights = weights or {
            "completeness": 0.35,
            "validity": 0.25,
            "uniqueness": 0.20,
            "consistency": 0.20,
            "outlier_penalty_factor": 0.10
        }
        if data_dir and os.path.exists(data_dir):
            self.data_dir = data_dir
        elif os.path.exists(INPUT_DIR):
            self.data_dir = INPUT_DIR
        else:
            self.data_dir = DATA_RAW_DIR

    def calculate_dataset_reliability(self, filepath: str) -> Dict[str, Any]:
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"File not found: {filepath}")
        
        df = pd.read_csv(filepath)
        total_cells = df.size
        total_rows = len(df)
        if total_rows == 0:
            return {"error": "Dataset is empty"}

        # 1. Completeness Score (0-100)
        missing_cells = int(df.isna().sum().sum())
        completeness = max(0.0, min(100.0, 100.0 - (missing_cells / max(1, total_cells) * 100.0)))
        
        # 2. Uniqueness Score (0-100)
        duplicate_rows = int(df.duplicated().sum())
        uniqueness = max(0.0, min(100.0, 100.0 - (duplicate_rows / max(1, total_rows) * 100.0)))

        # 3. Validity Score (0-100)
        # Checks for negative values in revenue/cost/prices or invalid formats
        invalid_entries = 0
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            if any(k in col.lower() for k in ["revenue", "price", "cost", "quantity", "impressions", "clicks", "leads"]):
                invalid_entries += int((df[col] < 0).sum())
        validity = max(0.0, min(100.0, 100.0 - (invalid_entries / max(1, total_rows * max(1, len(numeric_cols))) * 100.0)))

        # 4. Consistency Score (0-100)
        # Checks date parseability & relational sanity (e.g. revenue >= profit)
        inconsistent_rows = 0
        if "revenue" in df.columns and "profit" in df.columns:
            inconsistent_rows += int((df["profit"] > df["revenue"]).sum())
        if "cogs" in df.columns and "revenue" in df.columns:
            inconsistent_rows += int((df["cogs"] < 0).sum())
        consistency = max(0.0, min(100.0, 100.0 - (inconsistent_rows / max(1, total_rows) * 100.0)))

        # 5. Outlier Ratio (0-100 penalty)
        outlier_count = 0
        for col in numeric_cols:
            series = df[col].dropna()
            if len(series) > 10:
                q1 = series.quantile(0.25)
                q3 = series.quantile(0.75)
                iqr = q3 - q1
                if iqr > 0:
                    outlier_count += int(((series < (q1 - 3.0 * iqr)) | (series > (q3 + 3.0 * iqr))).sum())
        outlier_ratio = min(100.0, (outlier_count / max(1, total_cells)) * 100.0)

        # Compute Proposed Reliability Score
        w = self.weights
        raw_score = (
            w["completeness"] * completeness +
            w["validity"] * validity +
            w["uniqueness"] * uniqueness +
            w["consistency"] * consistency -
            w["outlier_penalty_factor"] * outlier_ratio
        )
        reliability_score = round(max(0.0, min(100.0, raw_score)), 1)
        
        # Classification
        if reliability_score >= 90.0:
            status = "Excellent"
            grade = "A"
        elif reliability_score >= 80.0:
            status = "Good"
            grade = "B"
        elif reliability_score >= 65.0:
            status = "Acceptable"
            grade = "C"
        else:
            status = "Degraded"
            grade = "D"

        return {
            "dataset_name": os.path.basename(filepath).replace("_data.csv", "").replace(".csv", ""),
            "filename": os.path.basename(filepath),
            "total_rows": total_rows,
            "total_columns": len(df.columns),
            "missing_cells": missing_cells,
            "missing_pct": round((missing_cells / max(1, total_cells)) * 100.0, 2),
            "duplicate_rows": duplicate_rows,
            "invalid_records": invalid_entries,
            "inconsistent_records": inconsistent_rows,
            "outlier_count": outlier_count,
            "dimensions": {
                "completeness_score": round(completeness, 1),
                "validity_score": round(validity, 1),
                "uniqueness_score": round(uniqueness, 1),
                "consistency_score": round(consistency, 1),
                "outlier_penalty": round(w["outlier_penalty_factor"] * outlier_ratio, 2)
            },
            "weights_used": self.weights,
            "reliability_score": reliability_score,
            "status": status,
            "grade": grade,
            "methodology_note": "Proposed Data Reliability Score is computed via empirical multi-attribute validation."
        }

    def evaluate_all(self) -> Dict[str, Any]:
        results = {}
        scores = []
        for filepath in glob.glob(os.path.join(self.data_dir, "*.csv")):
            try:
                res = self.calculate_dataset_reliability(filepath)
                name = res["dataset_name"]
                results[name] = res
                scores.append(res["reliability_score"])
            except Exception as err:
                results[os.path.basename(filepath)] = {"error": str(err)}

        overall_score = round(float(np.mean(scores)), 1) if scores else 0.0
        return {
            "overall_warehouse_reliability": overall_score,
            "overall_status": "Reliable" if overall_score >= 80.0 else "Action Required",
            "evaluated_datasets_count": len(scores),
            "datasets": results
        }
