from datetime import date
from sqlalchemy import Integer, String, ForeignKey, Float, Date, Enum as SQLEnum
import enum
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class FeeStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    OVERDUE = "overdue"

class Fees(Base):
    __tablename__ = "fees"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    amount: Mapped[float] = mapped_column(Float)
    due_date: Mapped[date] = mapped_column(Date)
    status: Mapped[FeeStatus] = mapped_column(SQLEnum(FeeStatus), default=FeeStatus.PENDING)
    semester: Mapped[str] = mapped_column(String(50))
    transaction_id: Mapped[str] = mapped_column(String(100), nullable=True)
