# ACDIE Demonstration Datasets

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
