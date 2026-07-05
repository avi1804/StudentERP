import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AddSubject() {
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
        const facRes = await fetch('http://localhost:8000/api/v1/faculty/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (facRes.ok) {
          const data = await facRes.json();
          setFaculties(data.items || data);
        }

        // Fetch Departments
        const depRes = await fetch('http://localhost:8000/api/v1/departments/', {
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

      const response = await fetch('http://localhost:8000/api/v1/subjects/', {
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

  return (
    <div className="page-center">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Add New Subject</span>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {message && (
            <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '4px', background: error ? 'var(--red-dim)' : 'var(--green-dim)', color: error ? 'var(--red)' : 'var(--green)' }}>
              {message}
            </div>
          )}
          <div className="two-input-row">
            <div className="fg">
              <label>Subject Name *</label>
              <input type="text" placeholder="Data Structures" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="fg">
              <label>Subject Code *</label>
              <input type="text" placeholder="CS301" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
            </div>
          </div>
          <div className="two-input-row">
            <div className="fg">
              <label>Semester *</label>
              <input type="number" placeholder="1" min="1" max="8" value={formData.semester} onChange={e => setFormData({...formData, semester: parseInt(e.target.value)})} required />
            </div>
            <div className="fg">
              <label>Faculty *</label>
              <select value={formData.faculty_id} onChange={e => setFormData({...formData, faculty_id: e.target.value ? parseInt(e.target.value) : ''})} required>
                <option value="">-- Select Faculty --</option>
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>{f.user?.full_name || f.employee_id}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="two-input-row">
            <div className="fg">
              <label>Credits *</label>
              <input type="number" placeholder="4" min="1" max="6" value={formData.credits} onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})} required />
            </div>
            <div className="fg">
              <label>Department *</label>
              <select value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value ? parseInt(e.target.value) : ''})} required>
                <option value="">-- Select Department --</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }} disabled={loading}>
            {loading ? 'Adding...' : 'Add Subject'}
          </button>
        </form>
      </div>
    </div>
  );
}
