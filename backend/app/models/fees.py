from typing import TYPE_CHECKING, List, Optional
from datetime import date, datetime
from sqlalchemy import String, ForeignKey, Float, Date, DateTime, Enum as SQLEnum
import enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.student import Student


class FeeStatus(str, enum.Enum):
    PENDING = "pending"
    PARTIAL = "partial"
    PAID = "paid"
    OVERDUE = "overdue"

class FeeType(str, enum.Enum):
    TUITION = "TUITION"
    HOSTEL = "HOSTEL"
    EXAM = "EXAM"
    LIBRARY = "LIBRARY"
    OTHER = "OTHER"

class Fees(Base):
    __tablename__ = "fees"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    fee_type: Mapped[FeeType] = mapped_column(SQLEnum(FeeType), default=FeeType.TUITION)
    amount_total: Mapped[float] = mapped_column(Float)
    amount_paid: Mapped[float] = mapped_column(Float, default=0.0)
    due_date: Mapped[date] = mapped_column(Date)
    status: Mapped[FeeStatus] = mapped_column(SQLEnum(FeeStatus), default=FeeStatus.PENDING)
    academic_year: Mapped[str] = mapped_column(String(20))
    remarks: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    student: Mapped["Student"] = relationship("Student")
    payments: Mapped[List["Payment"]] = relationship("Payment", back_populates="fee", cascade="all, delete-orphan")


class PaymentMethod(str, enum.Enum):
    CASH = "CASH"
    CARD = "CARD"
    UPI = "UPI"
    BANK_TRANSFER = "BANK_TRANSFER"

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    fee_id: Mapped[int] = mapped_column(ForeignKey("fees.id", ondelete="CASCADE"), index=True)
    amount: Mapped[float] = mapped_column(Float)
    payment_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    payment_method: Mapped[PaymentMethod] = mapped_column(SQLEnum(PaymentMethod))
    transaction_id: Mapped[Optional[str]] = mapped_column(String(100), unique=True, index=True, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="SUCCESS") # SUCCESS, FAILED, PENDING

    # Relationships
    fee: Mapped["Fees"] = relationship("Fees", back_populates="payments")
