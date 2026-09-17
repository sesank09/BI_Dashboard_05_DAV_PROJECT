import os
import glob
import re
import pandas as pd
from typing import Dict, Any, List

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
INPUT_DIR = os.path.join(PROJECT_ROOT, "input")
DATA_RAW_DIR = os.path.join(PROJECT_ROOT, "data", "raw")

class SemanticSchemaMapper:
    """
    Semantic Schema Mapping Engine for ACDIE.
    Automatically classifies input columns into standardized business entity roles
    using lexical similarity, dtype introspection, uniqueness cardinality, and sample value heuristics.
    """
    SEMANTIC_ROLES = {
        "CUSTOMER_ID": {
            "patterns": [r"cust.*id", r"customer", r"client.*id", r"account.*id"],
            "expected_types": ["object", "string", "int64"],
            "min_cardinality": 0.05
        },
        "ORDER_ID": {
            "patterns": [r"order.*id", r"trans.*id", r"invoice.*id", r"sale.*id"],
            "expected_types": ["object", "string", "int64"],
            "min_cardinality": 0.50
        },
        "PRODUCT_ID": {
            "patterns": [r"prod.*id", r"item.*id", r"sku", r"product.*code"],
            "expected_types": ["object", "string", "int64"],
            "min_cardinality": 0.001
        },
        "EMPLOYEE_ID": {
            "patterns": [r"emp.*id", r"employee", r"rep.*id", r"agent.*id", r"staff.*id"],
            "expected_types": ["object", "string", "int64"],
            "min_cardinality": 0.001
        },
        "REGION": {
            "patterns": [r"region", r"territory", r"zone", r"country", r"state", r"location"],
            "expected_types": ["object", "string"],
            "min_cardinality": 0.0001
        },
        "DATE": {
            "patterns": [r"date", r"time", r"month", r"day", r"year", r"period", r"timestamp"],
            "expected_types": ["object", "string", "datetime64[ns]"],
            "min_cardinality": 0.001
        },
        "REVENUE": {
            "patterns": [r"rev.*", r"sales", r"amount", r"gross.*", r"price", r"billing", r"turnover"],
            "expected_types": ["float64", "int64"],
            "min_cardinality": 0.01
        },
        "COST": {
            "patterns": [r"cost", r"cogs", r"spend", r"expense", r"expenditure", r"fee"],
            "expected_types": ["float64", "int64"],
            "min_cardinality": 0.01
        },
        "PROFIT": {
            "patterns": [r"profit", r"margin", r"net.*income", r"earnings"],
            "expected_types": ["float64", "int64"],
            "min_cardinality": 0.01
        },
        "QUANTITY": {
            "patterns": [r"qty", r"quantity", r"volume", r"count", r"units", r"orders"],
            "expected_types": ["int64", "float64"],
            "min_cardinality": 0.0001
        },
        "DEPARTMENT": {
            "patterns": [r"dept", r"department", r"division", r"function", r"business.*unit"],
            "expected_types": ["object", "string"],
            "min_cardinality": 0.0001
        },
        "CAMPAIGN": {
            "patterns": [r"campaign", r"channel", r"ad.*group", r"medium", r"source"],
            "expected_types": ["object", "string"],
            "min_cardinality": 0.0001
        }
    }

    def __init__(self, data_dir: str = None):
        if data_dir and os.path.exists(data_dir):
            self.data_dir = data_dir
        elif os.path.exists(INPUT_DIR):
            self.data_dir = INPUT_DIR
        else:
            self.data_dir = DATA_RAW_DIR

    def map_dataframe(self, df: pd.DataFrame, dataset_name: str = "custom") -> List[Dict[str, Any]]:
        mappings = []
        total_rows = len(df)
        
        for col in df.columns:
            clean_col = col.lower().strip()
            col_series = df[col]
            dtype_str = str(col_series.dtype)
            cardinality = col_series.nunique() / max(1, total_rows)
            
            best_role = "GENERIC_ATTRIBUTE"
            highest_confidence = 20
            reason = "Default categorical/numerical attribute"
            
            # Match against semantic pattern library
            for role, rules in self.SEMANTIC_ROLES.items():
                pattern_match = any(re.search(pat, clean_col) for pat in rules["patterns"])
                type_match = any(t in dtype_str for t in rules["expected_types"])
                
                # If date, also test if values parse as date
                is_date_parseable = False
                if role == "DATE" and not pd.api.types.is_numeric_dtype(col_series):
                    try:
                        sample = col_series.dropna().head(10)
                        pd.to_datetime(sample, format='mixed', errors='coerce')
                        is_date_parseable = True
                    except Exception:
                        pass
                
                score = 0
                if pattern_match:
                    score += 55
                if type_match or is_date_parseable:
                    score += 25
                if cardinality >= rules["min_cardinality"]:
                    score += 15
                    
                # Exact column matches get a boost
                if clean_col == role.lower() or clean_col == role.lower().replace("_", ""):
                    score += 20
                    
                score = min(100, score)
                if score > highest_confidence and (pattern_match or is_date_parseable or score >= 70):
                    highest_confidence = score
                    best_role = role
                    matched_pat = next((pat for pat in rules["patterns"] if re.search(pat, clean_col)), "dtype heuristics")
                    reason = f"Matched pattern '{matched_pat}' with compatible {dtype_str} type (cardinality {round(cardinality, 3)})"
            
            mappings.append({
                "original_column": col,
                "detected_semantic_role": best_role,
                "confidence_score": highest_confidence,
                "confidence_label": "High" if highest_confidence >= 80 else ("Medium" if highest_confidence >= 50 else "Low"),
                "data_type": dtype_str,
                "reasoning": reason,
                "dataset": dataset_name
            })
            
        return mappings

    def map_file(self, filepath: str) -> Dict[str, Any]:
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"File not found: {filepath}")
        df = pd.read_csv(filepath)
        dataset_name = os.path.basename(filepath).replace("_data.csv", "").replace(".csv", "")
        return {
            "dataset_name": dataset_name,
            "filename": os.path.basename(filepath),
            "total_columns": len(df.columns),
            "mappings": self.map_dataframe(df, dataset_name)
        }

    def map_all(self) -> Dict[str, Any]:
        results = {}
        for filepath in glob.glob(os.path.join(self.data_dir, "*.csv")):
            try:
                res = self.map_file(filepath)
                results[res["dataset_name"]] = res
            except Exception as e:
                results[os.path.basename(filepath)] = {"error": str(e)}
        return results
