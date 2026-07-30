import React, { useState, useEffect } from 'react';
import { apiClient as api } from '../../api/axios';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, User, Building2 } from 'lucide-react';

interface Application {
  id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  enrollment_number: string;
  drive_id: number;
  drive_title: string;
  company_name: string;
  package_offered: string;
  status: string;
  applied_on: string;
}

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  APPLIED:     { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6', label: 'Applied' },
  SHORTLISTED: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Shortlisted' },
  INTERVIEW:   { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', label: 'Interview' },
  SELECTED:    { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: 'Selected' },
  REJECTED:    { bg: 'rgba(239,68,68,0.1)',  color: '#ef4444', label: 'Rejected' },
};

const ALL_STATUSES = ['All', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'];

export function StudentApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updating, setUpdating] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  const fetchApps = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      const r = await api.get('/placements/applications', { params });
      setApps(r.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(); }, [statusFilter]);

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdating(id);
    try {
      await api.patch(`/placements/applications/${id}/status`, { status: newStatus });
      setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      setMsg('Status updated');
      setTimeout(() => setMsg(''), 2000);
    } catch { setMsg('Failed to update status'); } finally { setUpdating(null); }
  };

  const filtered = apps.filter(a =>
    a.student_name.toLowerCase().includes(search.toLowerCase()) ||
    a.company_name.toLowerCase().includes(search.toLowerCase()) ||
    a.drive_title.toLowerCase().includes(search.toLowerCase()) ||
    a.enrollment_number?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = Object.fromEntries(ALL_STATUSES.slice(1).map(s => [s, apps.filter(a => a.status === s).length]));

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Student Applications</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>Track and manage all placement applications</p>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {ALL_STATUSES.map(s => {
          const isActive = statusFilter === s;
          const conf = s !== 'All' ? STATUS_CONFIG[s] : null;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: '7px 16px', borderRadius: '10px', border: `1.5px solid ${isActive ? (conf?.color || '#3b82f6') : '#e2e8f0'}`,
                background: isActive ? (conf?.bg || 'rgba(59,130,246,0.1)') : '#fff',
                color: isActive ? (conf?.color || '#3b82f6') : '#64748b',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
              {s === 'All' ? 'All' : STATUS_CONFIG[s]?.label}
              {s !== 'All' && <span style={{ background: isActive ? (conf?.color || '#3b82f6') : '#e2e8f0', color: isActive ? '#fff' : '#64748b', borderRadius: '20px', padding: '0 6px', fontSize: '10px', fontWeight: 800 }}>{counts[s] || 0}</span>}
            </button>
          );
        })}
      </div>

      {msg && <div style={{ marginBottom: '12px', padding: '10px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>{msg}</div>}

      {/* Search */}
      <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ position: 'relative', maxWidth: '380px' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search student, company, drive..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Student', 'Drive / Company', 'Package', 'Applied On', 'Status', 'Update Status'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No applications found.</td></tr>
              ) : filtered.map((a, i) => {
                const conf = STATUS_CONFIG[a.status] || STATUS_CONFIG.APPLIED;
                return (
                  <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    style={{ borderTop: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                          {a.student_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{a.student_name}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.enrollment_number || a.student_email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{a.drive_title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Building2 size={11} /> {a.company_name}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#10b981', fontWeight: 700 }}>{a.package_offered || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b' }}>{new Date(a.applied_on).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: conf.bg, color: conf.color }}>{conf.label}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <select
                          value={a.status}
                          disabled={updating === a.id}
                          onChange={e => updateStatus(a.id, e.target.value)}
                          style={{
                            padding: '6px 28px 6px 10px', borderRadius: '8px', border: '1.5px solid #e2e8f0',
                            fontSize: '12px', fontWeight: 700, color: '#475569', background: '#fff',
                            cursor: 'pointer', appearance: 'none', outline: 'none',
                          }}>
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                        <ChevronDown size={12} color="#94a3b8" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
