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
    PaymentCreate, PaymentUpdate, PaymentResponse, ReceiptResponse,
    AssignFeeCreate, StudentPayFeeCreate
)
from app.repositories.fee import (
    fee_structure_repo, scholarship_repo, discount_repo, fine_rule_repo,
    student_fee_repo, payment_repo
)
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter()

ADMIN_ROLES = ["admin", "finance_admin"]


# ----------------- ADMIN DASHBOARD -----------------
@router.get("/admin-dashboard")
async def get_admin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(ADMIN_ROLES))
) -> Any:
    total_expected = await db.scalar(select(func.sum(StudentFee.total_fee))) or 0
    total_collected = await db.scalar(select(func.sum(StudentFee.paid_amount))) or 0
    pending_collection = await db.scalar(select(func.sum(StudentFee.pending_amount))) or 0
    
    total_students = await db.scalar(select(func.count(StudentFee.id))) or 0
    paid_students = await db.scalar(select(func.count(StudentFee.id)).where(StudentFee.status == FeeStatus.PAID)) or 0
    pending_students = total_students - paid_students
    
    today = date.today()
    today_payments = await db.scalars(
        select(Payment).where(func.date(Payment.payment_date) == today, Payment.status == PaymentStatus.VERIFIED)
    )
    today_collection = sum(p.amount for p in today_payments)
    
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
    # Get student profile
    student = await db.scalar(select(Student).where(Student.user_id == current_user.id))
    if not student:
        student = Student(
            user_id=current_user.id,
            enrollment_number=f"STU-{1000 + current_user.id}",
            batch="2024-2028"
        )
        db.add(student)
        await db.commit()
        await db.refresh(student)

    # Get student assigned fee bills
    student_fees = list(await db.scalars(select(StudentFee).where(StudentFee.student_id == student.id)))
    
    total_fee = sum(sf.total_fee for sf in student_fees)
    paid_fee = sum(sf.paid_amount for sf in student_fees)
    pending_fee = sum(sf.pending_amount for sf in student_fees)

    # Build dynamic categorical breakdown from assigned fee structures
    breakdown = []
    if student_fees:
        fs = await db.get(FeeStructure, student_fees[0].fee_structure_id)
        if fs:
            running_paid = paid_fee
            components = [
                ("Tuition Fee", fs.tuition_fee),
                ("Exam Fee", fs.exam_fee),
                ("Library Fee", fs.library_fee),
                ("Development Fee", fs.development_fee),
                ("Laboratory Fee", fs.laboratory_fee),
                ("Hostel Fee", fs.hostel_fee),
                ("Sports Fee", fs.sports_fee),
                ("Miscellaneous Fee", fs.miscellaneous_fee),
            ]
            for comp_name, comp_val in components:
                if comp_val and comp_val > 0:
                    if running_paid >= comp_val:
                        status_str = "Paid"
                        running_paid -= comp_val
                    elif running_paid > 0:
                        status_str = "Partial"
                        running_paid = 0
                    else:
                        status_str = "Pending"
                    breakdown.append({
                        "component": comp_name,
                        "total": comp_val,
                        "status": status_str
                    })

    # Payments history
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
            "desc": "Fee Installment Payment"
        })

    upcoming_dues = []
    for sf in student_fees:
        if sf.pending_amount > 0:
            upcoming_dues.append({
                "id": sf.id,
                "title": "Assigned Semester Fee Bill",
                "amount": sf.pending_amount,
                "due": sf.due_date.isoformat(),
                "isOverdue": sf.due_date < date.today()
            })

    return {
        "student_id": student.id,
        "enrollment_number": student.enrollment_number,
        "student_fees": [
            {
                "id": sf.id,
                "total_fee": sf.total_fee,
                "paid_amount": sf.paid_amount,
                "pending_amount": sf.pending_amount,
                "status": sf.status.value,
                "due_date": sf.due_date.isoformat()
            } for sf in student_fees
        ],
        "kpis": {
            "total_fee": total_fee,
            "paid_fee": paid_fee,
            "pending_fee": pending_fee
        },
        "breakdown": breakdown,
        "payment_history": payment_history,
        "upcoming_dues": upcoming_dues
    }


# ----------------- ASSIGN FEE BILL CATEGORICALLY / BULK SEMESTER (ADMIN) -----------------
@router.post("/assign-fee", response_model=StudentFeeResponse)
async def assign_fee_to_student(
    fee_in: AssignFeeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(ADMIN_ROLES))
) -> Any:
    """
    Assign/Send a fee bill to a student individually or bulk assign to ALL students of a Semester (Admin).
    """
    # Calculate total fee as sum of all category components including late fine
    total_fee_calc = (
        (fee_in.tuition_fee or 0.0) +
        (fee_in.exam_fee or 0.0) +
        (fee_in.library_fee or 0.0) +
        (fee_in.development_fee or 0.0) +
        (fee_in.laboratory_fee or 0.0) +
        (fee_in.hostel_fee or 0.0) +
        (fee_in.sports_fee or 0.0) +
        (fee_in.late_fine or 0.0) +
        (fee_in.miscellaneous_fee or 0.0)
    )

    if total_fee_calc <= 0:
        raise BadRequestException("Total fee bill amount must be greater than zero. Please enter breakdown amounts.")

    # ── BULK ASSIGN TO ALL STUDENTS OF A SEMESTER ──
    if fee_in.bulk_semester:
        target_sem = fee_in.bulk_semester
        # Strictly get ONLY students in the target semester
        students = list((await db.scalars(select(Student).where(Student.semester == target_sem))).all())

        if not students:
            raise NotFoundException(f"No students found in Semester {target_sem}. Make sure students have their semester set correctly.")

        # Re-use master FeeStructure for target_sem (never duplicate structure rows)
        master_fs = await db.scalar(select(FeeStructure).where(FeeStructure.semester == target_sem))
        if not master_fs:
            master_fs = FeeStructure(
                academic_year=fee_in.academic_year or "2024-2025",
                department_id=1,
                semester=target_sem,
                category=fee_in.category or f"Semester {target_sem} Package",
                tuition_fee=fee_in.tuition_fee or 0.0,
                exam_fee=fee_in.exam_fee or 0.0,
                library_fee=fee_in.library_fee or 0.0,
                development_fee=fee_in.development_fee or 0.0,
                laboratory_fee=fee_in.laboratory_fee or 0.0,
                hostel_fee=fee_in.hostel_fee or 0.0,
                sports_fee=fee_in.sports_fee or 0.0,
                bus_fee=fee_in.late_fine or 0.0,
                miscellaneous_fee=fee_in.miscellaneous_fee or 0.0,
                total_amount=total_fee_calc
            )
            db.add(master_fs)
            await db.commit()
            await db.refresh(master_fs)

        created_sf = None
        for st in students:
            new_sf = StudentFee(
                student_id=st.id,
                fee_structure_id=master_fs.id,
                total_fee=total_fee_calc,
                paid_amount=0.0,
                pending_amount=total_fee_calc,
                due_date=fee_in.due_date,
                status=FeeStatus.PENDING,
                fine_amount=fee_in.late_fine or 0.0
            )
            db.add(new_sf)
            await db.commit()
            await db.refresh(new_sf)
            created_sf = new_sf

            log = PaymentHistory(
                student_id=st.id,
                action=f"Bulk Semester {target_sem} Fee Bill Assigned (Total: ₹{total_fee_calc})",
                amount=total_fee_calc
            )
            db.add(log)
            await db.commit()

        res = StudentFeeResponse.model_validate(created_sf)
        res.student_name = f"All {len(students)} Students (Semester {target_sem})"
        res.enrollment_number = f"BULK-SEM-{target_sem}"
        return res

    # ── INDIVIDUAL STUDENT ASSIGNMENT BY ENROLLMENT NUMBER ──
    student = None
    if fee_in.student_id:
        student = await db.get(Student, fee_in.student_id)
    elif fee_in.enrollment_number:
        student = await db.scalar(select(Student).where(Student.enrollment_number == fee_in.enrollment_number))
        
    if not student:
        raise NotFoundException(f"Student with enrollment number '{fee_in.enrollment_number}' not found.")

    target_sem = fee_in.semester or student.semester or 1
    master_fs = await db.scalar(select(FeeStructure).where(FeeStructure.semester == target_sem))
    if not master_fs:
        master_fs = FeeStructure(
            academic_year=fee_in.academic_year or "2024-2025",
            department_id=student.course_id or 1,
            semester=target_sem,
            category=fee_in.category or "General",
            total_amount=total_fee_calc
        )
        db.add(master_fs)
        await db.commit()
        await db.refresh(master_fs)

    # Create StudentFee bill linked to master FeeStructure
    new_fee = StudentFee(
        student_id=student.id,
        fee_structure_id=master_fs.id,
        total_fee=total_fee_calc,
        paid_amount=0.0,
        pending_amount=total_fee_calc,
        due_date=fee_in.due_date,
        status=FeeStatus.PENDING,
        fine_amount=fee_in.late_fine or 0.0
    )
    db.add(new_fee)
    await db.commit()
    await db.refresh(new_fee)

    log = PaymentHistory(
        student_id=student.id,
        action=f"Categorical Fee Bill Assigned (Total: ₹{total_fee_calc})",
        amount=total_fee_calc
    )
    db.add(log)
    await db.commit()

    user = await db.get(User, student.user_id) if student.user_id else None
    res = StudentFeeResponse.model_validate(new_fee)
    res.student_name = user.full_name if user else "Student"
    res.enrollment_number = student.enrollment_number
    return res


# ----------------- PAY FEE (STUDENT / ADMIN) -----------------
@router.post("/pay-fee", response_model=PaymentResponse)
async def student_pay_fee(
    pay_in: StudentPayFeeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Submit fee payment (Student/Admin).
    """
    sf = await db.get(StudentFee, pay_in.student_fee_id)
    if not sf:
        raise NotFoundException("Student fee bill not found")
        
    if sf.pending_amount <= 0:
        raise BadRequestException("This fee bill is already fully paid.")

    payment_amt = min(pay_in.amount, sf.pending_amount)

    count = await db.scalar(select(func.count(Payment.id))) or 0
    receipt_no = f"RCPT-{date.today().strftime('%Y%m%d')}-{1001 + count}"

    payment = Payment(
        receipt_no=receipt_no,
        student_fee_id=sf.id,
        amount=payment_amt,
        payment_mode=pay_in.payment_mode,
        transaction_id=pay_in.transaction_id or f"TXN-{100000 + count}",
        status=PaymentStatus.VERIFIED
    )
    db.add(payment)
    await db.commit()
    await db.refresh(payment)

    sf.paid_amount += payment_amt
    sf.pending_amount -= payment_amt
    if sf.pending_amount <= 0:
        sf.pending_amount = 0
        sf.status = FeeStatus.PAID
    else:
        sf.status = FeeStatus.PARTIAL

    category_label = pay_in.fee_category or "Full Outstanding Dues"
    log = PaymentHistory(
        student_id=sf.student_id,
        action=f"Payment Received [{category_label}] ({pay_in.payment_mode.value} - ₹{payment_amt})",
        amount=payment_amt
    )
    db.add(log)
    await db.commit()

    student = await db.get(Student, sf.student_id)
    user = await db.get(User, student.user_id) if student else None

    res = PaymentResponse.model_validate(payment)
    res.student_name = user.full_name if user else "Student"
    res.enrollment_number = student.enrollment_number if student else ""
    res.fee_category = category_label
    return res


async def ensure_8_semester_fee_structures(db: AsyncSession):
    count = await db.scalar(select(func.count(FeeStructure.id))) or 0
    if count >= 8:
        return
        
    existing_sems = set((await db.scalars(select(FeeStructure.semester))).all())
    
    for sem in range(1, 9):
        if sem in existing_sems:
            continue
            
        # Odd sem = 90,000, Even sem = 1,00,000
        if sem % 2 != 0:
            fs = FeeStructure(
                academic_year="2024-2025",
                department_id=1,
                semester=sem,
                category="General",
                tuition_fee=50000.0,
                exam_fee=10000.0,
                library_fee=5000.0,
                development_fee=15000.0,
                laboratory_fee=10000.0,
                hostel_fee=0.0,
                sports_fee=0.0,
                miscellaneous_fee=0.0,
                total_amount=90000.0
            )
        else:
            fs = FeeStructure(
                academic_year="2024-2025",
                department_id=1,
                semester=sem,
                category="General",
                tuition_fee=60000.0,
                exam_fee=10000.0,
                library_fee=5000.0,
                development_fee=15000.0,
                laboratory_fee=10000.0,
                hostel_fee=0.0,
                sports_fee=0.0,
                miscellaneous_fee=0.0,
                total_amount=100000.0
            )
        db.add(fs)
    await db.commit()


# ----------------- CRUD: FEE STRUCTURES -----------------
@router.get("/structures", response_model=List[FeeStructureResponse])
async def get_fee_structures(db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    await ensure_8_semester_fee_structures(db)
    stmt = select(FeeStructure).order_by(FeeStructure.semester.asc())
    return (await db.execute(stmt)).scalars().all()

@router.post("/structures", response_model=FeeStructureResponse)
async def create_fee_structure(obj_in: FeeStructureCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    return await fee_structure_repo.create(db, obj_in=obj_in)

@router.put("/structures/{id}", response_model=FeeStructureResponse)
async def update_fee_structure(
    id: int,
    obj_in: FeeStructureUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(ADMIN_ROLES))
) -> Any:
    struct = await fee_structure_repo.get(db, id=id)
    if not struct:
        raise NotFoundException("Fee Structure not found")
        
    return await fee_structure_repo.update(db, db_obj=struct, obj_in=obj_in)

@router.delete("/structures/{id}", response_model=FeeStructureResponse)
async def delete_fee_structure(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(ADMIN_ROLES))
) -> Any:
    struct = await fee_structure_repo.get(db, id=id)
    if not struct:
        raise NotFoundException("Fee Structure not found")
        
    return await fee_structure_repo.remove(db, id=id)


# ----------------- CRUD: STUDENT FEES -----------------
@router.get("/student-fees", response_model=List[StudentFeeResponse])
async def get_student_fees(db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    stmt = select(StudentFee, Student, User).join(Student, StudentFee.student_id == Student.id).outerjoin(User, Student.user_id == User.id)
    rows = (await db.execute(stmt)).all()
    
    result = []
    for sf, student, user in rows:
        item = StudentFeeResponse.model_validate(sf)
        item.student_name = user.full_name if user else "Student"
        item.enrollment_number = student.enrollment_number if student else ""
        result.append(item)
    return result


# ----------------- CRUD: PAYMENTS -----------------
@router.get("/payments", response_model=List[PaymentResponse])
async def get_payments(db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    stmt = select(Payment, StudentFee, Student, User)\
        .join(StudentFee, Payment.student_fee_id == StudentFee.id)\
        .join(Student, StudentFee.student_id == Student.id)\
        .outerjoin(User, Student.user_id == User.id)\
        .order_by(desc(Payment.payment_date))
    rows = (await db.execute(stmt)).all()

    result = []
    for p, sf, student, user in rows:
        item = PaymentResponse.model_validate(p)
        item.student_name = user.full_name if user else "Student"
        item.enrollment_number = student.enrollment_number if student else ""
        result.append(item)
    return result

@router.patch("/payments/{id}/verify")
async def verify_payment(id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(RequireRole(ADMIN_ROLES))) -> Any:
    payment = await payment_repo.get(db, id=id)
    if not payment:
        raise NotFoundException("Payment not found")
        
    payment.status = PaymentStatus.VERIFIED
    payment.verified_by = current_user.id
    
    sf = await student_fee_repo.get(db, id=payment.student_fee_id)
    if sf:
        sf.paid_amount += payment.amount
        sf.pending_amount -= payment.amount
        if sf.pending_amount <= 0:
            sf.pending_amount = 0
            sf.status = FeeStatus.PAID
        else:
            sf.status = FeeStatus.PARTIAL
        
    await db.commit()
    return {"message": "Payment verified successfully", "status": payment.status}
