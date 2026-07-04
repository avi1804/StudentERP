import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export function NotifyStudent() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'GENERAL'
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = useAuthStore.getState().accessToken;
      const response = await fetch('http://localhost:8000/api/v1/notices/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, is_active: true })
      });
      
      if (response.ok) {
        setMessage('Notice posted successfully!');
        setError(false);
        setFormData({ title: '', content: '', category: 'GENERAL' });
      } else {
        const data = await response.json();
        let msg = 'Failed to post notice.';
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
          <span className="card-title">Post New Notice</span>
        </div>
        <form onSubmit={handlePostNotice} style={{ padding: '24px' }}>
          {message && (
            <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '4px', background: error ? 'var(--red-dim)' : 'var(--green-dim)', color: error ? 'var(--red)' : 'var(--green)' }}>
              {message}
            </div>
          )}
          <div className="fg">
            <label>Title *</label>
            <input type="text" placeholder="Mid-semester exam schedule released" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="fg">
            <label>Content *</label>
            <textarea rows={4} placeholder="Full notice details..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required></textarea>
          </div>
          <div className="fg">
            <label>Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="GENERAL">General</option>
              <option value="EXAM">Exam</option>
              <option value="FEE">Fee</option>
              <option value="EVENT">Event</option>
              <option value="HOLIDAY">Holiday</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '16px' }}>
            {loading ? 'Posting...' : 'Post Notice'}
          </button>
        </form>
      </div>
    </div>
  );
}
