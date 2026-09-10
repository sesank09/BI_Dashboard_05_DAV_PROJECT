import io
import pandas as pd
from sqlalchemy.orm import Session
from app.database.schema import FactSales, FactFinance, FactHR, FactMarketing, FactOperations

class ReportExporter:
    def __init__(self, db: Session):
        self.db = db

    def export_to_csv(self, dataset: str) -> str:
        df = self._get_dataframe(dataset)
        return df.to_csv(index=False)

    def export_to_excel(self, dataset: str) -> bytes:
        df = self._get_dataframe(dataset)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name=dataset.capitalize())
        return output.getvalue()

    def export_to_pdf(self, dataset: str) -> bytes:
        df = self._get_dataframe(dataset).head(50)
        output = io.BytesIO()
        try:
            from reportlab.lib.pagesizes import letter
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib import colors

            doc = SimpleDocTemplate(output, pagesize=letter)
            elements = []
            styles = getSampleStyleSheet()

            title_style = ParagraphStyle(
                'TitleStyle',
                parent=styles['Heading1'],
                fontSize=18,
                textColor=colors.HexColor('#123A6D'),
                spaceAfter=12
            )
            elements.append(Paragraph(f"Executive BI Performance Report - {dataset.upper()}", title_style))
            elements.append(Spacer(1, 10))

            headers = list(df.columns[:6])
            data_rows = [headers]
            for _, row in df.iterrows():
                data_rows.append([str(row[col]) for col in headers])

            t = Table(data_rows)
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#123A6D')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
                ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F8FAFC')),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1'))
            ]))
            elements.append(t)
            doc.build(elements)
            return output.getvalue()
        except Exception:
            # Fallback text if pdf rendering fails
            return f"PDF Report for {dataset}\nRecord Count: {len(df)}\n".encode('utf-8')

    def _get_dataframe(self, dataset: str) -> pd.DataFrame:
        mapping = {
            "sales": FactSales,
            "finance": FactFinance,
            "hr": FactHR,
            "marketing": FactMarketing,
            "operations": FactOperations
        }
        model = mapping.get(dataset.lower(), FactSales)
        return pd.read_sql(self.db.query(model).statement, self.db.bind)
