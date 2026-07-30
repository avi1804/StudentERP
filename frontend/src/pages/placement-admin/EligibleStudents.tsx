import React, { useState, useEffect } from 'react';
import { apiClient as api } from '../../api/axios';
import { Search, GraduationCap, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface Student { id: number; enrollment_number: string; cgpa: number; semester: number; user?: { full_name: string; email: string }; }

export function EligibleStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minCgpa, setMinCgpa] = useState('');

  useEffect(() => {
    api.get('/students/').then(r => setStudents(r.data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s => {
    const nameMatch = (s.user?.full_name || s.enrollment_number).toLowerCase().includes(search.toLowerCase());
    const cgpaMatch = !minCgpa || s.cgpa >= parseFloat(minCgpa);
    return nameMatch && cgpaMatch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Eligible Students</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>{filtered.length} students match criteria</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} color="#64748b" />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Min CGPA:</span>
            <input type="number" min={0} max={10} step={0.1} placeholder="e.g. 6.5" value={minCgpa} onChange={e => setMinCgpa(e.target.value)}
              style={{ width: '80px', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Student', 'Enrollment No.', 'CGPA', 'Semester', 'Email'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No students found.</td></tr>
              ) : filtered.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  style={{ borderTop: '1px solid #f1f5f9' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                        {(s.user?.full_name || 'ST').substring(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{s.user?.full_name || 'Student'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '12px', color: '#475569' }}>{s.enrollment_number}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: s.cgpa >= 7 ? '#10b981' : s.cgpa >= 5 ? '#f59e0b' : '#ef4444' }}>{s.cgpa?.toFixed(2)}</span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#64748b' }}>Sem {s.semester}</td>
                  <td style={{ padding: '13px 16px', fontSize: '12px', color: '#64748b' }}>{s.user?.email || '—'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
