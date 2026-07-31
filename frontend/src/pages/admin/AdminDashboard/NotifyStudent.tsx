import React, { useState, useEffect } from 'react';
import { Megaphone, Send, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient as api } from '../../../api/axios';

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  category: string;
  is_active: boolean;
  author_id: number;
  author_name?: string;
  created_at: string;
}

export function NotifyStudent() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'GENERAL'
  });

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const fetchNotices = async () => {
    try {
      setFetching(true);
      const res = await api.get<NoticeItem[]>('/notices/');
      setNotices(res.data);
    } catch (err) {
      console.error("Failed to load notices", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError(false);
    try {
      await api.post('/notices/', {
        ...formData,
        is_active: true
      });
      setMessage('Notice posted successfully! It is now live on Student Dashboard.');
      setFormData({ title: '', content: '', category: 'GENERAL' });
      fetchNotices();
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.detail || 'Failed to post notice.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotice = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await api.delete(`/notices/${id}`);
      setNotices(notices.filter(n => n.id !== id));
      setMessage('Notice deleted successfully.');
      setError(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete notice.");
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#09090b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Megaphone color="#573cfa" size={26} /> Notice & Announcement Center
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
            Broadcast real-time announcements directly to all student dashboards.
          </p>
        </div>

        <button
          onClick={fetchNotices}
          style={{ background: '#ffffff', border: '1.5px solid #e5e7eb', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} className={fetching ? "animate-spin" : ""} /> Refresh Feed
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '28px' }}>
        
        {/* Left Form: Create Notice */}
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e5e7eb', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#09090b', margin: '0 0 18px 0' }}>Post New Notice</h2>
          
          {message && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '18px',
              borderRadius: '12px',
              background: error ? '#fef2f2' : '#f0fdf4',
              color: error ? '#dc2626' : '#16a34a',
              border: error ? '1px solid #fecaca' : '1px solid #bbf7d0',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              {message}
            </div>
          )}

          <form onSubmit={handlePostNotice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Notice Title *</label>
              <input
                type="text"
                placeholder="e.g. Mid-Semester Exam Schedule 2026 Released"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', background: 'white', fontWeight: 600 }}
              >
                <option value="GENERAL">General Announcement</option>
                <option value="EXAM">Examination</option>
                <option value="FEE">Fee & Accounts</option>
                <option value="EVENT">Event / Cultural</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="URGENT">Urgent Alert</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Notice Content / Details *</label>
              <textarea
                rows={5}
                placeholder="Enter complete notice text for students..."
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: '#573cfa', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(87, 60, 250, 0.3)' }}
            >
              <Send size={16} /> {loading ? "Publishing..." : "Broadcast Notice Now"}
            </button>
          </form>
        </div>

        {/* Right Panel: Active Notices List */}
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e5e7eb', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#09090b', margin: 0 }}>Active Posted Notices ({notices.length})</h2>
            <span style={{ fontSize: '11px', color: '#16a34a', background: '#f0fdf4', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>Real-Time Live</span>
          </div>

          {fetching ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading active notices...</div>
          ) : notices.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af' }}>
              No notices published yet. Use the form on the left to broadcast your first announcement.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
              {notices.map((n) => {
                const categoryColors: Record<string, { bg: string; text: string }> = {
                  URGENT: { bg: '#fef2f2', text: '#dc2626' },
                  EXAM: { bg: '#fffbeb', text: '#d97706' },
                  FEE: { bg: '#eff6ff', text: '#2563eb' },
                  EVENT: { bg: '#f0fdf4', text: '#16a34a' },
                  GENERAL: { bg: '#f3f0ff', text: '#573cfa' },
                  HOLIDAY: { bg: '#fdf2f8', text: '#db2777' }
                };
                const catStyle = categoryColors[n.category] || { bg: '#f3f4f6', text: '#4b5563' };

                return (
                  <div key={n.id} style={{ background: '#f9fafb', borderRadius: '14px', padding: '16px', border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ background: catStyle.bg, color: catStyle.text, padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 800 }}>
                        {n.category}
                      </span>
                      <button
                        onClick={() => handleDeleteNotice(n.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        title="Delete Notice"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b' }}>{n.title}</div>
                    <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>{n.content}</div>

                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>By {n.author_name || 'Admin'}</span>
                      <span>{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
