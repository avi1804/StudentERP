import React, { useEffect, useState, useRef } from "react";
import { 
  Megaphone, Search, Filter, RefreshCw, AlertCircle, Clock, 
  CheckCircle2, XCircle, ArrowUpRight, Eye, Check, X, Send, 
  MessageSquare, User, Tag, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient as api } from "../../../api/axios";

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

export function ManageComplaints() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Selected complaint for Admin Response Modal
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [updateStatus, setUpdateStatus] = useState<"OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED">("OPEN");
  const [updatePriority, setUpdatePriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [resolutionText, setResolutionText] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const prevTotalRef = useRef<number>(0);

  const fetchComplaints = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const [resAll, resStats] = await Promise.all([
        api.get<ComplaintItem[]>('/complaints/admin/all'),
        api.get('/complaints/admin/stats')
      ]);

      const newComplaints = resAll.data;
      setComplaints(newComplaints);
      setStats(resStats.data);

      // Trigger visual alert if new complaint arrived in real-time
      if (prevTotalRef.current > 0 && newComplaints.length > prevTotalRef.current) {
        setToastMessage("🔔 New complaint received in real time!");
        setTimeout(() => setToastMessage(null), 4000);
      }
      prevTotalRef.current = newComplaints.length;

    } catch (err) {
      console.error("Failed to fetch admin complaints", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();

    // Live real-time polling every 5 seconds
    const interval = setInterval(() => {
      fetchComplaints(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenManageModal = (complaint: ComplaintItem) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
    setUpdatePriority(complaint.priority);
    setResolutionText(complaint.resolution || "");
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      setSaving(true);
      const res = await api.patch(`/complaints/${selectedComplaint.id}/status`, {
        status: updateStatus,
        priority: updatePriority,
        resolution: resolutionText
      });

      setToastMessage(`Complaint #${selectedComplaint.ticket_number} updated to ${updateStatus}!`);
      setTimeout(() => setToastMessage(null), 3000);
      setSelectedComplaint(null);
      fetchComplaints(true);
    } catch (err) {
      console.error("Error updating complaint", err);
      alert("Failed to update complaint status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = 
      c.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.student_name && c.student_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.student_enrollment && c.student_enrollment.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>Open</span>;
      case "IN_PROGRESS":
        return <span style={{ background: '#fffbeb', color: '#d97706', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>In Progress</span>;
      case "RESOLVED":
        return <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>Resolved</span>;
      case "CLOSED":
        return <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>Closed</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <span style={{ background: '#fef2f2', color: '#dc2626', padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 800 }}>HIGH</span>;
      case "MEDIUM":
        return <span style={{ background: '#fffbeb', color: '#d97706', padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 800 }}>MEDIUM</span>;
      case "LOW":
        return <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 800 }}>LOW</span>;
      default:
        return <span>{priority}</span>;
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '100%', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Toast Alert Banner */}
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
              background: '#573cfa',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '14px',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(87, 60, 250, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <CheckCircle2 size={20} /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#09090b', margin: 0, letterSpacing: '-0.5px' }}>
              Student Complaints & Grievances
            </h1>
            <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              Live Real-Time Sync
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
            View, track, assign and resolve student complaints in real-time.
          </p>
        </div>

        <button
          onClick={() => fetchComplaints(true)}
          style={{ background: '#ffffff', border: '1.5px solid #e5e7eb', padding: '9px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refetching..." : "Refresh Feed"}
        </button>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
        {/* KPI 1: Total Received */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e5e7eb', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Total Received</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Megaphone size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#09090b' }}>{stats.total}</div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Complaints in system</div>
        </div>

        {/* KPI 2: Open / Pending */}
        <div style={{ background: stats.open > 0 ? '#eff6ff' : '#ffffff', borderRadius: '18px', border: stats.open > 0 ? '1.5px solid #93c5fd' : '1.5px solid #e5e7eb', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: stats.open > 0 ? '#1d4ed8' : '#6b7280' }}>Pending Review</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: stats.open > 0 ? '#1e40af' : '#09090b' }}>{stats.open}</div>
          <div style={{ fontSize: '12px', color: stats.open > 0 ? '#2563eb' : '#6b7280', marginTop: '4px', fontWeight: 600 }}>Needs Admin Action</div>
        </div>

        {/* KPI 3: In Progress */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e5e7eb', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>In Progress</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#09090b' }}>{stats.in_progress}</div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Under investigation</div>
        </div>

        {/* KPI 4: Resolved */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e5e7eb', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>Resolved</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#09090b' }}>{stats.resolved + stats.closed}</div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px', fontWeight: 600 }}>Resolved tickets</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e5e7eb', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        
        {/* Filters Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', width: '340px' }}>
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by ticket #, student name, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none' }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f4f4f5', padding: '3px', borderRadius: '10px' }}>
              {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: statusFilter === st ? '#573cfa' : 'transparent',
                    color: statusFilter === st ? '#ffffff' : '#6b7280',
                    transition: 'all 0.15s'
                  }}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Priority Filter Select */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '12px', fontWeight: 600, outline: 'none', background: 'white' }}
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority Only</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#9ca3af' }}>
              Loading real-time complaints stream...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>
              <Megaphone size={40} color="#d1d5db" style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#374151' }}>No complaints match criteria</div>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>All incoming student complaints will automatically render here live.</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <th style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Ticket #</th>
                  <th style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Student Info</th>
                  <th style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Subject & Category</th>
                  <th style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Priority</th>
                  <th style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Received</th>
                  <th style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: '#6b7280', textAlign: 'left', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '0 12px 12px 12px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{ background: '#f3f0ff', color: '#573cfa', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                        {c.ticket_number}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#09090b' }}>
                        {c.student_name || 'Student'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>
                        {c.student_enrollment || `ID: #${c.student_id}`}
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
                        {c.subject}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>
                        Category: <span style={{ color: '#573cfa', fontWeight: 600 }}>{c.category || 'General'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      {getPriorityBadge(c.priority)}
                    </td>
                    <td style={{ padding: '16px 12px', fontSize: '12px', color: '#4b5563', fontWeight: 500 }}>
                      {new Date(c.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      {getStatusBadge(c.status)}
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleOpenManageModal(c)}
                        style={{ background: '#573cfa', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 6px rgba(87,60,250,0.2)' }}
                      >
                        <MessageSquare size={13} /> Respond
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── ADMIN MANAGE COMPLAINT MODAL ── */}
      <AnimatePresence>
        {selectedComplaint && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '620px', padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', position: 'relative' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <span style={{ background: '#f3f0ff', color: '#573cfa', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                    Ticket #{selectedComplaint.ticket_number}
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', margin: '6px 0 0 0' }}>
                    {selectedComplaint.subject}
                  </h3>
                </div>
                <button onClick={() => setSelectedComplaint(null)} style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} color="#71717a" />
                </button>
              </div>

              {/* Student Details Summary */}
              <div style={{ background: '#f9fafb', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                <div><strong>Student Name:</strong> {selectedComplaint.student_name || 'Student'}</div>
                <div><strong>Enrollment #:</strong> {selectedComplaint.student_enrollment || 'N/A'}</div>
                <div><strong>Category:</strong> {selectedComplaint.category || 'General'}</div>
                <div><strong>Received On:</strong> {new Date(selectedComplaint.created_at).toLocaleString()}</div>
              </div>

              {/* Original Complaint Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: '6px' }}>Student Description:</label>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', fontSize: '13px', color: '#1f2937', lineHeight: 1.5, border: '1px solid #e2e8f0' }}>
                  {selectedComplaint.description}
                </div>
              </div>

              <form onSubmit={handleSaveStatus} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Update Status</label>
                    <select
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value as any)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', background: 'white', fontWeight: 600 }}
                    >
                      <option value="OPEN">OPEN (Awaiting action)</option>
                      <option value="IN_PROGRESS">IN PROGRESS (Under review)</option>
                      <option value="RESOLVED">RESOLVED (Solution provided)</option>
                      <option value="CLOSED">CLOSED (Case closed)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Set Priority</label>
                    <select
                      value={updatePriority}
                      onChange={(e) => setUpdatePriority(e.target.value as any)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', background: 'white', fontWeight: 600 }}
                    >
                      <option value="LOW">Low Priority</option>
                      <option value="MEDIUM">Medium Priority</option>
                      <option value="HIGH">High Priority (Urgent)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Official Admin Response / Resolution Reply</label>
                  <textarea
                    rows={4}
                    placeholder="Enter resolution notes, action taken, or explanation for the student..."
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    style={{ padding: '10px 18px', background: '#f3f4f6', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ padding: '10px 22px', background: '#573cfa', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Send size={15} /> {saving ? "Saving..." : "Update Complaint"}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
