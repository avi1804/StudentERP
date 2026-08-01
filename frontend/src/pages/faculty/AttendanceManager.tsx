import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { BookOpen, Calendar, CheckCircle2, Clock, Users, ChevronRight, BellRing, ArrowUpRight, Check, XCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { motion } from 'framer-motion';
import TextType from '../../components/TextType';
import { TimetableAttendanceService, resolveTeacherIdByName } from '../../services/timetableAttendanceService';
import type { LectureInstance } from '../../services/timetableAttendanceService';
import { useAuthStore } from '../../store/authStore';

export const AttendanceManager: React.FC = () => {
  const { isMobile } = useIsMobile();
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<LectureInstance[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Resolve the logged-in faculty's teacher ID by matching their name
  const facultyName = user?.full_name || '';
  const resolvedTeacherId = resolveTeacherIdByName(facultyName);
  const [activeTeacherId, setActiveTeacherId] = useState<number>(resolvedTeacherId || 102);

  useEffect(() => {
    if (resolvedTeacherId) {
      setActiveTeacherId(resolvedTeacherId);
    }
  }, [resolvedTeacherId]);

  const myAssignedSubjects = TimetableAttendanceService.getAssignedSubjectsForTeacher(activeTeacherId);

  const [stats, setStats] = useState({
    totalSubjects: 5,
    todaysClasses: 6,
    attendanceMarked: 18,
    pendingAttendance: 2,
    totalStudents: 30
  });

  useEffect(() => {
    fetchMySubjects();
    fetchStudents();
  }, [activeTeacherId]);

  useEffect(() => {
    // Whenever date or active teacher changes, load auto-generated timetable slots for that date
    // FILTERED to only the active faculty's assigned subjects
    const slots = TimetableAttendanceService.getLectureInstancesForDateByTeacher(date, activeTeacherId);
    setAvailableSlots(slots);
    if (slots.length > 0) {
      setSelectedSlotId(slots[0].id);
      setSelectedSubject(String(slots[0].subjectId));
    } else {
      setSelectedSlotId('');
      setSelectedSubject('');
    }
  }, [date, activeTeacherId]);

  const fetchMySubjects = async () => {
    try {
      const res = await api.get('/faculty-dash/my-subjects');
      // Filter API results to only subjects assigned to this teacher
      const filtered = res.data.filter((s: any) => myAssignedSubjects.some(a => a.subjectId === s.id));
      setSubjects(filtered.length > 0 ? filtered : res.data);
    } catch {
      // Fallback: use only the subjects assigned to this teacher from timetable
      setSubjects(myAssignedSubjects.map(s => ({ id: s.subjectId, name: s.subjectName, code: s.subjectCode })));
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/faculty-dash/subjects/1/students`);
      setStudents(res.data);
    } catch {
      setStudents([
        { id: 1, name: "Harsh Patel", enrollment_number: "21001" },
        { id: 2, name: "Yash Patel", enrollment_number: "21002" },
        { id: 3, name: "Aarav Sharma", enrollment_number: "21003" },
        { id: 4, name: "Priya Singh", enrollment_number: "21004" },
      ]);
    }
  };

  const handleSlotChange = (slotId: string) => {
    setSelectedSlotId(slotId);
    const foundSlot = availableSlots.find(s => s.id === slotId);
    if (foundSlot) {
      setSelectedSubject(String(foundSlot.subjectId));
    }
  };

  const markAttendance = (status: 'present' | 'absent' | 'cancelled') => {
    if (!selectedSlotId || !date) {
      setMessage({ text: 'Please select a valid Timetable slot and date.', type: 'error' });
      return;
    }

    const currentSlot = availableSlots.find(s => s.id === selectedSlotId);
    if (!currentSlot) {
      setMessage({ text: 'Selected slot does not exist in Timetable.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      TimetableAttendanceService.markAttendance(
        currentSlot.id,
        currentSlot.date,
        currentSlot.subjectId,
        currentSlot.subjectCode,
        status
      );

      setMessage({ text: `Attendance for ${currentSlot.subjectName} marked as ${status.toUpperCase()}!`, type: 'success' });
      setStats(prev => ({
        ...prev,
        attendanceMarked: prev.attendanceMarked + 1,
        pendingAttendance: Math.max(0, prev.pendingAttendance - 1)
      }));
    } catch (error: any) {
      setMessage({ text: 'Failed to mark attendance', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0px', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Header */}
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
                text={["Manager", "Timetable Synced", "Evaluator"]}
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
            Mark student attendance strictly against auto-generated Timetable lecture slots.
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          style={{ background: '#f4f4f5', borderRadius: '24px', padding: '22px 24px', border: '1.5px solid rgba(0,0,0,0.07)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={18} color="#6366f1" />
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>My Subjects</span>
            </div>
          </div>
          <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', marginTop: '16px' }}>{myAssignedSubjects.length}</div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          style={{ background: '#f4f4f5', borderRadius: '24px', padding: '22px 24px', border: '1.5px solid rgba(0,0,0,0.07)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={18} color="#3b82f6" />
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Students</span>
            </div>
          </div>
          <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', marginTop: '16px' }}>{students.length || 30}</div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          style={{ background: '#f4f4f5', borderRadius: '24px', padding: '22px 24px', border: '1.5px solid rgba(0,0,0,0.07)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#22c55e" />
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Marked Entries</span>
            </div>
          </div>
          <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', marginTop: '16px' }}>{stats.attendanceMarked}</div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          style={{ background: '#f4f4f5', borderRadius: '24px', padding: '22px 24px', border: '1.5px solid rgba(0,0,0,0.07)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} color="#f59e0b" />
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Pending Slots</span>
            </div>
          </div>
          <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', marginTop: '16px' }}>{availableSlots.length}</div>
        </motion.div>
      </motion.div>

      {message.text && (
        <div style={{ marginBottom: '24px', padding: '12px 16px', borderRadius: '12px', background: message.type === 'error' ? '#fee2e2' : '#dcfce7', color: message.type === 'error' ? '#b91c1c' : '#15803d', fontWeight: 600 }}>
          {message.text}
        </div>
      )}

      {/* Main Section */}
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', border: '1.5px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={20} color="#573cfa" /> Select Date & Timetable Lecture Slot
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#71717a', display: 'block', marginBottom: '6px' }}>Lecture Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e4e4e7', fontSize: '14px', fontWeight: 600 }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#71717a', display: 'block', marginBottom: '6px' }}>
              Auto-Populated Timetable Slot (Single Source of Truth)
            </label>
            <select
              value={selectedSlotId}
              onChange={(e) => handleSlotChange(e.target.value)}
              disabled={availableSlots.length === 0}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e4e4e7', fontSize: '14px', fontWeight: 700, color: '#09090b' }}
            >
              {availableSlots.length === 0 ? (
                <option value="">No Timetable Slots Scheduled For This Date</option>
              ) : (
                availableSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>
                    {slot.startTime} - {slot.endTime} | {slot.subjectName} ({slot.subjectCode}) | Prof. {slot.teacherName} ({slot.room})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {availableSlots.length > 0 && selectedSlotId && (
          <div style={{ background: '#f8fafc', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            {(() => {
              const activeSlot = availableSlots.find(s => s.id === selectedSlotId);
              if (!activeSlot) return null;
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#573cfa', textTransform: 'uppercase' }}>Selected Slot Details</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{activeSlot.subjectName} ({activeSlot.subjectCode})</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Faculty: <strong>{activeSlot.teacherName}</strong> | Room: <strong>{activeSlot.room}</strong> | Time: <strong>{activeSlot.startTime} - {activeSlot.endTime}</strong></div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => markAttendance('present')}
                      disabled={loading}
                      style={{ padding: '10px 20px', borderRadius: '12px', background: '#16a34a', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ✓ Mark Present
                    </button>

                    <button
                      onClick={() => markAttendance('absent')}
                      disabled={loading}
                      style={{ padding: '10px 20px', borderRadius: '12px', background: '#dc2626', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ✗ Mark Absent
                    </button>

                    <button
                      onClick={() => markAttendance('cancelled')}
                      disabled={loading}
                      style={{ padding: '10px 20px', borderRadius: '12px', background: '#d97706', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel Lecture
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
