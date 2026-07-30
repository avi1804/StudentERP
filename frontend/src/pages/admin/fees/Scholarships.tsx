import React, { useState } from 'react';
import { Award, Plus, Search, Trash2, Edit, CheckCircle } from 'lucide-react';

export function Scholarships() {
  const [scholarships, setScholarships] = useState([
    { id: 1, name: 'Merit Excellence Scholarship', code: 'MERIT-100', type: 'Percentage', amount: 50, criteria: 'CGPA > 9.0', beneficiaries: 14 },
    { id: 2, name: 'Sports Concession', code: 'SPORTS-50', type: 'Fixed Amount', amount: 20000, criteria: 'State Level Certificate', beneficiaries: 6 },
    { id: 3, name: 'EBC Concession', code: 'EBC-GOVT', type: 'Percentage', amount: 100, criteria: 'Income < 2.5 LPA', beneficiaries: 42 },
  ]);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px' }}>
            Scholarship Schemes
          </h1>
          <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
            Manage merit and category-based fee concessions for enrolled students
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
          <Plus size={16} /> Add Scholarship Scheme
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Award size={20} color="#6366f1" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#52525b' }}>Active Schemes</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#09090b' }}>{scholarships.length}</div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Award size={20} color="#16a34a" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#52525b' }}>Total Beneficiaries</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#09090b' }}>
            {scholarships.reduce((a, b) => a + b.beneficiaries, 0)}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e4e7' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Scheme Name</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Code</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Type</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Benefit Value</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Eligibility Criteria</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Beneficiaries</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>{s.name}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                    {s.code}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', color: '#64748b' }}>{s.type}</td>
                <td style={{ padding: '16px 20px', fontWeight: 700, color: '#16a34a' }}>
                  {s.type === 'Percentage' ? `${s.amount}% Fee Off` : `₹ ${s.amount.toLocaleString('en-IN')}`}
                </td>
                <td style={{ padding: '16px 20px', color: '#334155' }}>{s.criteria}</td>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>{s.beneficiaries} Students</td>
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
