import React, { useEffect, useState } from "react";
import { 
  Wallet, Receipt, Clock, Calendar, ChevronDown, Download,
  FileText, ArrowRight, Bell, Headset, ArrowUpRight, Loader, X, CheckCircle2, AlertCircle, Printer, CreditCard
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import TextType from "../../components/TextType";
import { useFeeStore } from "../../store/useFeeStore";

export function MyFees() {
  const { studentDashboardData, fetchStudentDashboard, payFee, isLoading } = useFeeStore();

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>("UPI");
  const [txnId, setTxnId] = useState<string>("");
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [receiptData, setReceiptData] = useState<any>(null);

  useEffect(() => {
    fetchStudentDashboard();
  }, [fetchStudentDashboard]);

  if (isLoading || !studentDashboardData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <Loader className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  const { kpis, breakdown, payment_history, upcoming_dues, student_fees } = studentDashboardData;

  const summaryData = [
    { name: 'Paid', value: kpis.paid_fee, color: '#10b981' },
    { name: 'Pending', value: kpis.pending_fee, color: '#f59e0b' }
  ];

  const overdueAmount = upcoming_dues.filter((d: any) => d.isOverdue).reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const nextDue = upcoming_dues.length > 0 ? upcoming_dues[0] : null;
  const paidPercentage = kpis.total_fee > 0 ? ((kpis.paid_fee / kpis.total_fee) * 100).toFixed(1) : 0;
  
  let daysDiffText = "No upcoming dues";
  if (nextDue) {
    const today = new Date();
    const dueDate = new Date(nextDue.due);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      daysDiffText = `${Math.abs(diffDays)} Days Overdue`;
    } else {
      daysDiffText = `${diffDays} Days Remaining`;
    }
  }

  const handleOpenPayModal = (catName: string = "ALL", catAmt?: number) => {
    setSelectedCategory(catName);
    if (catName !== "ALL" && catAmt && catAmt > 0) {
      setPayAmount(catAmt);
    } else {
      setPayAmount(kpis.pending_fee > 0 ? kpis.pending_fee : 5000);
    }
    setTxnId(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
    setPayError("");
    setIsPayModalOpen(true);
  };

  const handleCategoryDropdownChange = (catName: string) => {
    setSelectedCategory(catName);
    if (catName === "ALL") {
      setPayAmount(kpis.pending_fee > 0 ? kpis.pending_fee : 0);
    } else if (catName.startsWith("SEM_")) {
      const semNum = Number(catName.split("_")[1]);
      const semFee = semNum % 2 !== 0 ? 90000 : 100000;
      setPayAmount(semFee);
    } else {
      const match = breakdown.find((b: any) => b.component === catName);
      if (match) {
        setPayAmount(match.total);
      }
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student_fees || student_fees.length === 0) {
      setPayError("No assigned fee bill found to pay.");
      return;
    }
    const feeId = student_fees[0].id;
    setIsPaying(true);
    setPayError("");
    try {
      const res = await payFee({
        student_fee_id: feeId,
        amount: Number(payAmount),
        payment_mode: paymentMode,
        transaction_id: txnId,
        fee_category: selectedCategory === "ALL" ? "Full Outstanding Dues" : selectedCategory
      });
      setIsPayModalOpen(false);
      setReceiptData(res);
    } catch (err: any) {
      console.error(err);
      setPayError(err.response?.data?.detail || "Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Fee</span>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <TextType
                text={["Management", "Payments", "Structure"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#ffffff' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Select specific fee categories or pay full dues securely</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {kpis.pending_fee > 0 && (
            <button
              onClick={() => handleOpenPayModal("ALL")}
              style={{
                background: '#573cfa',
                color: '#ffffff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '14px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(87, 60, 250, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Wallet size={18} /> Pay Fee Now
            </button>
          )}
        </div>
      </div>

      {/* ── Top KPI Cards Row ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '18px', marginBottom: '32px' }}
      >
        {/* KPI 1 — Total Allocated */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '175px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(87,60,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(87,60,250,0.08)' }}>
                <Wallet size={18} color="#573cfa" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Total Fee</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.2px', lineHeight: 1.1, marginBottom: '6px' }}>
              ₹ {kpis.total_fee.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#573cfa', fontWeight: 600 }}>Total</span> · Allocated Bill
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Amount Paid */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '175px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.08)' }}>
                <Receipt size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Total Paid</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#16a34a', letterSpacing: '-1.2px', lineHeight: 1.1, marginBottom: '6px' }}>
              ₹ {kpis.paid_fee.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>{paidPercentage}%</span> · Cleared
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Pending Dues */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '175px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.08)' }}>
                <Clock size={18} color="#f59e0b" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Pending Due</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: kpis.pending_fee > 0 ? '#d97706' : '#16a34a', letterSpacing: '-1.2px', lineHeight: 1.1, marginBottom: '6px' }}>
              ₹ {kpis.pending_fee.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: kpis.pending_fee > 0 ? '#f59e0b' : '#22c55e', fontWeight: 600 }}>
                {kpis.pending_fee > 0 ? 'Action Required' : 'All Cleared'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* KPI 4 — Overdue */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '175px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)' }}>
                <Clock size={18} color="#ef4444" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Overdue</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#dc2626', letterSpacing: '-1.2px', lineHeight: 1.1, marginBottom: '6px' }}>
              ₹ {overdueAmount.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>Penalty Applies</span>
            </div>
          </div>
        </motion.div>

        {/* KPI 5 — Next Due Date */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '175px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.08)' }}>
                <Calendar size={18} color="#3b82f6" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Due Date</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '6px' }}>
              {nextDue ? new Date(nextDue.due).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : 'None'}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>{daysDiffText}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.1fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Fee Breakdown & Category Actions */}
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f3f4f6', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Category-Wise Fee Structure & Payment</h3>
              <span style={{ fontSize: '11px', color: '#573cfa', background: '#f3f0ff', padding: '4px 10px', borderRadius: '10px', fontWeight: 700 }}>Categorical Select</span>
            </div>

            {breakdown.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                No fee structure assigned yet. When Admin assigns your fee bill, category components will appear here.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {breakdown.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#fafafa', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827', display: 'block' }}>{item.component}</span>
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>Category Allocation</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>₹ {item.total.toLocaleString('en-IN')}</span>
                      
                      <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '10px', background: item.status === 'Paid' ? '#f0fdf4' : item.status === 'Partial' ? '#fffbeb' : '#fef2f2', color: item.status === 'Paid' ? '#16a34a' : item.status === 'Partial' ? '#d97706' : '#dc2626' }}>
                        {item.status}
                      </span>

                      {item.status !== 'Paid' && (
                        <button
                          onClick={() => handleOpenPayModal(item.component, item.total)}
                          style={{
                            background: '#573cfa',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '10px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 8px rgba(87,60,250,0.25)'
                          }}
                        >
                          <CreditCard size={13} /> Pay This Category
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment History */}
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Payment Receipts & History</h3>
            
            {payment_history.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                No payment receipts found. Select a category above to pay.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {payment_history.map((pay: any) => (
                  <div key={pay.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '14px', border: '1px solid #f3f4f6', background: '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Receipt size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{pay.receipt_no}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Mode: <span style={{ fontWeight: 600, color: '#573cfa' }}>{pay.mode}</span> • {new Date(pay.date).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#16a34a' }}>+ ₹ {pay.amount.toLocaleString('en-IN')}</div>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#16a34a', background: '#f0fdf4', padding: '2px 6px', borderRadius: '6px' }}>VERIFIED</span>
                      </div>

                      <button
                        onClick={() => setReceiptData(pay)}
                        style={{ background: '#f3f4f6', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Outstanding Balance & Action */}
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Outstanding Balance</h3>
            
            <div style={{ background: '#f3f0ff', padding: '20px', borderRadius: '14px', border: '1px solid #ede9fe', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Total Pending Balance</div>
                  <div style={{ fontSize: '11px', color: '#4b5563' }}>Real-time database balance</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#573cfa' }}>₹ {kpis.pending_fee.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            <button
              disabled={kpis.pending_fee <= 0}
              onClick={() => handleOpenPayModal("ALL")}
              style={{
                width: '100%',
                padding: '14px',
                background: kpis.pending_fee > 0 ? '#573cfa' : '#9ca3af',
                color: 'white',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: kpis.pending_fee > 0 ? 'pointer' : 'not-allowed',
                boxShadow: kpis.pending_fee > 0 ? '0 4px 16px rgba(87, 60, 250, 0.3)' : 'none'
              }}
            >
              {kpis.pending_fee > 0 ? "Pay Full Outstanding Fee" : "Fees Fully Settled ✓"}
            </button>
          </div>

        </div>
      </div>

      {/* ── MODAL 1: PAY FEE MODAL WITH CATEGORY DROPDOWN ── */}
      <AnimatePresence>
        {isPayModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', margin: 0 }}>Fee Payment Gateway</h3>
                  <span style={{ fontSize: '11px', color: '#573cfa', fontWeight: 700 }}>Categorical Fee Payment</span>
                </div>
                <button onClick={() => setIsPayModalOpen(false)} style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} color="#71717a" />
                </button>
              </div>

              {payError && (
                <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} /> {payError}
                </div>
              )}

              <form onSubmit={handleProcessPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* CATEGORY & SEMESTER SELECTION DROPDOWN */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Select Semester or Category Fee to Pay *
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={e => handleCategoryDropdownChange(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #573cfa', fontSize: '13px', fontWeight: 700, background: '#f3f0ff', color: '#573cfa', outline: 'none' }}
                  >
                    <option value="ALL">Full Outstanding Dues (₹ {kpis.pending_fee.toLocaleString('en-IN')})</option>
                    
                    <optgroup label="── SEMESTER-WISE FEE BILLS ──">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={`SEM_${s}`}>
                          Semester {s} Package - ₹ {s % 2 !== 0 ? '90,000 (Odd Sem)' : '1,00,000 (Even Sem)'}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="── CATEGORY BREAKDOWN & FINES ──">
                      {breakdown.map((b: any, idx: number) => (
                        <option key={idx} value={b.component}>
                          {b.component} - ₹ {b.total.toLocaleString('en-IN')} ({b.status})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Amount to Pay (₹) *</label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={e => setPayAmount(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '15px', fontWeight: 700, outline: 'none' }}
                  />
                  <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>Selected Category: <strong>{selectedCategory === "ALL" ? "All Dues" : selectedCategory}</strong></span>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Payment Method *</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', fontWeight: 600, background: 'white' }}
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="CARD">Debit / Credit Card</option>
                    <option value="BANK">Net Banking / NEFT</option>
                    <option value="CASH">Cash Deposit</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Transaction Ref / UTR ID</label>
                  <input
                    type="text"
                    value={txnId}
                    onChange={e => setTxnId(e.target.value)}
                    placeholder="e.g. UPI-9988771122"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPaying}
                  style={{ width: '100%', padding: '14px', background: '#573cfa', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(87, 60, 250, 0.3)' }}
                >
                  {isPaying ? "Processing Payment..." : `Confirm Payment of ₹ ${payAmount.toLocaleString('en-IN')}`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: OFFICIAL RECEIPT MODAL ── */}
      <AnimatePresence>
        {receiptData && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '460px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> OFFICIAL RECEIPT
                </span>
                <button onClick={() => setReceiptData(null)} style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} color="#71717a" />
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', fontWeight: 700, letterSpacing: '1px' }}>INSTITUTE FEE RECEIPT</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#573cfa', marginTop: '4px' }}>{receiptData.receipt_no || receiptData.receiptNo}</div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Category Paid:</span>
                  <strong style={{ color: '#573cfa', fontSize: '14px' }}>{receiptData.fee_category || selectedCategory || 'Tuition Fee'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Paid Amount:</span>
                  <strong style={{ color: '#16a34a', fontSize: '16px' }}>₹ {receiptData.amount?.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Payment Mode:</span>
                  <strong style={{ color: '#1e293b' }}>{receiptData.mode || receiptData.payment_mode}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Transaction Ref:</span>
                  <strong style={{ color: '#1e293b' }}>{receiptData.transaction_id || 'N/A'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Date & Time:</span>
                  <strong style={{ color: '#1e293b' }}>{new Date(receiptData.date || receiptData.payment_date || Date.now()).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Status:</span>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '8px', fontWeight: 800, fontSize: '11px' }}>VERIFIED</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  onClick={() => window.print()}
                  style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Printer size={16} /> Print Receipt
                </button>
                <button
                  onClick={() => setReceiptData(null)}
                  style={{ flex: 1, padding: '12px', background: '#573cfa', color: 'white', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
