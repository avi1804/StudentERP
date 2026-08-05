import React, { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import {
  BookOpen, Calendar, CheckCircle2, Clock, Users, Check, XCircle,
  Search, Filter, QrCode, Save, RefreshCw, AlertTriangle, Lock,
  User as UserIcon, ChevronDown,
} from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { motion, AnimatePresence } from 'framer-motion';
import TextType from '../../components/TextType';
import { TimetableAttendanceService, resolveTeacherIdByName } from '../../services/timetableAttendanceService';
import type { LectureInstance } from '../../services/timetableAttendanceService';
import { qrAttendanceService, attendanceService } from '../../services/qrAttendanceService';
import { substituteService } from '../../services/substituteService';
import { useAuthStore } from '../../store/authStore';
import QRCode from 'react-qr-code';

/* ─── Types ─────────────────────────────────────────────────── */
interface StudentRecord {
  id: number;
  name: string;
  enrollment_number: string;
  roll_number?: string;
  photo?: string;
  status: 'PRESENT' | 'ABSENT';
}

/* ─── Avatar helper ──────────────────────────────────────────── */
function Avatar({ name, photo, size = 44 }: { name: string; photo?: string; size?: number }) {
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  const hue = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % 360;
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `hsl(${hue}, 60%, 88%)`, color: `hsl(${hue}, 55%, 30%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: size * 0.35, letterSpacing: '-0.5px',
      border: `2px solid hsl(${hue}, 40%, 80%)`,
    }}>
      {initials}
    </div>
  );
}

/* ─── Student Card ───────────────────────────────────────────── */
function StudentCard({
  student, locked, onToggle,
}: {
  student: StudentRecord;
  locked: boolean;
  onToggle: (id: number) => void;
}) {
  const isPresent = student.status === 'PRESENT';
  return (
    <motion.div
      layout
      onClick={() => !locked && onToggle(student.id)}
      style={{
        background: isPresent
          ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
          : 'linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)',
        border: `2px solid ${isPresent ? '#bbf7d0' : '#fecaca'}`,
        borderRadius: '18px',
        padding: '16px 18px',
        cursor: locked ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: isPresent
          ? '0 2px 12px rgba(34,197,94,0.12)'
          : '0 2px 12px rgba(239,68,68,0.08)',
        userSelect: 'none',
        opacity: locked ? 0.85 : 1,
      }}
      whileHover={!locked ? { scale: 1.018, y: -2 } : {}}
      whileTap={!locked ? { scale: 0.97 } : {}}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar name={student.name} photo={student.photo} />
        <motion.div
          animate={{
            background: isPresent ? '#22c55e' : '#ef4444',
            border: `2px solid ${isPresent ? '#fff' : '#fff'}`,
          }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 14, height: 14, borderRadius: '50%',
          }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '14px', fontWeight: 700, color: '#111827',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {student.name}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, marginTop: '2px' }}>
          {student.enrollment_number}
          {student.roll_number ? ` · Roll ${student.roll_number}` : ''}
        </div>
      </div>

      {/* Status Badge */}
      <motion.div
        animate={{
          background: isPresent ? '#dcfce7' : '#fee2e2',
          color: isPresent ? '#15803d' : '#b91c1c',
          borderColor: isPresent ? '#bbf7d0' : '#fecaca',
        }}
        transition={{ duration: 0.2 }}
        style={{
          padding: '5px 12px', borderRadius: '20px', border: '1.5px solid',
          fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px',
          textTransform: 'uppercase', flexShrink: 0, display: 'flex',
          alignItems: 'center', gap: '5px',
        }}
      >
        {isPresent
          ? <><Check size={11} strokeWidth={3} /> Present</>
          : <><XCircle size={11} /> Absent</>}
      </motion.div>
    </motion.div>
  );
}

/* ─── Confirmation Dialog ────────────────────────────────────── */
function ConfirmDialog({
  open, presentCount, absentCount, onConfirm, onCancel,
}: {
  open: boolean;
  presentCount: number;
  absentCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(5px)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 6 }}
            style={{
              background: '#fff', borderRadius: '24px', padding: '32px',
              maxWidth: 420, width: '100%', boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 60, height: 60, borderRadius: '50%', background: '#fef3c7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <AlertTriangle size={28} color="#f59e0b" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
              Save Attendance?
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6 }}>
              Are you sure you want to save attendance for this lecture?<br />
              <strong style={{ color: '#111827' }}>This action cannot be undone.</strong>
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <div style={{
                flex: 1, background: '#dcfce7', borderRadius: 12, padding: '12px 0',
                fontSize: '20px', fontWeight: 800, color: '#15803d',
              }}>
                {presentCount}
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a', marginTop: 2 }}>PRESENT</div>
              </div>
              <div style={{
                flex: 1, background: '#fee2e2', borderRadius: 12, padding: '12px 0',
                fontSize: '20px', fontWeight: 800, color: '#b91c1c',
              }}>
                {absentCount}
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#dc2626', marginTop: 2 }}>ABSENT</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={onCancel}
                style={{
                  flex: 1, padding: '13px', borderRadius: 14, background: '#f4f4f5',
                  border: 'none', fontWeight: 700, color: '#374151', cursor: 'pointer', fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                style={{
                  flex: 1, padding: '13px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none', fontWeight: 700, color: '#fff', cursor: 'pointer', fontSize: '14px',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                }}
              >
                ✓ Save Attendance
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── QR Modal ───────────────────────────────────────────────── */
function QRModal({
  open, qrPayload, expiresAt, expirySeconds, slotLabel, scannedCount, totalStudents,
  onClose, onRegenerate, loading,
}: {
  open: boolean;
  qrPayload: string;
  expiresAt: Date | null;
  expirySeconds: number;
  slotLabel: string;
  scannedCount: number;
  totalStudents: number;
  onClose: () => void;
  onRegenerate: () => void;
  loading: boolean;
}) {
  // Compute initial remaining seconds immediately from the Date object
  const calcRemaining = () =>
    expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000)) : expirySeconds;

  const [timeRemaining, setTimeRemaining] = useState<number>(calcRemaining);
  const totalSeconds = useRef<number>(expirySeconds);

  useEffect(() => {
    if (!open || !expiresAt) return;
    const diff = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
    totalSeconds.current = diff > 0 ? diff : expirySeconds;
    setTimeRemaining(diff);
    if (diff <= 0) return; // already expired
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
      setTimeRemaining(remaining);
      if (remaining === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [open, expiresAt]);

  const pct = totalSeconds.current > 0 ? (timeRemaining / totalSeconds.current) * 100 : 100;
  const isExpired = timeRemaining <= 0 && expiresAt !== null;
  const timerColor = timeRemaining > 60 ? '#3b82f6' : timeRemaining > 20 ? '#f59e0b' : '#ef4444';
  const expiryMinutes = Math.ceil(expirySeconds / 60);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)', zIndex: 1500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            style={{
              background: '#fff', borderRadius: '28px', padding: '32px',
              maxWidth: 440, width: '100%', boxShadow: '0 32px 64px rgba(0,0,0,0.22)',
              textAlign: 'center',
            }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#f0f9ff', borderRadius: 10, padding: '6px 14px',
              fontSize: '12px', fontWeight: 700, color: '#0369a1', marginBottom: 16,
            }}>
              <QrCode size={14} />  {slotLabel}
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
              Scan to Mark Attendance
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 24px' }}>
              Students scan this code from their app. Auto-expires in{' '}
              <strong style={{ color: '#111827' }}>{expiryMinutes} min</strong>.
            </p>

            {/* QR Code */}
            <div style={{
              background: isExpired ? '#fef2f2' : '#f8fafc',
              padding: 24, borderRadius: 20, display: 'inline-block',
              marginBottom: 20, border: `2px solid ${isExpired ? '#fecaca' : '#e2e8f0'}`,
              position: 'relative',
            }}>
              {!isExpired ? (
                <QRCode value={qrPayload} size={220} style={{ display: 'block' }} />
              ) : (
                <div style={{
                  width: 220, height: 220, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexDirection: 'column', color: '#ef4444',
                }}>
                  <XCircle size={52} strokeWidth={1.5} style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>QR Expired</div>
                </div>
              )}
            </div>

            {/* Timer + Stats row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#f8fafc', borderRadius: 16, padding: '14px 20px', marginBottom: 20,
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>
                  Students Scanned
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#15803d' }}>
                  {scannedCount}
                  <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 600 }}> / {totalStudents}</span>
                </div>
              </div>

              {/* Circular timer */}
              <div style={{ position: 'relative', width: 64, height: 64 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e4e4e7" strokeWidth="3.5" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={timerColor} strokeWidth="3.5"
                    strokeDasharray={`${pct}, 100`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s linear' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 800, color: isExpired ? '#ef4444' : '#111827',
                }}>
                  {isExpired ? '✕' : `${timeRemaining}s`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: '13px', borderRadius: 14, background: '#f4f4f5',
                  border: 'none', fontWeight: 700, cursor: 'pointer', color: '#374151',
                }}
              >
                Close
              </button>
              <button
                onClick={onRegenerate}
                disabled={loading || !isExpired}
                style={{
                  flex: 1, padding: '13px', borderRadius: 14, background: '#3b82f6',
                  border: 'none', fontWeight: 700, cursor: loading || !isExpired ? 'not-allowed' : 'pointer',
                  color: '#fff', opacity: !isExpired ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <RefreshCw size={14} /> Regenerate
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export const AttendanceManager: React.FC = () => {
  const { isMobile } = useIsMobile();
  const { user } = useAuthStore();

  /* ── Slot / slot selection ── */
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<(LectureInstance & { isSubstitute?: boolean })[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');

  /* ── Student list ── */
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /* ── Attendance state ── */
  const [locked, setLocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  /* ── Confirm dialog ── */
  const [showConfirm, setShowConfirm] = useState(false);

  /* ── QR ── */
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrPayload, setQrPayload] = useState('');
  const [qrExpiresAt, setQrExpiresAt] = useState<Date | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrStudentCount, setQrStudentCount] = useState(0);

  /* ── Faculty resolution ── */
  const facultyName = user?.full_name || '';
  const resolvedTeacherId = resolveTeacherIdByName(facultyName);
  const [activeTeacherId] = useState<number>(resolvedTeacherId || 102);
  const myAssignedSubjects = TimetableAttendanceService.getAssignedSubjectsForTeacher(activeTeacherId);

  /* ─── Load slots whenever date changes ─── */
  useEffect(() => {
    const fetchSlots = async () => {
      const baseSlots = TimetableAttendanceService.getLectureInstancesForDateByTeacher(date, activeTeacherId);
      let combined: (LectureInstance & { isSubstitute?: boolean })[] = [...baseSlots];

      try {
        const subs = await substituteService.getMyAssignments();
        const todaysSubs = subs.filter(s => s.start_date === date);
        for (const sub of todaysSubs) {
          const all = TimetableAttendanceService.getLectureInstancesForDate(date);
          const match = all.find(i => i.id === sub.lecture_instance_id);
          if (match && !combined.some(s => s.id === match.id)) {
            combined.push({ ...match, isSubstitute: true });
          }
        }
      } catch {/* ignore */}

      setAvailableSlots(combined);
      if (combined.length > 0) {
        setSelectedSlotId(combined[0].id);
      } else {
        setSelectedSlotId('');
        setStudents([]);
      }
    };
    fetchSlots();
  }, [date, activeTeacherId]);

  /* ─── Load + check-lock students when slot changes ─── */
  useEffect(() => {
    if (!selectedSlotId) {
      setStudents([]);
      setLocked(false);
      return;
    }
    const slot = availableSlots.find(s => s.id === selectedSlotId);
    if (!slot) return;

    const loadStudents = async () => {
      setLoadingStudents(true);
      setMessage({ text: '', type: '' });

      // Check if attendance already submitted for this lecture
      let isSubmitted = false;
      try {
        isSubmitted = await attendanceService.isSubmitted(selectedSlotId);
      } catch {/* ignore, default false */}
      setLocked(isSubmitted);

      // Fetch students and possibly their saved attendance
      try {
        const [data, lectureAttendance] = await Promise.all([
          attendanceService.getStudentsForSubject(slot.subjectId),
          isSubmitted ? attendanceService.getLectureAttendance(selectedSlotId) : Promise.resolve([])
        ]);

        const attendanceMap = new Map<number, 'PRESENT' | 'ABSENT'>();
        if (isSubmitted) {
          lectureAttendance.forEach(record => {
            attendanceMap.set(record.student_id, record.status);
          });
        }

        const mapped: StudentRecord[] = data.map((s: any) => ({
          id: s.id,
          name: s.name,
          enrollment_number: s.enrollment_number,
          roll_number: s.roll_number,
          photo: s.photo,
          status: attendanceMap.get(s.id) || 'ABSENT',
        }));
        setStudents(mapped);
      } catch {
        // Demo fallback
        setStudents([
          { id: 1, name: 'Harsh Patel', enrollment_number: 'EN21001', roll_number: '01', status: 'ABSENT' },
          { id: 2, name: 'Yash Patel', enrollment_number: 'EN21002', roll_number: '02', status: 'ABSENT' },
          { id: 3, name: 'Aarav Sharma', enrollment_number: 'EN21003', roll_number: '03', status: 'ABSENT' },
          { id: 4, name: 'Priya Singh', enrollment_number: 'EN21004', roll_number: '04', status: 'ABSENT' },
          { id: 5, name: 'Riya Verma', enrollment_number: 'EN21005', roll_number: '05', status: 'ABSENT' },
          { id: 6, name: 'Karan Mehta', enrollment_number: 'EN21006', roll_number: '06', status: 'ABSENT' },
          { id: 7, name: 'Sneha Joshi', enrollment_number: 'EN21007', roll_number: '07', status: 'ABSENT' },
          { id: 8, name: 'Ankit Rao', enrollment_number: 'EN21008', roll_number: '08', status: 'ABSENT' },
          { id: 9, name: 'Divya Nair', enrollment_number: 'EN21009', roll_number: '09', status: 'ABSENT' },
          { id: 10, name: 'Raj Kumar', enrollment_number: 'EN21010', roll_number: '10', status: 'ABSENT' },
          { id: 11, name: 'Pooja Shah', enrollment_number: 'EN21011', roll_number: '11', status: 'ABSENT' },
          { id: 12, name: 'Amit Gupta', enrollment_number: 'EN21012', roll_number: '12', status: 'ABSENT' },
        ]);
      }
      setLoadingStudents(false);
    };

    loadStudents();
  }, [selectedSlotId, availableSlots]);

  /* ─── Poll QR stats ─── */
  useEffect(() => {
    if (!showQRModal || !selectedSlotId) return;
    const interval = setInterval(async () => {
      try {
        const stats = await qrAttendanceService.getStats(selectedSlotId);
        setQrStudentCount(stats.scanned_count);
      } catch {/* ignore */}
    }, 2500);
    return () => clearInterval(interval);
  }, [showQRModal, selectedSlotId]);

  /* ─── Handlers ─── */
  const toggleStudent = useCallback((id: number) => {
    setStudents(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.status === 'PRESENT' ? 'ABSENT' : 'PRESENT' } : s
    ));
  }, []);

  const markAll = (status: 'PRESENT' | 'ABSENT') => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSaveClick = () => {
    if (students.length === 0) return;
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setSaving(true);
    const slot = availableSlots.find(s => s.id === selectedSlotId);
    if (!slot) { setSaving(false); return; }

    try {
      const result = await attendanceService.bulkSave({
        subject_id: slot.subjectId,
        date,
        lecture_id: selectedSlotId,
        attendance_method: 'Manual',
        records: students.map(s => ({ student_id: s.id, status: s.status })),
      });
      setLocked(true);
      setMessage({
        text: `✓ Attendance saved! ${result.present} present · ${result.absent} absent`,
        type: 'success',
      });
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.detail || 'Failed to save attendance.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!selectedSlotId) return;
    const slot = availableSlots.find(s => s.id === selectedSlotId);
    setQrLoading(true);
    try {
      const res = await qrAttendanceService.generateQR({
        lecture_instance_id: selectedSlotId,
        subject_id: slot?.subjectId,
        expiry_seconds: 180,
      });
      setQrPayload(res.qr_payload);
      setQrExpiresAt(new Date(res.expires_at));
      setQrStudentCount(0);
      setShowQRModal(true);
    } catch (err: any) {
      setMessage({ text: err.response?.data?.detail || 'Failed to generate QR.', type: 'error' });
    } finally {
      setQrLoading(false);
    }
  };

  /* ─── Derived ─── */
  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.enrollment_number.toLowerCase().includes(q) ||
      (s.roll_number || '').toLowerCase().includes(q)
    );
  });

  const presentCount = students.filter(s => s.status === 'PRESENT').length;
  const absentCount = students.length - presentCount;
  const activeSlot = availableSlots.find(s => s.id === selectedSlotId);

  /* ─── Render ─── */
  return (
    <div style={{ padding: 0, fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', letterSpacing: '-0.6px', margin: 0, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span>Attendance</span>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff', padding: '4px 18px', borderRadius: 14,
              boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              display: 'inline-flex', alignItems: 'center', lineHeight: 1.2,
            }}>
              <TextType
                text={['Manager', 'Lecture-Wise', 'Evaluator']}
                typingSpeed={60} deletingSpeed={35} pauseDuration={2200}
                loop showCursor cursorCharacter="|"
                style={{ color: '#fff' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>
            Mark class attendance per lecture slot • All students default to Absent
          </div>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 18, marginBottom: 28 }}
      >
        {[
          { icon: <BookOpen size={16} color="#6366f1" />, label: 'My Subjects', value: myAssignedSubjects.length, color: '#6366f1' },
          { icon: <Users size={16} color="#3b82f6" />, label: 'Students Loaded', value: students.length, color: '#3b82f6' },
          { icon: <CheckCircle2 size={16} color="#22c55e" />, label: 'Present', value: presentCount, color: '#22c55e' },
          { icon: <Clock size={16} color="#ef4444" />, label: 'Absent', value: absentCount, color: '#ef4444' },
        ].map((card, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            style={{ background: '#f9fafb', borderRadius: 22, padding: '20px 22px', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${card.color}18`, border: `1px solid ${card.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>{card.label}</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-1px' }}>{card.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Alert Banner ── */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              marginBottom: 20, padding: '12px 18px', borderRadius: 14,
              background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: message.type === 'success' ? '#15803d' : '#b91c1c',
              fontWeight: 600, fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Slot Selector ── */}
      <div style={{ background: '#fff', borderRadius: 24, padding: 26, border: '1.5px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={18} color="#6366f1" /> Select Lecture Slot
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 14, fontWeight: 600, boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Lecture Slot (Timetable-Synced)
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedSlotId}
                onChange={e => setSelectedSlotId(e.target.value)}
                disabled={availableSlots.length === 0}
                style={{
                  width: '100%', padding: '11px 40px 11px 14px', borderRadius: 12,
                  border: '1.5px solid #e5e7eb', fontSize: 14, fontWeight: 700,
                  color: '#111827', background: '#fff', appearance: 'none', boxSizing: 'border-box',
                }}
              >
                {availableSlots.length === 0
                  ? <option value="">No scheduled classes found</option>
                  : availableSlots.map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.startTime}–{slot.endTime} | {slot.subjectName} ({slot.room})
                      {slot.isSubstitute ? ' [SUBSTITUTE]' : ''}
                      {slot.status === 'cancelled' ? ' [CANCELLED]' : ''}
                    </option>
                  ))
                }
              </select>
              <ChevronDown size={16} color="#9ca3af" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Slot details + Actions row */}
        {activeSlot && (
          <div style={{
            marginTop: 18, background: '#f8fafc', borderRadius: 16, padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14,
            border: '1px solid #e2e8f0',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                {locked ? '🔒 Attendance Locked' : 'Active Slot'}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>{activeSlot.subjectName}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                {activeSlot.teacherName} · {activeSlot.room} · {activeSlot.startTime}–{activeSlot.endTime}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={handleGenerateQR}
                disabled={qrLoading || locked}
                style={{
                  padding: '9px 18px', borderRadius: 11,
                  background: locked ? '#f3f4f6' : '#3b82f6', color: locked ? '#9ca3af' : '#fff',
                  border: 'none', fontWeight: 700, cursor: locked ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
                }}
              >
                <QrCode size={14} />
                {qrLoading ? 'Generating…' : 'Generate QR'}
              </button>

              {!locked && (
                <>
                  <button
                    onClick={() => markAll('PRESENT')}
                    style={{ padding: '9px 18px', borderRadius: 11, background: '#dcfce7', color: '#15803d', border: '1.5px solid #bbf7d0', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
                  >
                    ✓ All Present
                  </button>
                  <button
                    onClick={() => markAll('ABSENT')}
                    style={{ padding: '9px 18px', borderRadius: 11, background: '#fee2e2', color: '#b91c1c', border: '1.5px solid #fecaca', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
                  >
                    ✗ All Absent
                  </button>
                  <button
                    onClick={handleSaveClick}
                    disabled={saving || students.length === 0}
                    style={{
                      padding: '9px 18px', borderRadius: 11,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff', border: 'none', fontWeight: 700, cursor: saving || students.length === 0 ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(16,185,129,0.28)',
                      display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
                    }}
                  >
                    <Save size={14} /> {saving ? 'Saving…' : 'Save Attendance'}
                  </button>
                </>
              )}

              {locked && (
                <div style={{
                  padding: '9px 18px', borderRadius: 11, background: '#f0fdf4',
                  border: '1.5px solid #bbf7d0', fontWeight: 700, color: '#15803d',
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
                }}>
                  <Lock size={14} /> Attendance Saved
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Student List ── */}
      {selectedSlotId && (
        <div style={{ background: '#fff', borderRadius: 24, padding: 26, border: '1.5px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} color="#3b82f6" />
              Student List
              {loadingStudents && <span style={{ fontSize: 12, fontWeight: 500, color: '#6b7280' }}> · Loading…</span>}
              {!loadingStudents && (
                <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                  · {filteredStudents.length} students
                  {locked ? ' (Locked)' : ''}
                </span>
              )}
            </h3>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#9ca3af" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, enrollment, roll…"
                style={{
                  paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                  borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 13,
                  width: isMobile ? '100%' : 280, outline: 'none', fontWeight: 500,
                }}
              />
            </div>
          </div>

          {/* Summary pills */}
          {!loadingStudents && students.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              {[
                { label: `${presentCount} Present`, bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
                { label: `${absentCount} Absent`, bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
              ].map(p => (
                <div key={p.label} style={{ padding: '5px 14px', borderRadius: 20, background: p.bg, color: p.color, border: `1.5px solid ${p.border}`, fontSize: 12, fontWeight: 700 }}>
                  {p.label}
                </div>
              ))}
              <div style={{ padding: '5px 14px', borderRadius: 20, background: '#f3f4f6', color: '#374151', border: '1.5px solid #e5e7eb', fontSize: 12, fontWeight: 700 }}>
                {Math.round((presentCount / Math.max(students.length, 1)) * 100)}% Attendance
              </div>
            </div>
          )}

          {/* Card grid */}
          {loadingStudents ? (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: '#f9fafb', borderRadius: 18, height: 80, border: '2px solid #e5e7eb', animation: 'pulse 1.5s ease infinite' }} />
              ))}
            </div>
          ) : filteredStudents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#6b7280' }}>
              <UserIcon size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
              <div style={{ fontWeight: 600 }}>No students found</div>
              {searchQuery && <div style={{ fontSize: 13, marginTop: 4 }}>Try clearing the search</div>}
            </div>
          ) : (
            <motion.div
              layout
              style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(268px, 1fr))', gap: 14 }}
            >
              <AnimatePresence>
                {filteredStudents.map(student => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    locked={locked}
                    onToggle={toggleStudent}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      <ConfirmDialog
        open={showConfirm}
        presentCount={presentCount}
        absentCount={absentCount}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />

      <QRModal
        open={showQRModal}
        qrPayload={qrPayload}
        expiresAt={qrExpiresAt}
        expirySeconds={180}
        slotLabel={activeSlot ? `${activeSlot.subjectName} · ${activeSlot.startTime}–${activeSlot.endTime}` : ''}
        scannedCount={qrStudentCount}
        totalStudents={students.length || 30}
        onClose={() => setShowQRModal(false)}
        onRegenerate={handleGenerateQR}
        loading={qrLoading}
      />
    </div>
  );
};
