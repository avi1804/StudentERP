from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database.base import Base

class FeeStatus(str, enum.Enum):
    PENDING = "PENDING"
    PARTIAL = "PARTIAL"
    PAID = "PAID"
    OVERDUE = "OVERDUE"

class PaymentMode(str, enum.Enum):
    CASH = "CASH"
    UPI = "UPI"
    CARD = "CARD"
    BANK = "BANK"
    CHEQUE = "CHEQUE"

class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"

class DiscountType(str, enum.Enum):
    FLAT = "FLAT"
    PERCENTAGE = "PERCENTAGE"


class FeeStructure(Base):
    """Template for defining fees for a specific academic year, department, and semester."""
    __tablename__ = "fee_structures"

    id = Column(Integer, primary_key=True, index=True)
    academic_year = Column(String(20), nullable=False) # e.g. "2024-2025"
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)
    semester = Column(Integer, nullable=False)
    category = Column(String(50), nullable=False) # e.g. "General", "Management Quota"
    
    # Detailed Fee Breakdown
    tuition_fee = Column(Float, default=0.0)
    exam_fee = Column(Float, default=0.0)
    library_fee = Column(Float, default=0.0)
    sports_fee = Column(Float, default=0.0)
    development_fee = Column(Float, default=0.0)
    laboratory_fee = Column(Float, default=0.0)
    hostel_fee = Column(Float, default=0.0)
    bus_fee = Column(Float, default=0.0)
    miscellaneous_fee = Column(Float, default=0.0)
    gst = Column(Float, default=0.0)
    
    total_amount = Column(Float, nullable=False)
    
    scholarship_allowed = Column(Boolean, default=True)
    installments_allowed = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    department = relationship("Department", backref="fee_structures")
    student_fees = relationship("StudentFee", back_populates="fee_structure", cascade="all, delete-orphan")


class Scholarship(Base):
    __tablename__ = "fee_scholarships"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    percentage = Column(Float, nullable=True) # Percentage discount on total fee
    amount = Column(Float, nullable=True)     # Flat amount discount
    eligibility_criteria = Column(String(255), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="CASCADE"), nullable=True)
    semester = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    department = relationship("Department")


class Discount(Base):
    __tablename__ = "fee_discounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    discount_type = Column(Enum(DiscountType), nullable=False)
    value = Column(Float, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class FineRule(Base):
    __tablename__ = "fee_fine_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    daily_fine = Column(Float, default=0.0)
    weekly_fine = Column(Float, default=0.0)
    max_fine = Column(Float, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class StudentFee(Base):
    """Specific generated bill for a student based on a FeeStructure."""
    __tablename__ = "fee_student_fees"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    fee_structure_id = Column(Integer, ForeignKey("fee_structures.id", ondelete="CASCADE"), nullable=False)
    
    total_fee = Column(Float, nullable=False) # Based on FeeStructure total_amount
    paid_amount = Column(Float, default=0.0)
    pending_amount = Column(Float, nullable=False) # total_fee - paid_amount - scholarship - discount + fine
    
    due_date = Column(Date, nullable=False)
    status = Column(Enum(FeeStatus), default=FeeStatus.PENDING)
    
    scholarship_id = Column(Integer, ForeignKey("fee_scholarships.id", ondelete="SET NULL"), nullable=True)
    scholarship_amount = Column(Float, default=0.0)
    
    discount_id = Column(Integer, ForeignKey("fee_discounts.id", ondelete="SET NULL"), nullable=True)
    discount_amount = Column(Float, default=0.0)
    
    fine_amount = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    student = relationship("Student", backref="fees")
    fee_structure = relationship("FeeStructure", back_populates="student_fees")
    scholarship = relationship("Scholarship")
    discount = relationship("Discount")
    payments = relationship("Payment", back_populates="student_fee", cascade="all, delete-orphan")


class Payment(Base):
    __tablename__ = "fee_payments"
    
    id = Column(Integer, primary_key=True, index=True)
    receipt_no = Column(String(50), unique=True, index=True, nullable=False)
    student_fee_id = Column(Integer, ForeignKey("fee_student_fees.id", ondelete="CASCADE"), nullable=False)
    
    amount = Column(Float, nullable=False)
    payment_mode = Column(Enum(PaymentMode), nullable=False)
    transaction_id = Column(String(100), nullable=True) # for UPI, Card, Bank
    
    payment_date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    
    verified_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student_fee = relationship("StudentFee", back_populates="payments")
    verified_by_user = relationship("User")
    receipt = relationship("Receipt", back_populates="payment", uselist=False, cascade="all, delete-orphan")


class Receipt(Base):
    __tablename__ = "fee_receipts"
    
    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("fee_payments.id", ondelete="CASCADE"), unique=True, nullable=False)
    receipt_url = Column(String(255), nullable=True) # URL/path to the generated PDF
    generated_at = Column(DateTime, default=datetime.utcnow)
    
    payment = relationship("Payment", back_populates="receipt")


class PaymentHistory(Base):
    __tablename__ = "fee_payment_history"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(255), nullable=False) # e.g. "Fee Bill Generated", "Payment Verified"
    amount = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student")
