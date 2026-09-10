import pandas as pd
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database.connection import get_db
from app.services.kpi_engine import KPIEngine
from app.database.schema import FactSales, FactFinance, FactHR, FactMarketing, FactOperations, DimRegion, DimProduct, DimCustomer, DimEmployee

router = APIRouter(prefix="/dashboards", tags=["Dashboards"])

@router.get("/executive")
def get_executive_dashboard(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    product_category: Optional[str] = Query(None),
    customer_segment: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    kpis = KPIEngine(db).get_kpis(start_date, end_date, region, department, product_category, customer_segment)

    # 1. Monthly Revenue vs Profit Trend
    sales_df = pd.read_sql("SELECT order_date, revenue, profit, region_id, product_id FROM fact_sales", db.bind)
    if start_date:
        sales_df = sales_df[sales_df["order_date"] >= start_date]
    if end_date:
        sales_df = sales_df[sales_df["order_date"] <= end_date]
    if region and region != "All":
        sales_df = sales_df[sales_df["region_id"] == region]

    sales_df["month"] = pd.to_datetime(sales_df["order_date"]).dt.strftime("%Y-%m")
    monthly_trend = sales_df.groupby("month").agg({"revenue": "sum", "profit": "sum"}).reset_index()
    monthly_trend["revenue"] = monthly_trend["revenue"].round(2)
    monthly_trend["profit"] = monthly_trend["profit"].round(2)

    # 2. Regional Performance
    reg_df = pd.read_sql("SELECT region_id, region_name FROM dim_region", db.bind)
    sales_reg = sales_df.merge(reg_df, on="region_id", how="left")
    reg_perf = sales_reg.groupby("region_name").agg({"revenue": "sum", "profit": "sum"}).reset_index()
    reg_perf["revenue"] = reg_perf["revenue"].round(2)
    reg_perf["profit"] = reg_perf["profit"].round(2)

    # 3. Category Revenue Contribution
    prod_df = pd.read_sql("SELECT product_id, category FROM dim_product", db.bind)
    sales_cat = sales_df.merge(prod_df, on="product_id", how="left")
    cat_contrib = sales_cat.groupby("category").agg({"revenue": "sum", "profit": "sum"}).reset_index()
    cat_contrib["revenue"] = cat_contrib["revenue"].round(2)

    # 4. Department Performance
    hr_df = pd.read_sql("SELECT department, productivity_score, performance_score FROM fact_hr", db.bind)
    dept_perf = hr_df.groupby("department").agg({"productivity_score": "mean", "performance_score": "mean"}).reset_index()
    dept_perf["productivity_score"] = dept_perf["productivity_score"].round(1)

    return {
        "kpis": kpis,
        "monthly_trend": monthly_trend.to_dict(orient="records"),
        "regional_performance": reg_perf.to_dict(orient="records"),
        "category_contribution": cat_contrib.to_dict(orient="records"),
        "department_performance": dept_perf.to_dict(orient="records")
    }

@router.get("/sales")
def get_sales_dashboard(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    kpis = KPIEngine(db).get_kpis(start_date, end_date, region=region)
    sales_df = pd.read_sql("SELECT * FROM fact_sales", db.bind)
    if start_date:
        sales_df = sales_df[sales_df["order_date"] >= start_date]
    if end_date:
        sales_df = sales_df[sales_df["order_date"] <= end_date]

    # Target vs Actual
    sales_df["month"] = pd.to_datetime(sales_df["order_date"]).dt.strftime("%Y-%m")
    target_vs_actual = sales_df.groupby("month").agg({"revenue": "sum", "sales_target": "sum"}).reset_index()
    target_vs_actual["revenue"] = target_vs_actual["revenue"].round(2)
    target_vs_actual["sales_target"] = target_vs_actual["sales_target"].round(2)

    # Sales Rep Leaderboard
    emp_df = pd.read_sql("SELECT employee_id, employee_name FROM dim_employee", db.bind)
    rep_sales = sales_df.groupby("sales_rep_id").agg({"revenue": "sum", "order_id": "count"}).reset_index()
    rep_leaderboard = rep_sales.merge(emp_df, left_on="sales_rep_id", right_on="employee_id", how="left").sort_values("revenue", ascending=False).head(10)
    rep_leaderboard["revenue"] = rep_leaderboard["revenue"].round(2)

    # Customer Segment Performance
    cust_df = pd.read_sql("SELECT customer_id, customer_segment FROM dim_customer", db.bind)
    cust_sales = sales_df.merge(cust_df, on="customer_id", how="left")
    segment_perf = cust_sales.groupby("customer_segment").agg({"revenue": "sum", "profit": "sum", "order_id": "count"}).reset_index()

    return {
        "kpis": {
            "total_revenue": kpis["total_revenue"],
            "total_orders": kpis["total_orders"],
            "average_order_value": kpis["average_order_value"],
            "target_achievement": kpis["target_achievement"],
            "total_profit": kpis["total_profit"]
        },
        "target_vs_actual": target_vs_actual.to_dict(orient="records"),
        "sales_rep_leaderboard": rep_leaderboard[["employee_name", "revenue", "order_id"]].to_dict(orient="records"),
        "customer_segment_performance": segment_perf.to_dict(orient="records")
    }

@router.get("/finance")
def get_finance_dashboard(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    kpis = KPIEngine(db).get_kpis(start_date, end_date)
    fin_df = pd.read_sql("SELECT * FROM fact_finance", db.bind)

    fin_df["month"] = pd.to_datetime(fin_df["transaction_date"]).dt.strftime("%Y-%m")
    rev_vs_exp = fin_df.groupby("month").agg({
        "revenue": "sum",
        "operating_expense": "sum",
        "marketing_expense": "sum",
        "payroll_expense": "sum",
        "operating_profit": "sum",
        "cash_flow": "sum",
        "budget": "sum"
    }).reset_index()

    # Expense breakdown totals
    expense_breakdown = [
        {"name": "Operating Expense", "value": round(float(fin_df["operating_expense"].sum()), 2)},
        {"name": "Payroll Expense", "value": round(float(fin_df["payroll_expense"].sum()), 2)},
        {"name": "Marketing Expense", "value": round(float(fin_df["marketing_expense"].sum()), 2)}
    ]

    return {
        "kpis": {
            "total_revenue": kpis["total_revenue"],
            "operating_expense": kpis["operating_expense"],
            "total_profit": kpis["total_profit"],
            "profit_margin": kpis["profit_margin"],
            "cash_flow": kpis["cash_flow"]
        },
        "monthly_finance_trend": rev_vs_exp.to_dict(orient="records"),
        "expense_breakdown": expense_breakdown
    }

@router.get("/marketing")
def get_marketing_dashboard(db: Session = Depends(get_db)):
    kpis = KPIEngine(db).get_kpis()
    mkt_df = pd.read_sql("SELECT * FROM fact_marketing", db.bind)

    # Channel Performance
    ch_perf = mkt_df.groupby("channel").agg({
        "campaign_cost": "sum",
        "revenue_generated": "sum",
        "clicks": "sum",
        "leads": "sum",
        "conversions": "sum",
        "customers_acquired": "sum"
    }).reset_index()
    ch_perf["roi"] = (((ch_perf["revenue_generated"] - ch_perf["campaign_cost"]) / ch_perf["campaign_cost"]) * 100.0).round(1)
    ch_perf["cac"] = (ch_perf["campaign_cost"] / ch_perf["customers_acquired"].clip(lower=1)).round(2)

    # Conversion Funnel
    funnel = [
        {"stage": "Impressions", "value": int(mkt_df["impressions"].sum())},
        {"stage": "Clicks", "value": int(mkt_df["clicks"].sum())},
        {"stage": "Leads", "value": int(mkt_df["leads"].sum())},
        {"stage": "Conversions", "value": int(mkt_df["conversions"].sum())},
        {"stage": "Acquired Customers", "value": int(mkt_df["customers_acquired"].sum())}
    ]

    return {
        "kpis": {
            "marketing_spend": {"name": "Marketing Spend", "value": round(float(mkt_df["campaign_cost"].sum()), 2), "unit": "$", "trend": "up"},
            "cac": kpis["cac"],
            "ltv": kpis["ltv"],
            "marketing_roi": kpis["marketing_roi"],
            "conversion_rate": kpis["conversion_rate"]
        },
        "channel_performance": ch_perf.to_dict(orient="records"),
        "conversion_funnel": funnel
    }

@router.get("/hr")
def get_hr_dashboard(db: Session = Depends(get_db)):
    kpis = KPIEngine(db).get_kpis()
    hr_df = pd.read_sql("SELECT * FROM fact_hr", db.bind)

    dept_hr = hr_df.groupby("department").agg({
        "employee_id": "count",
        "productivity_score": "mean",
        "performance_score": "mean",
        "training_hours": "mean",
        "attrition_status": lambda x: (x == "Yes").sum()
    }).reset_index()
    dept_hr.columns = ["department", "headcount", "avg_productivity", "avg_performance", "avg_training_hours", "attrition_count"]
    dept_hr["attrition_rate"] = (dept_hr["attrition_count"] / dept_hr["headcount"] * 100.0).round(1)
    dept_hr["avg_productivity"] = dept_hr["avg_productivity"].round(1)

    return {
        "kpis": {
            "total_employees": {"name": "Total Employees", "value": len(hr_df), "unit": "", "trend": "up"},
            "attrition_rate": kpis["attrition_rate"],
            "employee_productivity": kpis["employee_productivity"],
            "average_training": {"name": "Avg Training Hours", "value": round(float(hr_df["training_hours"].mean()), 1), "unit": "hrs", "trend": "up"}
        },
        "department_hr": dept_hr.to_dict(orient="records")
    }

@router.get("/operations")
def get_operations_dashboard(db: Session = Depends(get_db)):
    kpis = KPIEngine(db).get_kpis()
    ops_df = pd.read_sql("SELECT * FROM fact_operations", db.bind)

    sla_dist = ops_df["sla_status"].value_counts().reset_index()
    sla_dist.columns = ["status", "count"]

    avg_times = {
        "processing_time_hours": round(float(ops_df["processing_time"].mean()), 1),
        "fulfillment_time_hours": round(float(ops_df["fulfillment_time"].mean()), 1),
        "delivery_time_days": round(float(ops_df["delivery_time"].mean()), 1)
    }

    return {
        "kpis": {
            "orders_processed": {"name": "Orders Processed", "value": len(ops_df), "unit": "", "trend": "up"},
            "sla_compliance": kpis["sla_compliance"],
            "inventory_turnover": kpis["inventory_turnover"],
            "avg_fulfillment_time": {"name": "Avg Fulfillment Time", "value": avg_times["fulfillment_time_hours"], "unit": "hrs", "trend": "down"}
        },
        "sla_distribution": sla_dist.to_dict(orient="records"),
        "fulfillment_metrics": avg_times
    }
