import { useState, useEffect } from "react";
import { apiClient as api } from "@/api/axios";

export default function Attendance() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [reportStudent, setReportStudent] = useState('');
  const [reportSubject, setReportSubject] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState<any[] | null>(null);

  useEffect(() => {
    fetchSubjects();
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      // Just fetch all students to populate the Report dropdown initially
      const res = await api.get('/students/'); 
      setAllStudents(res.data.items || res.data); // Support both paginated and flat lists just in case
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects/');
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
      const res = await api.get(`/subjects/${subjectId}/students`);
      setStudents(res.data);
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
    } catch (error: any) {
      setMessage({ text: error.response?.data?.detail || 'Failed to mark attendance', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async () => {
    if (!reportStudent) {
      setMessage({ text: 'Please select a student for the report.', type: 'error' });
      return;
    }
    setReportLoading(true);
    try {
      let url = `/faculty-dash/attendance/report?student_id=${reportStudent}`;
      if (reportSubject) {
        url += `&subject_id=${reportSubject}`;
      }
      const res = await api.get(url);
      setReportData(res.data);
    } catch (error: any) {
      console.error(error);
      setMessage({ text: 'Failed to fetch report', type: 'error' });
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="page-center">
      {message.text && (
        <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', border: message.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)', backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: message.type === 'error' ? 'var(--red)' : 'var(--green)' }}>
          {message.text}
        </div>
      )}
      
      <div className="att-grid">
        {/* Mark panel */}
        <div className="mark-panel" id="att-mark-panel">
          <div className="card-header">
            <span className="card-title">Mark Attendance</span>
            <button className="btn-qr-gen" id="qr-gen-btn">
              <span>&#x25A6;</span> Generate QR
            </button>
          </div>
          <div className="panel-body">
            <div className="fg">
              <label>Subject</label>
              <select value={selectedSubject} onChange={handleSubjectChange}>
                <option value="">— Select Subject —</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
            
            <div className="fg">
              <label>Student</label>
              <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} disabled={!selectedSubject}>
                <option value="">— Select Subject First —</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name || s.user?.full_name || "Unknown"} ({s.enrollment_number})</option>
                ))}
              </select>
            </div>
            
            <div className="fg">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            
            <div className="fg" style={{ marginBottom: 0 }}>
              <label>Status</label>
              <div className="att-status-btns">
                <button className="att-btn present" onClick={() => markAttendance('PRESENT')} disabled={loading}>
                  <span className="icon">✓</span><span>Present</span>
                </button>
                <button className="att-btn absent" onClick={() => markAttendance('ABSENT')} disabled={loading}>
                  <span className="icon">✗</span><span>Absent</span>
                </button>
                <button className="att-btn late" onClick={() => markAttendance('LATE')} disabled={loading}>
                  <span className="icon">⏱</span><span>Late</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report panel */}
        <div className="mark-panel">
          <div className="card-header">
            <span className="card-title">Attendance Report</span>
          </div>
          <div className="panel-body">
            <div className="fg">
              <label>Student</label>
              <select value={reportStudent} onChange={(e) => setReportStudent(e.target.value)}>
                <option value="">— Select Student —</option>
                {allStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name || s.user?.full_name || "Unknown"} ({s.enrollment_number})</option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label>Subject <span style={{ fontSize: '10px', color: 'var(--text3)' }}>(blank = all)</span></label>
              <select value={reportSubject} onChange={(e) => setReportSubject(e.target.value)}>
                <option value="">All subjects</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ marginBottom: '16px', width: '100%' }}
              onClick={fetchReport}
              disabled={reportLoading}
            >
              {reportLoading ? 'Loading...' : 'View Report'}
            </button>
            <div>
              {reportData === null ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: '13px' }}>
                  Select a student and click View Report
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
                            {r.subjectName || "Subject " + r.subjectId}
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
                          <path className="orbit-fill" strokeDasharray={`${pct}, 100`} style={{ stroke: 'var(--tertiary)', filter: 'drop-shadow(0 0 6px var(--secondary))' }} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
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

      {/* Low attendance */}
      <div className="low-att-panel">
        <div className="card-header">
          <span className="card-title">Low Attendance Alert</span>
          <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Students below threshold</span>
        </div>
        <div className="low-controls">
          <div className="fg">
            <label>Branch</label>
            <select><option>CSE</option><option>ECE</option><option>ME</option><option>CE</option><option>IT</option></select>
          </div>
          <div className="fg">
            <label>Semester</label>
            <input type="number" placeholder="3" min="1" max="8" />
          </div>
          <div className="fg">
            <label>Subject</label>
            <select>
              <option value="">— Select Subject —</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label>Threshold %</label>
            <input type="number" defaultValue="75" min="1" max="100" />
          </div>
          <button className="card-btn" style={{ height: '40px', alignSelf: 'flex-end' }}>Check</button>
        </div>
      </div>
    </div>
  );
}
