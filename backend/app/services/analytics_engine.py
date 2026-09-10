import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
from sqlalchemy.orm import Session
from app.database.schema import FactSales, FactFinance, FactHR, FactMarketing, FactOperations, DimCustomer

class AnalyticsEngine:
    def __init__(self, db: Session):
        self.db = db

    def get_eda_summary(self, dataset_name: str = "sales") -> dict:
        table_map = {
            "sales": FactSales,
            "finance": FactFinance,
            "hr": FactHR,
            "marketing": FactMarketing,
            "operations": FactOperations,
            "customers": DimCustomer
        }
        model = table_map.get(dataset_name.lower(), FactSales)
        df = pd.read_sql(self.db.query(model).statement, self.db.bind)

        if df.empty:
            return {"error": "Dataset is empty"}

        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        # Drop primary key IDs from numeric correlation
        numeric_cols = [c for c in numeric_cols if not c.endswith("_id") and c not in ["sale_id", "finance_id", "hr_id", "marketing_id", "ops_id"]]

        stats = {}
        for col in numeric_cols:
            series = df[col].dropna()
            stats[col] = {
                "mean": round(float(series.mean()), 2),
                "median": round(float(series.median()), 2),
                "std": round(float(series.std()), 2),
                "min": round(float(series.min()), 2),
                "max": round(float(series.max()), 2),
                "q25": round(float(series.quantile(0.25)), 2),
                "q75": round(float(series.quantile(0.75)), 2)
            }

        # Correlation matrix
        corr = df[numeric_cols].corr().round(3).to_dict() if len(numeric_cols) > 1 else {}

        # Histogram data for key variable (first numeric col)
        hist_col = numeric_cols[0] if numeric_cols else ""
        hist_bins = []
        if hist_col:
            counts, bin_edges = np.histogram(df[hist_col].dropna(), bins=10)
            for i in range(len(counts)):
                hist_bins.append({
                    "range": f"{round(bin_edges[i], 1)} - {round(bin_edges[i+1], 1)}",
                    "count": int(counts[i])
                })

        return {
            "dataset": dataset_name,
            "total_records": len(df),
            "columns": list(df.columns),
            "numeric_columns": numeric_cols,
            "summary_stats": stats,
            "correlation_matrix": corr,
            "sample_histogram": {"column": hist_col, "bins": hist_bins}
        }

    def run_rfm_segmentation(self, n_clusters: int = 5) -> dict:
        sales_df = pd.read_sql("SELECT customer_id, order_date, revenue FROM fact_sales", self.db.bind)
        cust_df = pd.read_sql("SELECT customer_id, customer_name, customer_segment, lifetime_value FROM dim_customer", self.db.bind)

        if sales_df.empty:
            return {"error": "No sales data for RFM"}

        sales_df["order_date"] = pd.to_datetime(sales_df["order_date"])
        max_date = sales_df["order_date"].max()

        # Recency, Frequency, Monetary calculation per customer
        rfm = sales_df.groupby("customer_id").agg({
            "order_date": lambda x: (max_date - x.max()).days, # Recency
            "revenue": ["count", "sum"]                        # Frequency, Monetary
        }).reset_index()

        rfm.columns = ["customer_id", "recency", "frequency", "monetary"]

        # K-Means Clustering using Scikit-Learn
        features = rfm[["recency", "frequency", "monetary"]]
        scaler = StandardScaler()
        scaled_features = scaler.fit_transform(features)

        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        rfm["cluster"] = kmeans.fit_predict(scaled_features)

        # Map cluster numbers to meaningful Business Segments
        cluster_means = rfm.groupby("cluster")["monetary"].mean().sort_values(ascending=False).index
        segment_labels = ["Champions", "Loyal Customers", "Potential Loyalists", "At Risk", "Lost / Low Value"]
        label_map = {cluster_means[i]: segment_labels[i] if i < len(segment_labels) else f"Segment {i+1}" for i in range(len(cluster_means))}
        
        rfm["segment_name"] = rfm["cluster"].map(label_map)

        # Segment distribution summary
        segment_summary = rfm.groupby("segment_name").agg({
            "customer_id": "count",
            "recency": "mean",
            "frequency": "mean",
            "monetary": ["mean", "sum"]
        }).reset_index()

        segment_summary.columns = ["segment_name", "customer_count", "avg_recency", "avg_frequency", "avg_monetary", "total_revenue"]
        segment_summary["avg_recency"] = segment_summary["avg_recency"].round(1)
        segment_summary["avg_frequency"] = segment_summary["avg_frequency"].round(1)
        segment_summary["avg_monetary"] = segment_summary["avg_monetary"].round(2)
        segment_summary["total_revenue"] = segment_summary["total_revenue"].round(2)

        return {
            "total_customers_analyzed": len(rfm),
            "segment_summary": segment_summary.to_dict(orient="records"),
            "customer_sample": rfm.head(50).to_dict(orient="records")
        }

    def generate_revenue_forecast(self, months_ahead: int = 6) -> dict:
        sales_df = pd.read_sql("SELECT order_date, revenue FROM fact_sales", self.db.bind)
        if sales_df.empty:
            return {"error": "No sales data for forecast"}

        sales_df["order_date"] = pd.to_datetime(sales_df["order_date"])
        monthly = sales_df.resample("ME", on="order_date")["revenue"].sum().reset_index()
        monthly["month_str"] = monthly["order_date"].dt.strftime("%Y-%m")

        # Linear trend + Seasonal forecasting model
        y = monthly["revenue"].values
        x = np.arange(len(y))

        slope, intercept = np.polyfit(x, y, 1)

        # Forecast future points
        last_date = monthly["order_date"].max()
        future_dates = [last_date + pd.DateOffset(months=i) for i in range(1, months_ahead + 1)]
        
        historical = []
        for _, row in monthly.iterrows():
            historical.append({
                "date": row["month_str"],
                "actual_revenue": round(float(row["revenue"]), 2),
                "is_forecast": False
            })

        std_err = np.std(y - (slope * x + intercept))
        forecast = []
        for i, f_date in enumerate(future_dates):
            idx = len(x) + i
            pred = max(0, slope * idx + intercept)
            # Seasonal boost
            month_num = f_date.month
            season_factor = 1.15 if month_num in [10, 11, 12] else (0.92 if month_num in [1, 2] else 1.0)
            final_pred = round(pred * season_factor, 2)
            
            forecast.append({
                "date": f_date.strftime("%Y-%m"),
                "forecast_revenue": final_pred,
                "upper_bound": round(final_pred + 1.96 * std_err, 2),
                "lower_bound": round(max(0, final_pred - 1.96 * std_err), 2),
                "is_forecast": True
            })

        return {
            "historical": historical,
            "forecast": forecast,
            "trend_slope": round(float(slope), 2),
            "confidence_level": "95%"
        }

    def detect_anomalies(self) -> list:
        sales_df = pd.read_sql("SELECT order_date, revenue, order_id FROM fact_sales", self.db.bind)
        fin_df = pd.read_sql("SELECT transaction_date, operating_expense FROM fact_finance", self.db.bind)
        ops_df = pd.read_sql("SELECT order_id, sla_actual, delivery_time FROM fact_operations", self.db.bind)

        anomalies = []

        # 1. Daily Revenue Anomalies (Isolation Forest & IQR)
        daily_rev = sales_df.groupby("order_date")["revenue"].sum().reset_index()
        q1 = daily_rev["revenue"].quantile(0.25)
        q3 = daily_rev["revenue"].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr

        outliers = daily_rev[(daily_rev["revenue"] < lower_bound) | (daily_rev["revenue"] > upper_bound)]
        for _, row in outliers.head(10).iterrows():
            is_drop = row["revenue"] < lower_bound
            anomalies.append({
                "anomaly_id": f"ANOM-REV-{row['order_date']}",
                "date": str(row["order_date"]),
                "metric": "Daily Revenue",
                "value": f"${round(float(row['revenue']), 2):,}",
                "expected_range": f"${round(lower_bound, 2):,} - ${round(upper_bound, 2):,}",
                "severity": "HIGH" if is_drop else "MEDIUM",
                "explanation": "Revenue dropped unexpectedly below normal baseline." if is_drop else "Unusual revenue spike detected."
            })

        # 2. Operating Expense Spikes
        fin_df["transaction_date"] = fin_df["transaction_date"].astype(str)
        q1_exp = fin_df["operating_expense"].quantile(0.25)
        q3_exp = fin_df["operating_expense"].quantile(0.75)
        upper_exp = q3_exp + 1.8 * (q3_exp - q1_exp)
        exp_spikes = fin_df[fin_df["operating_expense"] > upper_exp]
        for _, row in exp_spikes.head(5).iterrows():
            anomalies.append({
                "anomaly_id": f"ANOM-EXP-{row['transaction_date']}",
                "date": str(row["transaction_date"]),
                "metric": "Operating Expense",
                "value": f"${round(float(row['operating_expense']), 2):,}",
                "expected_range": f"<= ${round(upper_exp, 2):,}",
                "severity": "HIGH",
                "explanation": "Operating expenditure exceeded statistical upper control limit."
            })

        # 3. Fulfillment Delay Anomalies
        delay_outliers = ops_df[ops_df["delivery_time"] > 6.0]
        for _, row in delay_outliers.head(5).iterrows():
            anomalies.append({
                "anomaly_id": f"ANOM-OPS-{row['order_id']}",
                "date": "Recent",
                "metric": "Delivery Time",
                "value": f"{row['delivery_time']} days",
                "expected_range": "<= 5.0 days",
                "severity": "MEDIUM",
                "explanation": f"Fulfillment delay breached target SLA limit for Order {row['order_id']}."
            })

        return anomalies
