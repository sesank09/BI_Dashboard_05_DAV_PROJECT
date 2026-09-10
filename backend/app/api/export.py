from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.exporter import ReportExporter

router = APIRouter(prefix="/export", tags=["Export"])

@router.get("/csv")
def export_csv(dataset: str = Query("sales"), db: Session = Depends(get_db)):
    exporter = ReportExporter(db)
    csv_data = exporter.export_to_csv(dataset)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=bi_report_{dataset}.csv"}
    )

@router.get("/excel")
def export_excel(dataset: str = Query("sales"), db: Session = Depends(get_db)):
    exporter = ReportExporter(db)
    excel_bytes = exporter.export_to_excel(dataset)
    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=bi_report_{dataset}.xlsx"}
    )

@router.get("/pdf")
def export_pdf(dataset: str = Query("sales"), db: Session = Depends(get_db)):
    exporter = ReportExporter(db)
    pdf_bytes = exporter.export_to_pdf(dataset)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=bi_report_{dataset}.pdf"}
    )
