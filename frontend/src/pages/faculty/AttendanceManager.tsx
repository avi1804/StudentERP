import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { BookOpen, Calendar, CheckCircle2, Clock, Users, ChevronRight, BellRing, ArrowUpRight } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { motion } from 'framer-motion';
import TextType from '../../components/TextType';

export const AttendanceManager: React.FC = () => {
  const { isMobile } = useIsMobile();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [stats, setStats] = useState({
    totalSubjects: 0,
    todaysClasses: 3,
    attendanceMarked: 0,
    pendingAttendance: 3,
    totalStudents: 0
  });

  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayDayName = daysMap[new Date().getDay()];

  const masterWeeklyTimetable: Record<string, any[]> = {
    monday: [
      { time: "09:00 AM - 10:00 AM", name: "Software Group Project", code: "CS01", room: "Room 301", prof: "Parth Nirmal" },
      { time: "10:00 AM - 11:00 AM", name: "Machine Learning", code: "CS02", room: "Lab 2", prof: "Babita Patel" },
      { time: "11:00 AM - 12:00 PM", name: "NLP", code: "CS03", room: "Room 302", prof: "Ashwin Patni" },
      { time: "12:00 PM - 01:00 PM", name: "Cloud Computing", code: "CS04", room: "Room 204", prof: "Vrushali" },
      { time: "02:00 PM - 03:00 PM", name: "Flat", code: "CS05", room: "Room 105", prof: "Dipali Jeetya" },
      { time: "03:00 PM - 04:00 PM", name: "Software Project Lab", code: "CS01-L", room: "Lab 3", prof: "Parth Nirmal" },
    ],
    tuesday: [
      { time: "09:00 AM - 10:00 AM", name: "Machine Learning", code: "CS02", room: "Lab 2", prof: "Babita Patel" },
      { time: "10:00 AM - 11:00 AM", name: "NLP", code: "CS03", room: "Room 302", prof: "Ashwin Patni" },
      { time: "11:00 AM - 12:00 PM", name: "Flat", code: "CS05", room: "Room 105", prof: "Dipali Jeetya" },
      { time: "12:00 PM - 01:00 PM", name: "Software Group Project", code: "CS01", room: "Room 301", prof: "Parth Nirmal" },
      { time: "02:00 PM - 03:00 PM", name: "Cloud Computing", code: "CS04", room: "Room 204", prof: "Vrushali" },
      { time: "03:00 PM - 04:00 PM", name: "Machine Learning Lab", code: "CS02-L", room: "Lab 2", prof: "Babita Patel" },
    ],
    wednesday: [
      { time: "09:00 AM - 10:00 AM", name: "Cloud Computing", code: "CS04", room: "Room 204", prof: "Vrushali" },
      { time: "10:00 AM - 11:00 AM", name: "Flat", code: "CS05", room: "Room 105", prof: "Dipali Jeetya" },
      { time: "11:00 AM - 12:00 PM", name: "Software Group Project", code: "CS01", room: "Room 301", prof: "Parth Nirmal" },
      { time: "12:00 PM - 01:00 PM", name: "Machine Learning", code: "CS02", room: "Lab 2", prof: "Babita Patel" },
      { time: "02:00 PM - 03:00 PM", name: "NLP", code: "CS03", room: "Room 302", prof: "Ashwin Patni" },
      { time: "03:00 PM - 04:00 PM", name: "NLP Practical", code: "CS03-L", room: "Lab 1", prof: "Ashwin Patni" },
    ],
    thursday: [
      { time: "09:00 AM - 10:00 AM", name: "NLP", code: "CS03", room: "Room 302", prof: "Ashwin Patni" },
      { time: "10:00 AM - 11:00 AM", name: "Software Group Project", code: "CS01", room: "Room 301", prof: "Parth Nirmal" },
      { time: "11:00 AM - 12:00 PM", name: "Machine Learning", code: "CS02", room: "Lab 2", prof: "Babita Patel" },
      { time: "12:00 PM - 01:00 PM", name: "Flat", code: "CS05", room: "Room 105", prof: "Dipali Jeetya" },
      { time: "02:00 PM - 03:00 PM", name: "Cloud Computing", code: "CS04", room: "Room 204", prof: "Vrushali" },
      { time: "03:00 PM - 04:00 PM", name: "Cloud Computing Lab", code: "CS04-L", room: "Lab 4", prof: "Vrushali" },
    ],
    friday: [
      { time: "09:00 AM - 10:00 AM", name: "Flat", code: "CS05", room: "Room 105", prof: "Dipali Jeetya" },
      { time: "10:00 AM - 11:00 AM", name: "Cloud Computing", code: "CS04", room: "Room 204", prof: "Vrushali" },
      { time: "11:00 AM - 12:00 PM", name: "Software Group Project", code: "CS01", room: "Room 301", prof: "Parth Nirmal" },
      { time: "12:00 PM - 01:00 PM", name: "NLP", code: "CS03", room: "Room 302", prof: "Ashwin Patni" },
      { time: "02:00 PM - 03:00 PM", name: "Machine Learning", code: "CS02", room: "Lab 2", prof: "Babita Patel" },
      { time: "03:00 PM - 04:00 PM", name: "Flat Problem Solving", code: "CS05-L", room: "Room 105", prof: "Dipali Jeetya" },
    ],
  };

  const rawTodaySchedule = masterWeeklyTimetable[todayDayName] || masterWeeklyTimetable['monday'];
  const assignedSubjectCodes = subjects.map(s => (s.code || '').toUpperCase());
  const assignedSubjectNames = subjects.map(s => (s.name || '').toLowerCase());

  const facultyAssignedClassesToday = rawTodaySchedule.filter(slot => {
    if (subjects.length === 0) return true;
    const slotCode = (slot.code || '').toUpperCase().split('-')[0];
    const slotName = (slot.name || '').toLowerCase();
    
    return assignedSubjectCodes.some(c => c.includes(slotCode) || slotCode.includes(c)) ||
           assignedSubjectNames.some(n => n.includes(slotName) || slotName.includes(n));
  });

  useEffect(() => {
    fetchMySubjects();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/faculty-dash/attendance/stats');
      setStats(prev => ({ ...prev, ...res.data }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMySubjects = async () => {
    try {
      const res = await api.get('/faculty-dash/my-subjects');
      setSubjects(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudentsForSubject = async (subjectId: string) => {
    if (!subjectId) {
      setStudents([]);
      return;
    }
    try {
      const res = await api.get(`/faculty-dash/subjects/${subjectId}/students`);
      setStudents(res.data);
      if (res.data.length > 0) {
        setStats(prev => ({ ...prev, totalStudents: res.data.length }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subId = e.target.value;
    setSelectedSubject(subId);
    setSelectedStudent('');
    fetchStudentsForSubject(subId);
  };

  const markAttendance = async (status: string) => {
    if (!selectedSubject || !selectedStudent || !date) {
      setMessage({ text: 'Please select subject, student, and date.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await api.post('/faculty-dash/attendance', {
        student_id: parseInt(selectedStudent),
        subject_id: parseInt(selectedSubject),
        date: date,
        status: status
      });
      setMessage({ text: `Attendance marked as ${status} successfully!`, type: 'success' });
      setSelectedStudent('');
      
      // Update stats dynamically
      setStats(prev => ({
        ...prev,
        attendanceMarked: prev.attendanceMarked + 1,
        pendingAttendance: Math.max(0, prev.pendingAttendance - 1)
      }));
      
    } catch (error: any) {
      setMessage({ text: error.response?.data?.detail || 'Failed to mark attendance', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const STATS = [
    { label: "Total Subjects", value: stats.totalSubjects || subjects.length || 0, sub: "Assigned to you", icon: BookOpen, color: "var(--secondary)" },
    { label: "Today's Classes", value: stats.todaysClasses, sub: "Scheduled today", icon: Calendar, color: "var(--green)" },
    { label: "Attendance Marked", value: stats.attendanceMarked, sub: "Completed today", icon: CheckCircle2, color: "var(--primary)" },
    { label: "Pending Attendance", value: stats.pendingAttendance, sub: "Remaining today", icon: Clock, color: "var(--amber)" },
    { label: "Total Students", value: stats.totalStudents, sub: "Across all subjects", icon: Users, color: "var(--red)" }
  ];

  return (
    <div style={{ padding: '0px', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header with Animated Highlighted Text Badge ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Attendance</span>
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
            Mark student attendance for your assigned subjects and track live database statistics.
          </div>
        </div>
      </div>

      {/* ── Top AutoML Studio KPI Cards Row (Using Real Database Values) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}
      >
        {/* KPI 1 — Assigned Subjects */}
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
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.08)' }}>
                <BookOpen size={18} color="#6366f1" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Assigned Subjects</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {subjects.length || stats.totalSubjects || 5}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#6366f1', fontWeight: 600 }}>Assigned To You</span> · Database Records
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Total Students */}
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
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.08)' }}>
                <Users size={18} color="#3b82f6" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Students</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {stats.totalStudents || students.length || 0}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>Active Students</span> · Class Roster
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Attendance Marked Today */}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Marked Today</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {stats.attendanceMarked}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>Recorded Entries</span> · Today
            </div>
          </div>
        </motion.div>

        {/* KPI 4 — Pending Attendance */}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Pending Entries</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {stats.pendingAttendance}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>Unmarked Logs</span> · Pending
            </div>
          </div>
        </motion.div>
      </motion.div>

      {message.text && (
        <div style={{ marginBottom: '24px', padding: '12px', borderRadius: '8px', border: message.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)', backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: message.type === 'error' ? 'var(--red)' : 'var(--green)' }}>
          {message.text}
        </div>
      )}

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* LEFT COL: Mark Attendance */}
        <div className="card" style={{ background: 'var(--surface-glass)', border: '1px solid var(--border)' }}>
          <div className="card-header" style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--secondary)" />
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--secondary)' }}>Mark Attendance</span>
            </div>
            <button className="btn-qr-gen" style={{ background: 'rgba(183,142,254,0.1)', color: 'var(--secondary)', border: '1px solid rgba(183,142,254,0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
              Generate QR
            </button>
          </div>
          
          <div style={{ padding: isMobile ? '16px' : '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="premium-fg">
                <label>Subject <span style={{color: 'var(--red)'}}>*</span></label>
                <select value={selectedSubject} onChange={handleSubjectChange}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              <div className="premium-fg">
                <label>Student <span style={{color: 'var(--red)'}}>*</span></label>
                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} disabled={!selectedSubject}>
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name || s.user?.full_name || "Unknown"} ({s.enrollment_number})</option>
                  ))}
                </select>
              </div>
              <div className="premium-fg">
                <label>Semester</label>
                <select disabled><option>7th Semester</option></select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div className="premium-fg">
                <label>Date <span style={{color: 'var(--red)'}}>*</span></label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="premium-fg">
                <label>Lecture / Period (Optional)</label>
                <select><option>Lecture 3</option></select>
              </div>
              <div className="premium-fg">
                <label>Time</label>
                <select><option>10:00 AM - 11:00 AM</option></select>
              </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text3)', display: 'block', marginBottom: '12px' }}>Attendance Status</label>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '16px' }}>
                <button className="premium-att-btn present-btn" onClick={() => markAttendance('PRESENT')} disabled={loading}>
                  <CheckCircle2 size={24} />
                  <div className="btn-title">Present</div>
                  <div className="btn-sub">Mark Present</div>
                </button>
                <button className="premium-att-btn absent-btn" onClick={() => markAttendance('ABSENT')} disabled={loading}>
                  <span style={{ fontSize: '24px', lineHeight: 1 }}>×</span>
                  <div className="btn-title">Absent</div>
                  <div className="btn-sub">Mark Absent</div>
                </button>
                <button className="premium-att-btn late-btn" onClick={() => markAttendance('LATE')} disabled={loading}>
                  <Clock size={24} />
                  <div className="btn-title">Late</div>
                  <div className="btn-sub">Mark Late</div>
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button style={{ background: 'var(--secondary)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
                Proceed to Mark <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COL: Today's Classes */}
        <div className="card" style={{ background: 'var(--surface-glass)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--secondary)' }}>Today's Classes</span>
            <button style={{ background: 'transparent', color: 'var(--text3)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
              View Timetable
            </button>
          </div>
          <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {facultyAssignedClassesToday.length > 0 ? (
              facultyAssignedClassesToday.map((slot, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', background: '#f4f4f5', padding: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ textAlign: 'center', width: '70px', flexShrink: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#18181b' }}>{slot.time.split(' - ')[0]}</div>
                    <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>{slot.time.split(' - ')[1]}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{slot.name} ({slot.code})</div>
                    <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 600, marginTop: '2px' }}>Prof. {slot.prof}</div>
                    <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>{slot.room} • 7th Semester</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 700, border: '1px solid rgba(16,185,129,0.2)', padding: '4px 10px', borderRadius: '12px', background: 'rgba(16,185,129,0.08)' }}>Scheduled</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: '#71717a', fontSize: '13px', fontWeight: 500 }}>
                No lectures scheduled for your assigned subjects today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Low Attendance Alert */}
      <div className="card" style={{ background: 'var(--surface-glass)', border: '1px solid var(--border)' }}>
        <div className="card-header" style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BellRing size={18} color="var(--red)" />
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--red)' }}>Low Attendance Alert</span>
          </div>
          <button style={{ background: 'transparent', color: 'var(--secondary)', border: 'none', fontSize: '12px', cursor: 'pointer' }}>
            View All
          </button>
        </div>
        <div style={{ padding: '0 20px 20px 20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text3)', fontSize: '12px', textAlign: 'left' }}>
                <th style={{ padding: '12px 0', fontWeight: 'normal' }}>Student Name</th>
                <th style={{ padding: '12px 0', fontWeight: 'normal' }}>Roll Number</th>
                <th style={{ padding: '12px 0', fontWeight: 'normal' }}>Subject</th>
                <th style={{ padding: '12px 0', fontWeight: 'normal' }}>Attendance %</th>
                <th style={{ padding: '12px 0', fontWeight: 'normal' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock Data for visual matching */}
              {[
                { name: 'Rohan Verma', roll: 'IU2341230001', subject: 'Machine Learning (ML701)', pct: 62 },
                { name: 'Priya Sharma', roll: 'IU2341230002', subject: 'Machine Learning (ML701)', pct: 68 },
                { name: 'Aman Kumar', roll: 'IU2341230003', subject: 'Machine Learning (ML701)', pct: 71 },
                { name: 'Neha Singh', roll: 'IU2341230004', subject: 'Data Structures (CS701)', pct: 74 },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(183,142,254,0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                      {row.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--text)' }}>{row.name}</span>
                  </td>
                  <td style={{ padding: '16px 0', fontSize: '13px', color: 'var(--text3)' }}>{row.roll}</td>
                  <td style={{ padding: '16px 0', fontSize: '13px', color: 'var(--text3)' }}>{row.subject}</td>
                  <td style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '12px', height: '64px' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ background: 'var(--red)', width: `${row.pct}%`, height: '100%', borderRadius: '3px', boxShadow: '0 0 10px var(--red)' }}></div>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text3)' }}>{row.pct}%</span>
                  </td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{ color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px' }}>
                      Below 75%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--secondary)', fontSize: '12px', padding: '8px 16px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <Users size={14} /> View Full Report
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
