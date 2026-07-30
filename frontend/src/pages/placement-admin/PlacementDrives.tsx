import React, { useState, useEffect } from 'react';
import { apiClient as api } from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CalendarDays, Building2, Filter, List, Kanban } from 'lucide-react';

interface Drive {
  id: number;
  company_id: number;
  title: string;
  description: string;
  drive_date: string;
  registration_deadline: string;
  eligibility_cgpa: number;
  package_offered?: string;
}

interface Company { id: number; name: string; industry: string; }

const STATUS_BUCKETS = ['Upcoming', 'Registration Open', 'Interview Running', 'Completed'];
const BUCKET_COLORS = { 'Upcoming': '#3b82f6', 'Registration Open': '#f59e0b', 'Interview Running': '#8b5cf6', 'Completed': '#10b981' };

function getDriveStatus(drive: Drive): string {
  const today = new Date();
  const driveDate = new Date(drive.drive_date);
  const regDeadline = new Date(drive.registration_deadline);
  if (driveDate < today) return 'Completed';
  if (today > regDeadline) return 'Interview Running';
  const diffDays = (regDeadline.getTime() - today.getTime()) / 86400000;
  if (diffDays < 7) return 'Registration Open';
  return 'Upcoming';
}

function DriveModal({ drive, companies, onClose, onSaved }: { drive: Drive | null; companies: Company[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    company_id: drive?.company_id || (companies[0]?.id || 0),
    title: drive?.title || '',
    description: drive?.description || '',
    drive_date: drive?.drive_date || '',
    registration_deadline: drive?.registration_deadline ? drive.registration_deadline.slice(0, 16) : '',
    eligibility_cgpa: drive?.eligibility_cgpa ?? 0,
    package_offered: drive?.package_offered || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.drive_date || !form.registration_deadline || !form.company_id) { setError('Required fields are missing'); return; }
    setLoading(true); setError('');
    try {
      const payload = { ...form, company_id: Number(form.company_id), eligibility_cgpa: Number(form.eligibility_cgpa) };
      if (drive) await api.put(`/placements/drives/${drive.id}`, payload);
      else await api.post('/placements/drives', payload);
      onSaved(); onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to save drive');
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)' }} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        style={{ position: 'relative', width: '100%', maxWidth: '560px', background: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 10000, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{drive ? 'Edit Drive' : 'Create Drive'}</h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
        </div>
        {error && <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Company *</label>
            <select value={form.company_id} onChange={set('company_id')} style={inputStyle}>
              <option value="">Select company...</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Drive Title *</label>
            <input type="text" placeholder="e.g. Software Engineer 2025" value={form.title} onChange={set('title')} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Job description, skills required..."
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Drive Date *</label>
              <input type="date" value={form.drive_date} onChange={set('drive_date')} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Registration Deadline *</label>
              <input type="datetime-local" value={form.registration_deadline} onChange={set('registration_deadline')} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Min CGPA</label>
              <input type="number" min={0} max={10} step={0.1} value={form.eligibility_cgpa} onChange={set('eligibility_cgpa')} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Package Offered</label>
              <input type="text" placeholder="e.g. 8 LPA" value={form.package_offered} onChange={set('package_offered')} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              {loading ? 'Saving...' : drive ? 'Update Drive' : 'Create Drive'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function PlacementDrives() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Drive | null | undefined>(undefined);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [dRes, cRes] = await Promise.all([api.get('/placements/drives'), api.get('/placements/companies')]);
      setDrives(dRes.data || []); setCompanies(cRes.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const getCompanyName = (id: number) => companies.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Placement Drives</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>{drives.length} drives this placement season</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '3px' }}>
            {[{ icon: Kanban, v: 'kanban' }, { icon: List, v: 'table' }].map(({ icon: Icon, v }) => (
              <button key={v} onClick={() => setView(v as any)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: 'none', background: view === v ? '#fff' : 'transparent', cursor: 'pointer', color: view === v ? '#3b82f6' : '#94a3b8', boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center' }}>
                <Icon size={15} />
              </button>
            ))}
          </div>
          <button onClick={() => setModal(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}>
            <Plus size={16} /> Create Drive
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '14px' }}>Loading drives...</div>
      ) : view === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {STATUS_BUCKETS.map(bucket => {
            const bucketDrives = drives.filter(d => getDriveStatus(d) === bucket);
            const color = BUCKET_COLORS[bucket as keyof typeof BUCKET_COLORS];
            return (
              <div key={bucket} style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>{bucket}</span>
                  <span style={{ marginLeft: 'auto', background: `${color}18`, color, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{bucketDrives.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {bucketDrives.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '12px' }}>No drives</div>}
                  {bucketDrives.map(d => (
                    <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ background: '#fff', borderRadius: '12px', padding: '14px', border: '1px solid #f1f5f9', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                      whileHover={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                      onClick={() => setModal(d)}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{d.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{getCompanyName(d.company_id)}</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', background: '#f1f5f9', borderRadius: '6px', padding: '3px 8px', color: '#475569' }}>{d.drive_date}</span>
                        {d.package_offered && <span style={{ fontSize: '11px', background: `${color}10`, borderRadius: '6px', padding: '3px 8px', color }}>{d.package_offered}</span>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Title', 'Company', 'Drive Date', 'Package', 'Min CGPA', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drives.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No drives found.</td></tr>
              ) : drives.map((d, i) => {
                const status = getDriveStatus(d);
                const color = BUCKET_COLORS[status as keyof typeof BUCKET_COLORS];
                return (
                  <tr key={d.id} style={{ borderTop: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{d.title}</td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#475569' }}>{getCompanyName(d.company_id)}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#64748b' }}>{d.drive_date}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#10b981', fontWeight: 700 }}>{d.package_offered || '—'}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#64748b' }}>{d.eligibility_cgpa}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '8px', background: `${color}15`, color }}>{status}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <button onClick={() => setModal(d)} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modal !== undefined && <DriveModal drive={modal} companies={companies} onClose={() => setModal(undefined)} onSaved={fetchAll} />}
      </AnimatePresence>
    </div>
  );
}
