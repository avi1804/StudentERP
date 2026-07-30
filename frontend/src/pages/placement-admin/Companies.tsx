import React, { useState, useEffect } from 'react';
import { apiClient as api } from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit3, Trash2, X, Building2, Globe, Mail, Briefcase } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  industry: string;
  website?: string;
  contact_email?: string;
}

function CompanyModal({ company, onClose, onSaved }: { company: Company | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(company?.name || '');
  const [industry, setIndustry] = useState(company?.industry || '');
  const [website, setWebsite] = useState(company?.website || '');
  const [email, setEmail] = useState(company?.contact_email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !industry.trim()) { setError('Name and Industry are required'); return; }
    setLoading(true); setError('');
    try {
      const payload = { name, industry, website: website || undefined, contact_email: email || undefined };
      if (company) await api.put(`/placements/companies/${company.id}`, payload);
      else await api.post('/placements/companies', payload);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to save company');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)' }}
      />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        style={{ position: 'relative', width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 10000 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{company ? 'Edit Company' : 'Add Company'}</h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
        </div>
        {error && <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Company Name *', value: name, set: setName, placeholder: 'e.g. Google, Infosys', icon: Building2 },
            { label: 'Industry *', value: industry, set: setIndustry, placeholder: 'e.g. Technology, Finance', icon: Briefcase },
            { label: 'Website', value: website, set: setWebsite, placeholder: 'https://company.com', icon: Globe },
            { label: 'Contact Email', value: email, set: setEmail, placeholder: 'hr@company.com', icon: Mail },
          ].map(({ label, value, set, placeholder, icon: Icon }) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <Icon size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                  style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              {loading ? 'Saving...' : company ? 'Update Company' : 'Add Company'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalCompany, setModalCompany] = useState<Company | null | undefined>(undefined);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetch = async () => {
    setLoading(true);
    try { const r = await api.get('/placements/companies'); setCompanies(r.data || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this company?')) return;
    try { await api.delete(`/placements/companies/${id}`); setMsg({ text: 'Company deleted', type: 'success' }); fetch(); }
    catch { setMsg({ text: 'Failed to delete company', type: 'error' }); }
  };

  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Companies</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>{companies.length} companies in the placement pool</p>
        </div>
        <button onClick={() => setModalCompany(null)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}>
          <Plus size={16} /> Add Company
        </button>
      </div>

      {msg.text && <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: msg.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', color: msg.type === 'error' ? '#ef4444' : '#10b981', fontSize: '13px', fontWeight: 600 }}>{msg.text}</div>}

      <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {/* Search */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ position: 'relative', maxWidth: '360px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Company', 'Industry', 'Website', 'Contact Email', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No companies found.</td></tr>
              ) : filtered.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderTop: '1px solid #f1f5f9' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569' }}>{c.industry}</td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#3b82f6' }}>{c.website || '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b' }}>{c.contact_email || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setModalCompany(c)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Edit3 size={13} /> Edit</button>
                      <button onClick={() => handleDelete(c.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Trash2 size={13} /> Delete</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalCompany !== undefined && (
          <CompanyModal company={modalCompany} onClose={() => setModalCompany(undefined)} onSaved={fetch} />
        )}
      </AnimatePresence>
    </div>
  );
}
