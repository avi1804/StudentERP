import { API_BASE_URL } from '../../../config';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AddFaculty() {
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

  return (
    <div className="page-center">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Add New Faculty</span>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {message && (
            <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '4px', background: error ? 'var(--red-dim)' : 'var(--green-dim)', color: error ? 'var(--red)' : 'var(--green)' }}>
              {message}
            </div>
          )}
          <div className="two-input-row">
            <div className="fg">
              <label>Full Name *</label>
              <input type="text" placeholder="Dr. Priya Shah" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
            </div>
            <div className="fg">
              <label>Email *</label>
              <input type="email" placeholder="priya@college.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
          </div>
          <div className="two-input-row">
            <div className="fg">
              <label>Password *</label>
              <input type="password" placeholder="Min 8 characters" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength={8} />
            </div>
            <div className="fg">
              <label>Phone</label>
              <input type="text" placeholder="9876543210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div className="two-input-row">
            <div className="fg">
              <label>Department *</label>
              <select value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})} required>
                <option value="">-- Select Department --</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label>Designation *</label>
              <select value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})}>
                <option>Professor</option>
                <option>Associate Professor</option>
                <option>Assistant Professor</option>
                <option>Lecturer</option>
                <option>HOD</option>
              </select>
            </div>
          </div>
          <div className="fg">
            <label>Employee ID *</label>
            <input type="text" placeholder="EMP1002" value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Enrolling...' : 'Add Faculty'}
          </button>
        </form>
      </div>
    </div>
  );
}
