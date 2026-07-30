import React, { useState } from 'react';
import { Bell, Send, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SAMPLE = [
  { id: 1, title: 'TCS Drive Registration Open', body: 'Register for TCS placement drive by Dec 15th.', type: 'info', time: '2 hours ago', read: false },
  { id: 2, title: 'Interview Schedule Released', body: 'Infosys interviews scheduled for Dec 18–20.', type: 'success', time: '5 hours ago', read: false },
  { id: 3, title: 'Deadline Reminder', body: 'Wipro registration closes tomorrow at midnight.', type: 'warning', time: '1 day ago', read: true },
  { id: 4, title: 'Results Published', body: '45 students selected in Amazon campus drive.', type: 'success', time: '2 days ago', read: true },
];

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  info:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', icon: Bell },
  success: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: CheckCircle2 },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: AlertCircle },
};

export function Notifications() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [notices, setNotices] = useState(SAMPLE);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    setNotices(prev => [{ id: Date.now(), title, body, type: 'info', time: 'Just now', read: false }, ...prev]);
    setTitle(''); setBody('');
    setSending(false); setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Notifications</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>Send announcements to students and view activity</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Send Panel */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={16} color="#3b82f6" /> Send Notification
          </div>
          {sent && <div style={{ marginBottom: '12px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>Notification sent successfully!</div>}
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. TCS Drive Registration"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Message *</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="Write your notification message..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <Users size={14} color="#64748b" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '12px', color: '#64748b' }}>Notification will be sent to <strong>all eligible students</strong> in the system</span>
            </div>
            <button type="submit" disabled={sending || !title || !body}
              style={{ padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', opacity: !title || !body ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Send size={14} /> {sending ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>

        {/* Notification Feed */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Recent Notifications</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notices.map((n, i) => {
              const conf = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
              const Icon = conf.icon;
              return (
                <motion.div key={n.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  style={{ padding: '12px 14px', borderRadius: '12px', background: n.read ? '#f8fafc' : conf.bg, border: `1px solid ${n.read ? '#f1f5f9' : `${conf.color}20`}` }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Icon size={14} color={conf.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: n.read ? 600 : 800, color: '#0f172a' }}>{n.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{n.body}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>{n.time}</div>
                    </div>
                    {!n.read && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: conf.color, flexShrink: 0, marginTop: '4px' }} />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
