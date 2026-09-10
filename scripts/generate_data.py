import os
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
RAW_DIR = os.path.join(DATA_DIR, "raw")
SAMPLE_DIR = os.path.join(DATA_DIR, "sample")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")

for directory in [RAW_DIR, SAMPLE_DIR, PROCESSED_DIR]:
    os.makedirs(directory, exist_ok=True)

print("Starting realistic data generation...")

# ----------------------------------------------------
# 1. REGIONS
# ----------------------------------------------------
regions_data = [
    {"region_id": "REG-01", "region_name": "North America", "country": "United States"},
    {"region_id": "REG-02", "region_name": "Europe", "country": "Germany"},
    {"region_id": "REG-03", "region_name": "Asia Pacific", "country": "Japan"},
    {"region_id": "REG-04", "region_name": "Latin America", "country": "Brazil"},
    {"region_id": "REG-05", "region_name": "Middle East & Africa", "country": "UAE"}
]
df_regions = pd.DataFrame(regions_data)
df_regions.to_csv(os.path.join(RAW_DIR, "regions.csv"), index=False)
print(f"Generated {len(df_regions)} regions.")

# ----------------------------------------------------
# 2. PRODUCTS
# ----------------------------------------------------
categories = ["Cloud Infrastructure", "Enterprise Software", "Hardware Workstations", "SaaS Subscriptions", "Consulting Services"]
products_list = [
    ("PROD-101", "Enterprise Cloud Suite", "Cloud Infrastructure", 1200.0, 2500.0),
    ("PROD-102", "Data Analytics Platform", "Enterprise Software", 800.0, 1800.0),
    ("PROD-103", "AI Model Hosting", "Cloud Infrastructure", 500.0, 1200.0),
    ("PROD-104", "High-Perf Server Rack", "Hardware Workstations", 3500.0, 6000.0),
    ("PROD-105", "Developer Workstation", "Hardware Workstations", 1200.0, 2200.0),
    ("PROD-106", "Security Shield SaaS", "SaaS Subscriptions", 150.0, 450.0),
    ("PROD-107", "CRM Enterprise Edition", "SaaS Subscriptions", 300.0, 850.0),
    ("PROD-108", "ERP Integration Pack", "Enterprise Software", 2000.0, 4500.0),
    ("PROD-109", "BI Implementation Package", "Consulting Services", 1500.0, 3500.0),
    ("PROD-110", "DevOps Consulting Retainer", "Consulting Services", 2500.0, 5000.0),
    ("PROD-111", "Edge Compute Node", "Cloud Infrastructure", 700.0, 1400.0),
    ("PROD-112", "Cybersecurity Audit Tool", "Enterprise Software", 900.0, 2100.0),
]
# Expand to 25 products with variations
all_products = []
for p_id, p_name, cat, cost, price in products_list:
    all_products.append({
        "product_id": p_id,
        "product_name": p_name,
        "category": cat,
        "unit_cost": cost,
        "selling_price": price
    })
for i in range(13, 30):
    cat = random.choice(categories)
    cost = round(random.uniform(200, 3000), 2)
    price = round(cost * random.uniform(1.4, 2.5), 2)
    all_products.append({
        "product_id": f"PROD-{100+i}",
        "product_name": f"{cat} Module #{i}",
        "category": cat,
        "unit_cost": cost,
        "selling_price": price
    })
df_products = pd.DataFrame(all_products)
df_products.to_csv(os.path.join(RAW_DIR, "products.csv"), index=False)
print(f"Generated {len(df_products)} products.")

# ----------------------------------------------------
# 3. CUSTOMERS
# ----------------------------------------------------
customer_segments = ["Enterprise", "Mid-Market", "SMB", "Government", "Startup"]
first_names = ["Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Pat", "Riley", "Casey", "Dakota", "Avery", "Reese", "Quinn", "Skyler", "Cameron"]
last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson"]
companies = ["TechCorp", "Apex Global", "Synergy Systems", "Vanguard Solutions", "Nexus Dynamic", "Horizon Inc", "Omni Digital", "Quantum Labs", "Starlight Media", "Innovate X"]

num_customers = 2500
customers = []
start_date = datetime(2023, 1, 1)
end_date = datetime(2025, 12, 31)

for i in range(1, num_customers + 1):
    c_id = f"CUST-{i:05d}"
    segment = random.choice(customer_segments)
    reg = random.choice(df_regions["region_id"].tolist())
    acq_days = random.randint(0, (end_date - start_date).days - 90)
    acq_date = (start_date + timedelta(days=acq_days)).strftime("%Y-%m-%d")
    
    # Segment specific multipliers
    mult = 3.0 if segment == "Enterprise" else (2.0 if segment == "Mid-Market" else (1.5 if segment == "Government" else 1.0))
    freq = round(random.uniform(2, 20) * mult, 1)
    aov = round(random.uniform(500, 4000) * mult, 2)
    # LTV = freq * AOV * retention factor
    ltv = round(freq * aov * random.uniform(1.2, 3.5), 2)
    retention = "Active" if random.random() > 0.15 else "Churned"
    
    comp_name = f"{random.choice(companies)} {i}"
    customers.append({
        "customer_id": c_id,
        "customer_name": comp_name,
        "customer_segment": segment,
        "region": reg,
        "acquisition_date": acq_date,
        "purchase_frequency": freq,
        "average_order_value": aov,
        "lifetime_value": ltv,
        "retention_status": retention
    })
df_customers = pd.DataFrame(customers)
df_customers.to_csv(os.path.join(RAW_DIR, "customers.csv"), index=False)
print(f"Generated {len(df_customers)} customers.")

# ----------------------------------------------------
# 4. HR (EMPLOYEES)
# ----------------------------------------------------
departments = ["Sales", "Finance", "HR", "Marketing", "Operations", "Engineering"]
sales_reps = []

num_employees = 500
employees = []
for i in range(1, num_employees + 1):
    e_id = f"EMP-{i:04d}"
    emp_name = f"{random.choice(first_names)} {random.choice(last_names)}"
    dept = random.choice(departments)
    reg = random.choice(df_regions["region_id"].tolist())
    join_days = random.randint(0, 1000)
    joining_date = (datetime(2022, 1, 1) + timedelta(days=join_days)).strftime("%Y-%m-%d")
    
    perf = round(random.uniform(60.0, 99.0), 1)
    att = round(random.uniform(85.0, 100.0), 1)
    train_hrs = round(random.uniform(10.0, 80.0), 1)
    
    # Productivity score correlated with training and performance
    prod = round(0.4 * perf + 0.3 * att + 0.3 * min(100, (train_hrs / 80.0) * 100), 1)
    # Attrition higher if low performance & productivity
    attr_prob = 0.35 if prod < 70 else (0.15 if prod < 80 else 0.04)
    attrition = "Yes" if random.random() < attr_prob else "No"
    
    if dept == "Sales":
        sales_reps.append(e_id)
        
    employees.append({
        "employee_id": e_id,
        "employee_name": emp_name,
        "department": dept,
        "region": reg,
        "joining_date": joining_date,
        "performance_score": perf,
        "attendance_rate": att,
        "training_hours": train_hrs,
        "productivity_score": prod,
        "attrition_status": attrition
    })
df_hr = pd.DataFrame(employees)
df_hr.to_csv(os.path.join(RAW_DIR, "hr.csv"), index=False)
print(f"Generated {len(df_hr)} HR records.")

# ----------------------------------------------------
# 5. SALES (10,000+ RECORDS)
# ----------------------------------------------------
num_orders = 12500
orders = []
prod_lookup = {p["product_id"]: p for p in all_products}
cust_lookup = {c["customer_id"]: c for c in customers}

curr_date = datetime(2023, 1, 1)
total_days = (end_date - start_date).days

for i in range(1, num_orders + 1):
    order_id = f"ORD-{i:06d}"
    order_days = random.randint(0, total_days)
    o_date_dt = start_date + timedelta(days=order_days)
    order_date = o_date_dt.strftime("%Y-%m-%d")
    
    cust = random.choice(customers)
    cust_id = cust["customer_id"]
    reg_id = cust["region"]
    
    prod = random.choice(all_products)
    prod_id = prod["product_id"]
    
    rep_id = random.choice(sales_reps) if sales_reps else "EMP-0001"
    
    # Quantity & price
    qty = random.randint(1, 15)
    unit_price = prod["selling_price"]
    unit_cost = prod["unit_cost"]
    
    # Seasonality effect (Q4 bump)
    seasonality = 1.15 if o_date_dt.month in [10, 11, 12] else 1.0
    
    discount = round(random.choice([0.0, 0.05, 0.10, 0.15, 0.20]), 2)
    gross = qty * unit_price * seasonality
    revenue = round(gross * (1.0 - discount), 2)
    cost = round(qty * unit_cost, 2)
    profit = round(revenue - cost, 2)
    sales_target = round(revenue * random.uniform(0.9, 1.15), 2)
    
    orders.append({
        "order_id": order_id,
        "order_date": order_date,
        "customer_id": cust_id,
        "product_id": prod_id,
        "region_id": reg_id,
        "sales_rep_id": rep_id,
        "quantity": qty,
        "unit_price": unit_price,
        "discount": discount,
        "revenue": revenue,
        "cost": cost,
        "profit": profit,
        "sales_target": sales_target
    })

df_sales = pd.DataFrame(orders)
# Sort by order_date
df_sales.sort_values("order_date", inplace=True)
df_sales.to_csv(os.path.join(RAW_DIR, "sales.csv"), index=False)
print(f"Generated {len(df_sales)} Sales order records.")

# ----------------------------------------------------
# 6. OPERATIONS
# ----------------------------------------------------
ops = []
for i, row in df_sales.iterrows():
    ord_id = row["order_id"]
    reg_id = row["region_id"]
    
    proc_time = round(random.uniform(0.5, 4.0), 1)  # hours
    fulf_time = round(random.uniform(1.0, 8.0), 1)  # hours
    deliv_time = round(random.uniform(1.0, 7.0), 1)  # days
    
    inv_level = random.randint(100, 2000)
    inv_turnover = round(random.uniform(4.0, 14.0), 2)
    
    sla_target = 5.0  # target 5 days total delivery
    total_fulfillment_days = (proc_time/24.0) + (fulf_time/24.0) + deliv_time
    sla_actual = round(total_fulfillment_days, 1)
    
    sla_status = "Met" if sla_actual <= sla_target else "Breached"
    
    ops.append({
        "operation_id": f"OPS-{i+1:06d}",
        "order_id": ord_id,
        "processing_time": proc_time,
        "fulfillment_time": fulf_time,
        "delivery_time": deliv_time,
        "inventory_level": inv_level,
        "inventory_turnover": inv_turnover,
        "sla_target": sla_target,
        "sla_actual": sla_actual,
        "sla_status": sla_status
    })
df_ops = pd.DataFrame(ops)
df_ops.to_csv(os.path.join(RAW_DIR, "operations.csv"), index=False)
print(f"Generated {len(df_ops)} Operations records.")

# ----------------------------------------------------
# 7. MARKETING
# ----------------------------------------------------
channels = ["Google Ads", "LinkedIn Ads", "Email Campaigns", "SEO Content", "Events & Webinars", "Partner Referrals"]
marketing = []

dates = pd.date_range(start="2023-01-01", end="2025-12-31", freq="D")
camp_id_cnt = 1

for d in dates:
    d_str = d.strftime("%Y-%m-%d")
    # 2 to 4 campaigns per day
    for ch in random.sample(channels, random.randint(2, 4)):
        camp_id = f"CAMP-{camp_id_cnt:05d}"
        camp_id_cnt += 1
        
        cost = round(random.uniform(300, 3500), 2)
        impressions = random.randint(5000, 100000)
        clicks = int(impressions * random.uniform(0.02, 0.08))
        leads = int(clicks * random.uniform(0.05, 0.20))
        conversions = int(leads * random.uniform(0.10, 0.40))
        cust_acq = max(1, int(conversions * random.uniform(0.6, 1.0)))
        
        # Revenue generated correlated with customers acquired & cost
        rev_gen = round(cust_acq * random.uniform(800, 4500), 2)
        
        marketing.append({
            "campaign_id": camp_id,
            "campaign_name": f"{ch} Campaign {d_str}",
            "campaign_date": d_str,
            "channel": ch,
            "campaign_cost": cost,
            "impressions": impressions,
            "clicks": clicks,
            "leads": leads,
            "conversions": conversions,
            "customers_acquired": cust_acq,
            "revenue_generated": rev_gen
        })

df_mkt = pd.DataFrame(marketing)
df_mkt.to_csv(os.path.join(RAW_DIR, "marketing.csv"), index=False)
print(f"Generated {len(df_mkt)} Marketing campaign records.")

# ----------------------------------------------------
# 8. FINANCE (DAILY FINANCIAL SUMMARY)
# ----------------------------------------------------
# Aggregate daily sales revenue to form realistic finance metrics
daily_sales = df_sales.groupby("order_date")[["revenue", "profit"]].sum().reset_index()

finance = []
for i, row in daily_sales.iterrows():
    t_date = row["order_date"]
    rev = round(float(row["revenue"]), 2)
    s_profit = round(float(row["profit"]), 2)
    
    # Financial expenses
    op_exp = round(rev * random.uniform(0.25, 0.40), 2)
    mkt_exp = round(rev * random.uniform(0.10, 0.20), 2)
    pay_exp = round(rev * random.uniform(0.20, 0.35), 2)
    
    total_exp = op_exp + mkt_exp + pay_exp
    operating_profit = round(rev - total_exp, 2)
    cash_flow = round(operating_profit * random.uniform(0.85, 1.15), 2)
    budget = round(rev * random.uniform(0.95, 1.10), 2)
    
    finance.append({
        "transaction_id": f"FIN-{i+1:05d}",
        "transaction_date": t_date,
        "revenue": rev,
        "operating_expense": op_exp,
        "marketing_expense": mkt_exp,
        "payroll_expense": pay_exp,
        "operating_profit": operating_profit,
        "cash_flow": cash_flow,
        "budget": budget
    })

df_fin = pd.DataFrame(finance)
df_fin.to_csv(os.path.join(RAW_DIR, "finance.csv"), index=False)
print(f"Generated {len(df_fin)} Finance daily records.")

# Copy sample data
for fname in ["regions.csv", "products.csv", "customers.csv", "hr.csv", "sales.csv", "operations.csv", "marketing.csv", "finance.csv"]:
    df = pd.read_csv(os.path.join(RAW_DIR, fname))
    df.head(100).to_csv(os.path.join(SAMPLE_DIR, f"sample_{fname}"), index=False)

print("DATA GENERATION COMPLETE! All 8 core CSV datasets created successfully.")
