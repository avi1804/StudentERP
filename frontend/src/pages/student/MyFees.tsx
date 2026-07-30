import React from "react";
import { 
  Wallet, Receipt, Clock, Calendar, ChevronDown, Download,
  FileText, ArrowRight, Bell, Headset, ArrowUpRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import TextType from "../../components/TextType";

export function MyFees() {

  const summaryData = [
    { name: 'Paid', value: 80000, color: '#10b981' },
    { name: 'Pending', value: 40000, color: '#f59e0b' },
    { name: 'Overdue', value: 5000, color: '#ef4444' }
  ];

  const feeOverview = [
    { component: "Tuition Fee", sub: "Academic Tuition Fee", total: "60,000", paid: "40,000", pending: "20,000", status: "Partial", statusColor: "yellow", pendingColor: "yellow" },
    { component: "Development Fee", sub: "Infrastructure & Dev. Fee", total: "15,000", paid: "15,000", pending: "0", status: "Paid", statusColor: "green", pendingColor: "gray" },
    { component: "Exam Fee", sub: "Semester Examination Fee", total: "10,000", paid: "10,000", pending: "0", status: "Paid", statusColor: "green", pendingColor: "gray" },
    { component: "Library Fee", sub: "Library & Resource Fee", total: "5,000", paid: "5,000", pending: "0", status: "Paid", statusColor: "green", pendingColor: "gray" },
    { component: "Laboratory Fee", sub: "Lab & Equipment Fee", total: "10,000", paid: "5,000", pending: "5,000", status: "Partial", statusColor: "yellow", pendingColor: "red" },
    { component: "Other Charges", sub: "Miscellaneous Charges", total: "20,000", paid: "5,000", pending: "15,000", status: "Partial", statusColor: "yellow", pendingColor: "red" }
  ];

  const paymentHistory = [
    { id: "PAY-2024-001", date: "10 May 2024", desc: "Tuition Fee (1st Installment)", amount: "40,000", mode: "Online", modeColor: "green" },
    { id: "PAY-2024-002", date: "15 Apr 2024", desc: "Development Fee", amount: "15,000", mode: "Online", modeColor: "green" },
    { id: "PAY-2024-003", date: "05 Apr 2024", desc: "Exam Fee", amount: "10,000", mode: "UPI", modeColor: "purple" },
    { id: "PAY-2024-004", date: "28 Mar 2024", desc: "Library Fee", amount: "5,000", mode: "Card", modeColor: "blue" },
    { id: "PAY-2024-005", date: "20 Mar 2024", desc: "Laboratory Fee (Partial)", amount: "5,000", mode: "UPI", modeColor: "purple" }
  ];

  const pendingDues = [
    { title: "Tuition Fee (2nd Installment)", due: "Due on 15 Jun 2024", amount: "20,000", iconBg: "#f3f0ff", iconColor: "#573cfa", isOverdue: false },
    { title: "Laboratory Fee (Remaining)", due: "Due on 15 Jun 2024", amount: "5,000", iconBg: "#fffbeb", iconColor: "#f59e0b", isOverdue: false },
    { title: "Other Charges", due: "Due on 30 Jun 2024", amount: "15,000", iconBg: "#eff6ff", iconColor: "#3b82f6", isOverdue: false },
    { title: "Misc. Fine", due: "Overdue by 10 days", amount: "5,000", iconBg: "#fef2f2", iconColor: "#ef4444", isOverdue: true }
  ];

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      
      {/* ── Header with Animated Highlighted Text Badge (Matching Main Dashboard & Attendance) ── */}
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
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Track, manage and view your fee payments</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            Academic Year 2024 - 25 <ChevronDown size={14} color="#6b7280" />
          </div>
        </div>
      </div>

      {/* ── Real-Time Top KPI Cards Row (AutoML Studio design matching Main Dashboard) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '18px', marginBottom: '32px' }}
      >
        {/* KPI 1 — Total Fees */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(87,60,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(87,60,250,0.08)' }}>
                <Wallet size={18} color="#573cfa" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Total Fees</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#09090b', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '6px' }}>
              ₹ 1,20,000
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#573cfa', fontWeight: 600 }}>100%</span> · Academic Year 2024-25
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Paid Fees */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.08)' }}>
                <Receipt size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Paid Fees</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#09090b', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '6px' }}>
              ₹ 80,000
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>66.7%</span> · Total Paid
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Pending Fees */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.08)' }}>
                <Wallet size={18} color="#f59e0b" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Pending Fees</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#09090b', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '6px' }}>
              ₹ 40,000
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>33.3%</span> · Remaining Dues
            </div>
          </div>
        </motion.div>

        {/* KPI 4 — Overdue Amount */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)' }}>
                <Clock size={18} color="#ef4444" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Overdue Amount</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#09090b', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '6px' }}>
              ₹ 5,000
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>Urgent</span> · Due Immediately
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
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.08)' }}>
                <Calendar size={18} color="#3b82f6" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#52525b' }}>Next Due Date</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', lineHeight: 1.1, marginBottom: '6px' }}>
              15 Jun 2024
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>45 Days</span> · Remaining
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Layout (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Fee Overview */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Fee Overview</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  Academic Year 2023-24 <ChevronDown size={14} color="#6b7280" />
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#573cfa', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                  <Download size={16} /> Download Statement
                </button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <th style={{ padding: '0 0 12px 0', fontSize: '10px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fee Component</th>
                  <th style={{ padding: '0 0 12px 0', fontSize: '10px', fontWeight: 700, color: '#6b7280', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount</th>
                  <th style={{ padding: '0 0 12px 0', fontSize: '10px', fontWeight: 700, color: '#6b7280', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paid Amount</th>
                  <th style={{ padding: '0 0 12px 0', fontSize: '10px', fontWeight: 700, color: '#6b7280', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Amount</th>
                  <th style={{ padding: '0 0 12px 0', fontSize: '10px', fontWeight: 700, color: '#6b7280', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {feeOverview.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '16px 0' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>{item.component}</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>{item.sub}</div>
                    </td>
                    <td style={{ padding: '16px 0', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                      ₹ {item.total}
                    </td>
                    <td style={{ padding: '16px 0', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#10b981' }}>
                      ₹ {item.paid}
                    </td>
                    <td style={{ padding: '16px 0', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: item.pendingColor === 'red' ? '#ef4444' : item.pendingColor === 'yellow' ? '#f59e0b' : '#6b7280' }}>
                      ₹ {item.pending}
                    </td>
                    <td style={{ padding: '16px 0', textAlign: 'center' }}>
                      <span style={{ 
                        background: item.statusColor === 'green' ? '#e8f5e9' : '#fffbeb', 
                        color: item.statusColor === 'green' ? '#10b981' : '#f59e0b', 
                        padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 600 
                      }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr style={{ background: '#f8fafc', borderBottom: 'none' }}>
                  <td style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#573cfa', borderRadius: '8px 0 0 8px' }}>Total</td>
                  <td style={{ padding: '16px 0', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#573cfa' }}>₹ 1,20,000</td>
                  <td style={{ padding: '16px 0', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>₹ 80,000</td>
                  <td style={{ padding: '16px 0', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#ef4444' }}>₹ 40,000</td>
                  <td style={{ padding: '16px', borderRadius: '0 8px 8px 0' }}></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* History and Dues Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Payment History */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Payment History</h3>
                <span style={{ fontSize: '11px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View All</span>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <th style={{ padding: '0 0 12px 0', fontSize: '9px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Payment ID</th>
                    <th style={{ padding: '0 0 12px 0', fontSize: '9px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '0 0 12px 0', fontSize: '9px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Description</th>
                    <th style={{ padding: '0 0 12px 0', fontSize: '9px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ padding: '0 0 12px 0', fontSize: '9px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Mode</th>
                    <th style={{ padding: '0 0 12px 0', fontSize: '9px', fontWeight: 700, color: '#6b7280', textAlign: 'center', textTransform: 'uppercase' }}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((pmt, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                      <td style={{ padding: '12px 0' }}>
                        <span style={{ background: '#f3f0ff', color: '#573cfa', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700 }}>{pmt.id}</span>
                      </td>
                      <td style={{ padding: '12px 0', fontSize: '10px', color: '#4b5563' }}>{pmt.date}</td>
                      <td style={{ padding: '12px 0', fontSize: '10px', color: '#111827', fontWeight: 500 }}>{pmt.desc}</td>
                      <td style={{ padding: '12px 0', fontSize: '10px', color: '#111827', fontWeight: 600 }}>₹ {pmt.amount}</td>
                      <td style={{ padding: '12px 0' }}>
                        <span style={{ color: pmt.modeColor === 'green' ? '#10b981' : pmt.modeColor === 'purple' ? '#8b5cf6' : '#3b82f6', fontSize: '10px', fontWeight: 600 }}>
                          {pmt.mode}
                        </span>
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'center' }}>
                        <Download size={14} color="#6b7280" style={{ cursor: 'pointer' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pending Dues */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Pending Dues</h3>
                <span style={{ fontSize: '11px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View All</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingDues.map((due, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: due.iconBg, color: due.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Wallet size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>{due.title}</div>
                        <div style={{ fontSize: '10px', color: due.isOverdue ? '#ef4444' : '#6b7280', fontWeight: due.isOverdue ? 600 : 400 }}>{due.due}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827' }}>₹ {due.amount}</div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#573cfa', cursor: 'pointer' }}>Pay Now</div>
                    </div>
                  </div>
                ))}
              </div>

              <button style={{ width: '100%', background: 'none', border: 'none', color: '#573cfa', padding: '12px', fontSize: '12px', fontWeight: 600, marginTop: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                View All Dues <ArrowRight size={14} />
              </button>
            </div>

          </div>

          {/* Banner Promo */}
          <div style={{ background: '#f3f0ff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#573cfa', position: 'relative' }}>
                <Calendar size={32} />
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'white', borderRadius: '50%', padding: '2px' }}>
                   <div style={{ width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                     <Clock size={10} />
                   </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Stay on top of your fee payments!</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>Enable reminders to get notified about upcoming due dates and never miss a payment.</div>
              </div>
            </div>
            <button style={{ padding: '10px 20px', background: '#573cfa', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} /> Enable Reminders
            </button>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Fee Payment Summary */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>Fee Payment Summary</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '120px', height: '120px', position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={summaryData} innerRadius={40} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                      {summaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>66.67%</div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>Paid</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                {summaryData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563', fontWeight: 500 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }}></div>
                      {d.name}
                    </div>
                    <div style={{ color: '#111827', fontWeight: 600 }}>
                      ₹ {d.value.toLocaleString('en-IN')} 
                      <span style={{ color: '#9ca3af', fontWeight: 'normal', marginLeft: '4px' }}>({Math.round((d.value/125000)*100)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Due */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Upcoming Due</h3>
            
            <div style={{ background: '#f3f0ff', padding: '20px', borderRadius: '12px', border: '1px solid #ede9fe', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#573cfa' }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Next Installment</div>
                    <div style={{ fontSize: '11px', color: '#4b5563', marginBottom: '8px' }}>Tuition Fee (2nd Installment)</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>Due on 15 Jun 2024</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>₹ 20,000</div>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#573cfa', background: '#ede9fe', padding: '4px 8px', borderRadius: '12px' }}>45 Days Left</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{ width: '100%', padding: '12px', background: '#573cfa', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Pay Now
              </button>
              <button style={{ width: '100%', padding: '12px', background: 'white', color: '#573cfa', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                View All Dues
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Quick Actions</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              
              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wallet size={18} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Pay Fees</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={18} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Fee Receipt</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Payment History</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Generate Invoice</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fdf2f8', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Fee Structure</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', background: '#fafafa' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Headset size={18} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Help & Support</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
