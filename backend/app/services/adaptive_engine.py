import pandas as pd
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal

class AdaptiveAnalyticsSelectionEngine:
    """
    Core ACDIE Novel Engine: Adaptive Analytics Selection.
    Dynamically inspects the active star schema warehouse tables and determines
    which analytical modules can legitimately execute based on rigorous data preconditions.
    Prevents fabricated outputs by explicitly providing diagnosable unviability reasons.
    """
    def __init__(self, db: Session = None):
        self.db = db if db else SessionLocal()

    def evaluate_analytical_capabilities(self) -> dict:
        try:
            sales_df = pd.read_sql("SELECT * FROM fact_sales", self.db.bind)
            fin_df = pd.read_sql("SELECT * FROM fact_finance", self.db.bind)
            hr_df = pd.read_sql("SELECT * FROM fact_hr", self.db.bind)
            mkt_df = pd.read_sql("SELECT * FROM fact_marketing", self.db.bind)
            ops_df = pd.read_sql("SELECT * FROM fact_operations", self.db.bind)
            cust_df = pd.read_sql("SELECT * FROM dim_customer", self.db.bind)
        except Exception as e:
            return {"error": f"Database introspection failed: {str(e)}"}

        evaluations = {}

        # 1. RFM Customer Segmentation
        sales_has_cust = not sales_df.empty and "customer_id" in sales_df.columns and "revenue" in sales_df.columns
        unique_cust_count = sales_df["customer_id"].nunique() if sales_has_cust else 0
        if sales_has_cust and unique_cust_count >= 15:
            evaluations["rfm_segmentation"] = {
                "module": "RFM Customer Segmentation (K-Means + Silhouette)",
                "status": "available",
                "reason": f"Detected {unique_cust_count} unique customer entities with transactional revenue history."
            }
        else:
            evaluations["rfm_segmentation"] = {
                "module": "RFM Customer Segmentation (K-Means + Silhouette)",
                "status": "unavailable",
                "reason": f"Requires at least 15 unique customer IDs with revenue transactions (found: {unique_cust_count})."
            }

        # 2. Time Series Forecasting
        if not sales_df.empty and "order_date" in sales_df.columns:
            try:
                sales_df["month"] = pd.to_datetime(sales_df["order_date"]).dt.strftime("%Y-%m")
                monthly_counts = sales_df["month"].nunique()
            except Exception:
                monthly_counts = 0
        else:
            monthly_counts = 0

        if monthly_counts >= 6:
            evaluations["forecasting"] = {
                "module": "Multi-Model Time-Series Forecasting (MAE/RMSE Validation)",
                "status": "available",
                "reason": f"Sufficient temporal depth detected ({monthly_counts} distinct monthly observations >= 6 required)."
            }
        else:
            evaluations["forecasting"] = {
                "module": "Multi-Model Time-Series Forecasting (MAE/RMSE Validation)",
                "status": "unavailable",
                "reason": f"Insufficient time periods detected ({monthly_counts} monthly points, minimum 6 required for holdout validation)."
            }

        # 3. Statistical Anomaly Detection & Impact Analysis
        sales_records = len(sales_df)
        if sales_records >= 25:
            evaluations["anomaly_detection"] = {
                "module": "Business Impact-Aware Anomaly Detection (Isolation Forest / IQR / Z-Score)",
                "status": "available",
                "reason": f"Dataset contains {sales_records} transaction records, sufficient for statistical dispersion modeling."
            }
        else:
            evaluations["anomaly_detection"] = {
                "module": "Business Impact-Aware Anomaly Detection (Isolation Forest / IQR / Z-Score)",
                "status": "unavailable",
                "reason": f"Insufficient observation count ({sales_records} rows, minimum 25 required for IQR/Isolation Forest)."
            }

        # 4. Cross-Functional Feature Fusion
        dept_tables_present = sum([not sales_df.empty, not fin_df.empty, not mkt_df.empty, not hr_df.empty, not ops_df.empty])
        if dept_tables_present >= 3:
            evaluations["cross_functional_fusion"] = {
                "module": "Cross-Functional Feature Fusion & Propagation",
                "status": "available",
                "reason": f"Detected {dept_tables_present} active cross-departmental fact tables in star schema."
            }
        else:
            evaluations["cross_functional_fusion"] = {
                "module": "Cross-Functional Feature Fusion & Propagation",
                "status": "unavailable",
                "reason": f"Requires at least 3 departmental datasets (found {dept_tables_present})."
            }

        # 5. KPI Statistical Dependency Graph
        if not sales_df.empty and not fin_df.empty and not mkt_df.empty:
            evaluations["kpi_dependency_graph"] = {
                "module": "Empirical KPI Dependency Graph (Pearson & Spearman Significance)",
                "status": "available",
                "reason": "Multivariate numerical features available across Sales, Finance, and Marketing."
            }
        else:
            evaluations["kpi_dependency_graph"] = {
                "module": "Empirical KPI Dependency Graph (Pearson & Spearman Significance)",
                "status": "unavailable",
                "reason": "Requires concurrent Sales, Finance, and Marketing metrics for covariance modeling."
            }

        # 6. Model-Driven Decision Simulation
        if not mkt_df.empty and not sales_df.empty and len(mkt_df) >= 6:
            evaluations["decision_simulation"] = {
                "module": "Model-Driven Decision Simulator",
                "status": "available",
                "reason": "Historical campaign expenditure and revenue streams support linear elasticity training."
            }
        else:
            evaluations["decision_simulation"] = {
                "module": "Model-Driven Decision Simulator",
                "status": "unavailable",
                "reason": "Insufficient marketing/revenue pairs to train simulation regression estimators."
            }

        available_count = sum(1 for v in evaluations.values() if v["status"] == "available")
        total_count = len(evaluations)

        return {
            "adaptive_status": {
                "available_modules": available_count,
                "total_modules": total_count,
                "adaptation_score_pct": round((available_count / max(1, total_count)) * 100.0, 1),
                "summary": f"{available_count} of {total_count} analytical intelligence engines are active and verified."
            },
            "evaluations": evaluations
        }
