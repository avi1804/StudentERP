import { API_BASE_URL } from '../../../config';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft, BookOpen, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddSubject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 4,
    department_id: '' as number | string,
    semester: 1,
    faculty_id: '' as number | string
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = useAuthStore.getState().accessToken;
        
        // Fetch Faculties
        const facRes = await fetch(API_BASE_URL + '/api/v1/faculty/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (facRes.ok) {
          const data = await facRes.json();
          setFaculties(data.items || data);
        }

        // Fetch Departments
        const depRes = await fetch(API_BASE_URL + '/api/v1/departments/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (depRes.ok) {
          const data = await depRes.json();
          setDepartments(data.items || data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = useAuthStore.getState().accessToken;
      
      const payload = {
        name: formData.name,
        code: formData.code,
        credits: formData.credits,
        department_id: formData.department_id ? Number(formData.department_id) : null,
        semester: formData.semester,
        faculty_id: formData.faculty_id ? Number(formData.faculty_id) : null
      };

      const response = await fetch(API_BASE_URL + '/api/v1/subjects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setMessage('Subject added successfully!');
        setError(false);
        setFormData({ name: '', code: '', credits: 4, department_id: '', semester: 1, faculty_id: '' });
        setTimeout(() => navigate('/admin/dashboard/subject/manage'), 1200);
      } else {
        const data = await response.json();
        let msg = 'Failed to add subject.';
        if (typeof data.detail === 'string') {
          msg = data.detail;
        } else if (Array.isArray(data.detail)) {
          msg = data.detail.map((d: any) => `${d.loc.join('.')}: ${d.msg}`).join(', ');
        }
        setMessage(msg);
        setError(true);
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Network error. Please try again.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    background: '#fafafa',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    color: '#282B4A',
    marginBottom: '6px'
  };

  return (
    <div style={{ padding: '0', maxWidth: '840px', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <button 
          onClick={() => navigate('/admin/dashboard/subject/manage')}
          style={{
            width: '42px', height: '42px', borderRadius: '14px', background: '#ffffff',
            border: '1px solid rgba(40, 43, 74, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(40, 43, 74, 0.04)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(40, 43, 74, 0.06)')}
          onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
        >
          <ArrowLeft size={20} color="#282B4A" />
        </button>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Add New</span>
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
              Subject
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            Create and configure an academic course subject with credits, semester, and instructor
          </div>
        </div>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '14px 20px', marginBottom: '24px', borderRadius: '14px',
            backgroundColor: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(5, 150, 105, 0.1)',
            color: error ? '#ef4444' : '#059669',
            border: error ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(5, 150, 105, 0.2)',
            fontWeight: 600, fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {message}
        </motion.div>
      )}

      {/* ── Form Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid rgba(40, 43, 74, 0.08)',
          boxShadow: '0 4px 24px rgba(40, 43, 74, 0.03)',
          padding: '32px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Subject Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Data Structures & Algorithms" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={labelStyle}>Subject Code *</label>
              <input 
                type="text" 
                placeholder="e.g. CS301" 
                value={formData.code} 
                onChange={e => setFormData({...formData, code: e.target.value})} 
                required 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Semester *</label>
              <input 
                type="number" 
                placeholder="1" 
                min="1" 
                max="8" 
                value={formData.semester} 
                onChange={e => setFormData({...formData, semester: parseInt(e.target.value) || 1})} 
                required 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={labelStyle}>Credits *</label>
              <input 
                type="number" 
                placeholder="4" 
                min="1" 
                max="10" 
                value={formData.credits} 
                onChange={e => setFormData({...formData, credits: parseInt(e.target.value) || 4})} 
                required 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div>
              <label style={labelStyle}>Department *</label>
              <select 
                value={formData.department_id} 
                onChange={e => setFormData({...formData, department_id: e.target.value ? parseInt(e.target.value) : ''})} 
                required 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <option value="">-- Select Department --</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code || `ID: ${d.id}`})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Assigned Faculty *</label>
              <select 
                value={formData.faculty_id} 
                onChange={e => setFormData({...formData, faculty_id: e.target.value ? parseInt(e.target.value) : ''})} 
                required 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <option value="">-- Select Faculty --</option>
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>{f.user?.full_name || f.employee_id} ({f.designation})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard/subject/manage')}
              style={{
                padding: '12px 24px',
                borderRadius: '14px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '12px 28px',
                borderRadius: '14px',
                border: '1px solid rgba(238, 235, 218, 0.2)',
                background: '#282B4A',
                color: '#EEEBDA',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(40, 43, 74, 0.25)',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#373a61'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#282B4A'; }}
            >
              <BookOpen size={18} color="#EEEBDA" />
              {loading ? 'Adding...' : 'Add Subject'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
