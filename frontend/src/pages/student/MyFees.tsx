import React from "react";
import { 
  Wallet, Receipt, Clock, Calendar, ChevronDown, Download,
  FileText, ArrowRight, Bell, Headset
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', background: '#f3f0ff', borderRadius: '12px', marginRight: '16px', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Wallet size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Fee Management</h1>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>Track, manage and view your fee payments</div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {/* Total Fees */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Wallet size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Total Fees</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>₹ 1,20,000</div>
            <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>This Academic Year</div>
          </div>
        </div>

        {/* Paid Fees */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Receipt size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Paid Fees</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>₹ 80,000</div>
            <div style={{ fontSize: '10px', color: '#111827', fontWeight: 600, marginTop: '2px' }}>66.67% of total</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: '24px', right: '24px', height: '3px', background: '#10b981', borderRadius: '3px 3px 0 0' }} />
        </div>

        {/* Pending Fees */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Wallet size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Pending Fees</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>₹ 40,000</div>
            <div style={{ fontSize: '10px', color: '#111827', fontWeight: 600, marginTop: '2px' }}>33.33% of total</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: '24px', right: '24px', height: '3px', background: '#f59e0b', borderRadius: '3px 3px 0 0' }} />
        </div>

        {/* Overdue Amount */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Overdue Amount</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>₹ 5,000</div>
            <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600, marginTop: '2px' }}>Due Immediately</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: '24px', right: '24px', height: '3px', background: '#ef4444', borderRadius: '3px 3px 0 0' }} />
        </div>

        {/* Next Due Date */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Calendar size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Next Due Date</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>15 Jun 2024</div>
            <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>45 Days Left</div>
          </div>
        </div>

      </div>

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
