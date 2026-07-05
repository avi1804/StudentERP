import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';

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
      setMessage({ text: `Marks saved successfully!`, type: 'success' });
      setMarksObtained('');
    } catch (error: any) {
      setMessage({ text: error.response?.data?.detail || 'Failed to save marks', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      {message.text && (
        <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', border: message.type === 'error' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)', backgroundColor: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: message.type === 'error' ? 'var(--red)' : 'var(--green)' }}>
          {message.text}
        </div>
      )}

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Enter marks panel */}
        <div className="marks-input-panel">
          <div className="card-header"><span className="card-title">Enter Marks</span></div>
          <div className="panel-body">
            <div className="fg">
              <label>Subject</label>
              <select className="premium-fg" value={selectedSubject} onChange={handleSubjectChange}>
                <option value="">— Select Subject —</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label>Student</label>
              <select className="premium-fg" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} disabled={!selectedSubject}>
                <option value="">— Select Subject First —</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.enrollment_number})</option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label>Exam Type</label>
              <select className="premium-fg" value={examType} onChange={(e) => setExamType(e.target.value)}>
                <option value="MID_SEM">Mid Semester</option>
                <option value="END_SEM">End Semester</option>
                <option value="INTERNAL">Internal</option>
                <option value="PRACTICAL">Practical</option>
              </select>
            </div>
            <div className="two-input-row">
              <div className="fg">
                <label>Marks Obtained</label>
                <input type="number" placeholder="42" step="0.5" value={marksObtained} onChange={(e) => setMarksObtained(e.target.value)} />
              </div>
              <div className="fg">
                <label>Total Marks</label>
                <input type="number" placeholder="50" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={submitMarks} disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Saving...' : 'Save Marks'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
