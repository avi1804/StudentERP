import React from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const YEAR_CMP = [
  { year: '2022', avg: 6.2, high: 18, placed: 120 },
  { year: '2023', avg: 7.1, high: 20, placed: 158 },
  { year: '2024', avg: 8.5, high: 24, placed: 193 },
  { year: '2025', avg: 9.2, high: 32, placed: 210 },
];
const DEPT = [
  { dept: 'CSE', placed: 45, total: 60 }, { dept: 'ECE', placed: 22, total: 40 },
  { dept: 'ME', placed: 15, total: 35 }, { dept: 'EE', placed: 12, total: 30 },
  { dept: 'Civil', placed: 6, total: 25 },
];
const COMPANY_TREND = [
  { month: 'Jan', companies: 3 }, { month: 'Feb', companies: 5 },
  { month: 'Mar', companies: 8 }, { month: 'Apr', companies: 6 },
  { month: 'May', companies: 11 }, { month: 'Jun', companies: 9 }, { month: 'Jul', companies: 7 },
];
const PKG_PIE = [
  { name: '3–5 LPA', value: 18, color: '#94a3b8' }, { name: '5–8 LPA', value: 32, color: '#3b82f6' },
  { name: '8–12 LPA', value: 24, color: '#8b5cf6' }, { name: '12–18 LPA', value: 12, color: '#f59e0b' },
  { name: '18+ LPA', value: 7, color: '#10b981' },
];

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>{title}</div>
    {children}
  </div>
);

const CHART_TOOLTIP_STYLE = { borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' };

export function Analytics() {
  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Analytics</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>Placement performance and trends across all years</p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Avg Package (2025)', value: '9.2 LPA', color: '#3b82f6' },
          { label: 'Highest Package', value: '32 LPA', color: '#10b981' },
          { label: 'Placement %', value: '78%', color: '#8b5cf6' },
          { label: 'Companies Visited', value: '49', color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color, letterSpacing: '-0.5px' }}>{value}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <ChartCard title="Year-over-Year Placement Comparison">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={YEAR_CMP} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="placed" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Students Placed" barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average vs Highest Package (LPA)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={YEAR_CMP}>
              <defs>
                <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2.5} fill="url(#avgGrad)" name="Avg Package" dot={{ r: 4, fill: '#3b82f6' }} />
              <Area type="monotone" dataKey="high" stroke="#10b981" strokeWidth={2.5} fill="url(#highGrad)" name="Highest Package" dot={{ r: 4, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <ChartCard title="Branch-wise Placements">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEPT} layout="vertical" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="placed" fill="#3b82f6" radius={[0, 6, 6, 0]} name="Placed" barSize={14} />
              <Bar dataKey="total" fill="#e2e8f0" radius={[0, 6, 6, 0]} name="Total" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Package Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PKG_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {PKG_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {PKG_PIE.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#64748b' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: d.color }} />{d.name}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
