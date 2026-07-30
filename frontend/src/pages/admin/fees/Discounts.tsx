import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit } from 'lucide-react';

export function Discounts() {
  const [discounts] = useState([
    { id: 1, name: 'Early Bird Discount', code: 'EARLY-10', discount_type: 'Percentage', value: 10, valid_till: '2024-08-31' },
    { id: 2, name: 'Staff Ward Benefit', code: 'STAFF-25', discount_type: 'Percentage', value: 25, valid_till: '2025-05-31' },
    { id: 3, name: 'Sibling Concession', code: 'SIBLING-5K', discount_type: 'Fixed Amount', value: 5000, valid_till: '2025-05-31' },
  ]);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px' }}>
            Fee Discounts & Concessions
          </h1>
          <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
            Configure early payment discounts, staff benefits, and special waivers
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
          <Plus size={16} /> Create Discount Code
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e4e7' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Discount Title</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Code</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Type</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Value</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Valid Until</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>{d.name}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                    {d.code}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', color: '#64748b' }}>{d.discount_type}</td>
                <td style={{ padding: '16px 20px', fontWeight: 700, color: '#16a34a' }}>
                  {d.discount_type === 'Percentage' ? `${d.value}% Off` : `₹ ${d.value.toLocaleString('en-IN')}`}
                </td>
                <td style={{ padding: '16px 20px', color: '#334155' }}>{new Date(d.valid_till).toLocaleDateString()}</td>
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
