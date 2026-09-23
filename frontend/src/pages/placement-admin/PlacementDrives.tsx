import React, { useState, useEffect } from 'react';
import { apiClient as api } from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CalendarDays, Building2, Filter, List, Kanban, Info, Clock, Users, ArrowUpRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
const BUCKET_COLORS = { 
  'Upcoming': '#282B4A', 
  'Registration Open': '#f59e0b', 
  'Interview Running': '#8b5cf6', 
  'Completed': '#10b981' 
};

export function getDriveStatus(drive: Drive): string {
  const now = new Date();
  
  // Set driveDate to end of that day (23:59:59) so it doesn't expire prematurely on the same day
  const driveDate = new Date(drive.drive_date);
  driveDate.setHours(23, 59, 59, 999);

  const regDeadline = new Date(drive.registration_deadline);

  // If the drive date has fully passed, it is Completed
  if (driveDate < now) {
    return 'Completed';
  }

  // If registration deadline has passed, but drive date is ongoing or in the future:
  // Registrations are closed, and candidate screening/interviews are currently active!
  if (now > regDeadline) {
    return 'Interview Running';
  }

  // If today is before registration deadline:
  // If announced more than 30 days away, mark as Upcoming announcement
  const diffDays = (regDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > 30) {
    return 'Upcoming';
  }

  // Otherwise, registration is actively OPEN!
  return 'Registration Open';
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

  // Helper date formatters for quick presets
  const formatIsoDate = (d: Date) => d.toISOString().split('T')[0];
  const formatIsoDateTimeLocal = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const applyStagePreset = (stage: 'Upcoming' | 'Registration Open' | 'Interview Running' | 'Completed') => {
    const today = new Date();
    if (stage === 'Upcoming') {
      const reg = new Date(today);
      reg.setDate(today.getDate() + 35);
      const drv = new Date(today);
      drv.setDate(today.getDate() + 45);
      setForm(f => ({ ...f, registration_deadline: formatIsoDateTimeLocal(reg), drive_date: formatIsoDate(drv) }));
    } else if (stage === 'Registration Open') {
      const reg = new Date(today);
      reg.setDate(today.getDate() + 7);
      const drv = new Date(today);
      drv.setDate(today.getDate() + 14);
      setForm(f => ({ ...f, registration_deadline: formatIsoDateTimeLocal(reg), drive_date: formatIsoDate(drv) }));
    } else if (stage === 'Interview Running') {
      const reg = new Date(today);
      reg.setDate(today.getDate() - 1);
      const drv = new Date(today);
      drv.setDate(today.getDate() + 3);
      setForm(f => ({ ...f, registration_deadline: formatIsoDateTimeLocal(reg), drive_date: formatIsoDate(drv) }));
    } else if (stage === 'Completed') {
      const reg = new Date(today);
      reg.setDate(today.getDate() - 10);
      const drv = new Date(today);
      drv.setDate(today.getDate() - 5);
      setForm(f => ({ ...f, registration_deadline: formatIsoDateTimeLocal(reg), drive_date: formatIsoDate(drv) }));
    }
  };

  // Preview status
  const currentPreviewStatus = form.drive_date && form.registration_deadline
    ? getDriveStatus({ ...form, id: 0, company_id: Number(form.company_id), eligibility_cgpa: Number(form.eligibility_cgpa) })
    : 'Incomplete';

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
        style={{ position: 'relative', width: '100%', maxWidth: '600px', background: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 10000, maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#282B4A' }}>{drive ? 'Edit Placement Drive' : 'Create Placement Drive'}</h2>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>Configure company drive dates, eligibility, and stage.</p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
        </div>

        {/* Quick Stage Presets Helper */}
        <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>⚡ Set Stage Dates Fast</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: BUCKET_COLORS[currentPreviewStatus as keyof typeof BUCKET_COLORS] || '#282B4A' }}>
              Calculated: {currentPreviewStatus}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => applyStagePreset('Registration Open')}
              style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '8px', border: '1px solid #fde68a', background: '#fef3c7', color: '#b45309', cursor: 'pointer', textAlign: 'center' }}
            >
              Open Reg
            </button>
            <button
              type="button"
              onClick={() => applyStagePreset('Interview Running')}
              style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '8px', border: '1px solid #ddd6fe', background: '#ede9fe', color: '#6d28d9', cursor: 'pointer', textAlign: 'center' }}
            >
              Start Interviews
            </button>
            <button
              type="button"
              onClick={() => applyStagePreset('Upcoming')}
              style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', cursor: 'pointer', textAlign: 'center' }}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => applyStagePreset('Completed')}
              style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '8px', border: '1px solid #bbf7d0', background: '#ecfdf5', color: '#15803d', cursor: 'pointer', textAlign: 'center' }}
            >
              Completed
            </button>
          </div>
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
            <input type="text" placeholder="e.g. Software Development Engineer 2026" value={form.title} onChange={set('title')} style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Job Description & Roles</label>
            <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Job requirements, interview format, technical skills..."
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Registration Deadline *</label>
              <input type="datetime-local" value={form.registration_deadline} onChange={set('registration_deadline')} style={inputStyle} />
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: 4, display: 'block' }}>Students apply until this date</span>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Drive / Interview Date *</label>
              <input type="date" value={form.drive_date} onChange={set('drive_date')} style={inputStyle} />
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: 4, display: 'block' }}>Date when interviews take place</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Min CGPA</label>
              <input type="number" min={0} max={10} step={0.1} value={form.eligibility_cgpa} onChange={set('eligibility_cgpa')} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Package Offered</label>
              <input type="text" placeholder="e.g. 14.5 LPA" value={form.package_offered} onChange={set('package_offered')} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1.5px solid rgba(40,43,74,0.12)', background: '#fff', color: '#282B4A', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(238, 235, 218, 0.2)', background: '#282B4A', color: '#EEEBDA', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(40,43,74,0.25)' }}>
              {loading ? 'Saving...' : drive ? 'Update Drive' : 'Create Drive'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function PlacementDrives() {
  const navigate = useNavigate();
  const [drives, setDrives] = useState<Drive[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Drive | null | undefined>(undefined);
  const [showInfo, setShowInfo] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [dRes, cRes] = await Promise.all([api.get('/placements/drives'), api.get('/placements/companies')]);
      setDrives(dRes.data || []); 
      setCompanies(cRes.data || []);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const getCompanyName = (id: number) => companies.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Top Header Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#282B4A', letterSpacing: '-0.5px' }}>
            Placement Drives
          </h1>
          <p style={{ margin: '4px 0 0', color: '#71717a', fontSize: '13px' }}>
            {drives.length} drives registered this placement season
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(40, 43, 74, 0.06)', borderRadius: '12px', padding: '3px', border: '1px solid rgba(40, 43, 74, 0.08)' }}>
            {[{ icon: Kanban, v: 'kanban' }, { icon: List, v: 'table' }].map(({ icon: Icon, v }) => (
              <button key={v} onClick={() => setView(v as any)}
                style={{ padding: '7px 12px', borderRadius: '9px', border: 'none', background: view === v ? '#282B4A' : 'transparent', cursor: 'pointer', color: view === v ? '#EEEBDA' : 'rgba(40, 43, 74, 0.6)', boxShadow: view === v ? '0 2px 8px rgba(40,43,74,0.2)' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center' }}>
                <Icon size={15} />
              </button>
            ))}
          </div>

          <button onClick={() => setModal(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#282B4A', color: '#EEEBDA', border: '1px solid rgba(238, 235, 218, 0.2)', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(40,43,74,0.25)' }}>
            <Plus size={16} /> Create Drive
          </button>
        </div>
      </div>

      {/* ── Workflow Guide Callout ── */}
      {showInfo && (
        <div style={{
          background: '#ffffff', border: '1.5px solid rgba(40,43,74,0.08)', borderRadius: '16px',
          padding: '14px 18px', marginBottom: '24px', boxShadow: '0 4px 16px rgba(40,43,74,0.02)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <HelpCircle size={16} color="#282B4A" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#282B4A' }}>
                How Drive Stages Work & How to Move Between Them:
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', fontSize: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', borderLeft: '3px solid #282B4A' }}>
                <strong style={{ color: '#282B4A' }}>1. Upcoming:</strong>
                <div style={{ color: '#64748b', marginTop: 2 }}>Announced in advance. Registrations have not opened yet.</div>
              </div>
              <div style={{ background: '#fffbeb', padding: '8px 12px', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
                <strong style={{ color: '#b45309' }}>2. Registration Open:</strong>
                <div style={{ color: '#64748b', marginTop: 2 }}>Now &le; Deadline. Students can actively apply from their Student Placement Cell.</div>
              </div>
              <div style={{ background: '#f5f3ff', padding: '8px 12px', borderRadius: '10px', borderLeft: '3px solid #8b5cf6' }}>
                <strong style={{ color: '#6d28d9' }}>3. Interview Running:</strong>
                <div style={{ color: '#64748b', marginTop: 2 }}>Registration closed. Shortlisting, screening tests & interviews in progress.</div>
              </div>
              <div style={{ background: '#ecfdf5', padding: '8px 12px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
                <strong style={{ color: '#15803d' }}>4. Completed:</strong>
                <div style={{ color: '#64748b', marginTop: 2 }}>Drive date passed. Final offers rolled out and students hired.</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
            title="Dismiss guide"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontSize: '14px' }}>Loading drives...</div>
      ) : view === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {STATUS_BUCKETS.map(bucket => {
            const bucketDrives = drives.filter(d => getDriveStatus(d) === bucket);
            const color = BUCKET_COLORS[bucket as keyof typeof BUCKET_COLORS];
            return (
              <div key={bucket} style={{ background: '#f8fafc', borderRadius: '18px', padding: '16px', border: '1.5px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: color }} />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#374151' }}>{bucket}</span>
                  <span style={{ marginLeft: 'auto', background: `${color}18`, color, fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
                    {bucketDrives.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {bucketDrives.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 16px', background: '#fff', borderRadius: '12px', border: '1px dashed #e2e8f0', color: '#94a3b8', fontSize: '12px' }}>
                      No drives in {bucket}
                    </div>
                  )}
                  {bucketDrives.map(d => {
                    const isRegOpen = bucket === 'Registration Open';
                    const isInterview = bucket === 'Interview Running';
                    const isUpcoming = bucket === 'Upcoming';

                    return (
                      <motion.div
                        key={d.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: '#fff', borderRadius: '14px', padding: '16px',
                          border: isRegOpen ? '1.5px solid rgba(245, 158, 11, 0.3)' : isInterview ? '1.5px solid rgba(139, 92, 246, 0.3)' : '1px solid #f1f5f9',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          cursor: 'pointer', transition: 'all 0.15s'
                        }}
                        whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(40,43,74,0.08)' }}
                        onClick={() => setModal(d)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: '6px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                            {d.title}
                          </div>
                          {d.package_offered && (
                            <span style={{ fontSize: '11px', fontWeight: 700, background: `${color}15`, color, padding: '3px 8px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                              {d.package_offered}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Building2 size={13} color="#94a3b8" />
                          <span>{getCompanyName(d.company_id)}</span>
                        </div>

                        {/* Date Status Info Pill */}
                        <div style={{ fontSize: '11px', padding: '6px 10px', borderRadius: '8px', background: '#f8fafc', color: '#475569', display: 'flex', alignItems: 'center', gap: 6, marginBottom: '10px' }}>
                          <Clock size={12} color="#64748b" />
                          <span>
                            {isRegOpen && `Reg closes: ${d.registration_deadline ? d.registration_deadline.slice(0, 10) : ''}`}
                            {isInterview && `Interviews on: ${d.drive_date}`}
                            {isUpcoming && `Drive on: ${d.drive_date}`}
                            {bucket === 'Completed' && `Concluded on: ${d.drive_date}`}
                          </span>
                        </div>

                        {/* Card Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f8fafc' }}>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                            Min CGPA: <strong style={{ color: '#475569' }}>{d.eligibility_cgpa}</strong>
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#282B4A', display: 'flex', alignItems: 'center', gap: 2 }}>
                            Edit <ArrowUpRight size={11} />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
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
                {['Title', 'Company', 'Drive Date', 'Registration Deadline', 'Package', 'Min CGPA', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drives.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No drives found.</td></tr>
              ) : drives.map((d) => {
                const status = getDriveStatus(d);
                const color = BUCKET_COLORS[status as keyof typeof BUCKET_COLORS];
                return (
                  <tr key={d.id} style={{ borderTop: '1px solid #f1f5f9' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{d.title}</td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#475569' }}>{getCompanyName(d.company_id)}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#64748b' }}>{d.drive_date}</td>
                    <td style={{ padding: '13px 16px', fontSize: '12px', color: '#64748b' }}>{d.registration_deadline ? d.registration_deadline.slice(0, 16).replace('T', ' ') : '—'}</td>
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
