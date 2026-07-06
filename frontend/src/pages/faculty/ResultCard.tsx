import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { UserCircle, GraduationCap, Building2, Library, CheckCircle2, Award, TrendingUp, Search } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export const ResultCard: React.FC = () => {
  const { isMobile } = useIsMobile();
  const [allStudents, setAllStudents] = useState<any[]>([]);
  
  const [reportStudent, setReportStudent] = useState('');
  const [reportExamType, setReportExamType] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState<any[] | null>(null);
  
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
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

  const fetchReport = async () => {
    if (!reportStudent) {
      setMessage({ text: 'Please select a student for the report.', type: 'error' });
      return;
    }
    setReportLoading(true);
    setMessage({ text: '', type: '' });
    try {
      let url = `/faculty-dash/marks/report?student_id=${reportStudent}`;
      if (reportExamType) {
        url += `&exam_type=${reportExamType}`;
      }
      const res = await api.get(url);
      setReportData(res.data);
    } catch (error: any) {
      console.error(error);
      setMessage({ text: 'Failed to fetch result card', type: 'error' });
    } finally {
      setReportLoading(false);
    }
  };

  const selectedStudentObj = allStudents.find(s => s.id.toString() === reportStudent);

  // Calculate Overall Stats
  let totalObtained = 0;
  let totalMax = 0;
  let overallPercentage = 0;

  if (reportData && reportData.length > 0) {
    reportData.forEach(r => {
      totalObtained += r.marksObtained;
      totalMax += r.totalMarks;
    });
    overallPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
  }

  return (
    <div style={{ padding: '0px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(183,142,254,0.1)', padding: '12px', borderRadius: '12px', marginRight: '16px' }}>
          <Award size={28} color="var(--secondary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>Student Result Card</h1>
          <div style={{ fontSize: '13px', color: 'var(--text3)' }}>Generate and analyze detailed student examination results</div>
        </div>
      </div>

      {message.text && (
        <div style={{ marginBottom: '24px', padding: '12px', borderRadius: '8px', border: message.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)', backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: message.type === 'error' ? 'var(--red)' : 'var(--green)' }}>
          {message.text}
        </div>
      )}
      
      {/* Search Controls */}
      <div className="glass-card" style={{ marginBottom: '32px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', alignItems: isMobile ? 'stretch' : 'flex-end' }}>
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
          <label>Filter by Exam Type</label>
          <select value={reportExamType} onChange={(e) => setReportExamType(e.target.value)} style={{ width: '100%' }}>
            <option value="">All Exams</option>
            <option value="MID_SEM">Mid Semester</option>
            <option value="END_SEM">End Semester</option>
            <option value="INTERNAL">Internal</option>
            <option value="PRACTICAL">Practical</option>
          </select>
        </div>
        <div>
          <button className="glass-btn" onClick={fetchReport} disabled={reportLoading} style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '43px' }}>
            <Search size={16} /> {reportLoading ? 'Generating...' : 'Get Result Card'}
          </button>
        </div>
      </div>

      {/* Generated Report Card */}
      {reportData && (
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Subtle gradient background glow */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(183,142,254,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="glass-header" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? '16px' : '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(183, 142, 254, 0.2), rgba(87, 46, 153, 0.4))', border: '2px solid rgba(183, 142, 254, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(183, 142, 254, 0.2)' }}>
                <UserCircle size={48} color="var(--secondary)" />
              </div>
              <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '0 0 8px 0' }}>
                  {selectedStudentObj?.name || selectedStudentObj?.user?.full_name || "Unknown Student"}
                </h2>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'flex-start', gap: isMobile ? '8px' : '24px', color: 'var(--text3)', fontSize: '13px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
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
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Overall Result</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: overallPercentage >= 70 ? 'var(--green)' : overallPercentage >= 50 ? 'var(--amber)' : 'var(--red)', textShadow: `0 0 15px ${overallPercentage >= 70 ? 'rgba(34,197,94,0.4)' : overallPercentage >= 50 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                  {overallPercentage}%
                </div>
              </div>
            </div>

            {/* Overall Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div className="report-stat-box">
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>Total Subjects</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{reportData.length}</div>
              </div>
              <div className="report-stat-box" style={{ borderBottom: '3px solid var(--secondary)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><CheckCircle2 size={14} color="var(--secondary)"/> Total Marks Obtained</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary)' }}>{totalObtained}</div>
              </div>
              <div className="report-stat-box">
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>Maximum Marks</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{totalMax}</div>
              </div>
            </div>

            {/* Subject Breakdown */}
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '16px', borderBottom: '1px solid rgba(183,142,254,0.2)', paddingBottom: '8px' }}>Subject-wise Marks</h3>
            
            {reportData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>No exam marks found for this student.</div>
            ) : (
              <div>
                {reportData.map((r, i) => (
                  <div key={i} className="subject-breakdown-row">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{r.subjectName || `Subject ${r.subjectId}`} {r.subjectCode ? `(${r.subjectCode})` : ''}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Exam Type: {r.examType}</div>
                    </div>
                    <div style={{ width: isMobile ? '70px' : '120px', textAlign: 'right', marginRight: isMobile ? '12px' : '32px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{r.marksObtained}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text3)' }}> / {r.totalMarks}</span>
                    </div>
                    <div style={{ width: isMobile ? '70px' : '200px', marginRight: isMobile ? '12px' : '32px', display: 'flex', alignItems: 'center' }}>
                      <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden', width: '100%' }}>
                        <div style={{ background: r.percentage >= 70 ? 'var(--green)' : r.percentage >= 50 ? 'var(--amber)' : 'var(--red)', width: `${r.percentage}%`, height: '100%', borderRadius: '3px', boxShadow: `0 0 10px ${r.percentage >= 70 ? 'var(--green)' : 'var(--red)'}` }}></div>
                      </div>
                    </div>
                    <div style={{ width: '80px', textAlign: 'right' }}>
                       <span className={`badge ${r.percentage >= 85 ? 'badge-green' : r.percentage >= 70 ? 'badge-amber' : r.percentage >= 50 ? 'badge-amber' : 'badge-red'}`}>{r.remark}</span>
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
