import os
import time
import json
import datetime
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal, engine
from app.database.schema import (
    Base, DimDate, DimCustomer, DimProduct, DimRegion, DimEmployee, DimCampaign,
    FactSales, FactFinance, FactHR, FactMarketing, FactOperations, ETLLog, DataQualityLog
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DATA_RAW_DIR = os.path.join(BASE_DIR, "data", "raw")

class ETLEngine:
    def __init__(self, db: Session = None):
        self.db = db if db else SessionLocal()

    def run_full_pipeline(self) -> dict:
        start_time = time.time()
        print("Initializing ETL Pipeline execution...")
        
        # Ensure database tables exist
        Base.metadata.create_all(bind=engine)
        
        records_extracted = 0
        records_transformed = 0
        records_loaded = 0
        failed_records = 0

        try:
            # 1. EXTRACT
            raw_sales = pd.read_csv(os.path.join(DATA_RAW_DIR, "sales.csv"))
            raw_finance = pd.read_csv(os.path.join(DATA_RAW_DIR, "finance.csv"))
            raw_hr = pd.read_csv(os.path.join(DATA_RAW_DIR, "hr.csv"))
            raw_marketing = pd.read_csv(os.path.join(DATA_RAW_DIR, "marketing.csv"))
            raw_ops = pd.read_csv(os.path.join(DATA_RAW_DIR, "operations.csv"))
            raw_cust = pd.read_csv(os.path.join(DATA_RAW_DIR, "customers.csv"))
            raw_prod = pd.read_csv(os.path.join(DATA_RAW_DIR, "products.csv"))
            raw_reg = pd.read_csv(os.path.join(DATA_RAW_DIR, "regions.csv"))
            
            records_extracted = (len(raw_sales) + len(raw_finance) + len(raw_hr) + 
                                 len(raw_marketing) + len(raw_ops) + len(raw_cust) + 
                                 len(raw_prod) + len(raw_reg))

            # 2. TRANSFORM & CLEAN
            # Deduplicate
            raw_sales = raw_sales.drop_duplicates(subset=["order_id"])
            raw_finance = raw_finance.drop_duplicates(subset=["transaction_id"])
            raw_hr = raw_hr.drop_duplicates(subset=["employee_id"])
            raw_marketing = raw_marketing.drop_duplicates(subset=["campaign_id"])
            raw_ops = raw_ops.drop_duplicates(subset=["operation_id"])
            raw_cust = raw_cust.drop_duplicates(subset=["customer_id"])
            raw_prod = raw_prod.drop_duplicates(subset=["product_id"])
            raw_reg = raw_reg.drop_duplicates(subset=["region_id"])

            # Fill missing values if any
            raw_sales.fillna({"discount": 0.0, "quantity": 1}, inplace=True)
            raw_hr.fillna({"training_hours": 0.0, "performance_score": 70.0}, inplace=True)
            raw_marketing.fillna({"impressions": 0, "clicks": 0, "leads": 0}, inplace=True)

            # Re-calculate derived metrics to ensure integrity
            raw_sales["revenue"] = raw_sales["quantity"] * raw_sales["unit_price"] * (1.0 - raw_sales["discount"])
            raw_sales["profit"] = raw_sales["revenue"] - raw_sales["cost"]

            records_transformed = (len(raw_sales) + len(raw_finance) + len(raw_hr) + 
                                   len(raw_marketing) + len(raw_ops) + len(raw_cust) + 
                                   len(raw_prod) + len(raw_reg))

            # 3. LOAD DIMENSIONS & FACTS
            # Clear existing data for clean reload
            for model in [FactSales, FactFinance, FactHR, FactMarketing, FactOperations, 
                          DimCustomer, DimProduct, DimRegion, DimEmployee, DimCampaign, DimDate]:
                self.db.query(model).delete()
            self.db.commit()

            # Load DimDate
            all_dates = set(raw_sales["order_date"]).union(set(raw_finance["transaction_date"])).union(set(raw_marketing["campaign_date"]))
            date_objs = []
            for d_str in sorted(all_dates):
                try:
                    dt = datetime.datetime.strptime(d_str, "%Y-%m-%d")
                    date_objs.append(DimDate(
                        date_key=int(dt.strftime("%Y%m%d")),
                        full_date=d_str,
                        year=dt.year,
                        quarter=(dt.month - 1) // 3 + 1,
                        month=dt.month,
                        month_name=dt.strftime("%B"),
                        day=dt.day,
                        day_of_week=dt.strftime("%A"),
                        is_weekend=dt.weekday() >= 5
                    ))
                except Exception:
                    pass
            self.db.bulk_save_objects(date_objs)

            # Load DimRegion
            self.db.bulk_save_objects([DimRegion(**row.to_dict()) for _, row in raw_reg.iterrows()])
            # Load DimProduct
            self.db.bulk_save_objects([DimProduct(**row.to_dict()) for _, row in raw_prod.iterrows()])
            # Load DimCustomer
            self.db.bulk_save_objects([DimCustomer(**row.to_dict()) for _, row in raw_cust.iterrows()])
            # Load DimEmployee
            self.db.bulk_save_objects([DimEmployee(**row.to_dict()) for _, row in raw_hr.iterrows()])
            # Load DimCampaign
            camp_df = raw_marketing[["campaign_id", "campaign_name", "channel"]].drop_duplicates()
            self.db.bulk_save_objects([DimCampaign(**row.to_dict()) for _, row in camp_df.iterrows()])

            self.db.commit()

            # Bulk load Facts in batches for performance
            hr_fact_cols = ["employee_id", "department", "region", "joining_date", "performance_score", "attendance_rate", "training_hours", "productivity_score", "attrition_status"]
            mkt_fact_cols = ["campaign_id", "campaign_date", "channel", "campaign_cost", "impressions", "clicks", "leads", "conversions", "customers_acquired", "revenue_generated"]

            self.db.bulk_save_objects([FactSales(**row.to_dict()) for _, row in raw_sales.iterrows()])
            self.db.bulk_save_objects([FactFinance(**row.to_dict()) for _, row in raw_finance.iterrows()])
            self.db.bulk_save_objects([FactHR(**row[hr_fact_cols].to_dict()) for _, row in raw_hr.iterrows()])
            self.db.bulk_save_objects([FactMarketing(**row[mkt_fact_cols].to_dict()) for _, row in raw_marketing.iterrows()])
            self.db.bulk_save_objects([FactOperations(**row.to_dict()) for _, row in raw_ops.iterrows()])

            self.db.commit()

            records_loaded = records_transformed
            proc_time = round(time.time() - start_time, 2)

            # Calculate Data Quality Metrics
            dq_metrics = self.calculate_data_quality(raw_sales, raw_finance, raw_hr, raw_marketing, raw_ops)

            # Log ETL run
            etl_log = ETLLog(
                records_extracted=records_extracted,
                records_transformed=records_transformed,
                records_loaded=records_loaded,
                failed_records=failed_records,
                processing_time_sec=proc_time,
                quality_score=dq_metrics["overall_score"],
                status="SUCCESS"
            )
            self.db.add(etl_log)

            # Log Data Quality
            dq_log = DataQualityLog(
                overall_score=dq_metrics["overall_score"],
                completeness=dq_metrics["completeness"],
                validity=dq_metrics["validity"],
                consistency=dq_metrics["consistency"],
                uniqueness=dq_metrics["uniqueness"],
                accuracy=dq_metrics["accuracy"],
                details_json=json.dumps(dq_metrics["details"])
            )
            self.db.add(dq_log)
            self.db.commit()

            print(f"ETL completed successfully in {proc_time} seconds! Loaded {records_loaded} records.")
            return {
                "status": "SUCCESS",
                "extracted": records_extracted,
                "transformed": records_transformed,
                "loaded": records_loaded,
                "failed": failed_records,
                "processing_time": proc_time,
                "quality_score": dq_metrics["overall_score"]
            }

        except Exception as e:
            self.db.rollback()
            proc_time = round(time.time() - start_time, 2)
            err_msg = str(e)
            print(f"ETL ERROR: {err_msg}")
            etl_log = ETLLog(
                records_extracted=records_extracted,
                records_transformed=records_transformed,
                records_loaded=records_loaded,
                failed_records=records_extracted - records_loaded,
                processing_time_sec=proc_time,
                quality_score=0.0,
                status="FAILED",
                error_message=err_msg
            )
            self.db.add(etl_log)
            self.db.commit()
            return {"status": "FAILED", "error": err_msg}

    def calculate_data_quality(self, sales_df, fin_df, hr_df, mkt_df, ops_df) -> dict:
        # Completeness: ratio of non-null values
        total_cells = sales_df.size + fin_df.size + hr_df.size + mkt_df.size + ops_df.size
        null_cells = sales_df.isnull().sum().sum() + fin_df.isnull().sum().sum() + hr_df.isnull().sum().sum() + mkt_df.isnull().sum().sum() + ops_df.isnull().sum().sum()
        completeness = round(max(0, (total_cells - null_cells) / total_cells * 100.0), 1)

        # Uniqueness: duplicate check
        unique_sales = len(sales_df) / max(1, len(sales_df.drop_duplicates(subset=["order_id"])))
        uniqueness = round(min(100.0, (1.0 / unique_sales) * 100.0), 1)

        # Validity: Check valid non-negative amounts in finance & sales
        invalid_sales = (sales_df["revenue"] < 0).sum() + (sales_df["quantity"] <= 0).sum()
        validity = round(max(0.0, (len(sales_df) - invalid_sales) / len(sales_df) * 100.0), 1)

        # Consistency: check revenue vs cost logic in sales
        consistent_sales = (sales_df["profit"] == (sales_df["revenue"] - sales_df["cost"])).sum()
        consistency = round((consistent_sales / len(sales_df)) * 100.0, 1)

        # Accuracy: check SLA status calculation match
        sla_matched = (ops_df["sla_status"] == np.where(ops_df["sla_actual"] <= ops_df["sla_target"], "Met", "Breached")).sum()
        accuracy = round((sla_matched / len(ops_df)) * 100.0, 1)

        overall = round(0.25 * completeness + 0.20 * validity + 0.20 * consistency + 0.20 * uniqueness + 0.15 * accuracy, 1)

        return {
            "overall_score": overall,
            "completeness": completeness,
            "validity": validity,
            "consistency": consistency,
            "uniqueness": uniqueness,
            "accuracy": accuracy,
            "details": {
                "total_records_evaluated": len(sales_df) + len(fin_df) + len(hr_df) + len(mkt_df) + len(ops_df),
                "null_values_count": int(null_cells),
                "invalid_sales_rows": int(invalid_sales),
                "inconsistent_profit_rows": int(len(sales_df) - consistent_sales)
            }
        }
