import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { BookOpen, Calendar, CheckCircle2, Clock, Users, ChevronRight, BellRing, ArrowUpRight, Check, XCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { motion } from 'framer-motion';
import TextType from '../../components/TextType';
import { TimetableAttendanceService, resolveTeacherIdByName } from '../../services/timetableAttendanceService';
import type { LectureInstance } from '../../services/timetableAttendanceService';
import { qrAttendanceService } from '../../services/qrAttendanceService';
import { substituteService, type MySubstituteAssignment } from '../../services/substituteService';
import { useAuthStore } from '../../store/authStore';
import QRCode from 'react-qr-code';

export const AttendanceManager: React.FC = () => {
  const { isMobile } = useIsMobile();
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<(LectureInstance & { isSubstitute?: boolean })[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [qrExpiresAt, setQrExpiresAt] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [qrStudentCount, setQrStudentCount] = useState(0);

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

  const markAttendance = async (status: 'present' | 'absent' | 'cancelled') => {
    if (!selectedSlotId || !date) {
      setMessage({ text: 'Please select a valid Timetable slot and date.', type: 'error' });
      return;
    }

    const currentSlot = availableSlots.find(s => s.id === selectedSlotId);
    if (!currentSlot) {
      setMessage({ text: 'Selected slot does not exist in Timetable.', type: 'error' });
      return;
    }

    if (!selectedStudent && status !== 'cancelled') {
      setMessage({ text: 'Please select a student.', type: 'error' });
      return;
    }

    if (currentSlot.isSubstitute) {
      try {
        await substituteService.markAttendance(currentSlot.id, status);
      } catch (error) {
        console.error("Failed to log substitute audit", error);
        // Continue to mark it locally so the UI updates
      }
    }

    if (status === 'cancelled') {
      TimetableAttendanceService.markAttendance(
        currentSlot.id,
        currentSlot.date,
        currentSlot.subjectId,
        currentSlot.subjectCode,
        'cancelled'
      );
      setMessage({ text: 'Lecture cancelled successfully for all students.', type: 'success' });
    } else {
      TimetableAttendanceService.markAttendance(
        currentSlot.id,
        currentSlot.date,
        currentSlot.subjectId,
        currentSlot.subjectCode,
        status
      );
      setMessage({ 
        text: `Attendance marked as ${status.toUpperCase()} in ${currentSlot.subjectName}`, 
        type: 'success' 
      });
    }

    // Refresh slots to reflect cancellations
    const baseSlots = TimetableAttendanceService.getLectureInstancesForDateByTeacher(date, activeTeacherId);
    // Note: To keep the substitute slot in the list after marking, we just do a quick re-fetch or preserve it.
    // For now, we will let the next re-render handle it correctly if they change dates.
    setAvailableSlots(prev => prev.map(p => {
      if (p.id === currentSlot.id && status === 'cancelled') return { ...p, status: 'cancelled' };
      return p;
    }));
  };

  useEffect(() => {
    const fetchSlots = async () => {
      // FILTERED to only the active faculty's assigned subjects
      const baseSlots = TimetableAttendanceService.getLectureInstancesForDateByTeacher(date, activeTeacherId);
      let combinedSlots: (LectureInstance & { isSubstitute?: boolean })[] = [...baseSlots];
      
      try {
        const subs = await substituteService.getMyAssignments();
        // Filter subs for current date
        const todaysSubs = subs.filter(s => s.start_date === date);
        
        for (const sub of todaysSubs) {
          // Construct a mock LectureInstance for the substitute class
          // (Assuming the lecture_instance_id matches one in the MASTER_TIMETABLE)
          const allInstancesForDate = TimetableAttendanceService.getLectureInstancesForDate(date);
          const matchedInstance = allInstancesForDate.find(i => i.id === sub.lecture_instance_id);
          
          if (matchedInstance) {
             // Only add if not already in list to prevent duplicates
             if (!combinedSlots.some(s => s.id === matchedInstance.id)) {
               combinedSlots.push({
                 ...matchedInstance,
                 isSubstitute: true
               });
             }
          }
        }
      } catch (err) {
        console.error("Failed to fetch substitute assignments", err);
      }

      setAvailableSlots(combinedSlots);
      if (combinedSlots.length > 0) {
        setSelectedSlotId(combinedSlots[0].id);
        setSelectedSubject(String(combinedSlots[0].subjectId));
      } else {
        setSelectedSlotId('');
        setSelectedSubject('');
      }
    };
    
    fetchSlots();
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

  // QR Modal and Countdown Logic
  useEffect(() => {
    let timer: number;
    if (showQRModal && qrExpiresAt) {
      timer = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((qrExpiresAt.getTime() - now.getTime()) / 1000);
        if (diff <= 0) {
          setTimeRemaining(0);
          clearInterval(timer);
        } else {
          setTimeRemaining(diff);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showQRModal, qrExpiresAt]);

  const handleGenerateQR = async () => {
    if (!selectedSlotId) return;
    setLoading(true);
    try {
      const res = await qrAttendanceService.generateQR(selectedSlotId);
      setQrToken(res.token);
      setQrExpiresAt(new Date(res.expires_at));
      setTimeRemaining(60);
      setQrStudentCount(0); // Reset count on new QR
      setShowQRModal(true);
    } catch (err: any) {
      setMessage({ text: err.response?.data?.detail || 'Failed to generate QR', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Poll stats when QR modal is open
  useEffect(() => {
    let interval: number;
    if (showQRModal && selectedSlotId) {
      interval = setInterval(async () => {
        try {
          const stats = await qrAttendanceService.getStats(selectedSlotId);
          setQrStudentCount(stats.scanned_count);
        } catch (e) {
          console.error('Failed to fetch QR stats', e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [showQRModal, selectedSlotId]);

  // Check if slot is currently live
  const isSlotLive = (slot: LectureInstance) => {
    if (slot.date !== new Date().toISOString().split('T')[0]) return false;
    // VERY BASIC check for demo purposes, assume true if date matches. 
    // In a real app we'd parse time properly. 
    return true; 
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
                <option value="" disabled>No scheduled classes found</option>
              ) : (
                availableSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>
                    {slot.startTime} - {slot.endTime} | {slot.subjectName} ({slot.room}) {slot.isSubstitute ? '[SUBSTITUTE]' : ''} {slot.status === 'cancelled' ? '[CANCELLED]' : ''}
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
                      onClick={handleGenerateQR}
                      disabled={loading || !isSlotLive(activeSlot)}
                      style={{ padding: '10px 20px', borderRadius: '12px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 700, cursor: loading || !isSlotLive(activeSlot) ? 'not-allowed' : 'pointer', opacity: isSlotLive(activeSlot) ? 1 : 0.5 }}
                    >
                      Generate QR
                    </button>

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
      
      {/* QR Code Modal */}
      {showQRModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', margin: '0 0 8px 0' }}>Scan to Mark Attendance</h2>
            <p style={{ fontSize: '14px', color: '#71717a', margin: '0 0 24px 0' }}>Students can scan this QR code using their app to instantly mark themselves present.</p>

            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', display: 'inline-block', marginBottom: '24px', position: 'relative' }}>
              {timeRemaining > 0 ? (
                <QRCode value={JSON.stringify({ lectureInstanceId: selectedSlotId, token: qrToken })} size={240} style={{ display: 'block' }} />
              ) : (
                <div style={{ width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#ef4444' }}>
                  <XCircle size={48} style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>QR Expired</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', padding: '16px', background: '#f4f4f5', borderRadius: '16px' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase' }}>Students Scanned</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#16a34a' }}>{qrStudentCount} <span style={{ fontSize: '14px', color: '#a1a1aa' }}>/ 30</span></div>
              </div>
              
              <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e4e4e7" strokeWidth="4" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={timeRemaining > 15 ? "#3b82f6" : "#ef4444"} strokeWidth="4" strokeDasharray={`${(timeRemaining / 60) * 100}, 100`} style={{ transition: 'stroke-dasharray 1s linear' }} />
                </svg>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: timeRemaining > 15 ? '#09090b' : '#ef4444' }}>
                  {timeRemaining}s
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowQRModal(false)}
                style={{ flex: 1, padding: '14px', borderRadius: '14px', background: '#f4f4f5', color: '#09090b', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>
              {timeRemaining <= 0 && (
                <button
                  onClick={handleGenerateQR}
                  disabled={loading}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Regenerate QR
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
