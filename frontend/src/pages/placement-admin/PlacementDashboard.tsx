import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient as api } from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import {
  Building2, CalendarDays, Users, TrendingUp, Clock, CheckCircle2,
  AlertCircle, ArrowUpRight, Plus, Zap, FileBarChart2, UploadCloud, Send
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import TextType from '@/components/TextType';

const STATUS_COLOR: Record<string, string> = {
  APPLIED: '#3b82f6', SHORTLISTED: '#f59e0b', INTERVIEW: '#8b5cf6',
  SELECTED: '#10b981', REJECTED: '#ef4444',
};

const TREND_DATA = [
  { month: 'Jan', placed: 12, drives: 3 }, { month: 'Feb', placed: 18, drives: 5 },
  { month: 'Mar', placed: 24, drives: 6 }, { month: 'Apr', placed: 15, drives: 4 },
  { month: 'May', placed: 31, drives: 8 }, { month: 'Jun', placed: 28, drives: 7 },
  { month: 'Jul', placed: 22, drives: 5 },
];
const PKG_DATA = [
  { range: '3–5 LPA', count: 18 }, { range: '5–8 LPA', count: 32 },
  { range: '8–12 LPA', count: 24 }, { range: '12–18 LPA', count: 12 },
  { range: '18+ LPA', count: 7 },
];


interface DashboardData {
  kpis: Record<string, any>;
  upcoming_drives: any[];
  recent_activity: any[];
  recent_companies: any[];
}

function KPICard({ label, value, icon: Icon, color, sub, highlight }: any) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
      style={{
        background: '#f4f4f5',
        border: '1.5px solid rgba(0,0,0,0.07)',
        borderRadius: '24px',
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '185px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: `1px solid ${color}25`, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: `${color}12`
          }}>
            <Icon size={18} color={color} strokeWidth={2} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>{label}</span>
        </div>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <ArrowUpRight size={15} color="#18181b" />
        </div>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <div style={{ fontSize: '42px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
          {value}
        </div>
        <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
          <span style={{ color, fontWeight: 600 }}>{highlight || 'Active'}</span> · {sub}
        </div>
      </div>
    </motion.div>
  );
}

export function PlacementDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/placements/dashboard')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const kpis = data?.kpis || {};

  const KPIS = [
    { label: 'Total Students', value: kpis.total_students ?? '—', icon: Users, color: '#3b82f6', sub: 'Enrolled across branches', highlight: 'Enrolled' },
    { label: 'Companies Visited', value: kpis.total_companies ?? '—', icon: Building2, color: '#8b5cf6', sub: 'This placement season', highlight: 'Recruiting' },
    { label: 'Active Drives', value: kpis.total_drives ?? '—', icon: CalendarDays, color: '#f59e0b', sub: 'Campus drives', highlight: 'Live' },
    { label: 'Students Placed', value: kpis.placed_students ?? '—', icon: CheckCircle2, color: '#10b981', sub: 'Successfully offered', highlight: 'Placed' },
    { label: 'Avg Package', value: kpis.average_package ?? '—', icon: TrendingUp, color: '#06b6d4', sub: 'Across all offers', highlight: 'Average' },
    { label: 'Highest Package', value: kpis.highest_package ?? '—', icon: Zap, color: '#f43f5e', sub: 'Best CTC this year', highlight: 'Highest' },
    { label: 'Pending Apps', value: kpis.pending_applications ?? '—', icon: Clock, color: '#64748b', sub: 'Awaiting review', highlight: 'Reviewing' },
    { label: 'Total Applications', value: kpis.total_applications ?? '—', icon: FileBarChart2, color: '#0ea5e9', sub: 'Across all drives', highlight: 'Submissions' },
  ];

  return (
    <div style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Header with Animated Text Badge matching Admin Dashboard */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Placement</span>
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              color: '#ffffff',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <TextType
                text={["Dashboard", "Analytics", "Recruitment Hub"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#ffffff' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Welcome back, <strong>{user?.full_name || 'Placement Admin'}</strong> — monitor placement statistics, active drives, and applicant hiring pipelines
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {[
          { label: 'Add Company', icon: Building2, path: '/placement-admin/companies', color: '#3b82f6' },
          { label: 'Create Drive', icon: CalendarDays, path: '/placement-admin/drives', color: '#8b5cf6' },
          { label: 'Upload Results', icon: UploadCloud, path: '/placement-admin/reports', color: '#f59e0b' },
          { label: 'Send Notification', icon: Send, path: '/placement-admin/notifications', color: '#10b981' },
          { label: 'Export Report', icon: FileBarChart2, path: '/placement-admin/reports', color: '#0ea5e9' },
        ].map(({ label, icon: Icon, path, color }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px',
              background: '#ffffff', border: '1.5px solid #e4e4e7', borderRadius: '12px',
              fontSize: '13px', fontWeight: 600, color: '#3f3f46', cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)', transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.color = color; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e4e4e7'; e.currentTarget.style.color = '#3f3f46'; }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* AutoML Studio Style Top KPI Cards Row */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}
      >
        {KPIS.map((k) => <KPICard key={k.label} {...k} />)}
      </motion.div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {/* Placement Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: '#ffffff', border: '1.5px solid #f4f4f5', borderRadius: '24px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
        >
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#09090b', marginBottom: '20px' }}>Placement Hiring Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: '12px' }} />
              <Line type="monotone" dataKey="placed" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} name="Students Placed" />
              <Line type="monotone" dataKey="drives" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 3" dot={false} name="Campus Drives" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Package Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ background: '#ffffff', border: '1.5px solid #f4f4f5', borderRadius: '24px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
        >
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#09090b', marginBottom: '20px' }}>Package Distribution (LPA)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PKG_DATA} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row: Upcoming Drives + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Upcoming Drives */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ background: '#ffffff', border: '1.5px solid #f4f4f5', borderRadius: '24px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#09090b' }}>Upcoming Campus Drives</div>
            <button onClick={() => navigate('/placement-admin/drives')} style={{ fontSize: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all</button>
          </div>
          {loading ? (
            <div style={{ color: '#a1a1aa', fontSize: '13px' }}>Loading...</div>
          ) : data?.upcoming_drives?.length === 0 ? (
            <div style={{ color: '#a1a1aa', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>No upcoming drives scheduled.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(data?.upcoming_drives || []).map((drive) => (
                <div key={drive.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: '#f4f4f5', borderRadius: '14px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                    {drive.company_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{drive.company_name}</div>
                    <div style={{ fontSize: '11px', color: '#71717a' }}>{drive.drive_date} · {drive.package_offered || 'Package TBD'}</div>
                  </div>
                  <button
                    onClick={() => navigate('/placement-admin/drives')}
                    style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: '#ffffff', border: '1.5px solid #f4f4f5', borderRadius: '24px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
        >
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#09090b', marginBottom: '18px' }}>Recent Student Applications</div>
          {loading ? (
            <div style={{ color: '#a1a1aa', fontSize: '13px' }}>Loading...</div>
          ) : data?.recent_activity?.length === 0 ? (
            <div style={{ color: '#a1a1aa', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>No activity logged yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(data?.recent_activity || []).map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0,
                    background: STATUS_COLOR[item.status] || '#a1a1aa'
                  }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#27272a' }}>
                      <strong>{item.student_name}</strong> applied to <strong>{item.company_name}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                        background: `${STATUS_COLOR[item.status] || '#a1a1aa'}18`,
                        color: STATUS_COLOR[item.status] || '#71717a'
                      }}>{item.status}</span>
                      <span style={{ fontSize: '11px', color: '#a1a1aa' }}>
                        {new Date(item.applied_on).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
