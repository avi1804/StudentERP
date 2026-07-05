import re

# Premium AttendanceManager component code
premium_code = """import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { BookOpen, Calendar, CheckCircle2, Clock, Users, ChevronRight, BellRing } from 'lucide-react';

export const AttendanceManager: React.FC = () => {
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
    <div style={{ padding: '0px' }}>
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(183,142,254,0.1)', padding: '12px', borderRadius: '12px', marginRight: '16px' }}>
          <Users size={28} color="var(--secondary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>Attendance</h1>
          <div style={{ fontSize: '13px', color: 'var(--text3)' }}>Mark and manage student attendance</div>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', padding: '16px', gap: '16px', background: 'var(--surface-glass)', border: '1px solid var(--border)' }}>
              <div style={{ background: `${s.color}20`, padding: '12px', borderRadius: '12px', display: 'flex' }}>
                <Icon size={24} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text)', lineHeight: '1.2' }}>{s.value}</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{s.sub}</div>
              </div>
            </div>
          )
        })}
      </div>

      {message.text && (
        <div style={{ marginBottom: '24px', padding: '12px', borderRadius: '8px', border: message.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)', backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: message.type === 'error' ? 'var(--red)' : 'var(--green)' }}>
          {message.text}
        </div>
      )}

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
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
          
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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
            
            {/* Mocked Class 1 */}
            <div style={{ display: 'flex', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'center', width: '45px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text)' }}>09:00</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>AM</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>Data Structures (CS701)</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', margin: '4px 0' }}>CSE - A • 7th Semester</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Room: CS-101</div>
              </div>
              <div>
                <span style={{ color: 'var(--green)', fontSize: '11px', border: '1px solid rgba(34,197,94,0.2)', padding: '4px 8px', borderRadius: '12px', background: 'rgba(34,197,94,0.05)' }}>Completed</span>
              </div>
            </div>

            {/* Mocked Class 2 */}
            <div style={{ display: 'flex', gap: '16px', background: 'rgba(183,142,254,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid var(--secondary)' }}>
              <div style={{ textAlign: 'center', width: '45px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text)' }}>10:00</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>AM</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>Machine Learning (ML701)</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', margin: '4px 0' }}>CSE - A • 7th Semester</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Room: CS-202</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{ color: 'var(--amber)', fontSize: '11px', border: '1px solid rgba(245,158,11,0.2)', padding: '4px 8px', borderRadius: '12px', background: 'rgba(245,158,11,0.05)' }}>Pending</span>
                <button style={{ background: 'transparent', border: '1px solid var(--secondary)', color: 'var(--secondary)', fontSize: '11px', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>Mark Attendance</button>
              </div>
            </div>

            {/* Mocked Class 3 */}
            <div style={{ display: 'flex', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'center', width: '45px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text)' }}>11:15</div>
                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>AM</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>Database Systems (DB701)</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', margin: '4px 0' }}>CSE - A • 7th Semester</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Room: CS-103</div>
              </div>
              <div>
                <span style={{ color: 'var(--amber)', fontSize: '11px', border: '1px solid rgba(245,158,11,0.2)', padding: '4px 8px', borderRadius: '12px', background: 'rgba(245,158,11,0.05)' }}>Pending</span>
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
              <button style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--secondary)', fontSize: '12px', padding: '8px 16px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <Calendar size={14} /> View Full Timetable
              </button>
            </div>
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
"""

with open("C:/Users/HARSH/OneDrive/Desktop/StudentERP/frontend/src/pages/faculty/AttendanceManager.tsx", "w", encoding="utf-8") as f:
    f.write(premium_code)

print("AttendanceManager.tsx completely overhauled.")
