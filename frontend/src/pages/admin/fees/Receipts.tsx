import React, { useState } from 'react';
import { FileText, Download, Search, Printer, Eye } from 'lucide-react';

export function Receipts() {
  const [receipts] = useState([
    { id: 1, receipt_no: 'RCPT-1001', student: 'Rahul Sharma', enrollment: 'ENR2024001', amount: 60000, date: '2024-07-28', mode: 'UPI' },
    { id: 2, receipt_no: 'RCPT-1002', student: 'Priya Patel', enrollment: 'ENR2024002', amount: 45000, date: '2024-07-29', mode: 'Net Banking' },
  ]);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px' }}>
          Official Fee Receipts Directory
        </h1>
        <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
          Archive of generated transaction receipts, print invoices, and audit tokens
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e4e7' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Receipt Number</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Student</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Amount Paid</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Issue Date</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Mode</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((rcpt) => (
              <tr key={rcpt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                    {rcpt.receipt_no}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{rcpt.student}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{rcpt.enrollment}</div>
                </td>
                <td style={{ padding: '16px 20px', fontWeight: 700, color: '#16a34a' }}>₹ {rcpt.amount.toLocaleString('en-IN')}</td>
                <td style={{ padding: '16px 20px', color: '#64748b' }}>{new Date(rcpt.date).toLocaleDateString()}</td>
                <td style={{ padding: '16px 20px', color: '#334155' }}>{rcpt.mode}</td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6366f1', marginRight: '12px' }} title="View Details">
                    <Eye size={16} />
                  </button>
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#16a34a' }} title="Download PDF Receipt">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
