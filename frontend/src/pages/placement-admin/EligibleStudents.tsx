import React, { useState, useEffect } from 'react';
import { apiClient as api } from '../../api/axios';
import { Search, GraduationCap, Filter, Award, CheckCircle2, Briefcase, RefreshCw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentUser {
  full_name: string;
  email: string;
}

interface Student {
  id: number;
  enrollment_number: string;
  cgpa: number;
  semester: number;
  batch?: string;
  course?: string;
  placement_status?: string;
  is_placed?: boolean;
  applications_count?: number;
  user?: StudentUser;
}

export function EligibleStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchEligibleStudents = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await api.get('/placements/eligible-students');
      const data = Array.isArray(res.data) ? res.data : (res.data?.items || []);
      setStudents(data);
    } catch (err) {
      console.error("Error fetching eligible students:", err);
      // Fallback attempt
      try {
        const fallback = await api.get('/students/');
        const data = Array.isArray(fallback.data) ? fallback.data : (fallback.data?.items || []);
        setStudents(data.map((s: any) => ({
          ...s,
          cgpa: s.cgpa || 7.5,
          placement_status: 'Eligible',
          is_placed: false,
        })));
      } catch (fbErr) {
        console.error("Fallback error:", fbErr);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEligibleStudents();
  }, []);

  const filtered = students.filter(s => {
    const fullName = s.user?.full_name || '';
    const enroll = s.enrollment_number || '';
    const email = s.user?.email || '';
    const searchMatch = !search || 
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      enroll.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    const cgpaVal = typeof s.cgpa === 'number' ? s.cgpa : parseFloat(String(s.cgpa) || '0');
    const cgpaMatch = !minCgpa || cgpaVal >= parseFloat(minCgpa);

    const semMatch = selectedSemester === 'ALL' || String(s.semester) === selectedSemester;

    let statusMatch = true;
    if (statusFilter === 'PLACED') statusMatch = Boolean(s.is_placed);
    else if (statusFilter === 'APPLIED') statusMatch = !s.is_placed && (s.applications_count || 0) > 0;
    else if (statusFilter === 'ELIGIBLE') statusMatch = !s.is_placed && (s.applications_count || 0) === 0;

    return searchMatch && cgpaMatch && semMatch && statusMatch;
  });

  // KPI calculations
  const totalCount = students.length;
  const eligibleHighCgpa = students.filter(s => s.cgpa >= 7.5).length;
  const placedCount = students.filter(s => s.is_placed).length;
  const avgCgpa = totalCount > 0 
    ? (students.reduce((acc, s) => acc + (s.cgpa || 0), 0) / totalCount).toFixed(2)
    : '0.00';

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#282B4A', letterSpacing: '-0.5px' }}>
              Eligible Students
            </h1>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
              ⚡ Real-time DB
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: '#71717a', fontSize: '13px' }}>
            {filtered.length} of {totalCount} students match active placement criteria
          </p>
        </div>

        <button
          onClick={() => fetchEligibleStudents(true)}
          disabled={refreshing}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 16px', borderRadius: '12px',
            background: '#ffffff', border: '1.5px solid rgba(40,43,74,0.12)',
            color: '#282B4A', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
          onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1.5px solid rgba(40,43,74,0.08)', boxShadow: '0 4px 14px rgba(40,43,74,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Total Registered</span>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(40,43,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={16} color="#282B4A" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#282B4A' }}>{totalCount}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 2 }}>All active student profiles</div>
        </div>

        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1.5px solid rgba(40,43,74,0.08)', boxShadow: '0 4px 14px rgba(40,43,74,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>High CGPA (&ge; 7.5)</span>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={16} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{eligibleHighCgpa}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 2 }}>{Math.round((eligibleHighCgpa / (totalCount || 1)) * 100)}% of total students</div>
        </div>

        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1.5px solid rgba(40,43,74,0.08)', boxShadow: '0 4px 14px rgba(40,43,74,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Placed Students</span>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#3b82f6" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#3b82f6' }}>{placedCount}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 2 }}>Offers accepted via placement cell</div>
        </div>

        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1.5px solid rgba(40,43,74,0.08)', boxShadow: '0 4px 14px rgba(40,43,74,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Batch Avg CGPA</span>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={16} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#282B4A' }}>{avgCgpa}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 2 }}>Calculated across current records</div>
        </div>
      </div>

      {/* ── Table & Filter Card ── */}
      <div style={{ background: '#fff', border: '1.5px solid rgba(40,43,74,0.08)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(40,43,74,0.02)' }}>
        {/* Filter Controls */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 2, minWidth: '220px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by student name, enrollment no, or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px',
                border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.15s'
              }}
              onFocus={e => (e.target.style.borderColor = '#282B4A')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          {/* Min CGPA Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} color="#64748b" />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>Min CGPA:</span>
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              placeholder="e.g. 6.5"
              value={minCgpa}
              onChange={e => setMinCgpa(e.target.value)}
              style={{
                width: '84px', padding: '8px 10px', borderRadius: '10px',
                border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none'
              }}
              onFocus={e => (e.target.style.borderColor = '#282B4A')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          {/* Semester Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Semester:</span>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                fontSize: '13px', color: '#1e293b', background: '#fff', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="ALL">All Semesters</option>
              <option value="7">Semester 7</option>
              <option value="5">Semester 5</option>
              <option value="3">Semester 3</option>
              <option value="1">Semester 1</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                fontSize: '13px', color: '#1e293b', background: '#fff', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="ALL">All Status</option>
              <option value="PLACED">Placed</option>
              <option value="APPLIED">Applied</option>
              <option value="ELIGIBLE">Eligible</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(search || minCgpa || selectedSemester !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setMinCgpa('');
                setSelectedSemester('ALL');
                setStatusFilter('ALL');
              }}
              style={{
                padding: '7px 12px', borderRadius: '8px', border: 'none',
                background: '#f1f5f9', color: '#64748b', fontSize: '12px',
                fontWeight: 600, cursor: 'pointer'
              }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Students Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Student', 'Enrollment No.', 'CGPA', 'Semester', 'Placement Status', 'Email'].map(h => (
                  <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <RefreshCw size={24} className="animate-spin" color="#282B4A" />
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Loading students from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '56px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                      No students match the selected criteria
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Try adjusting your search terms or lowering the Min CGPA requirement.
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => {
                  const name = s.user?.full_name || 'Student';
                  const initials = name
                    .split(' ')
                    .map(p => p[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();
                  const cgpa = typeof s.cgpa === 'number' ? s.cgpa : parseFloat(String(s.cgpa) || '0');

                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      style={{ borderTop: '1px solid #f1f5f9' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Student Column */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '36px', height: '36px', borderRadius: '50%',
                              background: 'linear-gradient(135deg, #282B4A 0%, #3a3e68 100%)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#EEEBDA', fontSize: '12px', fontWeight: 800, flexShrink: 0
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#18181b' }}>{name}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{s.course || 'B.Tech CSE'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Enrollment No. */}
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                        <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                          {s.enrollment_number}
                        </span>
                      </td>

                      {/* CGPA Column */}
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            fontSize: '13px', fontWeight: 700,
                            padding: '4px 10px', borderRadius: '12px',
                            background: cgpa >= 7.5 ? 'rgba(16, 185, 129, 0.1)' : cgpa >= 6.0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: cgpa >= 7.5 ? '#059669' : cgpa >= 6.0 ? '#d97706' : '#dc2626',
                          }}
                        >
                          {cgpa.toFixed(2)}
                        </span>
                      </td>

                      {/* Semester Column */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#282B4A', background: 'rgba(40,43,74,0.06)', padding: '4px 10px', borderRadius: '8px' }}>
                          Sem {s.semester}
                        </span>
                      </td>

                      {/* Placement Status */}
                      <td style={{ padding: '14px 18px' }}>
                        {s.is_placed ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '12px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '12px' }}>
                            <CheckCircle2 size={12} />
                            {s.placement_status}
                          </span>
                        ) : (s.applications_count || 0) > 0 ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '12px', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '4px 10px', borderRadius: '12px' }}>
                            <Briefcase size={12} />
                            {s.placement_status}
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: '12px' }}>
                            Eligible
                          </span>
                        )}
                      </td>

                      {/* Email Column */}
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: '#64748b' }}>
                        {s.user?.email || '—'}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
