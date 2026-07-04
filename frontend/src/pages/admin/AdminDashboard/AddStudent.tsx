import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AddStudent() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    enrollment_number: '',
    branch: 'CSE',
    semester: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = useAuthStore.getState().accessToken;
      const response = await fetch('http://localhost:8000/api/v1/students/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Student enrolled successfully!');
        setFormData({
          full_name: '', email: '', password: '', enrollment_number: '', branch: 'CSE', semester: '', phone: ''
        });
      } else {
        setMessage(`Error: ${data.detail || 'Failed to enroll student'}`);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Enroll New Student</span>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {message && <div style={{ marginBottom: '15px', color: message.includes('Error') ? 'red' : 'green' }}>{message}</div>}
          <div className="two-input-row">
            <div className="fg">
              <label>Full Name *</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Anika Sharma" required />
            </div>
            <div className="fg">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="anika@college.edu" required />
            </div>
          </div>
          <div className="two-input-row">
            <div className="fg">
              <label>Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 characters" required minLength={8} />
            </div>
            <div className="fg">
              <label>Roll Number *</label>
              <input type="text" name="enrollment_number" value={formData.enrollment_number} onChange={handleChange} placeholder="CS2301" required />
            </div>
          </div>
          <div className="two-input-row">
            <div className="fg">
              <label>Branch *</label>
              <select name="branch" value={formData.branch} onChange={handleChange} required>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="IT">IT</option>
              </select>
            </div>
            <div className="fg">
              <label>Semester *</label>
              <input type="number" name="semester" value={formData.semester} onChange={handleChange} placeholder="3" min="1" max="8" required />
            </div>
          </div>
          <div className="fg">
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Enrolling...' : 'Enroll Student'}
          </button>
        </form>
      </div>
    </div>
  );
}
