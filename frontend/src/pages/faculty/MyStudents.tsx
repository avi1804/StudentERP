import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { Users, Search, UserCheck, AlertTriangle, ArrowRight, ShieldCheck, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface StudentItem {
  id: number;
  name: string;
  email: string;
  enrollment_number: string;
  semester: number;
  batch: string;
  attendance_rate: number;
  status: 'Regular' | 'Shortage';
  contact_number: string;
}

export const MyStudents: React.FC = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'REGULAR' | 'SHORTAGE'>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/faculty-dash/my-students');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.enrollment_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'REGULAR') return matchesSearch && s.attendance_rate >= 75;
    if (statusFilter === 'SHORTAGE') return matchesSearch && s.attendance_rate < 75;
    return matchesSearch;
  });

  const totalStudents = students.length;
  const regularStudents = students.filter(s => s.attendance_rate >= 75).length;
  const shortageStudents = students.filter(s => s.attendance_rate < 75).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', color: '#71717a', fontSize: '14px', fontWeight: 600 }}>
        Loading student records...
      </div>
    );
  }

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={28} color="#282B4A" />
            <span>My Students</span>
            <span style={{ fontSize: '14px', fontWeight: 700, background: '#282B4A', color: '#EEEBDA', padding: '3px 12px', borderRadius: '12px' }}>
              Sem 7
            </span>
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
            Comprehensive directory of students enrolled across your classes with real attendance & performance metrics.
          </p>
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', gap: '10px' }}>
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
            <UserCheck size={16} /> Mark Class Attendance
          </button>
        </div>
      </div>

      {/* ── Quick KPI Metric Summary ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Total Students */}
        <div style={{ background: '#f4f4f5', borderRadius: '20px', padding: '18px 22px', border: '1.5px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="#282B4A" /> Total Enrolled Students
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#09090b', marginTop: '8px' }}>
            {totalStudents}
          </div>
          <div style={{ fontSize: '12px', color: '#71717a', marginTop: '4px' }}>7th Semester Batch A</div>
        </div>

        {/* Regular Attendance */}
        <div style={{ background: '#f4f4f5', borderRadius: '20px', padding: '18px 22px', border: '1.5px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#16a34a" /> Regular (&ge; 75% Attendance)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#16a34a', marginTop: '8px' }}>
            {regularStudents}
          </div>
          <div style={{ fontSize: '12px', color: '#71717a', marginTop: '4px' }}>Eligible for University Examinations</div>
        </div>

        {/* Shortage / Low Attendance */}
        <div style={{ background: '#f4f4f5', borderRadius: '20px', padding: '18px 22px', border: '1.5px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#d97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="#d97706" /> Attendance Shortage (&lt; 75%)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#d97706', marginTop: '8px' }}>
            {shortageStudents}
          </div>
          <div style={{ fontSize: '12px', color: '#71717a', marginTop: '4px' }}>Parental notification advised</div>
        </div>
      </div>

      {/* ── Filters & Search Row ── */}
      <div style={{
        background: '#f4f4f5',
        borderRadius: '20px',
        padding: '16px 20px',
        border: '1.5px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', borderRadius: '12px', padding: '8px 14px', border: '1px solid rgba(0,0,0,0.1)', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#71717a" />
          <input
            type="text"
            placeholder="Search by student name, roll no, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '13px', color: '#18181b', fontFamily: 'inherit' }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(40,43,74,0.06)', padding: '4px', borderRadius: '14px' }}>
          {(['ALL', 'REGULAR', 'SHORTAGE'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: 'none',
                background: statusFilter === tab ? '#282B4A' : 'transparent',
                color: statusFilter === tab ? '#EEEBDA' : '#52525b',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab === 'ALL' ? 'All Students' : tab === 'REGULAR' ? 'Regular' : 'Shortage'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Students Table ── */}
      <div style={{
        background: '#f4f4f5',
        borderRadius: '24px',
        border: '1.5px solid rgba(0,0,0,0.07)',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(40,43,74,0.04)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: '#52525b' }}>Student Details</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: '#52525b' }}>Enrollment No</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: '#52525b' }}>Batch / Sem</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: '#52525b' }}>Attendance Rate</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: '#52525b' }}>Status</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: '#52525b', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#71717a' }}>
                    No students match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: idx === filteredStudents.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.06)',
                      background: idx % 2 === 0 ? '#ffffff' : 'rgba(255,255,255,0.6)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {/* Student Name & Email */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#282B4A',
                          color: '#EEEBDA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '13px',
                          flexShrink: 0
                        }}>
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#09090b' }}>{s.name}</div>
                          <div style={{ fontSize: '11px', color: '#71717a', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <Mail size={11} /> {s.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Enrollment No */}
                    <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 600, color: '#282B4A' }}>
                      {s.enrollment_number}
                    </td>

                    {/* Batch */}
                    <td style={{ padding: '14px 20px', color: '#52525b' }}>
                      Sem {s.semester} — {s.batch}
                    </td>

                    {/* Attendance */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '80px',
                          height: '7px',
                          borderRadius: '4px',
                          background: 'rgba(0,0,0,0.08)',
                          overflow: 'hidden'
                        }}>
                          <div
                            style={{
                              width: `${Math.min(100, s.attendance_rate)}%`,
                              height: '100%',
                              borderRadius: '4px',
                              background: s.attendance_rate >= 75 ? '#16a34a' : '#d97706'
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 700, color: s.attendance_rate >= 75 ? '#16a34a' : '#d97706' }}>
                          {s.attendance_rate}%
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: s.attendance_rate >= 75 ? '#dcfce7' : '#fef3c7',
                        color: s.attendance_rate >= 75 ? '#15803d' : '#b45309'
                      }}>
                        {s.attendance_rate >= 75 ? 'Regular' : 'Shortage'}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => navigate(`/faculty/attendance-report?student_id=${s.id}`)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '10px',
                          background: 'rgba(40,43,74,0.06)',
                          color: '#282B4A',
                          border: '1px solid rgba(40,43,74,0.12)',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        Report <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default MyStudents;
