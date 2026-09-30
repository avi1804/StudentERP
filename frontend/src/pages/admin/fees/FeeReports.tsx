import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { Download, TrendingUp, DollarSign, Calendar, Wallet, CheckCircle2, FileSpreadsheet, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import TextType from '../../../components/TextType';

export function FeeReports() {
  const [downloadMsg, setDownloadMsg] = useState('');

  const collectionData = [
    { month: 'Jan', amount: 450000 },
    { month: 'Feb', amount: 320000 },
    { month: 'Mar', amount: 680000 },
    { month: 'Apr', amount: 210000 },
    { month: 'May', amount: 540000 },
    { month: 'Jun', amount: 890000 },
    { month: 'Jul', amount: 720000 },
  ];

  // Palette derived directly from colorpal.png: Midnight Indigo (#282B4A), Slate Indigo (#3F436C), Warm Sand (#BCA882), Soft Iris (#7B82BE)
  const modeData = [
    { name: 'UPI', value: 65, color: '#282B4A' },
    { name: 'Net Banking', value: 20, color: '#3F436C' },
    { name: 'Cash', value: 10, color: '#BCA882' },
    { name: 'Cheque', value: 5, color: '#7B82BE' },
  ];

  const summaryKpis = [
    { label: 'Total Revenue (YTD)', value: '₹ 38,10,000', change: '+18.4% vs last term', icon: Wallet, color: '#282B4A' },
    { label: 'Avg Monthly Inflow', value: '₹ 5,44,285', change: 'Consistent receipts', icon: TrendingUp, color: '#282B4A' },
    { label: 'Collection Efficiency', value: '94.2%', change: 'Target: 90% reached', icon: CheckCircle2, color: '#059669' },
    { label: 'Active Audit Cycle', value: 'FY 2026–27', change: 'Q2 In Progress', icon: Calendar, color: '#282B4A' },
  ];

  const handleExportCSV = () => {
    const rows = [
      ['Month', 'Total Collection (INR)', 'Audit Status'],
      ...collectionData.map(c => [c.month, c.amount.toString(), 'Audited & Verified'])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Finance_Audit_Report_2026.csv`;
    a.click();

    setDownloadMsg('Financial Audit Report exported successfully!');
    setTimeout(() => setDownloadMsg(''), 3000);
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>Financial</span>
            <span style={{
              background: '#282B4A',
              color: '#EEEBDA',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(40, 43, 74, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(238, 235, 218, 0.2)',
            }}>
              <TextType
                text={["Reports & Analytics", "Audit Ledger", "Fee Inflow"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#EEEBDA' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Comprehensive financial analytics, monthly revenue breakdown, and multi-channel audit reports
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            background: '#282B4A',
            color: '#EEEBDA',
            padding: '12px 24px',
            borderRadius: '16px',
            fontWeight: 700,
            fontSize: '14px',
            border: '1px solid rgba(238, 235, 218, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(40, 43, 74, 0.25)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#373a61')}
          onMouseLeave={e => (e.currentTarget.style.background = '#282B4A')}
        >
          <Download size={17} color="#EEEBDA" />
          Export Financial Audit Report
        </button>
      </div>

      {downloadMsg && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: '20px', padding: '14px 20px', borderRadius: '14px',
            backgroundColor: 'rgba(5, 150, 105, 0.1)', color: '#059669',
            border: '1px solid rgba(5, 150, 105, 0.2)', fontWeight: 600, fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <CheckCircle2 size={16} /> {downloadMsg}
        </motion.div>
      )}

      {/* ── Summary KPI Cards Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {summaryKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                background: '#ffffff',
                border: '1.5px solid rgba(40, 43, 74, 0.08)',
                borderRadius: '24px',
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(40, 43, 74, 0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{kpi.label}</span>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '12px',
                  background: 'rgba(40, 43, 74, 0.08)', border: '1px solid rgba(40, 43, 74, 0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={18} color="#282B4A" />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.8px' }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '12px', color: '#525677', marginTop: '4px', fontWeight: 500 }}>
                  {kpi.change}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Main Charts Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Monthly Collection Bar Chart */}
        <div style={{
          background: '#ffffff',
          padding: '28px',
          borderRadius: '24px',
          border: '1.5px solid rgba(40, 43, 74, 0.08)',
          boxShadow: '0 4px 24px rgba(40, 43, 74, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#282B4A', margin: 0 }}>Monthly Collection Trend</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Revenue collected across academic terms</p>
            </div>
            <span style={{
              fontSize: '11px', fontWeight: 800, color: '#282B4A',
              background: 'rgba(40, 43, 74, 0.08)', border: '1px solid rgba(40, 43, 74, 0.12)',
              padding: '4px 12px', borderRadius: '10px'
            }}>
              INR (₹)
            </span>
          </div>
          
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionData} barSize={34}>
                <defs>
                  <linearGradient id="feeBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#282B4A" />
                    <stop offset="100%" stopColor="#3F436C" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(40, 43, 74, 0.06)" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#71717a" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid rgba(238, 235, 218, 0.25)',
                    fontSize: '12px',
                    background: '#282B4A',
                    color: '#EEEBDA',
                    boxShadow: '0 8px 24px rgba(40, 43, 74, 0.25)'
                  }}
                  itemStyle={{ color: '#EEEBDA' }}
                  formatter={(value: any) => [`₹ ${Number(value).toLocaleString('en-IN')}`, 'Collection']}
                />
                <Bar dataKey="amount" fill="url(#feeBarGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Mode Pie Chart */}
        <div style={{
          background: '#ffffff',
          padding: '28px',
          borderRadius: '24px',
          border: '1.5px solid rgba(40, 43, 74, 0.08)',
          boxShadow: '0 4px 24px rgba(40, 43, 74, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#282B4A', margin: 0 }}>Payment Channels</h3>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Distribution</span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>Digital vs offline transactions breakdown</p>

            <div style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={modeData} innerRadius={58} outerRadius={82} paddingAngle={4} dataKey="value">
                    {modeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid rgba(238, 235, 218, 0.25)',
                      fontSize: '12px',
                      background: '#282B4A',
                      color: '#EEEBDA',
                      boxShadow: '0 8px 24px rgba(40, 43, 74, 0.25)'
                    }}
                    itemStyle={{ color: '#EEEBDA' }}
                    formatter={(val: any) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(40, 43, 74, 0.08)' }}>
            {modeData.map((m) => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: m.color, flexShrink: 0 }} />
                <span style={{ color: '#282B4A', fontWeight: 600 }}>{m.name} ({m.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
