import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.database.connection import Base

# ----------------------------------------------------
# USER AUTHENTICATION & ROLES
# ----------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # Executive, Sales Manager, Finance Manager, HR Manager, Marketing Manager, Operations Manager, Analyst
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# ----------------------------------------------------
# DIMENSION TABLES
# ----------------------------------------------------
class DimDate(Base):
    __tablename__ = "dim_date"

    date_key = Column(Integer, primary_key=True, index=True)
    full_date = Column(String, unique=True, index=True, nullable=False)
    year = Column(Integer, nullable=False)
    quarter = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)
    month_name = Column(String, nullable=False)
    day = Column(Integer, nullable=False)
    day_of_week = Column(String, nullable=False)
    is_weekend = Column(Boolean, default=False)

class DimCustomer(Base):
    __tablename__ = "dim_customer"

    customer_id = Column(String, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_segment = Column(String, nullable=False)
    region = Column(String, nullable=False)
    acquisition_date = Column(String, nullable=False)
    purchase_frequency = Column(Float, nullable=False)
    average_order_value = Column(Float, nullable=False)
    lifetime_value = Column(Float, nullable=False)
    retention_status = Column(String, nullable=False)

class DimProduct(Base):
    __tablename__ = "dim_product"

    product_id = Column(String, primary_key=True, index=True)
    product_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    unit_cost = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)

class DimRegion(Base):
    __tablename__ = "dim_region"

    region_id = Column(String, primary_key=True, index=True)
    region_name = Column(String, nullable=False)
    country = Column(String, nullable=False)

class DimEmployee(Base):
    __tablename__ = "dim_employee"

    employee_id = Column(String, primary_key=True, index=True)
    employee_name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    region = Column(String, nullable=False)
    joining_date = Column(String, nullable=False)
    performance_score = Column(Float, nullable=False)
    attendance_rate = Column(Float, nullable=False)
    training_hours = Column(Float, nullable=False)
    productivity_score = Column(Float, nullable=False)
    attrition_status = Column(String, nullable=False)

class DimCampaign(Base):
    __tablename__ = "dim_campaign"

    campaign_id = Column(String, primary_key=True, index=True)
    campaign_name = Column(String, nullable=False)
    channel = Column(String, nullable=False)

# ----------------------------------------------------
# FACT TABLES
# ----------------------------------------------------
class FactSales(Base):
    __tablename__ = "fact_sales"

    sale_id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String, index=True, nullable=False)
    order_date = Column(String, index=True, nullable=False)
    customer_id = Column(String, ForeignKey("dim_customer.customer_id"), nullable=False)
    product_id = Column(String, ForeignKey("dim_product.product_id"), nullable=False)
    region_id = Column(String, ForeignKey("dim_region.region_id"), nullable=False)
    sales_rep_id = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    discount = Column(Float, nullable=False)
    revenue = Column(Float, nullable=False)
    cost = Column(Float, nullable=False)
    profit = Column(Float, nullable=False)
    sales_target = Column(Float, nullable=False)

class FactFinance(Base):
    __tablename__ = "fact_finance"

    finance_id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_id = Column(String, index=True, nullable=False)
    transaction_date = Column(String, index=True, nullable=False)
    revenue = Column(Float, nullable=False)
    operating_expense = Column(Float, nullable=False)
    marketing_expense = Column(Float, nullable=False)
    payroll_expense = Column(Float, nullable=False)
    operating_profit = Column(Float, nullable=False)
    cash_flow = Column(Float, nullable=False)
    budget = Column(Float, nullable=False)

class FactHR(Base):
    __tablename__ = "fact_hr"

    hr_id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(String, ForeignKey("dim_employee.employee_id"), nullable=False)
    department = Column(String, nullable=False)
    region = Column(String, nullable=False)
    joining_date = Column(String, nullable=False)
    performance_score = Column(Float, nullable=False)
    attendance_rate = Column(Float, nullable=False)
    training_hours = Column(Float, nullable=False)
    productivity_score = Column(Float, nullable=False)
    attrition_status = Column(String, nullable=False)

class FactMarketing(Base):
    __tablename__ = "fact_marketing"

    marketing_id = Column(Integer, primary_key=True, autoincrement=True)
    campaign_id = Column(String, ForeignKey("dim_campaign.campaign_id"), nullable=False)
    campaign_date = Column(String, index=True, nullable=False)
    channel = Column(String, nullable=False)
    campaign_cost = Column(Float, nullable=False)
    impressions = Column(Integer, nullable=False)
    clicks = Column(Integer, nullable=False)
    leads = Column(Integer, nullable=False)
    conversions = Column(Integer, nullable=False)
    customers_acquired = Column(Integer, nullable=False)
    revenue_generated = Column(Float, nullable=False)

class FactOperations(Base):
    __tablename__ = "fact_operations"

    ops_id = Column(Integer, primary_key=True, autoincrement=True)
    operation_id = Column(String, index=True, nullable=False)
    order_id = Column(String, index=True, nullable=False)
    processing_time = Column(Float, nullable=False)
    fulfillment_time = Column(Float, nullable=False)
    delivery_time = Column(Float, nullable=False)
    inventory_level = Column(Integer, nullable=False)
    inventory_turnover = Column(Float, nullable=False)
    sla_target = Column(Float, nullable=False)
    sla_actual = Column(Float, nullable=False)
    sla_status = Column(String, nullable=False)

# ----------------------------------------------------
# SYSTEM & ETL LOGS
# ----------------------------------------------------
class ETLLog(Base):
    __tablename__ = "etl_logs"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    run_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    records_extracted = Column(Integer, default=0)
    records_transformed = Column(Integer, default=0)
    records_loaded = Column(Integer, default=0)
    failed_records = Column(Integer, default=0)
    processing_time_sec = Column(Float, default=0.0)
    quality_score = Column(Float, default=100.0)
    status = Column(String, default="SUCCESS")
    error_message = Column(Text, nullable=True)

class DataQualityLog(Base):
    __tablename__ = "data_quality_logs"

    dq_id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    overall_score = Column(Float, nullable=False)
    completeness = Column(Float, nullable=False)
    validity = Column(Float, nullable=False)
    consistency = Column(Float, nullable=False)
    uniqueness = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=False)
    details_json = Column(Text, nullable=True)
