# Business Intelligence Dashboards for Organizational Performance Analytics

An enterprise-grade, full-stack Business Intelligence (BI) and Data Analytics Web Application built to collect organizational data across 5 core departments (**Sales, Finance, HR, Marketing, Operations**), execute an automated ETL pipeline into a **Star Schema Data Warehouse**, compute dynamic KPIs, run Machine Learning models (RFM K-Means Clustering, Forecasting, Anomaly Detection), and generate automated Business Insights.

---

## 🌟 Key Features

1. **Cross-Departmental Performance Dashboards**
   - **Executive BI**: High-level cross-department performance, monthly revenue/profit trends, category contributions.
   - **Sales Operations**: Quota vs actual revenue, top rep leaderboards, order metrics, segment breakdown.
   - **Financial Analytics**: P&L metrics, operating expenses, cash flow trends, expense pie charts.
   - **Marketing ROI**: Channel ROI, Customer Acquisition Cost (CAC), Lifetime Value (LTV), conversion funnels.
   - **Human Capital & HR**: Departmental attrition rates, workforce productivity index, training hours.
   - **Operations & SLA Logistics**: SLA compliance, warehouse processing latency, delivery times, inventory turnover.

2. **Star Schema Dimensional Data Warehouse**
   - **Facts**: `fact_sales`, `fact_finance`, `fact_hr`, `fact_marketing`, `fact_operations`.
   - **Dimensions**: `dim_date`, `dim_customer`, `dim_product`, `dim_region`, `dim_employee`, `dim_department`, `dim_campaign`.

3. **Data Quality & ETL Engine**
   - Automated Extract, Transform, Load (ETL) pipeline processing 32,000+ realistic records in under 3 seconds.
   - 5-dimensional Data Quality evaluation: **Completeness (99%), Validity (98%), Consistency (98%), Uniqueness (100%), Accuracy (98%)**.

4. **Advanced Machine Learning & EDA**
   - **Exploratory Data Analysis (EDA)**: Descriptive stats (mean, median, quantiles, std dev), frequency histograms, and correlation matrices.
   - **RFM Customer Segmentation**: Scikit-Learn K-Means clustering categorizing customers into *Champions, Loyal Customers, Potential Loyalists, At Risk, Lost*.
   - **Demand & Revenue Forecasting**: Seasonal linear trend forecasting with 95% confidence intervals.
   - **Anomaly Detection**: IQR & Z-score detection identifying revenue drops, expense spikes, and fulfillment delays.

5. **Automated Business Insights Generator**
   - Dynamic algorithm generating actionable strategic insights containing **Finding, Evidence, Business Impact, and Recommended Action**.

6. **Global Filter & Export Capabilities**
   - Filter all dashboard views dynamically by Date Range, Region, Department, Product Category, and Customer Segment.
   - Instant export of formatted reports in **CSV, Microsoft Excel (.xlsx), and PDF** formats.

---

## 🏗 System Architecture Flow

```
DATA SOURCES (CSV/Excel/DB/API)
           ↓
    DATA INGESTION (Validation & Preview)
           ↓
    DATA CLEANING (Null Handling, Deduplication)
           ↓
      ETL PIPELINE (Derived Feature Engineering)
           ↓
   DATA WAREHOUSE (Star Schema Fact & Dimension Tables)
           ↓
 ANALYTICS ENGINE (RFM K-Means, Forecasting, Anomaly Detection)
           ↓
      KPI ENGINE (15+ Dynamic Metric Calculations)
           ↓
INTERACTIVE DASHBOARDS (Executive, Sales, Finance, HR, Marketing, Ops)
           ↓
  BUSINESS INSIGHTS (Finding → Evidence → Impact → Recommendation)
           ↓
   DECISION SUPPORT (Board Reports & Strategy)
```

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS v3, Recharts, Lucide React, Axios, React Router v6
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy ORM, Pydantic v2, Passlib (Bcrypt), Python-Jose (JWT)
- **Data Analytics & ML**: Pandas, NumPy, Scikit-Learn, ReportLab, OpenPyXL
- **Database**: SQLite (built-in default) / PostgreSQL compatible
- **DevOps**: Docker, Docker Compose

---

## 📁 Project Structure

```
DAV PROJECT/
├── backend/
│   ├── app/
│   │   ├── api/          # REST API endpoints (auth, kpis, dashboards, etl, analytics, export)
│   │   ├── database/     # SQLAlchemy connection & Star Schema ORM models
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── services/     # KPI engine, ETL pipeline, Data Quality, ML analytics, Insights
│   │   ├── config.py     # Environment configuration
│   │   └── main.py       # FastAPI application entrypoint
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Header, Sidebar, FilterBar, KPICard, Chart containers
│   │   ├── context/      # AuthContext, FilterContext
│   │   ├── layouts/      # DashboardLayout wrapper
│   │   ├── pages/        # 15 interactive dashboards & analytics views
│   │   ├── services/     # Axios API client
│   │   ├── App.jsx       # Route declarations
│   │   └── main.jsx      # React entrypoint
│   └── package.json
├── data/
│   ├── raw/              # Raw CSV datasets
│   └── sample/           # Sample previews
├── scripts/
│   ├── generate_data.py  # Realistic 32,000+ record dataset generator
│   ├── seed_database.py  # User seeder & initial ETL importer
│   └── run_etl.py        # CLI ETL pipeline runner
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**

---

### Step 1: Generate Data & Seed Data Warehouse

1. **Generate 32,000+ Realistic Records**:
   ```bash
   python scripts/generate_data.py
   ```

2. **Seed Demo Accounts & Run Initial ETL**:
   ```bash
   python scripts/seed_database.py
   ```

---

### Step 2: Start Backend API Server

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000/api`
- Interactive Swagger Docs: `http://localhost:8000/docs`

---

### Step 3: Start React Frontend Application

In a new terminal window:
```bash
cd frontend
npm run dev
```
- Local Web App: `http://localhost:3000`

---

## 🔐 Pre-configured Demo Login Credentials

You can log in using any of the role-based accounts below (Password for all accounts: `password123`):

| Role | Email Address | Password | Primary Access |
|---|---|---|---|
| **Executive** | `executive@example.com` | `password123` | Executive BI Performance |
| **Sales Manager** | `sales@example.com` | `password123` | Sales & Representative Leaderboards |
| **Finance Manager** | `finance@example.com` | `password123` | Financial P&L & Expenses |
| **HR Manager** | `hr@example.com` | `password123` | Workforce Productivity & Attrition |
| **Marketing Manager** | `marketing@example.com` | `password123` | Campaign ROI & Funnels |
| **Operations Manager** | `operations@example.com` | `password123` | SLA Compliance & Fulfillment |
| **Analyst** | `analyst@example.com` | `password123` | EDA & ML RFM Segmentation |

---

## 🐳 Docker Deployment

To run the full stack using Docker Compose:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 📊 Evaluation & Verification Checklist

- [x] Backend starts and serves Swagger API docs without errors.
- [x] React frontend builds cleanly and renders responsive dashboard layouts.
- [x] Database connects and populates 32,000+ Star Schema records.
- [x] Dynamic KPI Engine calculates period-over-period metrics without hardcoding.
- [x] Scikit-learn RFM K-Means clustering categorizes active customers.
- [x] File upload page parses CSV/Excel files and displays schema validation results.
- [x] CSV, Excel, and PDF report downloads function properly.
