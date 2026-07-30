import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export function FeeReports() {
  const collectionData = [
    { month: 'Jan', amount: 450000 },
    { month: 'Feb', amount: 320000 },
    { month: 'Mar', amount: 680000 },
    { month: 'Apr', amount: 210000 },
    { month: 'May', amount: 540000 },
    { month: 'Jun', amount: 890000 },
  ];

  const modeData = [
    { name: 'UPI', value: 65, color: '#6366f1' },
    { name: 'Net Banking', value: 20, color: '#3b82f6' },
    { name: 'Cash', value: 10, color: '#10b981' },
    { name: 'Cheque', value: 5, color: '#f59e0b' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px' }}>
            Fee Financial Reports & Analytics
          </h1>
          <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
            Comprehensive analytics, monthly revenue breakdown, and payment channel insights
          </p>
        </div>
        <button
          style={{
            background: '#fff',
            color: '#374151',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '13px',
            border: '1px solid #d1d5db',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <Download size={16} /> Export Financial Audit Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Collection Bar Chart */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e4e4e7' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', marginBottom: '20px' }}>Monthly Collection Trend</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionData}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mode Pie Chart */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e4e4e7' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', marginBottom: '20px' }}>Payment Channels</h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={modeData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                  {modeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
            {modeData.map((m) => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: m.color }} />
                <span style={{ color: '#475569' }}>{m.name} ({m.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
