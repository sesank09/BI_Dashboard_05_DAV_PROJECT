# ACDIE Sample Test Datasets for Dynamic Verification

This directory contains pre-configured test scenario datasets created specifically so you can test and verify that uploading new CSV files dynamically transforms all metrics, charts, ML forecasts, and decisions in real time across the entire platform.

---

## 📁 Available Test Datasets

### 1. `scenario_1_high_growth_sales.csv` (Target: Sales Data / `sales_data.csv`)
- **Scenario Description**: High-velocity revenue surge with high unit prices (₹4k–₹35k) and low discount rates.
- **Expected Impact Upon Upload**:
  - **Executive Dashboard**: Total Revenue and Net Profit will jump significantly into high multi-crore figures.
  - **Forecasting (ML Intelligence)**: 30-day revenue trajectory forecast shifts upward with higher slope.
  - **Cross-Functional Fusion**: Marketing ROI and Sales Efficiency indicators turn emerald green.

---

### 2. `scenario_2_market_recession_sales.csv` (Target: Sales Data / `sales_data.csv`)
- **Scenario Description**: Market contraction and aggressive price slashing with discount rates up to 40% and lower order sizes.
- **Expected Impact Upon Upload**:
  - **Executive Dashboard**: Total Revenue and Net Profit margin contract.
  - **Anomalies Page**: Automated Business Impact Anomaly Detector flags multiple severe margin erosion warnings.
  - **Traceable Insights**: Generates automated strategic recommendations to rein in excessive discount leakage.

---

### 3. `scenario_3_aggressive_marketing.csv` (Target: Marketing Data / `marketing_data.csv`)
- **Scenario Description**: High-budget multi-channel acquisition campaigns across Google Ads, LinkedIn B2B, and Meta.
- **Expected Impact Upon Upload**:
  - **Marketing Dashboard**: Drastic increase in leads generated and campaign attribution.
  - **Cross-Functional Page**: Marketing ➔ Sales lead conversion rates update dynamically.
  - **Decision Simulator**: Baseline CAC and elasticity curves adjust to higher marketing velocity.

---

### 4. `scenario_4_supply_chain_disruption_operations.csv` (Target: Operations Data / `operations_data.csv`)
- **Scenario Description**: Logistics bottleneck across carrier partners causing delayed fulfillment and low customer satisfaction.
- **Expected Impact Upon Upload**:
  - **Operations Dashboard**: On-Time SLA metric drops sharply (e.g. from 95% down to ~65%).
  - **Anomaly Propagation Chain**: Cross-Functional engine displays a red disruption chain showing how shipping delays impact customer retention.
  - **Traceable Insights**: Triggers urgent operational corrective action alerts.

---

### 5. `scenario_5_workforce_expansion_hr.csv` (Target: HR Data / `hr_data.csv`)
- **Scenario Description**: 200 high-performing team members across Sales, Engineering, and Operations with 95%+ productivity indices.
- **Expected Impact Upon Upload**:
  - **HR Dashboard**: Average workforce productivity and employee performance scores increase.
  - **Executive Dashboard**: Workforce Productivity KPI card updates.
  - **Decision Simulator**: Headcount elasticity and capacity metrics scale upward.

---

## 🚀 How to Test in the Application (Step-by-Step)

### Option A: Uploading via the Web UI (Recommended)
1. In the sidebar, navigate to **Data Pipeline** (`/data-management`).
2. Click **Choose File** and select any file from this `sample_upload_csvs/` folder.
3. Select the target table (e.g. select **Sales Data** when uploading `scenario_1_high_growth_sales.csv`).
4. Click **Validate File** to preview the schema, row counts, and data types.
5. Click **Process & Load to Warehouse** (or 1-Click Fast Ingest).
6. Navigate to **Executive BI**, **ML & Model Registry**, or **Cross-Functional** to watch all graphs, metrics, and forecasts dynamically adapt to your new data!

### Option B: 1-Click Preset Switching in the UI
On the `/data-management` page, you can also use the **Quick Scenario Switcher** buttons to instantly apply any of these test datasets with one click.
