import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { 
  ClipboardList, CheckCircle2, Clock, AlertCircle,
  Filter, List, Grid, MoreVertical, 
  ChevronLeft, ChevronRight, ChevronDown, ArrowUpRight, FileUp, X, Download
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import TextType from "../../components/TextType";

export function MyAssignments() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("All Assignments");
  const [selectedSemester, setSelectedSemester] = useState("7");
  const [submitModalAssignment, setSubmitModalAssignment] = useState<any | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  const [submissionFileName, setSubmissionFileName] = useState('Assignment_Solution.pdf');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchStudentAssignments();
  }, []);

  const fetchStudentAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/assignments/student');
      setAssignments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModalAssignment || !submissionUrl) return;

    try {
      await api.post(`/assignments/student/${submitModalAssignment.id}/submit`, {
        submission_url: submissionUrl,
        file_name: submissionFileName
      });
      setMessage({ text: 'Assignment submitted successfully!', type: 'success' });
      setSubmitModalAssignment(null);
      fetchStudentAssignments();
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Failed to submit assignment';
      setMessage({ text: detail, type: 'error' });
    }
  };

  const totalCount = assignments.length;
  const completedCount = assignments.filter(a => a.status === 'SUBMITTED' || a.status === 'GRADED').length;
  const pendingCount = assignments.filter(a => a.status === 'PENDING').length;
  const overdueCount = assignments.filter(a => a.status === 'OVERDUE').length;

  const pieData = [
    { name: 'Submitted', value: completedCount, color: '#3b82f6' },
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },
    { name: 'Overdue', value: overdueCount, color: '#ef4444' },
  ];

  const filteredAssignments = assignments.filter(a => {
    if (activeTab === "Pending") return a.status === 'PENDING';
    if (activeTab === "Submitted") return a.status === 'SUBMITTED' || a.status === 'GRADED';
    if (activeTab === "Overdue") return a.status === 'OVERDUE';
    return true;
  });

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header ── */}
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
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>View and submit assignments for your enrolled subjects</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px' }}>Semester</label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{
                appearance: 'none',
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
            </select>
            <ChevronDown size={14} color="#6b7280" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {message.text && (
        <div style={{
          marginBottom: '24px', padding: '14px 20px', borderRadius: '12px',
          backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
          color: message.type === 'error' ? '#ef4444' : '#22c55e',
          border: message.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)',
          fontWeight: 600, fontSize: '13px'
        }}>
          {message.text}
        </div>
      )}

      {/* ── Top KPI Cards Row ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}
      >
        {/* KPI 1 — Total */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{ background: '#f4f4f5', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '24px', padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '185px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(87,60,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(87,60,250,0.08)' }}>
                <ClipboardList size={18} color="#573cfa" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Assignments</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>{totalCount}</div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}><span style={{ color: '#573cfa', fontWeight: 600 }}>Enrolled</span> · Sem 7 Subjects</div>
          </div>
        </motion.div>

        {/* KPI 2 — Completed */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{ background: '#f4f4f5', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '24px', padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '185px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.08)' }}>
                <CheckCircle2 size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Completed</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>{completedCount}</div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}><span style={{ color: '#22c55e', fontWeight: 600 }}>Submitted</span> · Verified</div>
          </div>
        </motion.div>

        {/* KPI 3 — Pending */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{ background: '#f4f4f5', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '24px', padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '185px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.08)' }}>
                <Clock size={18} color="#f59e0b" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Pending</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>{pendingCount}</div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}><span style={{ color: '#f59e0b', fontWeight: 600 }}>Action Required</span></div>
          </div>
        </motion.div>

        {/* KPI 4 — Overdue */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{ background: '#f4f4f5', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '24px', padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '185px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)' }}>
                <AlertCircle size={18} color="#ef4444" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Overdue</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>{overdueCount}</div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}><span style={{ color: '#ef4444', fontWeight: 600 }}>Expired</span></div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Main Section ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Left Column: Assignment List */}
        <div>
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
            {["All Assignments", "Pending", "Submitted", "Overdue"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? '#6366f1' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : '#64748b',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Assignments List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((a) => (
                <div key={a.id} style={{ background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', background: 'rgba(99,102,241,0.08)', padding: '2px 8px', borderRadius: '6px' }}>
                        {a.subject_code}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Prof. {a.faculty_name}</span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: '6px 0 4px 0' }}>{a.title}</h3>
                    <div style={{ fontSize: '12px', color: '#71717a' }}>{a.subject_name} • Due: {a.due_date} ({a.due_time})</div>
                    {a.remarks && (
                      <div style={{ marginTop: '8px', fontSize: '12px', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', borderLeft: '3px solid #6366f1', color: '#475569' }}>
                        <strong>Feedback:</strong> {a.remarks}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                      background: a.status === 'GRADED' ? 'rgba(34,197,94,0.1)' : a.status === 'SUBMITTED' ? 'rgba(59,130,246,0.1)' : a.status === 'OVERDUE' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                      color: a.status === 'GRADED' ? '#22c55e' : a.status === 'SUBMITTED' ? '#3b82f6' : a.status === 'OVERDUE' ? '#ef4444' : '#f59e0b'
                    }}>
                      {a.status} {a.marks !== '-' ? `(${a.marks})` : ''}
                    </span>

                    {a.status === 'PENDING' && (
                      <button
                        onClick={() => setSubmitModalAssignment(a)}
                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FileUp size={14} /> Submit Work
                      </button>
                    )}
                    {(a.status === 'SUBMITTED' || a.status === 'GRADED') && a.submitted_file && (
                      <a
                        href={a.submitted_file}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#6366f1', fontSize: '12px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Download size={14} /> View Submission
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', color: '#71717a', fontSize: '14px', background: '#ffffff', borderRadius: '20px', border: '1.5px solid rgba(0,0,0,0.06)' }}>
                No assignments found in this view.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Breakdown Chart */}
        <div>
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid rgba(0,0,0,0.06)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', marginBottom: '16px' }}>Status Breakdown</h3>
            <div style={{ height: '180px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={50} outerRadius={70} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
              {pieData.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.color }} />
                    <span style={{ fontWeight: 600, color: '#3f3f46' }}>{p.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#09090b' }}>{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STUDENT SUBMISSION MODAL ── */}
      <AnimatePresence>
        {submitModalAssignment && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', margin: 0 }}>
                  Upload Assignment Submission
                </h3>
                <button onClick={() => setSubmitModalAssignment(null)} style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} color="#71717a" />
                </button>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', marginBottom: '20px', fontSize: '13px' }}>
                <div style={{ fontWeight: 700, color: '#09090b' }}>{submitModalAssignment.title}</div>
                <div style={{ color: '#64748b', marginTop: '2px' }}>Subject: {submitModalAssignment.subject_name} • Max Marks: {submitModalAssignment.max_marks}</div>
              </div>

              <form onSubmit={handleStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>
                    Submission File Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={submissionFileName}
                    onChange={e => setSubmissionFileName(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>
                    File URL / Document Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={submissionUrl}
                    onChange={e => setSubmissionUrl(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setSubmitModalAssignment(null)} style={{ background: '#f4f4f5', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 600, color: '#52525b', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', padding: '10px 22px', borderRadius: '12px', fontWeight: 700, color: '#ffffff', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
                    Confirm & Submit
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
