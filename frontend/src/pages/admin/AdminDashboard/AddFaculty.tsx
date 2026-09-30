import { API_BASE_URL } from '../../../config';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddFaculty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    department_id: '' as number | string,
    designation: 'Professor',
    employee_id: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = useAuthStore.getState().accessToken;
        const res = await fetch(API_BASE_URL + '/api/v1/departments/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDepartments(data.items || data);
        }
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = useAuthStore.getState().accessToken;
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        department_id: formData.department_id ? Number(formData.department_id) : null,
        designation: formData.designation,
        employee_id: formData.employee_id
      };
      
      const response = await fetch(API_BASE_URL + '/api/v1/faculty/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setMessage('Faculty enrolled successfully!');
        setError(false);
        setFormData({
          full_name: '', email: '', password: '', phone: '', department_id: '', designation: 'Professor', employee_id: ''
        });
        setTimeout(() => navigate('/admin/dashboard/faculty/manage'), 1200);
      } else {
        const data = await response.json();
        let msg = 'Failed to enroll faculty.';
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
          onClick={() => navigate('/admin/dashboard/faculty/manage')}
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
              Faculty
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            Enroll a new professor, instructor or HOD into the university faculty registry
          </div>
        </div>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
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
              <label style={labelStyle}>Full Name *</label>
              <input 
                type="text" 
                placeholder="Dr. Priya Shah" 
                value={formData.full_name} 
                onChange={e => setFormData({...formData, full_name: e.target.value})} 
                required 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address *</label>
              <input 
                type="email" 
                placeholder="priya@college.edu" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Password *</label>
              <input 
                type="password" 
                placeholder="Min 8 characters" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                required 
                minLength={8} 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={labelStyle}>Contact Phone</label>
              <input 
                type="text" 
                placeholder="9876543210" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Department *</label>
              <select 
                value={formData.department_id} 
                onChange={e => setFormData({...formData, department_id: e.target.value})} 
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
              <label style={labelStyle}>Designation *</label>
              <select 
                value={formData.designation} 
                onChange={e => setFormData({...formData, designation: e.target.value})} 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <option>Professor</option>
                <option>Associate Professor</option>
                <option>Assistant Professor</option>
                <option>Lecturer</option>
                <option>HOD</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Employee ID *</label>
            <input 
              type="text" 
              placeholder="EMP1002" 
              value={formData.employee_id} 
              onChange={e => setFormData({...formData, employee_id: e.target.value})} 
              required 
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = '#282B4A'}
              onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard/faculty/manage')}
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
              <UserPlus size={18} color="#EEEBDA" />
              {loading ? 'Enrolling...' : 'Add Faculty'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
