import React, { useEffect, useState } from "react";
import { 
  Megaphone, Plus, ClipboardList, CheckCircle2, Clock, AlertCircle,
  ChevronDown, Filter, LayoutGrid, MoreVertical, Check, MessageSquare,
  HelpCircle, Headset, ArrowUpRight, X, Send, Eye
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import TextType from "../../components/TextType";
import { apiClient as api } from "../../api/axios";

interface ComplaintItem {
  id: number;
  ticket_number: string;
  student_id: number;
  subject: string;
  description: string;
  category: string;
  resolution?: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  created_at: string;
  updated_at: string;
  student_name?: string;
  student_enrollment?: string;
}

export function MyComplaints() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [kpis, setKpis] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  // Form states
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Infrastructure");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const [resMy, resKpi] = await Promise.all([
        api.get<ComplaintItem[]>('/complaints/my'),
        api.get('/complaints/kpi')
      ]);
      setComplaints(resMy.data);
      setKpis(resKpi.data);
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    try {
      setSubmitting(true);
      await api.post('/complaints/', {
        subject,
        category,
        priority,
        description
      });
      
      setSubject("");
      setDescription("");
      setIsModalOpen(false);
      setToastMessage("Complaint submitted successfully!");
      setTimeout(() => setToastMessage(null), 3000);
      fetchComplaints();
    } catch (err) {
      console.error("Error creating complaint", err);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (statusFilter === "ALL") return true;
    return c.status === statusFilter;
  });

  const getPillStyle = (status: string) => {
    switch (status) {
      case "RESOLVED": return { bg: "#e8f5e9", text: "#10b981", label: "Resolved" };
      case "IN_PROGRESS": return { bg: "#fffbeb", text: "#f59e0b", label: "In Progress" };
      case "OPEN": return { bg: "#eff6ff", text: "#3b82f6", label: "Open" };
      case "CLOSED": return { bg: "#f3f4f6", text: "#6b7280", label: "Closed" };
      default: return { bg: "#f3f4f6", text: "#6b7280", label: status };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "HIGH": return { bg: "#fef2f2", text: "#ef4444" };
      case "MEDIUM": return { bg: "#fffbeb", text: "#f59e0b" };
      case "LOW": return { bg: "#f0fdf4", text: "#10b981" };
      default: return { bg: "#f3f4f6", text: "#6b7280" };
    }
  };

  // Pie chart calculation
  const categoryCounts: Record<string, number> = {};
  complaints.forEach(c => {
    const cat = c.category || "General";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryColors = ['#8b5cf6', '#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#6366f1'];
  const pieData = Object.keys(categoryCounts).length > 0 
    ? Object.keys(categoryCounts).map((cat, i) => ({
        name: cat,
        value: categoryCounts[cat],
        color: categoryColors[i % categoryColors.length]
      }))
    : [
        { name: 'Infrastructure', value: 3, color: '#8b5cf6' },
        { name: 'Academic', value: 2, color: '#3b82f6' },
        { name: 'Internet', value: 1, color: '#10b981' }
      ];

  const trendData = [
    { name: 'Apr 24', resolved: 2, inProgress: 1, closed: 0 },
    { name: 'May 24', resolved: 4, inProgress: 2, closed: 1 },
    { name: 'Jun 24', resolved: kpis.resolved || 5, inProgress: kpis.in_progress || 2, closed: kpis.closed || 1 }
  ];

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      
      {/* Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 9999,
              background: '#10b981',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <CheckCircle2 size={20} /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header with Animated Text Badge ── */}
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
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Raise, track and resolve your complaints in real time</div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: '#573cfa', color: 'white', borderRadius: '14px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(87, 60, 250, 0.3)', transition: 'all 0.2s' }}
        >
          <Plus size={18} /> Raise New Complaint
        </button>
      </div>

      {/* ── Real-Time Top KPI Cards Row ── */}
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
            minHeight: '165px',
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
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {kpis.total}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#573cfa', fontWeight: 600 }}>Real-time</span> · Database Sync
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
            minHeight: '165px',
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
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {kpis.resolved}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>{kpis.total > 0 ? Math.round((kpis.resolved / kpis.total) * 100) : 0}%</span> · Resolution Rate
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
            minHeight: '165px',
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
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {kpis.in_progress}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>Active</span> · Under Investigation
            </div>
          </div>
        </motion.div>

        {/* KPI 4 — Open */}
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
            minHeight: '165px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.08)' }}>
                <AlertCircle size={18} color="#3b82f6" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Open Tickets</span>
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {kpis.open}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>New</span> · Awaiting Review
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Grid: Complaints List (Left 2.2 cols) & Analytics (Right 1 col) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '32px', marginBottom: '32px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Complaints Table Card */}
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f3f4f6', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>My Complaints History</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: statusFilter === st ? '#573cfa' : '#f4f4f5',
                      color: statusFilter === st ? '#ffffff' : '#6b7280',
                      transition: 'all 0.15s'
                    }}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading complaints...</div>
              ) : filteredComplaints.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <ClipboardList size={40} color="#d1d5db" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>No complaints found</div>
                  <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>Click "Raise New Complaint" to lodge a ticket.</div>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <th style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Ticket #</th>
                      <th style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Subject & Category</th>
                      <th style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Priority</th>
                      <th style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Date</th>
                      <th style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '0 12px 12px 12px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((c) => {
                      const statusStyle = getPillStyle(c.status);
                      const prioStyle = getPriorityStyle(c.priority);
                      return (
                        <tr key={c.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                          <td style={{ padding: '16px 12px' }}>
                            <span style={{ background: '#f3f0ff', color: '#573cfa', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                              {c.ticket_number}
                            </span>
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>{c.subject}</div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>
                              Category: <span style={{ color: '#573cfa', fontWeight: 600 }}>{c.category || 'General'}</span>
                            </div>
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            <span style={{ background: prioStyle.bg, color: prioStyle.text, padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700 }}>
                              {c.priority}
                            </span>
                          </td>
                          <td style={{ padding: '16px 12px', fontSize: '12px', color: '#4b5563', fontWeight: 500 }}>
                            {new Date(c.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            <span style={{ background: statusStyle.bg, color: statusStyle.text, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                              {statusStyle.label}
                            </span>
                          </td>
                          <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                            <button
                              onClick={() => setSelectedComplaint(c)}
                              style={{ background: '#f3f4f6', border: 'none', color: '#374151', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Eye size={13} /> View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (Category breakdown) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Category Breakdown */}
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Category Breakdown</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '120px', height: '120px', position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={40} outerRadius={58} paddingAngle={2} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>{kpis.total}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>Total</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563', fontWeight: 500 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }}></div>
                      {d.name}
                    </div>
                    <div style={{ color: '#111827', fontWeight: 600 }}>{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── MODAL 1: RAISE COMPLAINT ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '520px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#09090b', margin: 0 }}>Lodge New Complaint</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} color="#71717a" />
                </button>
              </div>

              <form onSubmit={handleCreateComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Complaint Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wi-Fi not working in library floor 2"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', background: 'white' }}
                    >
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Internet/Wi-Fi">Internet / Wi-Fi</option>
                      <option value="Academics">Academics</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Cafeteria">Cafeteria</option>
                      <option value="Fee & Accounts">Fee & Accounts</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Priority Level</label>
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value as any)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', background: 'white' }}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High (Urgent)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Detailed Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide detailed description of the issue..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 18px', background: '#f3f4f6', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} style={{ padding: '10px 22px', background: '#573cfa', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Send size={15} /> {submitting ? "Submitting..." : "Submit Complaint"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: VIEW COMPLAINT DETAIL & RESOLUTION ── */}
      <AnimatePresence>
        {selectedComplaint && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '550px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <span style={{ background: '#f3f0ff', color: '#573cfa', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                    {selectedComplaint.ticket_number}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#09090b', margin: '8px 0 0 0' }}>
                    {selectedComplaint.subject}
                  </h3>
                </div>
                <button onClick={() => setSelectedComplaint(null)} style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} color="#71717a" />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f9fafb', padding: '14px', borderRadius: '12px' }}>
                  <div><strong>Category:</strong> {selectedComplaint.category}</div>
                  <div><strong>Priority:</strong> {selectedComplaint.priority}</div>
                  <div><strong>Status:</strong> <span style={{ color: getPillStyle(selectedComplaint.status).text, fontWeight: 700 }}>{selectedComplaint.status}</span></div>
                  <div><strong>Submitted On:</strong> {new Date(selectedComplaint.created_at).toLocaleString()}</div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>Description</label>
                  <p style={{ marginTop: '4px', color: '#1f2937', background: '#f8fafc', padding: '12px', borderRadius: '10px', lineHeight: 1.5 }}>
                    {selectedComplaint.description}
                  </p>
                </div>

                {selectedComplaint.resolution ? (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> Admin Resolution Reply:
                    </div>
                    <div style={{ fontSize: '13px', color: '#15803d', lineHeight: 1.5 }}>
                      {selectedComplaint.resolution}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '14px', borderRadius: '12px', fontSize: '12px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} /> Admin has received this ticket and will provide updates shortly.
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button onClick={() => setSelectedComplaint(null)} style={{ padding: '8px 20px', background: '#573cfa', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
