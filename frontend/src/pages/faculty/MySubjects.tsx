import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { BookOpen, Users, CheckSquare, Edit3, ClipboardList, ArrowUpRight, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SubjectItem {
  id: number;
  name: string;
  code: string;
  credits: number;
  semester: number;
  batch: string;
  enrolled_students: number;
  attendance_rate: number;
  pending_marks: number;
}

export const MySubjects: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/faculty-dash/my-subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', color: '#71717a', fontSize: '14px', fontWeight: 600 }}>
        Loading assigned subjects...
      </div>
    );
  }

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={28} color="#282B4A" />
            <span>My Subjects</span>
            <span style={{ fontSize: '14px', fontWeight: 700, background: '#282B4A', color: '#EEEBDA', padding: '3px 12px', borderRadius: '12px' }}>
              {subjects.length} Courses
            </span>
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
            Active courses, syllabus progress, enrolled student cohorts, and grading status for Semester 7.
          </p>
        </div>

        <button
          onClick={() => navigate('/faculty/attendance')}
          style={{
            padding: '10px 18px',
            borderRadius: '14px',
            background: '#282B4A',
            color: '#EEEBDA',
            border: '1px solid rgba(238, 235, 218, 0.2)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(40, 43, 74, 0.2)'
          }}
        >
          <CheckSquare size={16} /> Mark Attendance
        </button>
      </div>

      {/* ── Grid of Subjects ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {subjects.map((sub, idx) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            style={{
              background: '#f4f4f5',
              borderRadius: '24px',
              border: '1.5px solid rgba(0,0,0,0.07)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              {/* Top Row: Code Badge & Credits */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{
                  background: '#282B4A',
                  color: '#EEEBDA',
                  padding: '4px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}>
                  {sub.code}
                </span>

                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#52525b',
                  background: 'rgba(40,43,74,0.06)',
                  padding: '4px 10px',
                  borderRadius: '10px'
                }}>
                  <Award size={13} color="#282B4A" /> {sub.credits} Credits
                </span>
              </div>

              {/* Subject Title */}
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#09090b', margin: '0 0 6px 0', letterSpacing: '-0.4px' }}>
                {sub.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#71717a', margin: '0 0 20px 0', fontWeight: 500 }}>
                {sub.batch} · Bachelor of Technology
              </p>

              {/* Metrics pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                <div style={{ background: '#ffffff', borderRadius: '14px', padding: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={12} color="#282B4A" /> Students
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#09090b', marginTop: '4px' }}>
                    {sub.enrolled_students || 17}
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '14px', padding: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckSquare size={12} color="#16a34a" /> Attendance
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', marginTop: '4px' }}>
                    {sub.attendance_rate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => navigate('/faculty/attendance')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '12px',
                  background: '#282B4A',
                  color: '#EEEBDA',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CheckSquare size={14} /> Attendance
              </button>

              <button
                onClick={() => navigate('/faculty/marks')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '12px',
                  background: 'rgba(40,43,74,0.08)',
                  color: '#282B4A',
                  border: '1px solid rgba(40,43,74,0.12)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Edit3 size={14} /> Marks
              </button>

              <button
                onClick={() => navigate('/faculty/assignments')}
                title="Assignments"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#18181b'
                }}
              >
                <ClipboardList size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default MySubjects;
