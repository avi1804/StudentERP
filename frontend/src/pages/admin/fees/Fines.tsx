import React, { useState } from 'react';
import { AlertCircle, Plus, Trash2, Edit } from 'lucide-react';

export function Fines() {
  const [fineRules] = useState([
    { id: 1, name: 'Standard Late Fee', grace_period_days: 7, fine_per_day: 100, max_fine: 2000 },
    { id: 2, name: 'Library Overdue Book Fine', grace_period_days: 1, fine_per_day: 10, max_fine: 500 },
  ]);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px' }}>
            Fine & Penalty Policy Rules
          </h1>
          <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
            Set grace periods, per-day penalties, and maximum capped fine limits
          </p>
        </div>
        <button
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '13px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
          }}
        >
          <Plus size={16} /> Add Fine Rule
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e4e7' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Rule Name</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Grace Period</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Daily Penalty Rate</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Max Capped Fine</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fineRules.map((rule) => (
              <tr key={rule.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>{rule.name}</td>
                <td style={{ padding: '16px 20px', color: '#64748b' }}>{rule.grace_period_days} Days</td>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: '#dc2626' }}>₹ {rule.fine_per_day} / Day</td>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>₹ {rule.max_fine.toLocaleString('en-IN')}</td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', marginRight: '8px' }}>
                    <Edit size={16} />
                  </button>
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={16} />
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
