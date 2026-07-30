from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, date

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User
from app.models.student import Student
from app.models.fee import (
    FeeStructure, StudentFee, Scholarship, Discount, FineRule, Payment, Receipt, PaymentHistory, FeeStatus, PaymentStatus, PaymentMode
)
from app.schemas.fee import (
    FeeStructureCreate, FeeStructureUpdate, FeeStructureResponse,
    ScholarshipCreate, ScholarshipUpdate, ScholarshipResponse,
    DiscountCreate, DiscountUpdate, DiscountResponse,
    FineRuleCreate, FineRuleUpdate, FineRuleResponse,
    StudentFeeCreate, StudentFeeUpdate, StudentFeeResponse,
    PaymentCreate, PaymentUpdate, PaymentResponse, ReceiptResponse
)
from app.repositories.fee import (
    fee_structure_repo, scholarship_repo, discount_repo, fine_rule_repo,
    student_fee_repo, payment_repo
)
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter()

ADMIN_ROLES = ["admin", "finance_admin"]

async def ensure_fee_seed_data(db: AsyncSession):
    count = await db.scalar(select(func.count(FeeStructure.id))) or 0
    if count > 0:
        return
        
    # Seed fee structures
    struct = FeeStructure(
        academic_year="2024-2025",
        department_id=1,
        semester=1,
        category="General",
        tuition_fee=60000,
        exam_fee=10000,
        library_fee=5000,
        development_fee=15000,
        laboratory_fee=10000,
        total_amount=100000,
    )
    db.add(struct)
    await db.commit()
    await db.refresh(struct)
    
    # Seed student fee for first student
    student = await db.scalar(select(Student).limit(1))
    if student:
        sf = StudentFee(
            student_id=student.id,
            fee_structure_id=struct.id,
            total_fee=100000,
            paid_amount=60000,
            pending_amount=40000,
            due_date=date.today(),
            status=FeeStatus.PARTIAL
        )
        db.add(sf)
        await db.commit()
        await db.refresh(sf)
        
        # Add payment
        pay = Payment(
            receipt_no="RCPT-1001",
            student_fee_id=sf.id,
            amount=60000,
            payment_mode=PaymentMode.UPI,
            status=PaymentStatus.VERIFIED
        )
        db.add(pay)
        await db.commit()


# ----------------- ADMIN DASHBOARD -----------------
@router.get("/admin-dashboard")
async def get_admin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(ADMIN_ROLES))
) -> Any:
    await ensure_fee_seed_data(db)
    
    # KPIs
    total_expected = await db.scalar(select(func.sum(StudentFee.total_fee))) or 0
    total_collected = await db.scalar(select(func.sum(StudentFee.paid_amount))) or 0
    pending_collection = await db.scalar(select(func.sum(StudentFee.pending_amount))) or 0
    
    total_students = await db.scalar(select(func.count(StudentFee.id))) or 0
    paid_students = await db.scalar(select(func.count(StudentFee.id)).where(StudentFee.status == FeeStatus.PAID)) or 0
    pending_students = total_students - paid_students
    
    # Today's collection
    today = date.today()
    today_payments = await db.scalars(
        select(Payment).where(func.date(Payment.payment_date) == today, Payment.status == PaymentStatus.VERIFIED)
    )
    today_collection = sum(p.amount for p in today_payments)
    
    # Recent Payments
    recent = await db.scalars(select(Payment).order_by(desc(Payment.payment_date)).limit(8))
    recent_payments = []
    for p in recent:
        sf = await db.get(StudentFee, p.student_fee_id)
        student = await db.get(Student, sf.student_id) if sf else None
        user = await db.get(User, student.user_id) if student else None
        recent_payments.append({
            "id": p.id,
            "receipt_no": p.receipt_no,
            "student_name": user.full_name if user else "Unknown",
            "enrollment_number": student.enrollment_number if student else "",
            "amount": p.amount,
            "mode": p.payment_mode.value,
            "status": p.status.value,
            "date": p.payment_date.isoformat()
        })
        
    return {
        "kpis": {
            "total_expected": total_expected,
            "total_collected": total_collected,
            "pending_collection": pending_collection,
            "today_collection": today_collection,
            "total_students": total_students,
            "paid_students": paid_students,
            "pending_students": pending_students
        },
        "recent_payments": recent_payments
    }


# ----------------- STUDENT DASHBOARD -----------------
@router.get("/student-dashboard")
async def get_student_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    await ensure_fee_seed_data(db)
    student = await db.scalar(select(Student).where(Student.user_id == current_user.id))
    if not student:
        raise NotFoundException("Student profile not found")
        
    student_fees = await db.scalars(select(StudentFee).where(StudentFee.student_id == student.id))
    student_fees_list = list(student_fees)
    
    total_fee = sum(sf.total_fee for sf in student_fees_list)
    paid_fee = sum(sf.paid_amount for sf in student_fees_list)
    pending_fee = sum(sf.pending_amount for sf in student_fees_list)
    
    # Components Breakdown (using the first fee structure as example)
    breakdown = []
    if student_fees_list:
        fs = await db.get(FeeStructure, student_fees_list[0].fee_structure_id)
        if fs:
            breakdown = [
                {"component": "Tuition Fee", "total": fs.tuition_fee, "status": "Partial" if fs.tuition_fee > 0 else "Paid"},
                {"component": "Exam Fee", "total": fs.exam_fee, "status": "Paid"},
                {"component": "Library Fee", "total": fs.library_fee, "status": "Paid"},
                {"component": "Development Fee", "total": fs.development_fee, "status": "Paid"},
                {"component": "Laboratory Fee", "total": fs.laboratory_fee, "status": "Pending"}
            ]
            
    # Payment History
    payments = await db.scalars(
        select(Payment).join(StudentFee).where(StudentFee.student_id == student.id).order_by(desc(Payment.payment_date))
    )
    payment_history = []
    for p in payments:
        payment_history.append({
            "id": p.id,
            "receipt_no": p.receipt_no,
            "amount": p.amount,
            "mode": p.payment_mode.value,
            "status": p.status.value,
            "date": p.payment_date.isoformat(),
            "desc": "Semester Fee Installment"
        })
        
    upcoming_dues = []
    for sf in student_fees_list:
        if sf.pending_amount > 0:
            upcoming_dues.append({
                "title": "Semester Fee Remaining",
                "amount": sf.pending_amount,
                "due": sf.due_date.isoformat(),
                "isOverdue": sf.due_date < date.today()
            })

    return {
        "kpis": {
            "total_fee": total_fee,
            "paid_fee": paid_fee,
            "pending_fee": pending_fee
        },
        "breakdown": breakdown,
        "payment_history": payment_history,
        "upcoming_dues": upcoming_dues
    }


# ----------------- CRUD: FEE STRUCTURES -----------------
@router.get("/structures", response_model=List[FeeStructureResponse])
async def get_fee_structures(db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    return await fee_structure_repo.get_multi(db)

@router.post("/structures", response_model=FeeStructureResponse)
async def create_fee_structure(obj_in: FeeStructureCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    return await fee_structure_repo.create(db, obj_in=obj_in)


# ----------------- CRUD: STUDENT FEES -----------------
@router.get("/student-fees", response_model=List[StudentFeeResponse])
async def get_student_fees(db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    return await student_fee_repo.get_multi(db)

@router.post("/student-fees", response_model=StudentFeeResponse)
async def create_student_fee(obj_in: StudentFeeCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    fs = await fee_structure_repo.get(db, id=obj_in.fee_structure_id)
    if not fs:
        raise NotFoundException("Fee Structure not found")
        
    # Auto calc amounts
    obj_dict = obj_in.model_dump()
    obj_dict["total_fee"] = fs.total_amount
    obj_dict["pending_amount"] = fs.total_amount
    obj_dict["paid_amount"] = 0.0
    obj_dict["status"] = FeeStatus.PENDING
    
    db_obj = StudentFee(**obj_dict)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj


# ----------------- CRUD: PAYMENTS -----------------
@router.get("/payments", response_model=List[PaymentResponse])
async def get_payments(db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    return await payment_repo.get_multi(db)

@router.post("/payments", response_model=PaymentResponse)
async def create_payment(obj_in: PaymentCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    sf = await student_fee_repo.get(db, id=obj_in.student_fee_id)
    if not sf:
        raise NotFoundException("Student Fee not found")
        
    # Generate receipt no
    count = await db.scalar(select(func.count(Payment.id))) or 0
    receipt_no = f"RCPT-{1000 + count + 1}"
    
    pay_dict = obj_in.model_dump()
    pay_dict["receipt_no"] = receipt_no
    pay_dict["status"] = PaymentStatus.PENDING
    
    payment = Payment(**pay_dict)
    db.add(payment)
    await db.commit()
    await db.refresh(payment)
    return payment

@router.patch("/payments/{id}/verify")
async def verify_payment(id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    payment = await payment_repo.get(db, id=id)
    if not payment:
        raise NotFoundException("Payment not found")
        
    payment.status = PaymentStatus.VERIFIED
    payment.verified_by = current_user.id
    
    # Update Student Fee
    sf = await student_fee_repo.get(db, id=payment.student_fee_id)
    sf.paid_amount += payment.amount
    sf.pending_amount -= payment.amount
    if sf.pending_amount <= 0:
        sf.pending_amount = 0
        sf.status = FeeStatus.PAID
    else:
        sf.status = FeeStatus.PARTIAL
        
    await db.commit()
    return {"message": "Payment verified successfully", "status": payment.status}
