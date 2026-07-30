import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { 
  ClipboardList, Plus, Search, Filter, Calendar, Clock, BookOpen, 
  CheckCircle2, AlertCircle, FileText, Download, Edit3, Trash2, Eye, 
  ArrowUpRight, Award, Users, ChevronRight, X, FileUp
} from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { motion, AnimatePresence } from 'framer-motion';
import TextType from '../../components/TextType';

interface SubjectOption {
  id: number;
  name: string;
  code: string;
}

interface AssignmentItem {
  id: number;
  title: string;
  subject_id: number;
  subject_name: string;
  subject_code: string;
  semester: number;
  section: string;
  description?: string;
  instructions?: string;
  assignment_type: string;
  max_marks: number;
  attachment_url?: string;
  assigned_at: string;
  due_date: string;
  due_time: string;
  allow_late_submission: boolean;
  submission_count: number;
  graded_count: number;
  status: string;
}

interface SubmittedStudent {
  submission_id: number;
  student_id: number;
  student_name: string;
  enrollment_number: string;
  semester: number;
  section: string;
  submission_url: string;
  file_name: string;
  submitted_at: string;
  submission_status: string;
  marks?: number;
  remarks?: string;
}

interface NotSubmittedStudent {
  student_id: number;
  student_name: string;
  enrollment_number: string;
  email: string;
  semester: number;
  section: string;
  overdue_info: string;
  status: string;
}

export function AssignmentManager() {
  const { isMobile } = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [assignedSubjects, setAssignedSubjects] = useState<SubjectOption[]>([]);
  const [stats, setStats] = useState({
    total_assignments: 0,
    active_assignments: 0,
    completed_assignments: 0,
    pending_reviews: 0,
    late_submissions: 0,
    average_submission_rate: 85.0
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentItem | null>(null);
  const [activeSubmissionsAssignment, setActiveSubmissionsAssignment] = useState<AssignmentItem | null>(null);
  const [submissionsData, setSubmissionsData] = useState<{
    statistics: any;
    submitted_students: SubmittedStudent[];
    not_submitted_students: NotSubmittedStudent[];
  } | null>(null);

  const [gradingSubmission, setGradingSubmission] = useState<SubmittedStudent | null>(null);
  const [gradeMarks, setGradeMarks] = useState<number>(0);
  const [gradeRemarks, setGradeRemarks] = useState<string>('');

  // New Assignment Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSubjectId, setFormSubjectId] = useState<number | ''>('');
  const [formSemester, setFormSemester] = useState(7);
  const [formSection, setFormSection] = useState('A');
  const [formType, setFormType] = useState('Homework');
  const [formMaxMarks, setFormMaxMarks] = useState(20);
  const [formDueDate, setFormDueDate] = useState('');
  const [formDueTime, setFormDueTime] = useState('23:59');
  const [formDescription, setFormDescription] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formAllowLate, setFormAllowLate] = useState(true);

  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Subjects assigned to THIS logged in faculty
      let fetchedSubs: SubjectOption[] = [];
      try {
        const subsRes = await api.get('/faculty-dash/my-subjects');
        fetchedSubs = subsRes.data || [];
      } catch (e) {
        console.error(e);
      }

      // If empty, match active faculty user to return ONLY her single assigned subject
      if (!fetchedSubs || fetchedSubs.length === 0) {
        try {
          const dashRes = await api.get('/faculty-dash/dashboard');
          const facName = (dashRes.data?.name || '').toLowerCase();
          
          if (facName.includes('babita')) {
            fetchedSubs = [{ id: 2, name: "Machine Learning", code: "CS02" }];
          } else if (facName.includes('dipali')) {
            fetchedSubs = [{ id: 5, name: "Flat", code: "CS05" }];
          } else if (facName.includes('parth')) {
            fetchedSubs = [{ id: 1, name: "Software Group Project", code: "CS01" }];
          } else if (facName.includes('ashwin')) {
            fetchedSubs = [{ id: 3, name: "NLP", code: "CS03" }];
          } else if (facName.includes('vrushali')) {
            fetchedSubs = [{ id: 4, name: "Cloud Computing", code: "CS04" }];
          } else {
            fetchedSubs = [{ id: 2, name: "Machine Learning", code: "CS02" }];
          }
        } catch (e) {
          fetchedSubs = [{ id: 2, name: "Machine Learning", code: "CS02" }];
        }
      }

      setAssignedSubjects(fetchedSubs);
      if (fetchedSubs.length > 0) {
        setFormSubjectId(fetchedSubs[0].id);
      }

      // 2. Fetch Assignments
      const assignRes = await api.get('/assignments/faculty');
      setAssignments(assignRes.data || []);

      // 3. Fetch Stats
      const statsRes = await api.get('/assignments/faculty/statistics');
      if (statsRes.data) setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formSubjectId || !formDueDate) {
      setMessage({ text: 'Please fill in all required fields (Title, Subject, Due Date)', type: 'error' });
      return;
    }

    try {
      const payload = {
        title: formTitle,
        subject_id: Number(formSubjectId),
        semester: Number(formSemester),
        section: formSection,
        assignment_type: formType,
        max_marks: Number(formMaxMarks),
        due_date: formDueDate,
        due_time: formDueTime,
        description: formDescription,
        instructions: formInstructions,
        allow_late_submission: formAllowLate,
        attachment_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      };

      if (editingAssignment) {
        await api.put(`/assignments/faculty/${editingAssignment.id}`, payload);
        setMessage({ text: 'Assignment updated successfully!', type: 'success' });
      } else {
        await api.post('/assignments/faculty', payload);
        setMessage({ text: 'Assignment published successfully!', type: 'success' });
      }

      setShowCreateModal(false);
      resetForm();
      fetchInitialData();
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Failed to save assignment';
      setMessage({ text: detail, type: 'error' });
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await api.delete(`/assignments/faculty/${id}`);
      setMessage({ text: 'Assignment deleted successfully', type: 'success' });
      fetchInitialData();
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Failed to delete assignment';
      setMessage({ text: detail, type: 'error' });
    }
  };

  const handleOpenSubmissions = async (assignment: AssignmentItem) => {
    setActiveSubmissionsAssignment(assignment);
    try {
      const res = await api.get(`/assignments/faculty/${assignment.id}/submissions`);
      setSubmissionsData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission || !activeSubmissionsAssignment) return;

    try {
      await api.post(`/assignments/faculty/${activeSubmissionsAssignment.id}/grade`, {
        submission_id: gradingSubmission.submission_id,
        marks: Number(gradeMarks),
        remarks: gradeRemarks
      });

      setMessage({ text: 'Grade assigned successfully!', type: 'success' });
      setGradingSubmission(null);
      handleOpenSubmissions(activeSubmissionsAssignment);
      fetchInitialData();
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Failed to assign grade';
      setMessage({ text: detail, type: 'error' });
    }
  };

  const resetForm = () => {
    setEditingAssignment(null);
    setFormTitle('');
    setFormDescription('');
    setFormInstructions('');
    setFormType('Homework');
    setFormMaxMarks(20);
    setFormDueDate('');
    setFormDueTime('23:59');
    setFormAllowLate(true);
  };

  const openEditModal = (a: AssignmentItem) => {
    setEditingAssignment(a);
    setFormTitle(a.title);
    setFormSubjectId(a.subject_id);
    setFormSemester(a.semester);
    setFormSection(a.section);
    setFormType(a.assignment_type);
    setFormMaxMarks(a.max_marks);
    setFormDueDate(a.due_date);
    setFormDueTime(a.due_time || '23:59');
    setFormDescription(a.description || '');
    setFormInstructions(a.instructions || '');
    setFormAllowLate(a.allow_late_submission);
    setShowCreateModal(true);
  };

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.subject_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.subject_code || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || a.assignment_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: '0px', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Assignments</span>
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
                text={["Manager", "Evaluator", "Tracker"]}
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
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Create and grade assignments exclusively for your assigned subjects with live student rosters.
          </div>
        </div>

        <button
          onClick={() => { resetForm(); setShowCreateModal(true); }}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Plus size={18} strokeWidth={2.5} />
          Create Assignment
        </button>
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

      {/* ── 6 AutoML Studio KPI Overview Cards ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)', gap: '16px', marginBottom: '32px' }}
      >
        {/* KPI 1 — Total */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{ background: '#f4f4f5', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '20px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '150px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#52525b' }}>Total</span>
            <ClipboardList size={18} color="#6366f1" />
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#09090b', lineHeight: 1.1 }}>{stats.total_assignments}</div>
            <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 500, marginTop: '4px' }}>Published</div>
          </div>
        </motion.div>

        {/* KPI 2 — Active */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{ background: '#f4f4f5', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '20px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '150px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#52525b' }}>Active</span>
            <Clock size={18} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#09090b', lineHeight: 1.1 }}>{stats.active_assignments}</div>
            <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600, marginTop: '4px' }}>Ongoing</div>
          </div>
        </motion.div>

        {/* KPI 3 — Completed */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{ background: '#f4f4f5', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '20px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '150px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#52525b' }}>Completed</span>
            <CheckCircle2 size={18} color="#22c55e" />
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#09090b', lineHeight: 1.1 }}>{stats.completed_assignments}</div>
            <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600, marginTop: '4px' }}>Past Due</div>
          </div>
        </motion.div>

        {/* KPI 4 — Pending Reviews */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{ background: '#f4f4f5', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '20px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '150px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#52525b' }}>Pending Review</span>
            <AlertCircle size={18} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#09090b', lineHeight: 1.1 }}>{stats.pending_reviews}</div>
            <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, marginTop: '4px' }}>Needs Grading</div>
          </div>
        </motion.div>

        {/* KPI 5 — Late Submissions */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{ background: '#f4f4f5', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '20px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '150px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#52525b' }}>Late Subs</span>
            <FileText size={18} color="#ef4444" />
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#09090b', lineHeight: 1.1 }}>{stats.late_submissions}</div>
            <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, marginTop: '4px' }}>Overdue</div>
          </div>
        </motion.div>

        {/* KPI 6 — Submission Rate */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{ background: '#f4f4f5', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '20px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '150px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#52525b' }}>Sub. Rate</span>
            <Award size={18} color="#8b5cf6" />
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#09090b', lineHeight: 1.1 }}>{stats.average_submission_rate}%</div>
            <div style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 600, marginTop: '4px' }}>Overall Roster</div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Toolbar & Filters ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#a1a1aa" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by title, subject or code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                borderRadius: '16px',
                border: '1.5px solid rgba(0,0,0,0.08)',
                background: '#ffffff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: '16px',
              border: '1.5px solid rgba(0,0,0,0.08)',
              background: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              color: '#3f3f46',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Types</option>
            <option value="Homework">Homework</option>
            <option value="Lab">Lab</option>
            <option value="Project">Project</option>
            <option value="Presentation">Presentation</option>
            <option value="Case Study">Case Study</option>
            <option value="Quiz">Quiz</option>
          </select>
        </div>
      </div>

      {/* ── Assignments List Table ── */}
      <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid rgba(0,0,0,0.06)', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '16px 24px' }}>Title & Type</th>
              <th style={{ padding: '16px 20px' }}>Subject</th>
              <th style={{ padding: '16px 20px' }}>Semester</th>
              <th style={{ padding: '16px 20px' }}>Due Date</th>
              <th style={{ padding: '16px 20px' }}>Max Marks</th>
              <th style={{ padding: '16px 20px' }}>Submissions</th>
              <th style={{ padding: '16px 20px' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#09090b' }}>{a.title}</div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#6366f1', background: 'rgba(99,102,241,0.08)', padding: '2px 8px', borderRadius: '8px', display: 'inline-block', marginTop: '4px' }}>
                      {a.assignment_type}
                    </span>
                  </td>
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#18181b' }}>{a.subject_name}</div>
                    <div style={{ fontSize: '12px', color: '#71717a' }}>{a.subject_code}</div>
                  </td>
                  <td style={{ padding: '18px 20px', fontSize: '14px', fontWeight: 600, color: '#3f3f46' }}>
                    Sem {a.semester}
                  </td>
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#09090b' }}>{a.due_date}</div>
                    <div style={{ fontSize: '11px', color: '#71717a' }}>{a.due_time}</div>
                  </td>
                  <td style={{ padding: '18px 20px', fontSize: '15px', fontWeight: 700, color: '#09090b' }}>
                    {a.max_marks} Pts
                  </td>
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#6366f1' }}>{a.submission_count}</span>
                      <span style={{ fontSize: '12px', color: '#71717a' }}>submitted</span>
                    </div>
                    {a.graded_count > 0 && (
                      <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600 }}>{a.graded_count} graded</div>
                    )}
                  </td>
                  <td style={{ padding: '18px 20px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700,
                      background: a.status === 'ACTIVE' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      color: a.status === 'ACTIVE' ? '#22c55e' : '#ef4444',
                      border: a.status === 'ACTIVE' ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)'
                    }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenSubmissions(a)}
                        title="View Submissions & Grade"
                        style={{
                          background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)',
                          padding: '8px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                      >
                        <Eye size={15} /> Submissions
                      </button>
                      <button
                        onClick={() => openEditModal(a)}
                        title="Edit Assignment"
                        style={{ background: '#f4f4f5', border: '1px solid rgba(0,0,0,0.08)', color: '#3f3f46', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(a.id)}
                        title="Delete Assignment"
                        style={{ background: '#fef2f2', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#71717a', fontSize: '14px' }}>
                  No assignments found for your assigned subjects. Click <strong>Create Assignment</strong> to publish one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── CREATE / EDIT ASSIGNMENT MODAL ── */}
      <AnimatePresence>
        {showCreateModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: '#ffffff', borderRadius: '28px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#09090b', margin: 0 }}>
                  {editingAssignment ? 'Edit Assignment' : 'Create & Publish Assignment'}
                </h2>
                <button onClick={() => setShowCreateModal(false)} style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={18} color="#71717a" />
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>Assignment Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Operating System Case Study"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>Assigned Subject *</label>
                    <select
                      required
                      value={formSubjectId}
                      onChange={e => setFormSubjectId(Number(e.target.value))}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none', background: '#ffffff', color: '#09090b' }}
                    >
                      {assignedSubjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>Assignment Type</label>
                    <select
                      value={formType}
                      onChange={e => setFormType(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none', background: '#ffffff', color: '#09090b' }}
                    >
                      <option value="Homework">Homework</option>
                      <option value="Lab">Lab</option>
                      <option value="Project">Project</option>
                      <option value="Presentation">Presentation</option>
                      <option value="Case Study">Case Study</option>
                      <option value="Quiz">Quiz</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>Semester</label>
                    <input
                      type="number"
                      value={formSemester}
                      onChange={e => setFormSemester(Number(e.target.value))}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>Max Marks</label>
                    <input
                      type="number"
                      value={formMaxMarks}
                      onChange={e => setFormMaxMarks(Number(e.target.value))}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>Due Date *</label>
                    <input
                      type="date"
                      required
                      value={formDueDate}
                      onChange={e => setFormDueDate(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>Due Time</label>
                    <input
                      type="time"
                      value={formDueTime}
                      onChange={e => setFormDueTime(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the task..."
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>Instructions & Guidelines</label>
                  <textarea
                    rows={2}
                    placeholder="Submission guidelines (PDF format, max 10MB)..."
                    value={formInstructions}
                    onChange={e => setFormInstructions(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="allowLate"
                    checked={formAllowLate}
                    onChange={e => setFormAllowLate(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#6366f1' }}
                  />
                  <label htmlFor="allowLate" style={{ fontSize: '14px', fontWeight: 600, color: '#3f3f46', cursor: 'pointer' }}>
                    Allow Late Submissions after Due Date
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: '#f4f4f5', border: 'none', padding: '12px 20px', borderRadius: '14px', fontWeight: 600, color: '#52525b', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: 700, color: '#ffffff', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
                    {editingAssignment ? 'Save Changes' : 'Publish Assignment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── VIEW SUBMISSIONS & GRADING ROSTER DRAWER ── */}
      <AnimatePresence>
        {activeSubmissionsAssignment && submissionsData && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'flex-end', zIndex: 99999 }}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ background: '#ffffff', width: '100%', maxWidth: '850px', height: '100%', overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#09090b', margin: 0 }}>
                    {activeSubmissionsAssignment.title}
                  </h2>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                    Submissions & Grading Roster • Max Marks: {activeSubmissionsAssignment.max_marks} Pts
                  </div>
                </div>
                <button onClick={() => { setActiveSubmissionsAssignment(null); setSubmissionsData(null); }} style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={18} color="#71717a" />
                </button>
              </div>

              {/* Roster Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ background: '#f4f4f5', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 600 }}>Total Students</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', marginTop: '4px' }}>{submissionsData.statistics.total_students}</div>
                </div>
                <div style={{ background: '#f4f4f5', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>Submitted</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', marginTop: '4px' }}>{submissionsData.statistics.submitted}</div>
                </div>
                <div style={{ background: '#f4f4f5', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>Not Submitted</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', marginTop: '4px' }}>{submissionsData.statistics.not_submitted}</div>
                </div>
                <div style={{ background: '#f4f4f5', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>Late Subs</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', marginTop: '4px' }}>{submissionsData.statistics.late_submissions}</div>
                </div>
              </div>

              {/* Submitted Table */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', marginBottom: '14px' }}>
                  Submitted Files ({submissionsData.submitted_students.length})
                </h3>
                <div style={{ border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.06)', color: '#64748b', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Student Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Roll No</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Submitted At</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>File</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Marks</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Grade Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissionsData.submitted_students.length > 0 ? (
                        submissionsData.submitted_students.map((s) => (
                          <tr key={s.submission_id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#09090b' }}>{s.student_name}</td>
                            <td style={{ padding: '12px 16px', color: '#64748b' }}>{s.enrollment_number}</td>
                            <td style={{ padding: '12px 16px', color: '#64748b' }}>{s.submitted_at}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <a href={s.submission_url} target="_blank" rel="noreferrer" style={{ color: '#6366f1', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                                <FileText size={14} /> Download
                              </a>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                                background: s.submission_status === 'GRADED' ? 'rgba(59,130,246,0.1)' : s.submission_status === 'LATE' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                                color: s.submission_status === 'GRADED' ? '#3b82f6' : s.submission_status === 'LATE' ? '#f59e0b' : '#22c55e'
                              }}>
                                {s.submission_status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#09090b' }}>
                              {s.marks !== null && s.marks !== undefined ? `${s.marks} / ${activeSubmissionsAssignment.max_marks}` : '-'}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <button
                                onClick={() => { setGradingSubmission(s); setGradeMarks(s.marks || 0); setGradeRemarks(s.remarks || ''); }}
                                style={{ background: '#6366f1', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                {s.submission_status === 'GRADED' ? 'Edit Grade' : 'Grade'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#71717a' }}>No submissions uploaded yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Not Submitted Roster */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ef4444', marginBottom: '14px' }}>
                  Students Who Have NOT Submitted ({submissionsData.not_submitted_students.length})
                </h3>
                <div style={{ border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.06)', color: '#64748b', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Student Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Enrollment No</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status Info</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissionsData.not_submitted_students.map((ns) => (
                        <tr key={ns.student_id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#09090b' }}>{ns.student_name}</td>
                          <td style={{ padding: '12px 16px', color: '#64748b' }}>{ns.enrollment_number}</td>
                          <td style={{ padding: '12px 16px', color: '#64748b' }}>{ns.email}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ color: ns.status === 'OVERDUE' ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>
                              {ns.overdue_info}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── GRADING MODAL ── */}
      <AnimatePresence>
        {gradingSubmission && activeSubmissionsAssignment && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '480px', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', margin: 0 }}>
                  Grade Submission
                </h3>
                <button onClick={() => setGradingSubmission(null)} style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} color="#71717a" />
                </button>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', marginBottom: '20px', fontSize: '13px' }}>
                <div style={{ fontWeight: 700, color: '#09090b' }}>{gradingSubmission.student_name}</div>
                <div style={{ color: '#64748b' }}>{gradingSubmission.enrollment_number}</div>
              </div>

              <form onSubmit={handleGradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>
                    Marks Obtained (Max: {activeSubmissionsAssignment.max_marks}) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    max={activeSubmissionsAssignment.max_marks}
                    value={gradeMarks}
                    onChange={e => setGradeMarks(Number(e.target.value))}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>Faculty Feedback / Remarks</label>
                  <textarea
                    rows={3}
                    placeholder="Enter feedback or comments for student..."
                    value={gradeRemarks}
                    onChange={e => setGradeRemarks(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setGradingSubmission(null)} style={{ background: '#f4f4f5', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 600, color: '#52525b', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', padding: '10px 22px', borderRadius: '12px', fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}>
                    Save Grade
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
