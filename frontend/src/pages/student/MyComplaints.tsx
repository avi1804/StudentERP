import React from "react";
import { 
  Megaphone, Plus, ClipboardList, CheckCircle2, Clock, AlertCircle,
  ChevronDown, Filter, LayoutGrid, MoreVertical, Check, MessageSquare,
  HelpCircle, Headset, ArrowUpRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import TextType from "../../components/TextType";

export function MyComplaints() {

  const pieData = [
    { name: 'Infrastructure', value: 5, color: '#8b5cf6' },
    { name: 'Cafeteria', value: 3, color: '#f59e0b' },
    { name: 'Internet', value: 2, color: '#3b82f6' },
    { name: 'Hostel', value: 1, color: '#10b981' },
    { name: 'Others', value: 1, color: '#ec4899' }
  ];

  const trendData = [
    { name: 'Apr 24', resolved: 3, inProgress: 1, closed: 0 },
    { name: 'Apr 24', resolved: 5, inProgress: 2, closed: 1 },
    { name: 'May 24', resolved: 5, inProgress: 3, closed: 2 },
    { name: 'May 24', resolved: 6.5, inProgress: 4.5, closed: 2.5 },
    { name: 'May 24', resolved: 6, inProgress: 4, closed: 2 },
    { name: 'Jun 24', resolved: 8, inProgress: 5, closed: 3 }
  ];

  const complaints = [
    { id: "CMP-2024-012", title: "Wi-Fi not working in library", desc: "Unable to connect to Wi-Fi in 3rd floor library.", category: "Internet", catColor: "blue", date: "26 May 2024", status: "In Progress", statusColor: "yellow", updateDate: "26 May 2024", updateTime: "2:30 PM" },
    { id: "CMP-2024-011", title: "Classroom projector issue", desc: "Projector in Room 302 is not working properly.", category: "Infrastructure", catColor: "blue", date: "20 May 2024", status: "Resolved", statusColor: "green", updateDate: "23 May 2024", updateTime: "11:15 AM" },
    { id: "CMP-2024-010", title: "Cafeteria food quality", desc: "Food quality is not satisfactory today.", category: "Cafeteria", catColor: "pink", date: "18 May 2024", status: "In Progress", statusColor: "yellow", updateDate: "19 May 2024", updateTime: "9:45 AM" },
    { id: "CMP-2024-009", title: "Water leakage in hostel", desc: "Water leaking in Room B-205 bathroom.", category: "Hostel", catColor: "teal", date: "15 May 2024", status: "Resolved", statusColor: "green", updateDate: "17 May 2024", updateTime: "4:20 PM" },
    { id: "CMP-2024-008", title: "AC not working in lab", desc: "AC is not cooling in Computer Lab 1.", category: "Infrastructure", catColor: "blue", date: "10 May 2024", status: "Closed", statusColor: "gray", updateDate: "11 May 2024", updateTime: "2:10 PM" }
  ];

  const getPillStyle = (color: string) => {
    switch(color) {
      case "blue": return { bg: "#eff6ff", text: "#3b82f6" };
      case "pink": return { bg: "#fdf2f8", text: "#ec4899" };
      case "teal": return { bg: "#f0fdf4", text: "#14b8a6" }; // teal-ish
      case "green": return { bg: "#e8f5e9", text: "#10b981" };
      case "yellow": return { bg: "#fffbeb", text: "#f59e0b" };
      case "purple": return { bg: "#f3f0ff", text: "#573cfa" };
      case "gray": return { bg: "#f3f4f6", text: "#6b7280" };
      default: return { bg: "#f3f4f6", text: "#6b7280" };
    }
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      
      {/* ── Header with Animated Highlighted Text Badge (Matching Main Dashboard & Attendance) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>My</span>
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
                text={["Complaints", "Grievances", "Support"]}
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
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Raise, track and resolve your complaints</div>
        </div>

        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: '#573cfa', color: 'white', borderRadius: '14px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(87, 60, 250, 0.3)' }}>
          <Plus size={18} /> Raise New Complaint
        </button>
      </div>

      {/* ── Real-Time Top KPI Cards Row (AutoML Studio design matching Main Dashboard) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}
      >
        {/* KPI 1 — Total Complaints */}
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
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(87,60,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(87,60,250,0.08)' }}>
                <ClipboardList size={18} color="#573cfa" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Complaints</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              12
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#573cfa', fontWeight: 600 }}>100%</span> · Total Registered
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Resolved */}
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
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.08)' }}>
                <CheckCircle2 size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Resolved</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              8
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>67%</span> · Resolved Successfully
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — In Progress */}
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
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.08)' }}>
                <Clock size={18} color="#f59e0b" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>In Progress</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              3
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>25%</span> · Under Investigation
            </div>
          </div>
        </motion.div>

        {/* KPI 4 — Closed */}
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
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)' }}>
                <AlertCircle size={18} color="#ef4444" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Closed</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              1
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>8%</span> · Closed / Archived
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Layout (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* My Complaints Table */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#573cfa', margin: 0 }}>My Complaints</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  All Status <ChevronDown size={14} color="#6b7280" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  <Filter size={14} color="#6b7280" /> Filter
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  Sort by: Latest <ChevronDown size={14} color="#6b7280" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#f3f0ff', color: '#573cfa', borderRadius: '8px', cursor: 'pointer' }}>
                  <LayoutGrid size={16} />
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <th style={{ padding: '0 12px 12px 12px', fontSize: '10px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Complaint ID</th>
                    <th style={{ padding: '0 12px 12px 12px', fontSize: '10px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</th>
                    <th style={{ padding: '0 12px 12px 12px', fontSize: '10px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
                    <th style={{ padding: '0 12px 12px 12px', fontSize: '10px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date Raised</th>
                    <th style={{ padding: '0 12px 12px 12px', fontSize: '10px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                    <th style={{ padding: '0 12px 12px 12px', fontSize: '10px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Update</th>
                    <th style={{ padding: '0 12px 12px 12px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, i) => {
                    const catStyle = getPillStyle(c.catColor);
                    const statusStyle = getPillStyle(c.statusColor);
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{ background: '#f3f0ff', color: '#573cfa', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>{c.id}</span>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>{c.title}</div>
                          <div style={{ fontSize: '11px', color: '#6b7280', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.desc}</div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{ color: catStyle.text, fontSize: '11px', fontWeight: 600 }}>{c.category}</span>
                        </td>
                        <td style={{ padding: '16px 12px', fontSize: '12px', color: '#111827', fontWeight: 500 }}>
                          {c.date}
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{ background: statusStyle.bg, color: statusStyle.text, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>{c.status}</span>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{c.updateDate}</div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>{c.updateTime}</div>
                        </td>
                        <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                          <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><MoreVertical size={16} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <button style={{ width: '100%', background: '#f8fafc', border: 'none', color: '#573cfa', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginTop: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              View All Complaints &rarr;
            </button>
          </div>

          {/* Bottom Left Grid (Trend & Updates) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Complaint Status Trend */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Complaint Status Trend</h3>
              
              <div style={{ width: '100%', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#4b5563', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="inProgress" name="In Progress" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} />
                    <Line type="monotone" dataKey="closed" name="Closed" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Updates */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Recent Updates</h3>
                <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View All</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Your complaint CMP-2024-011 has been resolved.</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>23 May 2024, 11:15 AM</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Your complaint CMP-2024-012 is being processed.</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>26 May 2024, 2:30 PM</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>New response on CMP-2024-010 from admin.</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>19 May 2024, 9:45 AM</div>
                  </div>
                </div>
              </div>

              <button style={{ width: '100%', background: 'none', border: 'none', color: '#573cfa', padding: '12px', fontSize: '13px', fontWeight: 600, marginTop: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                View All Updates &rarr;
              </button>
            </div>

          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Complaint Overview */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Complaint Overview</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', color: '#374151', cursor: 'pointer' }}>
                This Semester <ChevronDown size={14} color="#6b7280" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '130px', height: '130px', position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>12</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Total</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563', fontWeight: 500 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }}></div>
                      {d.name}
                    </div>
                    <div style={{ color: '#111827', fontWeight: 600 }}>{d.value} <span style={{ color: '#6b7280', fontWeight: 'normal' }}>({Math.round((d.value/12)*100)}%)</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Quick Actions</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              
              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={20} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>Raise Complaint</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClipboardList size={20} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>My Complaints</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HelpCircle size={20} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>FAQ & Help</div>
              </div>

              <div style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Headset size={20} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>Contact Support</div>
              </div>

            </div>
          </div>

          {/* Need Help? */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', flex: 1, position: 'relative', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Need Help?</h3>
            <div style={{ fontSize: '12px', color: '#6b7280', maxWidth: '60%', lineHeight: 1.5, marginBottom: '24px' }}>
              Can't find what you're looking for? Our support team is here to help you.
            </div>
            <button style={{ padding: '10px 20px', background: '#573cfa', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              Contact Support
            </button>
            
            {/* Illustrative element mocked using icons/shapes */}
            <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '140px', height: '140px', background: '#f3f0ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#573cfa', opacity: 0.1, position: 'absolute', top: '-10px', right: '-10px' }}></div>
                <Headset size={64} color="#573cfa" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
