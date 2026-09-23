import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient as api } from '../../api/axios';

interface NotificationItem {
  id: string | number;
  title: string;
  subtitle: string;
  badge: string;
  type: string;
  time: string;
  is_read?: boolean;
}

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  PLACEMENT: { color: '#d97706', bg: 'rgba(217,119,6,0.08)', icon: Bell },
  STUDENT:   { color: '#059669', bg: 'rgba(5,150,105,0.08)', icon: CheckCircle2 },
  ADMIN:     { color: '#282B4A', bg: 'rgba(40,43,74,0.08)', icon: AlertCircle },
  DRIVE:     { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', icon: Bell },
  info:      { color: '#282B4A', bg: 'rgba(40,43,74,0.08)', icon: Bell },
};

export function Notifications() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetRole, setTargetRole] = useState<'student' | 'all' | 'faculty'>('student');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [notices, setNotices] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notifications/my-notifications');
      if (res.data && Array.isArray(res.data)) {
        setNotices(res.data);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;
    setSending(true);
    setErrorMsg('');
    try {
      await api.post('/notifications/', {
        title,
        message: body,
        category: 'PLACEMENT',
        target_role: targetRole,
        sender_name: 'Placement Cell',
        link: '/dashboard/placement',
      });
      setTitle('');
      setBody('');
      setSent(true);
      fetchNotices();
      setTimeout(() => setSent(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Failed to send notification.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#282B4A' }}>Placement Notifications</h1>
          <p style={{ margin: '4px 0 0', color: '#71717a', fontSize: '13px' }}>
            Broadcast recruitment drives, interview schedules, and shortlists to students in real-time
          </p>
        </div>
        <button
          onClick={fetchNotices}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '10px',
            background: '#ffffff', border: '1px solid #e2e8f0',
            fontSize: '12px', fontWeight: 600, color: '#282B4A', cursor: 'pointer',
          }}
        >
          <RefreshCw size={13} /> Refresh Feed
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Send Panel */}
        <div style={{ background: '#fff', border: '1.5px solid rgba(40,43,74,0.08)', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(40,43,74,0.02)' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#282B4A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={16} color="#282B4A" /> Send Notification
          </div>

          {sent && (
            <div style={{ marginBottom: '14px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
              ✓ Notification sent successfully! Live across Student Dynamic Islands.
            </div>
          )}

          {errorMsg && (
            <div style={{ marginBottom: '14px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. TCS Interview Shortlist Announced"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Target Audience</label>
              <select
                value={targetRole}
                onChange={(e: any) => setTargetRole(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
              >
                <option value="student">All Students</option>
                <option value="all">Everyone (Students, Faculty, Admin)</option>
                <option value="faculty">Faculty Members Only</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Message *</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={4}
                placeholder="Write notification message with key details, reporting time, venue, or instructions..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <Users size={14} color="#64748b" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Notification will be pushed in real-time to <strong>{targetRole === 'student' ? 'all students' : targetRole === 'faculty' ? 'all faculty' : 'all university users'}</strong>.
              </span>
            </div>

            <button
              type="submit"
              disabled={sending || !title || !body}
              style={{
                padding: '12px', borderRadius: '12px', border: '1px solid rgba(238, 235, 218, 0.2)',
                background: '#282B4A', color: '#EEEBDA', fontSize: '13px', fontWeight: 700,
                cursor: sending || !title || !body ? 'not-allowed' : 'pointer', opacity: !title || !body ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(40,43,74,0.25)', transition: 'all 0.15s ease'
              }}
            >
              <Send size={14} /> {sending ? 'Broadcasting...' : 'Broadcast Notification'}
            </button>
          </form>
        </div>

        {/* Notification Feed */}
        <div style={{ background: '#fff', border: '1.5px solid rgba(40,43,74,0.08)', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(40,43,74,0.02)' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#282B4A', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Live Notification Feed</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{notices.length} items</span>
          </div>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading live feed...</div>
          ) : notices.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No notifications found</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
              {notices.map((n, i) => {
                const conf = TYPE_CONFIG[n.badge?.toUpperCase()] || TYPE_CONFIG.info;
                const Icon = conf.icon;
                return (
                  <motion.div
                    key={n.id || i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      padding: '12px 14px', borderRadius: '12px',
                      background: conf.bg,
                      border: `1px solid ${conf.color}25`,
                    }}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <Icon size={14} color={conf.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{n.title}</span>
                          <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: conf.color, color: '#fff' }}>
                            {n.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.4 }}>{n.subtitle}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>{n.time}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
