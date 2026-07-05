import re

code = """import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { UserCircle, GraduationCap, Building2, Library, CheckCircle2, XCircle, TrendingUp, Search } from 'lucide-react';

export const AttendanceReport: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  
  const [reportStudent, setReportStudent] = useState('');
  const [reportSubject, setReportSubject] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState<any[] | null>(null);
  
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchMySubjects();
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const res = await api.get('/students/'); 
      setAllStudents(res.data.items || res.data);
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

  const fetchReport = async () => {
    if (!reportStudent) {
      setMessage({ text: 'Please select a student for the report.', type: 'error' });
      return;
    }
    setReportLoading(true);
    setMessage({ text: '', type: '' });
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

  const selectedStudentObj = allStudents.find(s => s.id.toString() === reportStudent);

  // Calculate Overall Stats
  let totalLectures = 0;
  let totalAttended = 0;
  let totalNotAttended = 0;
  let overallPercentage = 0;

  if (reportData && reportData.length > 0) {
    reportData.forEach(r => {
      totalLectures += r.totalClasses;
      totalAttended += (r.present + r.late);
      totalNotAttended += r.absent;
    });
    overallPercentage = totalLectures > 0 ? Math.round((totalAttended / totalLectures) * 100) : 0;
  }

  return (
    <div style={{ padding: '0px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(183,142,254,0.1)', padding: '12px', borderRadius: '12px', marginRight: '16px' }}>
          <TrendingUp size={28} color="var(--secondary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>Student Attendance Report</h1>
          <div style={{ fontSize: '13px', color: 'var(--text3)' }}>Generate and analyze detailed student attendance metrics</div>
        </div>
      </div>

      {message.text && (
        <div style={{ marginBottom: '24px', padding: '12px', borderRadius: '8px', border: message.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)', backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: message.type === 'error' ? 'var(--red)' : 'var(--green)' }}>
          {message.text}
        </div>
      )}
      
      {/* Search Controls */}
      <div className="glass-card" style={{ marginBottom: '32px', display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
        <div className="premium-fg" style={{ flex: 2 }}>
          <label>Select Student <span style={{color: 'var(--red)'}}>*</span></label>
          <select value={reportStudent} onChange={(e) => setReportStudent(e.target.value)} style={{ width: '100%' }}>
            <option value="">— Search & Select Student —</option>
            {allStudents.map(s => (
              <option key={s.id} value={s.id}>{s.name || s.user?.full_name || "Unknown"} ({s.enrollment_number})</option>
            ))}
          </select>
        </div>
        <div className="premium-fg" style={{ flex: 1.5 }}>
          <label>Filter by Subject</label>
          <select value={reportSubject} onChange={(e) => setReportSubject(e.target.value)} style={{ width: '100%' }}>
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>
        <div>
          <button className="glass-btn" onClick={fetchReport} disabled={reportLoading} style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '43px' }}>
            <Search size={16} /> {reportLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Generated Report Card */}
      {reportData && (
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Subtle gradient background glow */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(183,142,254,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="glass-header" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(183, 142, 254, 0.2), rgba(87, 46, 153, 0.4))', border: '2px solid rgba(183, 142, 254, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(183, 142, 254, 0.2)' }}>
                <UserCircle size={48} color="var(--secondary)" />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '0 0 8px 0' }}>
                  {selectedStudentObj?.name || selectedStudentObj?.user?.full_name || "Unknown Student"}
                </h2>
                <div style={{ display: 'flex', gap: '24px', color: 'var(--text3)', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={14} color="var(--secondary)" /> {selectedStudentObj?.enrollment_number || 'N/A'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={14} color="var(--secondary)" /> CSE (B.Tech)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Library size={14} color="var(--secondary)" /> 7th Semester
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Overall Attendance</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: overallPercentage >= 75 ? 'var(--green)' : overallPercentage >= 60 ? 'var(--amber)' : 'var(--red)', textShadow: `0 0 15px ${overallPercentage >= 75 ? 'rgba(34,197,94,0.4)' : overallPercentage >= 60 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                  {overallPercentage}%
                </div>
              </div>
            </div>

            {/* Overall Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div className="report-stat-box">
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>Total Lectures Delivered</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{totalLectures}</div>
              </div>
              <div className="report-stat-box" style={{ borderBottom: '3px solid var(--green)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><CheckCircle2 size={14} color="var(--green)"/> Attended Lectures</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--green)' }}>{totalAttended}</div>
              </div>
              <div className="report-stat-box" style={{ borderBottom: '3px solid var(--red)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><XCircle size={14} color="var(--red)"/> Missed Lectures</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--red)' }}>{totalNotAttended}</div>
              </div>
            </div>

            {/* Subject Breakdown */}
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '16px', borderBottom: '1px solid rgba(183,142,254,0.2)', paddingBottom: '8px' }}>Subject-wise Breakdown</h3>
            
            {reportData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>No attendance records found for this student.</div>
            ) : (
              <div>
                {reportData.map((r, i) => (
                  <div key={i} className="subject-breakdown-row">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{r.subjectName || `Subject ${r.subjectId}`}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{r.present} Present • {r.absent} Absent • {r.totalClasses} Total</div>
                    </div>
                    <div style={{ width: '200px', marginRight: '32px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ background: r.percentage >= 75 ? 'var(--green)' : r.percentage >= 60 ? 'var(--amber)' : 'var(--red)', width: `${r.percentage}%`, height: '100%', borderRadius: '3px', boxShadow: `0 0 10px ${r.percentage >= 75 ? 'var(--green)' : 'var(--red)'}` }}></div>
                      </div>
                    </div>
                    <div style={{ width: '60px', textAlign: 'right', fontWeight: 'bold', color: r.percentage >= 75 ? 'var(--green)' : r.percentage >= 60 ? 'var(--amber)' : 'var(--red)' }}>
                      {r.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
"""

with open("C:/Users/HARSH/OneDrive/Desktop/StudentERP/frontend/src/pages/faculty/AttendanceReport.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("AttendanceReport.tsx completely redesigned.")
