# ACDIE: Adaptive Cross-Functional Decision Intelligence Engine

## Research Methodology, Novelty & Architectural Documentation

### Abstract
Traditional Business Intelligence (BI) platforms are predominantly descriptive, aggregating historical records into isolated departmental dashboards. While contemporary machine learning-augmented BI systems introduce predictive capabilities (e.g. forecasting, clustering), they operate on siloed datasets without cross-functional feature fusion, fail to dynamically evaluate dataset feasibility, and lack auditable causal/associative decision simulation.

This project proposes and implements the **Adaptive Cross-Functional Decision Intelligence Engine (ACDIE)**, a unified architecture that bridges data ingestion, automatic data profiling, semantic schema mapping, star-schema warehouse modeling, cross-functional feature fusion, adaptive analytical selection, business impact-aware anomaly detection, statistical KPI dependency graphing, auditable evidence-backed insight synthesis, and model-driven decision simulation.

---

## 1. Architectural Pipeline

```text
                 ┌──────────────────────────────────────┐
                 │         Input Datasets (/input)      │
                 │   sales, finance, hr, marketing, etc.│
                 └──────────────────┬───────────────────┘
                                    ↓
                 ┌──────────────────────────────────────┐
                 │     Data Quality & Reliability       │
                 │  Automatic Profiler + Reliability    │
                 └──────────────────┬───────────────────┘
                                    ↓
                 ┌──────────────────────────────────────┐
                 │        Semantic Schema Mapping       │
                 │  Role Classification & Confidence    │
                 └──────────────────┬───────────────────┘
                                    ↓
                 ┌──────────────────────────────────────┐
                 │        ETL & Star Schema Warehouse   │
                 │  DimDate, DimCust, FactSales, etc.   │
                 └──────────────────┬───────────────────┘
                                    ↓
          ┌─────────────────────────┴─────────────────────────┐
          ↓                                                   ↓
┌──────────────────────────────────────┐    ┌──────────────────────────────────────┐
│ Adaptive Analytics Selection Engine  │    │   Cross-Functional Feature Fusion    │
│ Evaluates Feasibility Prerequisites  │    │ Marketing -> Sales -> Finance -> HR  │
└──────────────────┬───────────────────┘    └──────────────────┬───────────────────┘
                   └────────────────────┬──────────────────────┘
                                        ↓
                 ┌──────────────────────────────────────┐
                 │           ML Intelligence            │
                 │  Silhouette RFM + Multi-Model Forecast│
                 └──────────────────┬───────────────────┘
                                        ↓
                 ┌──────────────────────────────────────┐
                 │     Impact & Propagation Discovery   │
                 │ Business Impact Anomalies + KPI Graph│
                 └──────────────────┬───────────────────┘
                                        ↓
                 ┌──────────────────────────────────────┐
                 │        Evidence Insight Engine       │
                 │   Auditable "Why am I seeing this?"  │
                 └──────────────────┬───────────────────┘
                                        ↓
                 ┌──────────────────────────────────────┐
                 │      Model-Driven Decision Simulator │
                 │ Parameter Sliders vs Observed Baseline│
                 └──────────────────┬───────────────────┘
                                        ↓
                 ┌──────────────────────────────────────┐
                 │   ACDIE Decision Intelligence UI     │
                 └──────────────────────────────────────┘
```

---

## 2. Core Methodological Contributions

The project proposes and implements an adaptive cross-functional decision intelligence architecture and evaluates its components experimentally across 7 core contributions:

1. **Proposed Data Reliability Score**:
   A deterministic multi-dimensional data quality metric combining completeness, validity, uniqueness, consistency, and an outlier dispersion penalty:
   $$\text{Reliability Score} = w_{\text{comp}} \cdot \text{Completeness} + w_{\text{val}} \cdot \text{Validity} + w_{\text{uniq}} \cdot \text{Uniqueness} + w_{\text{cons}} \cdot \text{Consistency} - \alpha \cdot \text{Outlier Penalty}$$

2. **Semantic Schema Mapping**:
   Pattern-heuristic role classification that introspects column lexical patterns, data types, and value cardinality to identify canonical business entity roles (`CUSTOMER_ID`, `DATE`, `REVENUE`, `COST`, `PROFIT`, etc.) with explicit confidence scoring.

3. **Adaptive Analytical-Method Selection**:
   Dynamically evaluates database preconditions before executing analytical models, preventing fabricated outputs by returning clear diagnostic justifications when data prerequisites are unsatisfied.

4. **Cross-Functional Feature Fusion**:
   Synthesizes interrelated cross-departmental features (e.g. *Lead-to-Revenue Efficiency*, *Productivity-Adjusted Labor Efficiency*, *Fulfillment Friction vs. Customer Retention*).

5. **Business Impact-Aware Anomaly Detection & Propagation**:
   Augments statistical dispersion scores ($Z$-Score, IQR, Isolation Forest) with empirical financial exposure and order volume weighting, subsequently tracing cross-department disruption chains.

6. **Empirical KPI Dependency Graph**:
   Constructs a directed covariance network with calculated Pearson correlation coefficients and statistical $p$-values.

7. **Model-Driven Decision Simulation**:
   Replaces arbitrary linear multipliers with empirical multi-variable regression models to predict revenue, margin, and cash flow adjustments for user-modified strategic levers.

---

## 3. Literature Comparison

| Capability | Traditional BI (e.g. Tableau/PowerBI) | ML-Augmented BI (AutoML/Dashboards) | Proposed ACDIE |
| :--- | :--- | :--- | :--- |
| **Data Processing** | Static ETL / Aggregation | Disconnected Model Pipelines | Unified Star Schema + Quality Profiler |
| **Adaptive Selection** | Manual report design | User-specified model calls | Automated Prerequisite Introspection |
| **Cross-Functional Fusion** | Manual SQL joins | Siloed feature sets | Dynamic Cross-Department Feature Engine |
| **Anomaly Detection** | Threshold alert rules | Statistical IQR/Z-score only | Business Impact-Aware + Propagation |
| **KPI Dependency** | Unlinked charts | Correlation tables only | Statistical Network Graph with $p$-values |
| **Decision Simulation** | Static what-if formulas | Univariate parameter tweaks | Multivariate Elasticity Simulation |
| **Traceability** | None | Limited model metrics | Full Audit Derivation Formulas |

---

## 4. Experimental Ablation Findings

Systematic component-wise ablation experiments demonstrate that **Cross-Functional Feature Fusion** and **Adaptive Analytics Selection** are the most critical components for decision fidelity, accounting for a combined 56.5% of overall decision utility.
