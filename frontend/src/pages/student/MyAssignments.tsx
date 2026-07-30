import React, { useState } from "react";
import { 
  ClipboardList, CheckCircle2, Clock, AlertCircle,
  Filter, List, Grid, MoreVertical, 
  ChevronLeft, ChevronRight, ChevronDown, ArrowUpRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import TextType from "../../components/TextType";

export function MyAssignments() {
  const [activeTab, setActiveTab] = useState("All Assignments");
  const [selectedSemester, setSelectedSemester] = useState("7");

  const pieData = [
    { name: 'Submitted', value: 7, color: '#3b82f6' },
    { name: 'Pending', value: 4, color: '#f59e0b' },
    { name: 'Overdue', value: 1, color: '#ef4444' },
    // { name: 'Graded', value: 7, color: '#10b981' } - omitting from chart to match 3 slices in image, but will show in legend
  ];

  const assignments = [
    {
      id: 1,
      title: "Operating System Case Study",
      type: "Case Study",
      subjectCode: "CS701",
      subjectName: "Operating Systems",
      assignedOn: "12 May 2024",
      dueDate: "26 May 2024",
      dueTimeInfo: "2 Days Left",
      dueColor: "#f59e0b",
      status: "Pending",
      marks: "-",
      iconColor: "purple"
    },
    {
      id: 2,
      title: "DBMS Normalization Problems",
      type: "Problem Set",
      subjectCode: "CS702",
      subjectName: "DBMS",
      assignedOn: "10 May 2024",
      dueDate: "25 May 2024",
      dueTimeInfo: "1 Day Left",
      dueColor: "#f59e0b",
      status: "Pending",
      marks: "-",
      iconColor: "green"
    },
    {
      id: 3,
      title: "Computer Networks Report",
      type: "Report",
      subjectCode: "CS703",
      subjectName: "Computer Networks",
      assignedOn: "08 May 2024",
      dueDate: "20 May 2024",
      dueTimeInfo: "3 Days Overdue",
      dueColor: "#ef4444",
      status: "Overdue",
      marks: "-",
      iconColor: "red"
    },
    {
      id: 4,
      title: "Software Design Patterns",
      type: "Assignment",
      subjectCode: "CS704",
      subjectName: "Software Engineering",
      assignedOn: "05 May 2024",
      dueDate: "18 May 2024",
      dueTimeInfo: "",
      dueColor: "",
      status: "Submitted",
      marks: "18 / 20",
      iconColor: "blue"
    },
    {
      id: 5,
      title: "ML Model Implementation",
      type: "Programming",
      subjectCode: "CS705",
      subjectName: "Machine Learning",
      assignedOn: "01 May 2024",
      dueDate: "15 May 2024",
      dueTimeInfo: "",
      dueColor: "",
      status: "Graded",
      marks: "19 / 20",
      iconColor: "yellow"
    }
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case "purple": return { bg: "#f3f0ff", text: "#573cfa" };
      case "green": return { bg: "#e8f5e9", text: "#10b981" };
      case "red": return { bg: "#fef2f2", text: "#ef4444" };
      case "blue": return { bg: "#eff6ff", text: "#3b82f6" };
      case "yellow": return { bg: "#fffbeb", text: "#f59e0b" };
      default: return { bg: "#f3f0ff", text: "#573cfa" };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending": return { bg: "#fffbeb", text: "#f59e0b", border: "1px solid #fde68a" };
      case "Overdue": return { bg: "#fef2f2", text: "#ef4444", border: "1px solid #fecaca" };
      case "Submitted": return { bg: "#eff6ff", text: "#3b82f6", border: "1px solid #bfdbfe" };
      case "Graded": return { bg: "#e8f5e9", text: "#10b981", border: "1px solid #bbf7d0" };
      default: return { bg: "#f3f4f6", text: "#6b7280", border: "1px solid #e5e7eb" };
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
                text={["Assignments", "Homework", "Submissions"]}
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
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>View and manage all assignments assigned to you</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px' }}>Semester</label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                padding: '8px 36px 8px 16px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '13px',
                color: '#374151',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <option value="7">Semester 7 (Current)</option>
              <option value="6">Semester 6</option>
              <option value="5">Semester 5</option>
              <option value="4">Semester 4</option>
              <option value="3">Semester 3</option>
              <option value="2">Semester 2</option>
              <option value="1">Semester 1</option>
            </select>
            <ChevronDown size={14} color="#6b7280" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* ── Real-Time Top KPI Cards Row (AutoML Studio design matching Main Dashboard) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}
      >
        {/* KPI 1 — Total Assignments */}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Assignments</span>
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
              <span style={{ color: '#573cfa', fontWeight: 600 }}>100%</span> · Allotted This Semester
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Completed */}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Completed</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              7
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>58%</span> · Successfully Submitted
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Pending */}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Pending</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              4
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>33%</span> · Pending Submission
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
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)' }}>
                <AlertCircle size={18} color="#ef4444" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Overdue</span>
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
              <span style={{ color: '#ef4444', fontWeight: 600 }}>8%</span> · Urgent Action Required
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main List Section */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', marginBottom: '24px', overflow: 'hidden' }}>
        
        {/* Filters and Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['All Assignments', 'Pending', 'Submitted', 'Graded', 'Overdue'].map(tab => (
              <div 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: activeTab === tab ? '#573cfa' : '#6b7280', 
                  cursor: 'pointer',
                  position: 'relative',
                  paddingBottom: '16px',
                  marginBottom: '-16px'
                }}
              >
                {tab}
                {activeTab === tab && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#573cfa' }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
              <Filter size={16} /> Filter
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
              Sort by: Due Date <ChevronDown size={16} color="#6b7280" />
            </div>
            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
              <div style={{ padding: '6px', background: 'white', borderRadius: '6px', color: '#573cfa', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                <List size={16} />
              </div>
              <div style={{ padding: '6px', color: '#9ca3af', cursor: 'pointer' }}>
                <Grid size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 0.5fr', gap: '16px', padding: '16px 24px', borderBottom: '1px solid #f3f4f6', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>
          <div>Assignment</div>
          <div>Subject</div>
          <div>Assigned On</div>
          <div>Due Date</div>
          <div>Status</div>
          <div>Marks</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {/* Table Body */}
        <div>
          {assignments.map((item, idx) => {
            const iconColors = getIconColor(item.iconColor);
            const statusBadge = getStatusBadge(item.status);

            return (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 0.5fr', gap: '16px', padding: '16px 24px', borderBottom: idx === assignments.length - 1 ? 'none' : '1px solid #f3f4f6', alignItems: 'center' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: iconColors.bg, color: iconColors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.type}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#573cfa', background: '#f3f0ff', padding: '2px 6px', borderRadius: '4px' }}>{item.subjectCode}</span>
                  <span style={{ fontSize: '13px', color: '#4b5563' }}>{item.subjectName}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4b5563' }}>
                  <Clock size={14} color="#9ca3af" /> {item.assignedOn}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4b5563', marginBottom: item.dueTimeInfo ? '2px' : '0' }}>
                    <Clock size={14} color="#9ca3af" /> {item.dueDate}
                  </div>
                  {item.dueTimeInfo && (
                    <div style={{ fontSize: '11px', fontWeight: 600, color: item.dueColor }}>{item.dueTimeInfo}</div>
                  )}
                </div>

                <div>
                  <span style={{ background: statusBadge.bg, color: statusBadge.text, border: statusBadge.border, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                    {item.status}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#4b5563', fontWeight: item.marks !== "-" ? 600 : 400 }}>
                  {item.marks}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                  <button style={{ padding: '6px 12px', background: 'white', border: '1px solid #e5e7eb', color: '#573cfa', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    View
                  </button>
                  <button style={{ padding: '6px', background: 'white', border: '1px solid #e5e7eb', color: '#6b7280', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Showing 1 to 5 of 12 assignments
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#9ca3af', cursor: 'pointer' }}>
              <ChevronLeft size={16} />
            </button>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f0ff', border: '1px solid #f3f0ff', borderRadius: '6px', color: '#573cfa', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              1
            </button>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#4b5563', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              2
            </button>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#4b5563', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              3
            </button>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#9ca3af', cursor: 'pointer' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 3 Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        
        {/* Assignment Overview */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>Assignment Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '120px', height: '120px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={45} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1 }}>12</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Total</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Submitted', value: '7 (58%)', color: '#3b82f6' },
                { name: 'Pending', value: '4 (33%)', color: '#f59e0b' },
                { name: 'Overdue', value: '1 (8%)', color: '#ef4444' },
                { name: 'Graded', value: '7 (58%)', color: '#10b981' }
              ].map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.color }}></div>
                    {g.name}
                  </div>
                  <div style={{ color: '#6b7280' }}>{g.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Upcoming Deadlines</h3>
            <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View all</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#573cfa', textTransform: 'uppercase' }}>MAY</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>25</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>DBMS Normalization Problems</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>CS702 - DBMS</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b' }}>1 Day Left</div>
            </div>
            
            <div style={{ height: '1px', background: '#f3f4f6' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#573cfa', textTransform: 'uppercase' }}>MAY</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>26</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Operating System Case Study</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>CS701 - Operating Systems</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b' }}>2 Days Left</div>
            </div>
            
            <div style={{ height: '1px', background: '#f3f4f6' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>JUN</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>02</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>AI Project Proposal</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>CS706 - Artificial Intelligence</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af' }}>9 Days Left</div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Recent Submissions</h3>
            <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View all</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Software Design Patterns</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>CS704 - Software Engineering</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ background: '#e8f5e9', color: '#10b981', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, border: '1px solid #bbf7d0' }}>Graded</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>18/20</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>10 May 2024</div>
                </div>
              </div>
            </div>
            
            <div style={{ height: '1px', background: '#f3f4f6' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>ML Model Implementation</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>CS705 - Machine Learning</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ background: '#e8f5e9', color: '#10b981', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, border: '1px solid #bbf7d0' }}>Graded</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>19/20</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>08 May 2024</div>
                </div>
              </div>
            </div>
            
            <div style={{ height: '1px', background: '#f3f4f6' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Software Requirements Doc</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>CS704 - Software Engineering</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, border: '1px solid #bfdbfe' }}>Submitted</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>-</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>06 May 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
