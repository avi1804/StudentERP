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
  { name: '3–5 LPA', value: 18, color: 'rgba(40, 43, 74, 0.25)' },
  { name: '5–8 LPA', value: 32, color: 'rgba(40, 43, 74, 0.45)' },
  { name: '8–12 LPA', value: 24, color: '#5B608F' },
  { name: '12–18 LPA', value: 12, color: '#3F436C' },
  { name: '18+ LPA', value: 7, color: '#282B4A' },
];

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{
    background: '#ffffff',
    border: '1.5px solid rgba(40, 43, 74, 0.08)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(40, 43, 74, 0.02)'
  }}>
    <div style={{ fontSize: '15px', fontWeight: 700, color: '#282B4A', marginBottom: '20px' }}>{title}</div>
    {children}
  </div>
);

const CHART_TOOLTIP_STYLE = {
  borderRadius: '12px',
  border: '1px solid rgba(238, 235, 218, 0.25)',
  fontSize: '12px',
  background: '#282B4A',
  color: '#EEEBDA',
  boxShadow: '0 8px 24px rgba(40, 43, 74, 0.25)',
};

export function Analytics() {
  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#282B4A' }}>Analytics</h1>
        <p style={{ margin: '4px 0 0', color: '#71717a', fontSize: '13px' }}>Placement performance and trends across all years</p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Avg Package (2025)', value: '9.2 LPA', sub: '+8.2% vs last year' },
          { label: 'Highest Package', value: '32 LPA', sub: 'Top Recruiter Offer' },
          { label: 'Placement %', value: '78%', sub: '210 of 270 Placed' },
          { label: 'Companies Visited', value: '49', sub: 'Campus recruitment' },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            style={{
              background: '#ffffff',
              border: '1.5px solid rgba(40, 43, 74, 0.08)',
              borderRadius: '20px',
              padding: '20px 22px',
              boxShadow: '0 4px 18px rgba(40, 43, 74, 0.03)'
            }}
          >
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#282B4A', letterSpacing: '-0.8px' }}>{value}</div>
            <div style={{ fontSize: '13px', color: '#282B4A', marginTop: '4px', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px', fontWeight: 500 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <ChartCard title="Year-over-Year Placement Comparison">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={YEAR_CMP} barGap={4}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#282B4A" />
                  <stop offset="100%" stopColor="#3F436C" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(40, 43, 74, 0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} itemStyle={{ color: '#EEEBDA' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#282B4A', fontWeight: 600 }} />
              <Bar dataKey="placed" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Students Placed" barSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average vs Highest Package (LPA)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={YEAR_CMP}>
              <defs>
                <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#282B4A" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#282B4A" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6B7094" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6B7094" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(40, 43, 74, 0.06)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} itemStyle={{ color: '#EEEBDA' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#282B4A', fontWeight: 600 }} />
              <Area type="monotone" dataKey="avg" stroke="#282B4A" strokeWidth={2.5} fill="url(#avgGrad)" name="Avg Package" dot={{ r: 4, fill: '#282B4A' }} />
              <Area type="monotone" dataKey="high" stroke="#6B7094" strokeWidth={2.5} strokeDasharray="4 3" fill="url(#highGrad)" name="Highest Package" dot={{ r: 4, fill: '#6B7094' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <ChartCard title="Branch-wise Placements">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEPT} layout="vertical" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(40, 43, 74, 0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} itemStyle={{ color: '#EEEBDA' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#282B4A', fontWeight: 600 }} />
              <Bar dataKey="placed" fill="#282B4A" radius={[0, 6, 6, 0]} name="Placed" barSize={14} />
              <Bar dataKey="total" fill="rgba(40, 43, 74, 0.12)" radius={[0, 6, 6, 0]} name="Total" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Package Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PKG_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {PKG_PIE.map((entry, i) => <Cell key={i} fill={entry.color} stroke="#ffffff" strokeWidth={2} />)}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} itemStyle={{ color: '#EEEBDA' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px', justifyContent: 'center' }}>
            {PKG_PIE.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#282B4A', fontWeight: 600 }}>
                <div style={{ width: '9px', height: '9px', borderRadius: '3px', background: d.color }} />
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
