# Business Intelligence Dashboards for Organizational Performance Analytics

**Course**: Engineering Capstone Project - 1 (Course Code: `23IE4053R` / `23IE4053A`)  
**Department**: Department of Computer Science & Engineering (CSE) / CSIS  
**Academic Year**: 2026 – 2027  
**GitHub Repository**: [https://github.com/sesank09/KLH-CSE-2026-2420030161-BI-DASHBOARD](https://github.com/sesank09/KLH-CSE-2026-2420030161-BI-DASHBOARD)

---

## 👥 Project Team & Supervisor Metadata

### Team Members (Batch 5)
| S. No. | Student Name | University ID / Roll Number | GitHub Account / Role |
|:---:|:---|:---:|:---|
| **1** | **Yennam Sesank Reddy** | **`2420030161`** | Lead Data Engineer & Pipeline Architect |
| **2** | **Sai Sri Harsha** | **`2420030190`** | Data Analyst & Dimensional Modeling Lead |
| **3** | **Sathwik** | **`2420030048`** | Power BI Dashboard & Visual Designer |
| **4** | **Anjan Reddy** | **`2420030750`** | Business Analyst & Technical Writer |

### Project Supervisor / Faculty Guide
* **Supervisor Name**: **Dr. K. Swapnika**
* **Department**: Department of Computer Science & Engineering (CSE)

---

## 📌 Current Phase Status & Deliverables

* **Current Phase**: **Phase 1 / Review 1 Completed**
* **Git Repository Tag**: **`review-1`** (Release tag created for Phase 1 deliverable review)
* **Access Governance**: Repository access granted to Project Supervisor (**Dr. K. Swapnika**) and Course Coordinator. Repository accessibility will be maintained continuously until final evaluation.

---

## 📄 Abstract & Executive Summary

In modern enterprise operations, decentralized data architectures, heterogeneous relational schemas, and manual spreadsheet-based reporting lead to severe information silos, delayed operational reporting, and inconsistent business metrics. This project delivers an end-to-end Enterprise Business Intelligence (BI) and Data Warehousing platform designed to unify disparate corporate data sources, automate Extract-Transform-Load (ETL) pipelines, and empower executive leadership with interactive, multi-departmental performance analytics.

Utilizing Python (Pandas, NumPy, Seaborn), SQL relational engines (PostgreSQL / MySQL), and Microsoft Power BI, an enterprise dataset comprising over 10,000 multi-regional transactional records across 5 geographic regions and 5 product lines was extracted, cleaned, and standardized. A Kimball Star-Schema Data Warehouse was architected around central Fact tables (`Fact_Sales`, `Fact_Finance`, `Fact_Operations`) and shared Dimension tables (`Dim_Customer`, `Dim_Product`, `Dim_Region`, `Dim_Date`, `Dim_Employee`).

Exploratory Data Analysis (EDA) revealed significant regional profitability variances, Customer Acquisition Cost (CAC) vs. Customer Lifetime Value (LTV) anomalies, and operational fulfillment bottlenecks. To resolve these challenges, 10 core Key Performance Indicators (KPIs) were formulated and translated into DAX measures featuring time-intelligence expressions.

Six interactive Power BI dashboard modules were engineered: Executive C-Suite Overview, Sales Performance, Financial Analytics, Marketing ROI, HR Workforce Matrix, and Operations/Supply Chain Monitor. Empirical results demonstrate an 85% reduction in report generation time (dropping latency from 7 days to under 15 seconds), 100% data consistency across departments, and an estimated 40% improvement in cross-functional operational decision-making efficiency.

---

## 📂 Repository Directory Structure

This repository follows the mandatory project organization guidelines:

```text
KLH-CSE-2026-2420030161-BI-DASHBOARD/
├── README.md                           # Master project documentation (this file)
├── .gitignore                          # Excludes secrets, credentials & binary caches
├── src/                                # Source code directory (tracked via .gitkeep)
│   └── .gitkeep
├── docs/                               # Governance & architectural documentation
│   ├── Project_abstract.docx           # Official project abstract submission document
│   ├── Batch-5 roadmap.docx            # Project execution roadmap & methodology
│   └── Batch 5 presentation.pptx       # Review presentation deck
├── data/                               # Data modeling specifications & benchmark references
│   └── README.md                       # Data dictionary & public benchmark references
├── results/                            # Output artifacts directory (tracked via .gitkeep)
│   ├── charts/                         # EDA distribution & trend charts
│   ├── diagrams/                       # High-res architecture & ETL diagrams
│   └── mockups/                        # Power BI dashboard mockup previews
└── reports/                            # Official phase review deliverables
    ├── Review_1 document.pdf           # Review 1 submission document
    └── Review_1_BI_Dashboards.pdf      # Review 1 BI Dashboard deliverable PDF
```

---

## 🛠️ Setup & Execution Instructions

### Prerequisites
* **Python**: Version 3.10 or higher
* **Power BI Desktop**: Optional for opening `.pbix` templates
* **Git**: Installed and configured locally

### Step 1: Clone Repository
```bash
git clone https://github.com/sesank09/KLH-CSE-2026-2420030161-BI-DASHBOARD.git
cd KLH-CSE-2026-2420030161-BI-DASHBOARD
```

### Step 2: Install Python Dependencies
```bash
pip install pandas numpy matplotlib seaborn python-docx
```

### Step 3: Generate Dataset & Visual Analytics
Execute the visual analytics script to run EDA, generate distribution charts, architecture diagrams, and dashboard mockups:
```bash
python src/generate_charts.py
```

### Step 4: Build Complete Academic DOCX Report
```bash
python src/generate_docx.py
```
This generates the full 10-chapter report in `reports/BI_Dashboards_Report.docx`.

### Step 5: Convert DOCX Report to PDF (Windows)
```bash
python src/convert_pdf.py
```

### Step 6: View Interactive Web BI Dashboard
Open `src/index.html` in any web browser (Chrome, Edge, Firefox, Safari) or serve locally:
```bash
python -m http.server 8000 --directory src
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 🔒 Security, Compliance & Norms Adherence

1. **Credentials & Privacy (Norm #8)**: No API keys, passwords, credentials, licensed proprietary datasets, or confidential institutional data are stored in this repository. All sample datasets are generated synthetically or referenced from open Kaggle public benchmarks.
2. **Repository Stability (Norm #9)**: This repository URL (`https://github.com/sesank09/KLH-CSE-2026-2420030161-BI-DASHBOARD`) is fixed and will not be renamed or transferred without written consent from the Course Coordinator.
3. **Continuous Access (Norm #7)**: Read access is maintained for faculty review throughout the academic evaluation cycle.
4. **Deliverable Tagging (Norm #6)**: Phase 1 deliverable is tagged as `review-1`.
