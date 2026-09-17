import os
import sys
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Set fixed random seed for 100% reproducibility
SEED = 42
np.random.seed(SEED)
random.seed(SEED)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_DIR = os.path.join(PROJECT_ROOT, "input")
RAW_DIR = os.path.join(PROJECT_ROOT, "data", "raw")

for d in [INPUT_DIR, RAW_DIR]:
    os.makedirs(d, exist_ok=True)

print("[ACDIE Generator] Starting reproducible cross-functional dataset generation (SEED=42)...")

# ==============================================================================
# 1. REGIONS & PRODUCTS
# ==============================================================================
regions = [
    {"region_id": "REG-01", "region_name": "North Region", "country": "India", "tier": "Tier-1", "sales_tax_rate": 0.18},
    {"region_id": "REG-02", "region_name": "South Region", "country": "India", "tier": "Tier-1", "sales_tax_rate": 0.18},
    {"region_id": "REG-03", "region_name": "West Region", "country": "India", "tier": "Tier-1", "sales_tax_rate": 0.18},
    {"region_id": "REG-04", "region_name": "East Region", "country": "India", "tier": "Tier-2", "sales_tax_rate": 0.18},
    {"region_id": "REG-05", "region_name": "Central Region", "country": "India", "tier": "Tier-2", "sales_tax_rate": 0.18},
]
df_regions = pd.DataFrame(regions)

categories = ["Cloud Infrastructure", "Enterprise Software", "Hardware Workstations", "SaaS Subscriptions", "Consulting Services"]
products_list = [
    ("PROD-101", "Enterprise Cloud Suite", "Cloud Infrastructure", 45000.0, 95000.0),
    ("PROD-102", "Data Analytics Platform", "Enterprise Software", 35000.0, 78000.0),
    ("PROD-103", "AI Model Hosting Node", "Cloud Infrastructure", 25000.0, 55000.0),
    ("PROD-104", "High-Performance Workstation", "Hardware Workstations", 65000.0, 120000.0),
    ("PROD-105", "Developer Workstation Pro", "Hardware Workstations", 40000.0, 75000.0),
    ("PROD-106", "Security Shield SaaS", "SaaS Subscriptions", 8000.0, 22000.0),
    ("PROD-107", "CRM Enterprise Edition", "SaaS Subscriptions", 12000.0, 32000.0),
    ("PROD-108", "ERP Integration Core", "Enterprise Software", 85000.0, 180000.0),
    ("PROD-109", "BI Implementation Package", "Consulting Services", 60000.0, 140000.0),
    ("PROD-110", "DevOps Retainer Contract", "Consulting Services", 90000.0, 210000.0),
    ("PROD-111", "Edge Computing Appliance", "Cloud Infrastructure", 32000.0, 68000.0),
    ("PROD-112", "Cybersecurity Audit Suite", "Enterprise Software", 48000.0, 110000.0),
]
for i in range(13, 26):
    cat = random.choice(categories)
    cost = round(random.uniform(15000, 70000), 2)
    price = round(cost * random.uniform(1.6, 2.4), 2)
    products_list.append((f"PROD-{100+i}", f"{cat} Module #{i}", cat, cost, price))

df_products = pd.DataFrame([
    {"product_id": p[0], "product_name": p[1], "category": p[2], "unit_cost": p[3], "selling_price": p[4]}
    for p in products_list
])
df_products.to_csv(os.path.join(INPUT_DIR, "product_data.csv"), index=False)
df_products.to_csv(os.path.join(RAW_DIR, "products.csv"), index=False)
print(f"[OK] Generated {len(df_products)} products -> product_data.csv")

# ==============================================================================
# 2. CUSTOMERS
# ==============================================================================
customer_segments = ["Enterprise", "Mid-Market", "SMB", "Government", "Startup"]
company_prefixes = ["Apex", "Vanguard", "Nexus", "Starlight", "Quantum", "Synergy", "Omni", "Horizon", "Paramount", "Titan"]
company_suffixes = ["Tech", "Systems", "Solutions", "Dynamics", "Enterprises", "Industries", "Holdings", "Labs", "Digital"]

num_customers = 1200
customers = []
start_date = datetime(2023, 1, 1)
end_date = datetime(2025, 12, 31)

for i in range(1, num_customers + 1):
    c_id = f"CUST-{i:04d}"
    c_name = f"{random.choice(company_prefixes)} {random.choice(company_suffixes)} {random.randint(10, 99)}"
    segment = random.choice(customer_segments)
    reg = random.choice(df_regions["region_id"].tolist())
    acq_days = random.randint(0, (end_date - start_date).days - 90)
    acq_date = (start_date + timedelta(days=acq_days)).strftime("%Y-%m-%d")
    
    # Base multiplier for LTV & credit rating
    seg_mult = 3.5 if segment == "Enterprise" else (2.2 if segment == "Mid-Market" else (1.8 if segment == "Government" else 1.0))
    ltv = round(random.uniform(50000, 300000) * seg_mult, 2)
    credit_score = random.randint(620, 850)
    status = "Active" if random.random() > 0.12 else "Churned"
    churn_date = (datetime.strptime(acq_date, "%Y-%m-%d") + timedelta(days=random.randint(90, 400))).strftime("%Y-%m-%d") if status == "Churned" else None

    customers.append({
        "customer_id": c_id,
        "customer_name": c_name,
        "segment": segment,
        "region_id": reg,
        "acquisition_date": acq_date,
        "lifetime_value": ltv,
        "credit_score": credit_score,
        "retention_status": status,
        "churn_date": churn_date
    })

df_customers = pd.DataFrame(customers)
df_customers.to_csv(os.path.join(INPUT_DIR, "customer_data.csv"), index=False)
df_customers.to_csv(os.path.join(RAW_DIR, "customers.csv"), index=False)
print(f"[OK] Generated {len(df_customers)} customers -> customer_data.csv")

# ==============================================================================
# 3. EMPLOYEES & HR
# ==============================================================================
departments = ["Sales", "Engineering", "Marketing", "Finance", "Operations", "Customer Support", "Human Resources"]
first_names = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Diya", "Saanvi", "Aanya", "Aadhya", "Pari", "Ananya", "Myra", "Riya", "Navya", "Sneha"]
last_names = ["Sharma", "Verma", "Patel", "Reddy", "Rao", "Nair", "Iyer", "Mehta", "Singh", "Kumar", "Chopra", "Deshmukh", "Gupta", "Joshi", "Bhat", "Menon"]

num_employees = 150
employees = []
for i in range(1, num_employees + 1):
    emp_id = f"EMP-{i:03d}"
    name = f"{random.choice(first_names)} {random.choice(last_names)}"
    dept = random.choice(departments)
    reg = random.choice(df_regions["region_id"].tolist())
    hire_days = random.randint(100, 1200)
    hire_date = (end_date - timedelta(days=hire_days)).strftime("%Y-%m-%d")
    
    salary_base = {
        "Sales": 650000, "Engineering": 950000, "Marketing": 550000,
        "Finance": 700000, "Operations": 500000, "Customer Support": 400000, "Human Resources": 520000
    }
    salary = round(salary_base[dept] * random.uniform(0.85, 1.45), -3)
    tenure_months = round(hire_days / 30.4, 1)
    
    # Controlled attrition
    attrition = "Yes" if random.random() < 0.08 else "No"
    
    employees.append({
        "employee_id": emp_id,
        "employee_name": name,
        "department": dept,
        "region_id": reg,
        "hire_date": hire_date,
        "annual_salary": salary,
        "tenure_months": tenure_months,
        "attrition_status": attrition
    })

df_employees = pd.DataFrame(employees)

# Generate HR monthly fact logs
hr_logs = []
sales_reps = df_employees[df_employees["department"] == "Sales"]["employee_id"].tolist()

for _, emp in df_employees.iterrows():
    # Productivity score between 60 and 98
    base_prod = random.uniform(70, 92)
    perf_score = round(min(100.0, base_prod + random.uniform(-5, 8)), 1)
    training_hours = round(random.uniform(5, 45), 1)
    satisfaction = round(random.uniform(3.2, 4.9), 2)
    overtime_hrs = round(random.uniform(0, 25), 1)
    
    hr_logs.append({
        "log_id": f"HR-{emp['employee_id']}",
        "employee_id": emp["employee_id"],
        "employee_name": emp["employee_name"],
        "department": emp["department"],
        "region_id": emp["region_id"],
        "productivity_score": perf_score,
        "performance_score": round(perf_score * 0.95 + random.uniform(0, 5), 1),
        "training_hours": training_hours,
        "satisfaction_score": satisfaction,
        "overtime_hours": overtime_hrs,
        "attrition_status": emp["attrition_status"]
    })

df_hr = pd.DataFrame(hr_logs)
df_hr.to_csv(os.path.join(INPUT_DIR, "hr_data.csv"), index=False)
df_hr.to_csv(os.path.join(RAW_DIR, "hr.csv"), index=False)
print(f"[OK] Generated {len(df_hr)} HR records -> hr_data.csv")

# ==============================================================================
# 4. MARKETING (CAMPAIGNS & CHANNELS)
# ==============================================================================
channels = ["Google Search Ads", "LinkedIn B2B", "Direct Outreach", "Tech Webinars", "Partner Referral", "Industry Events"]
mkt_records = []
cur_date = datetime(2023, 1, 1)

while cur_date <= end_date:
    month_str = cur_date.strftime("%Y-%m")
    for ch in channels:
        # Seasonality: higher Q4 spend & Q1 refresh
        month_num = cur_date.month
        season_mult = 1.35 if month_num in [10, 11, 12] else (1.15 if month_num in [1, 2] else 1.0)
        
        cost_base = {
            "Google Search Ads": 180000, "LinkedIn B2B": 240000, "Direct Outreach": 90000,
            "Tech Webinars": 110000, "Partner Referral": 150000, "Industry Events": 300000
        }
        cost = round(cost_base[ch] * season_mult * random.uniform(0.85, 1.25), 2)
        impressions = int(cost * random.uniform(18, 35))
        clicks = int(impressions * random.uniform(0.025, 0.065))
        leads = int(clicks * random.uniform(0.08, 0.18))
        conversions = int(leads * random.uniform(0.12, 0.28))
        acquired = max(1, int(conversions * random.uniform(0.4, 0.75)))
        
        # Revenue generated through channel attribution
        avg_deal_size = 85000 * random.uniform(0.9, 1.3)
        rev_gen = round(acquired * avg_deal_size, 2)
        cac = round(cost / acquired, 2)
        roi = round(((rev_gen - cost) / max(1.0, cost)) * 100.0, 1)
        
        mkt_records.append({
            "campaign_id": f"MKT-{month_str}-{ch[:3].upper()}",
            "campaign_date": cur_date.strftime("%Y-%m-%d"),
            "month": month_str,
            "channel": ch,
            "campaign_cost": cost,
            "impressions": impressions,
            "clicks": clicks,
            "leads": leads,
            "conversions": conversions,
            "customers_acquired": acquired,
            "revenue_generated": rev_gen,
            "cac": cac,
            "roi_pct": roi
        })
    cur_date = (cur_date.replace(day=1) + timedelta(days=32)).replace(day=1)

df_marketing = pd.DataFrame(mkt_records)
df_marketing.to_csv(os.path.join(INPUT_DIR, "marketing_data.csv"), index=False)
df_marketing.to_csv(os.path.join(RAW_DIR, "marketing.csv"), index=False)
print(f"[OK] Generated {len(df_marketing)} marketing campaign records -> marketing_data.csv")

# ==============================================================================
# 5. TRANSACTIONS & SALES (CROSS-LINKED)
# ==============================================================================
sales_records = []
num_orders = 8500

cur_order_date = datetime(2023, 1, 1)
date_range_days = (end_date - start_date).days

for i in range(1, num_orders + 1):
    order_id = f"ORD-{i:06d}"
    order_days = random.randint(0, date_range_days)
    o_date = start_date + timedelta(days=order_days)
    month_str = o_date.strftime("%Y-%m")
    
    customer = random.choice(customers)
    cust_id = customer["customer_id"]
    cust_segment = customer["segment"]
    region_id = customer["region_id"]
    sales_rep = random.choice(sales_reps) if sales_reps else "EMP-001"
    
    prod = random.choice(products_list)
    prod_id = prod[0]
    prod_cat = prod[2]
    u_cost = prod[3]
    u_price = prod[4]
    
    # Order quantity based on customer segment
    qty_mult = 4 if cust_segment == "Enterprise" else (2 if cust_segment in ["Mid-Market", "Government"] else 1)
    quantity = random.randint(1, 3 * qty_mult)
    
    discount_pct = round(random.choice([0.0, 0.05, 0.08, 0.10, 0.15, 0.20]), 2)
    gross_revenue = round(quantity * u_price, 2)
    discount_amt = round(gross_revenue * discount_pct, 2)
    net_revenue = round(gross_revenue - discount_amt, 2)
    cogs = round(quantity * u_cost, 2)
    profit = round(net_revenue - cogs, 2)
    profit_margin = round((profit / max(1.0, net_revenue)) * 100.0, 2)
    
    # Controlled anomaly injection (e.g. major spike in Nov 2024, discount breach in March 2025)
    if o_date.year == 2024 and o_date.month == 11 and random.random() < 0.08:
        quantity *= 3
        gross_revenue *= 3
        net_revenue *= 3
        profit *= 2.8
    
    sales_records.append({
        "order_id": order_id,
        "order_date": o_date.strftime("%Y-%m-%d"),
        "customer_id": cust_id,
        "customer_segment": cust_segment,
        "product_id": prod_id,
        "product_category": prod_cat,
        "employee_id": sales_rep,
        "region_id": region_id,
        "quantity": quantity,
        "unit_price": u_price,
        "unit_cost": u_cost,
        "discount_pct": discount_pct,
        "gross_revenue": gross_revenue,
        "revenue": net_revenue,
        "cogs": cogs,
        "profit": profit,
        "profit_margin": profit_margin
    })

df_sales = pd.DataFrame(sales_records)
df_sales = df_sales.sort_values("order_date").reset_index(drop=True)
df_sales.to_csv(os.path.join(INPUT_DIR, "sales_data.csv"), index=False)
df_sales.to_csv(os.path.join(RAW_DIR, "sales.csv"), index=False)
print(f"[OK] Generated {len(df_sales)} sales transaction records -> sales_data.csv")

# ==============================================================================
# 6. OPERATIONS & FULFILLMENT
# ==============================================================================
ops_records = []
for i, s_row in df_sales.head(6500).iterrows():
    ord_id = s_row["order_id"]
    o_date = datetime.strptime(s_row["order_date"], "%Y-%m-%d")
    
    # Shipping duration based on region & carrier
    carrier = random.choice(["BlueDart Logistics", "Delhivery Express", "FedEx Supply", "DHL Freight", "Ecom Express"])
    warehouse = f"WH-{s_row['region_id']}"
    
    sla_target_days = 3 if s_row["customer_segment"] == "Enterprise" else 5
    actual_days = round(random.uniform(1.2, 6.8), 1)
    
    # Occasional operational delay outlier
    if random.random() < 0.03:
        actual_days += round(random.uniform(4.0, 9.0), 1)
        
    ship_date = (o_date + timedelta(days=max(1, int(actual_days * 0.4)))).strftime("%Y-%m-%d")
    delivery_date = (o_date + timedelta(days=max(1, int(actual_days)))).strftime("%Y-%m-%d")
    sla_status = "Compliant" if actual_days <= sla_target_days else "Breached"
    
    shipping_cost = round(random.uniform(850, 4500), 2)
    defect_rate = round(random.uniform(0.0, 1.8), 2)
    inv_turnover = round(random.uniform(5.5, 12.0), 1)
    
    ops_records.append({
        "fulfillment_id": f"FUL-{ord_id[4:]}",
        "order_id": ord_id,
        "order_date": s_row["order_date"],
        "ship_date": ship_date,
        "delivery_date": delivery_date,
        "warehouse_id": warehouse,
        "carrier": carrier,
        "region_id": s_row["region_id"],
        "delivery_time_days": actual_days,
        "sla_target_days": sla_target_days,
        "sla_status": sla_status,
        "shipping_cost": shipping_cost,
        "inventory_turnover": inv_turnover,
        "defect_rate_pct": defect_rate
    })

df_ops = pd.DataFrame(ops_records)
df_ops.to_csv(os.path.join(INPUT_DIR, "operations_data.csv"), index=False)
df_ops.to_csv(os.path.join(RAW_DIR, "operations.csv"), index=False)
print(f"[OK] Generated {len(df_ops)} operations records -> operations_data.csv")

# ==============================================================================
# 7. CORPORATE FINANCE (MONTHLY LEDGER)
# ==============================================================================
fin_records = []
df_sales["month"] = pd.to_datetime(df_sales["order_date"]).dt.strftime("%Y-%m")
sales_monthly = df_sales.groupby("month").agg({"revenue": "sum", "profit": "sum", "cogs": "sum"}).reset_index()

for _, m_row in sales_monthly.iterrows():
    m_str = m_row["month"]
    rev = float(m_row["revenue"])
    cogs_val = float(m_row["cogs"])
    gross_profit = float(m_row["profit"])
    
    # OPEX categories
    rnd_exp = round(rev * random.uniform(0.12, 0.16), 2)
    sales_mkt_exp = round(rev * random.uniform(0.14, 0.19), 2)
    gen_admin_exp = round(rev * random.uniform(0.07, 0.10), 2)
    tot_opex = round(rnd_exp + sales_mkt_exp + gen_admin_exp, 2)
    
    op_profit = round(gross_profit - tot_opex, 2)
    tax = round(max(0.0, op_profit * 0.22), 2)
    net_income = round(op_profit - tax, 2)
    cash_flow = round(net_income * random.uniform(0.9, 1.25), 2)
    
    fin_records.append({
        "record_id": f"FIN-{m_str}",
        "transaction_date": f"{m_str}-28",
        "month": m_str,
        "revenue": rev,
        "cogs": cogs_val,
        "gross_profit": gross_profit,
        "operating_expense": tot_opex,
        "rnd_expense": rnd_exp,
        "marketing_expense": sales_mkt_exp,
        "general_admin_expense": gen_admin_exp,
        "operating_profit": op_profit,
        "tax_provision": tax,
        "net_income": net_income,
        "cash_flow": cash_flow
    })

df_finance = pd.DataFrame(fin_records)
df_finance.to_csv(os.path.join(INPUT_DIR, "finance_data.csv"), index=False)
df_finance.to_csv(os.path.join(RAW_DIR, "finance.csv"), index=False)
print(f"[OK] Generated {len(df_finance)} finance records -> finance_data.csv")

# ==============================================================================
# 8. INPUT DATA README
# ==============================================================================
readme_content = """# ACDIE Demonstration Datasets

This directory contains the cross-functional enterprise input datasets for the **Adaptive Cross-Functional Decision Intelligence Engine (ACDIE)**.

## Dataset Inventory

| Dataset File | Primary Grain | Key Foreign Keys | Purpose |
| :--- | :--- | :--- | :--- |
| `sales_data.csv` | 1 row = 1 transaction | `customer_id`, `product_id`, `employee_id`, `region_id` | Core sales orders, order values, discount levels, and gross/net margins. |
| `finance_data.csv` | 1 row = 1 monthly ledger | `month` | P&L breakdown, OPEX allocations (R&D, SG&A), tax, and cash flow. |
| `hr_data.csv` | 1 row = 1 employee scorecard | `employee_id`, `region_id`, `department` | Headcount, workforce productivity indices, training hours, and attrition. |
| `marketing_data.csv` | 1 row = 1 channel campaign | `channel`, `month` | Spend, impressions, leads, conversions, CAC, and attributed revenue. |
| `operations_data.csv` | 1 row = 1 fulfillment log | `order_id`, `region_id` | Shipping duration, warehouse fulfillment, carrier SLA compliance, defect rate. |
| `customer_data.csv` | 1 row = 1 customer account | `region_id` | Industry segments, acquisition date, credit ratings, retention status. |
| `product_data.csv` | 1 row = 1 catalog item | `category` | Unit cost, standard selling price, and category hierarchy. |

## How to Test with Your Own Data

1. **Replace any CSV file** in `/input/` with your own compatible CSV file.
2. Ensure key semantic fields are present (e.g. `order_date`, `revenue`, `customer_id` or your equivalents).
3. The **Semantic Schema Mapper** will automatically identify column roles.
4. The **Adaptive Analytics Engine** will inspect the dataset and execute all supported analytics modules.
5. In the UI or via API `POST /api/etl/run`, trigger the pipeline to recalculate all KPIs, RFM clusters, forecasts, anomalies, and insights.
"""

with open(os.path.join(INPUT_DIR, "README.md"), "w", encoding="utf-8") as f:
    f.write(readme_content)

print("[OK] Created /input/README.md documentation.")
print("[ACDIE Generator] Data generation successfully completed!")
