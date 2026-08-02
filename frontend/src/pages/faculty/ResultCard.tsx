import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { 
  UserCircle, GraduationCap, Building2, Library, CheckCircle2, 
  Award, Search, ChevronRight, Filter, BookOpen
} from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { motion, AnimatePresence } from 'framer-motion';
import TextType from '../../components/TextType';

export const ResultCard: React.FC = () => {
  const { isMobile } = useIsMobile();
  const [allStudents, setAllStudents] = useState<any[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterSem, setFilterSem] = useState('All');

  const [reportStudent, setReportStudent] = useState<string>('');
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

  const fetchReport = async (studentId: string, examType: string) => {
    if (!studentId) return;
    setReportLoading(true);
    setMessage({ text: '', type: '' });
    try {
      let url = `/faculty-dash/marks/report?student_id=${studentId}`;
      if (examType) {
        url += `&exam_type=${examType}`;
      }
      const res = await api.get(url);
      setReportData(res.data);
      setReportStudent(studentId);
    } catch (error: any) {
      console.error(error);
      setMessage({ text: 'Failed to fetch result card', type: 'error' });
      setReportData(null);
    } finally {
      setReportLoading(false);
    }
  };

  const filteredStudents = allStudents.filter(s => {
    const matchesSearch = (s.name || s.user?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.enrollment_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Attempt to extract department name string
    let sDept = 'Unknown';
    if (s.department && s.department.name) sDept = s.department.name;
    else if (typeof s.department === 'string') sDept = s.department;
    else if (s.department_id) sDept = `Dept ${s.department_id}`; // Fallback

    const matchesDept = filterDept === 'All' || sDept.toUpperCase().includes(filterDept.toUpperCase());
    const matchesSem = filterSem === 'All' || (s.semester && s.semester.toString() === filterSem);

    return matchesSearch && matchesDept && matchesSem;
  });

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

  const handleStudentSelect = (id: string) => {
    fetchReport(id, reportExamType);
  };

  const handleExamTypeChange = (newType: string) => {
    setReportExamType(newType);
    if (reportStudent) {
      fetchReport(reportStudent, newType);
    }
  };

  return (
    <div style={{ padding: '0px', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Student</span>
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: '#ffffff',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              Results
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Search for students to view detailed examination result cards.
          </div>
        </div>
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

      {/* ── Toolbar & Filters ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#a1a1aa" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by student name or enrollment number..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                borderRadius: '16px',
                border: '1.5px solid rgba(0,0,0,0.08)',
                background: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '6px 12px' }}>
            <Filter size={16} color="#71717a" />
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '13px', fontWeight: 600, color: '#3f3f46', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Depts</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="ECE">ECE</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '6px 12px' }}>
            <Library size={16} color="#71717a" />
            <select
              value={filterSem}
              onChange={e => setFilterSem(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '13px', fontWeight: 600, color: '#3f3f46', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Sems</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s.toString()}>Sem {s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
        
        {/* Left Column: Student List */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid rgba(0,0,0,0.07)', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCircle size={18} color="#8b5cf6" />
              Matching Students ({filteredStudents.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
              {filteredStudents.length === 0 ? (
                <div style={{ color: '#71717a', textAlign: 'center', padding: '32px', fontSize: '13px' }}>No students match your search criteria.</div>
              ) : filteredStudents.map(s => (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  key={s.id}
                  onClick={() => handleStudentSelect(s.id.toString())}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: reportStudent === s.id.toString() ? 'rgba(139, 92, 246, 0.08)' : '#f8fafc',
                    border: reportStudent === s.id.toString() ? '1.5px solid #8b5cf6' : '1px solid rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eedeff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCircle size={20} color="#6d28d9" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#09090b', fontSize: '14px', marginBottom: '2px' }}>{s.name || s.user?.full_name || 'Unknown'}</div>
                    <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>{s.enrollment_number} • Sem {s.semester || 'N/A'}</div>
                  </div>
                  <ChevronRight size={18} color={reportStudent === s.id.toString() ? '#8b5cf6' : '#d4d4d8'} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Result Card View */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column' }}>
          {!reportStudent ? (
             <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', minHeight: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Award size={36} color="#a1a1aa" />
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#09090b' }}>No Student Selected</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#71717a', textAlign: 'center', maxWidth: '300px' }}>
                  Select a student from the list to view their detailed examination result card.
                </p>
             </div>
          ) : reportLoading ? (
            <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', minHeight: '400px' }}>
              <div style={{ color: '#8b5cf6', fontWeight: 600 }}>Loading result card...</div>
            </div>
          ) : reportData && selectedStudentObj && (
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
            >
              {/* Report Header */}
              <div style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', padding: '32px', borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)' }}>
                      <UserCircle size={40} color="#8b5cf6" />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                        {selectedStudentObj?.name || selectedStudentObj?.user?.full_name || "Unknown Student"}
                      </h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#52525b', fontSize: '13px', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <GraduationCap size={16} color="#8b5cf6" /> {selectedStudentObj?.enrollment_number || 'N/A'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building2 size={16} color="#8b5cf6" /> CSE Dept
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Library size={16} color="#8b5cf6" /> Sem {selectedStudentObj?.semester || '7'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', background: '#ffffff', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Overall Result</div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: overallPercentage >= 70 ? '#22c55e' : overallPercentage >= 50 ? '#f59e0b' : '#ef4444', lineHeight: 1 }}>
                      {overallPercentage}%
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', margin: 0 }}>Subject-wise Marks</h3>
                  <select
                    value={reportExamType}
                    onChange={(e) => handleExamTypeChange(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '12px', border: '1.5px solid rgba(0,0,0,0.08)', background: '#f8fafc', fontSize: '13px', fontWeight: 600, color: '#3f3f46', outline: 'none' }}
                  >
                    <option value="">All Exams</option>
                    <option value="MID_SEM">Mid Semester</option>
                    <option value="END_SEM">End Semester</option>
                    <option value="INTERNAL">Internal</option>
                    <option value="PRACTICAL">Practical</option>
                  </select>
                </div>

                {reportData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#71717a', background: '#f8fafc', borderRadius: '16px' }}>
                    <BookOpen size={32} color="#d4d4d8" style={{ margin: '0 auto 12px' }} />
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>No exam marks found</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Try selecting a different exam type.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {reportData.map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#09090b', marginBottom: '4px' }}>
                            {r.subjectName || `Subject ${r.subjectId}`} {r.subjectCode ? `(${r.subjectCode})` : ''}
                          </div>
                          <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 600, display: 'inline-block', background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e4e4e7' }}>
                            {r.examType.replace('_', ' ')}
                          </div>
                        </div>
                        
                        <div style={{ width: '200px', padding: '0 24px', display: 'none', '@media(min-width: 768px)': { display: 'block' } } as any}>
                           <div style={{ background: '#e4e4e7', height: '6px', borderRadius: '3px', overflow: 'hidden', width: '100%' }}>
                            <div style={{ background: r.percentage >= 70 ? '#22c55e' : r.percentage >= 50 ? '#f59e0b' : '#ef4444', width: `${r.percentage}%`, height: '100%', borderRadius: '3px' }}></div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', minWidth: '100px' }}>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: '#09090b' }}>
                            {r.marksObtained} <span style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 600 }}>/ {r.totalMarks}</span>
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: r.percentage >= 85 ? '#22c55e' : r.percentage >= 70 ? '#8b5cf6' : r.percentage >= 50 ? '#f59e0b' : '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>
                            {r.remark}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
