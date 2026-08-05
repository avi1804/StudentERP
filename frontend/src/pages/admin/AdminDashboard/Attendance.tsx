import { useState, useEffect } from "react";
import { apiClient as api } from "@/api/axios";
import { TimetableAttendanceService } from "@/services/timetableAttendanceService";
import type { LectureInstance, AttendanceRecord } from "@/services/timetableAttendanceService";
import { AlertTriangle, Trash2, RefreshCw } from "lucide-react";

export default function Attendance() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<LectureInstance[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [reportStudent, setReportStudent] = useState('');
  const [reportSubject, setReportSubject] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState<any[] | null>(null);

  // Report state

  useEffect(() => {
    fetchSubjects();
    fetchAllStudents();
  }, []);

  useEffect(() => {
    const slots = TimetableAttendanceService.getLectureInstancesForDate(date);
    setAvailableSlots(slots);
    if (slots.length > 0) {
      setSelectedSlotId(slots[0].id);
    } else {
      setSelectedSlotId('');
    }
  }, [date]);

  const fetchAllStudents = async () => {
    try {
      const res = await api.get('/students/'); 
      setAllStudents(res.data.items || res.data);
    } catch {
      setAllStudents([
        { id: 1, name: "Harsh Patel", enrollment_number: "21001" },
        { id: 2, name: "Yash Patel", enrollment_number: "21002" },
      ]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects/');
      setSubjects(res.data);
    } catch {
      setSubjects([
        { id: 1, name: "Software Group Project", code: "CS01" },
        { id: 2, name: "Machine Learning", code: "CS02" },
        { id: 3, name: "NLP", code: "CS03" },
        { id: 4, name: "Cloud Computing", code: "CS04" },
        { id: 5, name: "Flat", code: "CS05" },
      ]);
    }
  };

  const markAttendance = (status: 'present' | 'absent' | 'cancelled') => {
    if (!selectedSlotId || !date) {
      setMessage({ text: 'Please select a valid Timetable slot and date.', type: 'error' });
      return;
    }
    const slot = availableSlots.find(s => s.id === selectedSlotId);
    if (!slot) {
      setMessage({ text: 'Selected slot does not exist in Timetable.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      TimetableAttendanceService.markAttendance(
        slot.id,
        slot.date,
        slot.subjectId,
        slot.subjectCode,
        status
      );
      setMessage({ text: `Attendance for ${slot.subjectName} marked as ${status.toUpperCase()}!`, type: 'success' });
    } catch {
      setMessage({ text: 'Failed to mark attendance', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async () => {
    setReportLoading(true);
    try {
      const stats = TimetableAttendanceService.getAttendanceStats();
      setReportData(stats.subjects || stats.subjectWise || []);
    } catch {
      setMessage({ text: 'Failed to fetch report', type: 'error' });
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
          Timetable-Synced Attendance Management
        </h2>
      </div>

      {message.text && (
        <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', border: message.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)', backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: message.type === 'error' ? 'var(--red)' : 'var(--green)' }}>
          {message.text}
        </div>
      )}
      
      <div className="att-grid">
        {/* Mark panel */}
        <div className="mark-panel" id="att-mark-panel">
          <div className="card-header">
            <span className="card-title">Mark Attendance (Timetable Single Source)</span>
          </div>
          <div className="panel-body">
            <div className="fg">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="fg">
              <label>Timetable Slot (Auto-Populated)</label>
              <select value={selectedSlotId} onChange={(e) => setSelectedSlotId(e.target.value)} disabled={availableSlots.length === 0}>
                {availableSlots.length === 0 ? (
                  <option value="">No Timetable Slots Scheduled For This Date</option>
                ) : (
                  availableSlots.map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.startTime} - {slot.endTime} | {slot.subjectName} ({slot.subjectCode}) | Prof. {slot.teacherName}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div className="fg" style={{ marginBottom: 0 }}>
              <label>Status</label>
              <div className="att-status-btns">
                <button className="att-btn present" onClick={() => markAttendance('present')} disabled={loading || !selectedSlotId}>
                  <span className="icon">✓</span><span>Present</span>
                </button>
                <button className="att-btn absent" onClick={() => markAttendance('absent')} disabled={loading || !selectedSlotId}>
                  <span className="icon">✗</span><span>Absent</span>
                </button>
                <button className="att-btn late" onClick={() => markAttendance('cancelled')} disabled={loading || !selectedSlotId}>
                  <span className="icon">⏱</span><span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report panel */}
        <div className="mark-panel">
          <div className="card-header">
            <span className="card-title">Attendance Report Summary</span>
          </div>
          <div className="panel-body">
            <button 
              className="btn btn-primary" 
              style={{ marginBottom: '16px', width: '100%' }}
              onClick={fetchReport}
              disabled={reportLoading}
            >
              {reportLoading ? 'Loading...' : 'Generate Real-Time Report'}
            </button>

            <div>
              {reportData === null ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: '13px' }}>
                  Click Generate Real-Time Report
                </div>
              ) : reportData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: '13px' }}>
                  No attendance records found
                </div>
              ) : (
                reportData.map((r: any, idx: number) => {
                  const pct = r.percentage || 0;
                  const remarkBadge = pct >= 80 ? "badge-green" : pct >= 65 ? "badge-amber" : "badge-red";
                  
                  return (
                    <div className="att-report-card" key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                            {r.subjectName} ({r.subjectCode})
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
                            {r.present} present • {r.absent} absent • {r.totalClasses} total classes
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span className={`badge ${remarkBadge}`}>{r.remark}</span>
                        </div>
                      </div>
                      
                      <div className="progress-orbit-wrap">
                        <svg className="progress-orbit" viewBox="0 0 36 36">
                          <path className="orbit-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                          <path className="orbit-fill" strokeDasharray={`${pct}, 100`} style={{ stroke: 'var(--tertiary)' }} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        </svg>
                        <div className="orbit-text" style={{ color: 'var(--tertiary)' }}>{pct}%</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
