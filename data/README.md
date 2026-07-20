# Enterprise Data Warehousing & Analytical Data Sources

This directory contains data source specifications, public benchmark dataset documentation, dimensional data modeling schemas, and the synthetic enterprise dataset generation script used across the Business Intelligence (BI) Dashboards platform.

---

## 1. Primary Analytical Benchmark Datasets

The ETL and BI reporting framework leverages three benchmark domain datasets:

1. **Sample Superstore Dataset**  
   - **Focus**: Transactional sales data, customer segmentation, product categories, geographic regions, discounts, revenue, and profit margins.  
   - **Reference Link**: [Kaggle - Sample Superstore Dataset](https://www.kaggle.com/datasets/vivek468/superstore-dataset-final)

2. **IBM HR Analytics Employee Attrition & Performance Dataset**  
   - **Focus**: Organizational workforce demographics, job roles, monthly income, job satisfaction ratings, performance metrics, and employee attrition trends.  
   - **Reference Link**: [Kaggle - IBM HR Analytics Dataset](https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset)

3. **Marketing Campaign Performance Dataset**  
   - **Focus**: Omnichannel marketing campaigns, acquisition cost (CAC), customer lifetime value (LTV), conversion rates, return on investment (ROI), and channel effectiveness.  
   - **Reference Link**: [Kaggle - Marketing Campaign Dataset](https://www.kaggle.com/datasets/guelmaniloubna/marketing-campaign-dataset)

---

## 2. Kimball Star-Schema Dimensional Data Model

To ensure optimal query performance, 100% metric consistency, and seamless slice-and-dike analysis in Power BI, data is structured in a **Kimball Star Schema**:

```text
                     +-------------------+
                     |    Dim_Customer   |
                     +-------------------+
                               | 1
                               |
                               | *
+-----------------+  * +-------------------+ *  +-----------------+
|    Dim_Product  |----|     Fact_Sales    |----|    Dim_Region   |
+-----------------+    +-------------------+    +-----------------+
                               | *
                               |
                               | 1
                     +-------------------+
                     |      Dim_Date     |
                     +-------------------+
                               | 1
                               |
                               | *
                     +-------------------+
                     |    Fact_Finance   |
                     +-------------------+
```

### Fact Tables
* **`Fact_Sales`**: Transaction_ID, Date_ID, Customer_ID, Product_ID, Region_ID, Employee_ID, Sales_Revenue, Discount_Rate, Net_Profit, Margin_Pct.
* **`Fact_Finance`**: Financial_ID, Date_ID, Region_ID, Operating_Cost, Gross_Revenue, Net_Income, Customer_Acquisition_Cost (CAC), Customer_Lifetime_Value (LTV).
* **`Fact_Operations`**: Fulfillment_ID, Order_Date_ID, Ship_Date_ID, Region_ID, Order_Volume, Fulfillment_Days, SLA_Met_Flag, Defect_Rate.

### Dimension Tables
* **`Dim_Customer`**: Customer_ID, Customer_Name, Customer_Segment (*High-Value Enterprise, Mid-Market Growth, SMB Standard, Government*), Region_Name.
* **`Dim_Product`**: Product_ID, Category (*Enterprise Software, Cloud Infrastructure, Consulting Services, Hardware Solutions, SLA Support*), SubCategory, Unit_Price, Cost_Price.
* **`Dim_Region`**: Region_ID, Region_Name (*North America, Europe, Asia Pacific, Latin America, Middle East*), Country, Market_Zone.
* **`Dim_Date`**: Date_ID, Date, Year, Quarter, Month, Month_Name, Day_Of_Week, Is_Weekend.
* **`Dim_Employee`**: Employee_ID, Employee_Name, Department (*Sales, Engineering, Marketing, HR, Operations*), Job_Role, Satisfaction_Score (1-5).

---

## 3. Synthetic Data Generator

To execute local EDA and generate analytical visual assets without exposing confidential institutional data, run the provided generator script:

```bash
python src/generate_charts.py
```

This will produce structured sample transactional datasets (10,000+ records) and output all chart visualizations and mockups directly into `/results`.
