import React, { useState } from 'react';
import { Download, FileText, BarChart2, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const REPORTS = [
  { title: 'Placement Statistics', desc: 'Overall placement summary with KPIs, averages and totals', icon: BarChart2, color: '#3b82f6' },
  { title: 'Offer Statistics', desc: 'Break-down of all offers, packages and company-wise offers', icon: FileText, color: '#8b5cf6' },
  { title: 'Student Statistics', desc: 'All enrolled students, their status, branch and placement outcome', icon: Users, color: '#10b981' },
];

const FORMAT_COLORS: Record<string, { bg: string; color: string }> = {
  PDF: { bg: 'rgba(239,68,68,0.08)', color: '#ef4444' },
  Excel: { bg: 'rgba(16,185,129,0.08)', color: '#10b981' },
  CSV: { bg: 'rgba(59,130,246,0.08)', color: '#3b82f6' },
};

function generatePlaceholderCSV(title: string) {
  const rows = [
    ['Report', 'Generated On', 'Status'],
    [title, new Date().toLocaleDateString(), 'Demo Data'],
    ['Placed Students', '150', 'N/A'],
    ['Total Students', '210', 'N/A'],
    ['Avg Package', '8.5 LPA', 'N/A'],
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/ /g, '_')}.csv`;
  a.click();
}

export function Reports() {
  const [msg, setMsg] = useState('');

  const handleDownload = (title: string, format: string) => {
    if (format === 'CSV') {
      generatePlaceholderCSV(title);
      setMsg(`${title} (${format}) downloaded!`);
    } else {
      setMsg(`${format} generation for "${title}" requires server-side integration. CSV available now.`);
    }
    setTimeout(() => setMsg(''), 3500);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Reports</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>Generate and download placement reports in multiple formats</p>
      </div>

      {msg && (
        <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>{msg}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {REPORTS.map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.div key={r.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={r.color} />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{r.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{r.desc}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['PDF', 'Excel', 'CSV'].map(fmt => (
                  <button key={fmt} onClick={() => handleDownload(r.title, fmt)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                      borderRadius: '10px', border: `1.5px solid ${FORMAT_COLORS[fmt].color}40`,
                      background: FORMAT_COLORS[fmt].bg, color: FORMAT_COLORS[fmt].color,
                      fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    }}>
                    <Download size={13} /> {fmt}
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ marginTop: '32px', background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px dashed #e2e8f0' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Custom Report</div>
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Generate a filtered report by date range, department, or company.</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input type="date" style={{ padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none' }} placeholder="From" />
          <input type="date" style={{ padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none' }} placeholder="To" />
          <button onClick={() => handleDownload('Custom Report', 'CSV')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 20px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            <Download size={14} /> Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
