import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, User, Bell, Shield, Globe } from 'lucide-react';

const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
      <Icon size={16} color="#3b82f6" />
      <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{title}</span>
    </div>
    {children}
  </div>
);

const Field = ({ label, type = 'text', value, onChange, placeholder }: any) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
  </div>
);

const Toggle = ({ label, desc, value, onChange }: any) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f8fafc' }}>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{label}</div>
      {desc && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{desc}</div>}
    </div>
    <button onClick={() => onChange(!value)}
      style={{ width: '42px', height: '24px', borderRadius: '12px', border: 'none', background: value ? '#3b82f6' : '#e2e8f0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: value ? '20px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </button>
  </div>
);

export function PlacementSettings() {
  const [name, setName] = useState('Placement Officer');
  const [email, setEmail] = useState('placement@college.edu');
  const [orgName, setOrgName] = useState('SSIT Placement Cell');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, drive_reminder: true, app_updates: false, weekly_report: true });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Settings</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>Manage your placement portal preferences</p>
      </div>

      {saved && <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>Settings saved successfully!</div>}

      <Section title="Profile" icon={User}>
        <Field label="Full Name" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Your name" />
        <Field label="Email Address" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="your@email.com" />
      </Section>

      <Section title="Organization" icon={Globe}>
        <Field label="Placement Cell Name" value={orgName} onChange={(e: any) => setOrgName(e.target.value)} placeholder="e.g. MIT Placement Cell" />
        <Field label="Academic Year" value="2024–25" onChange={() => {}} placeholder="e.g. 2024–25" />
      </Section>

      <Section title="Notifications" icon={Bell}>
        <Toggle label="Email Notifications" desc="Receive updates via email" value={notifs.email} onChange={(v: boolean) => setNotifs(n => ({ ...n, email: v }))} />
        <Toggle label="Drive Reminders" desc="Get reminded before registration deadlines" value={notifs.drive_reminder} onChange={(v: boolean) => setNotifs(n => ({ ...n, drive_reminder: v }))} />
        <Toggle label="Application Updates" desc="Alert on every application status change" value={notifs.app_updates} onChange={(v: boolean) => setNotifs(n => ({ ...n, app_updates: v }))} />
        <Toggle label="Weekly Report" desc="Receive weekly placement summary digest" value={notifs.weekly_report} onChange={(v: boolean) => setNotifs(n => ({ ...n, weekly_report: v }))} />
      </Section>

      <Section title="Security" icon={Shield}>
        <Field label="Current Password" type="password" value="" onChange={() => {}} placeholder="Enter current password" />
        <Field label="New Password" type="password" value="" onChange={() => {}} placeholder="Enter new password" />
        <Field label="Confirm New Password" type="password" value="" onChange={() => {}} placeholder="Confirm new password" />
      </Section>

      <button onClick={handleSave}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}>
        <Save size={15} /> Save Settings
      </button>
    </div>
  );
}
