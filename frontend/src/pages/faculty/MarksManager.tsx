import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { Edit3, CheckCircle2, AlertTriangle, BookOpen, User, Award, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MarksManager: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [examType, setExamType] = useState('MID_SEM');
  const [marksObtained, setMarksObtained] = useState('');
  const [totalMarks, setTotalMarks] = useState('100');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchMySubjects();
  }, []);

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

  const submitMarks = async () => {
    if (!selectedSubject || !selectedStudent || !marksObtained || !totalMarks) {
      setMessage({ text: 'Please fill all required fields.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await api.post('/faculty-dash/marks', {
        student_id: parseInt(selectedStudent),
        subject_id: parseInt(selectedSubject),
        exam_type: examType,
        marks_obtained: parseFloat(marksObtained),
        total_marks: parseFloat(totalMarks)
      });
      setMessage({ text: `Marks saved successfully to university database!`, type: 'success' });
      setMarksObtained('');
    } catch (error: any) {
      setMessage({ text: error.response?.data?.detail || 'Failed to save marks', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Enter</span>
            <span style={{
              background: '#282B4A',
              color: '#EEEBDA',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(40, 43, 74, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(238, 235, 218, 0.2)',
            }}>
              Marks
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Record examination and continuous evaluation grades for students.
          </div>
        </div>
      </div>

      {/* ── Alert Message ── */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginBottom: '20px',
              padding: '12px 18px',
              borderRadius: '14px',
              background: message.type === 'error' ? '#fee2e2' : '#dcfce7',
              color: message.type === 'error' ? '#b91c1c' : '#15803d',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {message.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Form Card ── */}
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid rgba(0,0,0,0.07)',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '16px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(40,43,74,0.08)', color: '#282B4A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Edit3 size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#09090b', margin: 0 }}>Grade Entry Form</h2>
              <p style={{ fontSize: '12px', color: '#71717a', margin: '2px 0 0 0' }}>Select course, student, and input scores</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Subject Select */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#52525b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Subject / Course
              </label>
              <select
                value={selectedSubject}
                onChange={handleSubjectChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(0,0,0,0.1)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#18181b',
                  background: '#f9f9fb',
                  outline: 'none'
                }}
              >
                <option value="">— Select Subject —</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            {/* Student Select */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#52525b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Student Name / Enrollment
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={!selectedSubject}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(0,0,0,0.1)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: selectedSubject ? '#18181b' : '#a1a1aa',
                  background: '#f9f9fb',
                  outline: 'none'
                }}
              >
                <option value="">— {selectedSubject ? 'Select Student' : 'Select Subject First'} —</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.enrollment_number})</option>
                ))}
              </select>
            </div>

            {/* Exam Type */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#52525b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Exam Assessment Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(0,0,0,0.1)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#18181b',
                  background: '#f9f9fb',
                  outline: 'none'
                }}
              >
                <option value="MID_SEM">Mid Semester</option>
                <option value="END_SEM">End Semester</option>
                <option value="INTERNAL">Internal Assessment</option>
                <option value="PRACTICAL">Practical Exam</option>
              </select>
            </div>

            {/* Two Input Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#52525b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Marks Obtained
                </label>
                <input
                  type="number"
                  placeholder="e.g. 42"
                  step="0.5"
                  value={marksObtained}
                  onChange={(e) => setMarksObtained(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(0,0,0,0.1)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#18181b',
                    background: '#f9f9fb',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#52525b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Marks
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(0,0,0,0.1)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#18181b',
                    background: '#f9f9fb',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={submitMarks}
              disabled={loading}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: '#282B4A',
                color: '#EEEBDA',
                border: '1px solid rgba(238, 235, 218, 0.2)',
                fontSize: '14px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(40, 43, 74, 0.25)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Save size={16} />
              <span>{loading ? 'Saving to Database...' : 'Save Marks'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MarksManager;
