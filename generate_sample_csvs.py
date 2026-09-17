import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

SAMPLE_DIR = os.path.abspath("sample_upload_csvs")
os.makedirs(SAMPLE_DIR, exist_ok=True)

np.random.seed(101)

start_date = datetime(2023, 1, 1)
num_days = 730

# 1. SCENARIO 1: High Growth Sales Dataset (Replacing sales_data.csv)
rows = 6000
dates = [start_date + timedelta(days=int(d)) for d in np.random.randint(0, num_days, size=rows)]
dates.sort()

quantities = np.random.randint(5, 45, size=rows)
unit_prices = np.random.uniform(5000.0, 45000.0, size=rows).round(2)
discounts = np.random.uniform(0.0, 0.05, size=rows).round(2) # Low discount (0-5%)
revenues = (quantities * unit_prices * (1.0 - discounts)).round(2)
costs = (revenues * np.random.uniform(0.40, 0.55, size=rows)).round(2)
profits = (revenues - costs).round(2)

sales_high = pd.DataFrame({
    "order_id": [f"ORD-HG-{10000 + i}" for i in range(rows)],
    "order_date": [d.strftime("%Y-%m-%d") for d in dates],
    "month": [d.strftime("%Y-%m") for d in dates],
    "customer_id": [f"CUST-{np.random.randint(1000, 1500)}" for _ in range(rows)],
    "product_id": [f"PROD-{np.random.randint(101, 125)}" for _ in range(rows)],
    "sales_rep_id": [f"EMP-{np.random.randint(1001, 1050)}" for _ in range(rows)],
    "region_id": np.random.choice(["REG-01", "REG-02", "REG-03", "REG-04", "REG-05"], size=rows),
    "channel": np.random.choice(["Direct Online", "Enterprise Partner", "Retail Store", "Field Sales"], size=rows),
    "quantity": quantities,
    "unit_price": unit_prices,
    "discount": discounts,
    "revenue": revenues,
    "cost": costs,
    "profit": profits,
    "sales_target": (revenues * 0.92).round(2),
    "status": "Completed"
})
sales_high.to_csv(os.path.join(SAMPLE_DIR, "scenario_1_high_growth_sales.csv"), index=False)
print("Created scenario_1_high_growth_sales.csv")

# 2. SCENARIO 2: Market Slump / Crisis Sales Dataset (Replacing sales_data.csv)
rows_slump = 4000
dates_slump = [start_date + timedelta(days=int(d)) for d in np.random.randint(0, num_days, size=rows_slump)]
dates_slump.sort()

quantities_s = np.random.randint(1, 8, size=rows_slump)
unit_prices_s = np.random.uniform(800.0, 4500.0, size=rows_slump).round(2)
discounts_s = np.random.uniform(0.20, 0.40, size=rows_slump).round(2) # Heavy discount
revenues_s = (quantities_s * unit_prices_s * (1.0 - discounts_s)).round(2)
costs_s = (revenues_s * 0.88).round(2)
profits_s = (revenues_s - costs_s).round(2)

sales_slump = pd.DataFrame({
    "order_id": [f"ORD-SLUMP-{10000 + i}" for i in range(rows_slump)],
    "order_date": [d.strftime("%Y-%m-%d") for d in dates_slump],
    "month": [d.strftime("%Y-%m") for d in dates_slump],
    "customer_id": [f"CUST-{np.random.randint(1000, 1300)}" for _ in range(rows_slump)],
    "product_id": [f"PROD-{np.random.randint(101, 120)}" for _ in range(rows_slump)],
    "sales_rep_id": [f"EMP-{np.random.randint(1001, 1030)}" for _ in range(rows_slump)],
    "region_id": np.random.choice(["REG-01", "REG-02", "REG-03", "REG-04", "REG-05"], size=rows_slump),
    "channel": np.random.choice(["Direct Online", "Enterprise Partner", "Retail Store", "Field Sales"], size=rows_slump),
    "quantity": quantities_s,
    "unit_price": unit_prices_s,
    "discount": discounts_s,
    "revenue": revenues_s,
    "cost": costs_s,
    "profit": profits_s,
    "sales_target": (revenues_s * 1.35).round(2),
    "status": "Completed"
})
sales_slump.to_csv(os.path.join(SAMPLE_DIR, "scenario_2_market_recession_sales.csv"), index=False)
print("Created scenario_2_market_recession_sales.csv")

# 3. SCENARIO 3: Aggressive Marketing Campaigns (Replacing marketing_data.csv)
mkt_rows = 144
mkt_dates = [start_date + timedelta(days=int(d)) for d in np.random.randint(0, num_days, size=mkt_rows)]
mkt_dates.sort()

costs_m = np.random.uniform(250000.0, 950000.0, size=mkt_rows).round(2)
impressions_m = (costs_m * np.random.uniform(25, 45)).astype(int)
clicks_m = (impressions_m * np.random.uniform(0.04, 0.08)).astype(int)
leads_m = (clicks_m * np.random.uniform(0.12, 0.25)).astype(int)
conversions_m = (leads_m * np.random.uniform(0.20, 0.35)).astype(int)
acquired_m = np.maximum(1, (conversions_m * 0.65).astype(int))
rev_gen_m = (acquired_m * np.random.uniform(95000.0, 165000.0)).round(2)
cacs_m = (costs_m / acquired_m).round(2)
rois_m = (((rev_gen_m - costs_m) / costs_m) * 100.0).round(1)

mkt_high = pd.DataFrame({
    "campaign_id": [f"MKT-BOOST-{i:03d}" for i in range(mkt_rows)],
    "campaign_date": [d.strftime("%Y-%m-%d") for d in mkt_dates],
    "month": [d.strftime("%Y-%m") for d in mkt_dates],
    "channel": np.random.choice(["Google Search Ads", "LinkedIn B2B", "Direct Outreach", "Tech Webinars", "Partner Referral", "Industry Events"], size=mkt_rows),
    "campaign_cost": costs_m,
    "impressions": impressions_m,
    "clicks": clicks_m,
    "leads": leads_m,
    "conversions": conversions_m,
    "customers_acquired": acquired_m,
    "revenue_generated": rev_gen_m,
    "cac": cacs_m,
    "roi_pct": rois_m
})
mkt_high.to_csv(os.path.join(SAMPLE_DIR, "scenario_3_aggressive_marketing.csv"), index=False)
print("Created scenario_3_aggressive_marketing.csv")

# 4. SCENARIO 4: Supply Chain & SLA Disruption (Replacing operations_data.csv)
ops_rows = 5000
ops_dates = [start_date + timedelta(days=int(d)) for d in np.random.randint(0, num_days, size=ops_rows)]
ops_dates.sort()

del_times = np.random.uniform(4.5, 9.5, size=ops_rows).round(1)
sla_targets = np.array([3.0] * ops_rows)
sla_met = (del_times <= sla_targets).astype(int)

ops_disrupt = pd.DataFrame({
    "fulfillment_id": [f"FUL-DISR-{i:06d}" for i in range(ops_rows)],
    "order_id": [f"ORD-HG-{10000 + (i % 5000)}" for i in range(ops_rows)],
    "fulfillment_date": [d.strftime("%Y-%m-%d") for d in ops_dates],
    "month": [d.strftime("%Y-%m") for d in ops_dates],
    "region_id": np.random.choice(["REG-01", "REG-02", "REG-03", "REG-04", "REG-05"], size=ops_rows),
    "processing_time": np.random.uniform(2.0, 4.5, size=ops_rows).round(1),
    "fulfillment_time": np.random.uniform(3.0, 5.5, size=ops_rows).round(1),
    "delivery_time": del_times,
    "delivery_time_days": del_times,
    "sla_actual": del_times,
    "sla_target": sla_targets,
    "sla_target_days": sla_targets,
    "sla_met": sla_met,
    "shipping_cost": np.random.uniform(450.0, 1850.0, size=ops_rows).round(2),
    "inventory_level": np.random.randint(200, 800, size=ops_rows),
    "inventory_turnover": np.random.uniform(3.0, 5.5, size=ops_rows).round(2)
})
ops_disrupt.to_csv(os.path.join(SAMPLE_DIR, "scenario_4_supply_chain_disruption_operations.csv"), index=False)
print("Created scenario_4_supply_chain_disruption_operations.csv")

# 5. SCENARIO 5: Workforce Productivity Boost (Replacing hr_data.csv)
hr_rows = 150
prods_h = np.random.uniform(90.0, 99.5, size=hr_rows).round(1)

hr_boost = pd.DataFrame({
    "log_id": [f"HR-BOOST-{i:04d}" for i in range(hr_rows)],
    "employee_id": [f"EMP-{1001 + i}" for i in range(hr_rows)],
    "employee_name": [f"High Performer {i+1}" for i in range(hr_rows)],
    "department": np.random.choice(["Sales", "Engineering", "Marketing", "Finance", "Operations", "Customer Support"], size=hr_rows),
    "region_id": np.random.choice(["REG-01", "REG-02", "REG-03", "REG-04", "REG-05"], size=hr_rows),
    "productivity_score": prods_h,
    "performance_score": (prods_h * 0.98 + np.random.uniform(0, 2, size=hr_rows)).round(1),
    "training_hours": np.random.uniform(25.0, 60.0, size=hr_rows).round(1),
    "satisfaction_score": np.random.uniform(4.5, 5.0, size=hr_rows).round(2),
    "overtime_hours": np.random.uniform(0, 10, size=hr_rows).round(1),
    "attrition_status": "No"
})
hr_boost.to_csv(os.path.join(SAMPLE_DIR, "scenario_5_workforce_expansion_hr.csv"), index=False)
print("Created scenario_5_workforce_expansion_hr.csv")

print("[OK] All 5 sample scenario CSV files created successfully in sample_upload_csvs/")
