import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { useFeeStore } from '../../../store/useFeeStore';

export function Payments() {
  const { payments, fetchPayments, verifyPayment, isLoading } = useFeeStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleVerify = async (id: number) => {
    try {
      await verifyPayment(id);
    } catch (err) {
      console.error('Failed to verify payment', err);
    }
  };

  const filteredPayments = (payments || []).filter(p => 
    (p.receipt_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.payment_mode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.student_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.enrollment_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px' }}>
          Payment Transactions & Audit Log
        </h1>
        <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
          Real-time incoming payment stream, student audit history, and verification panel
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Total Collections</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#09090b' }}>
            ₹ {payments.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Verified Transactions</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a' }}>
            {payments.filter(p => p.status === 'VERIFIED').length}
          </div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Pending Approvals</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ca8a04' }}>
            {payments.filter(p => p.status === 'PENDING').length}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e4e4e7', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, background: '#f4f4f5', padding: '8px 14px', borderRadius: '10px' }}>
          <Search size={16} color="#71717a" />
          <input
            type="text"
            placeholder="Search by student name, receipt no, or mode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e4e7' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Receipt No</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Student Info</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Amount</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Payment Mode</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Date & Time</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Status</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Loading transaction log...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No payment transactions found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((pmt) => (
                <tr key={pmt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#573cfa' }}>{pmt.receipt_no}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{pmt.student_name || 'Student'}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{pmt.enrollment_number || ''}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#16a34a' }}>₹ {pmt.amount?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ background: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                      {pmt.payment_mode}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#64748b' }}>
                    {pmt.payment_date ? new Date(pmt.payment_date).toLocaleString() : 'Today'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: pmt.status === 'VERIFIED' ? '#dcfce7' : '#fef3c7',
                      color: pmt.status === 'VERIFIED' ? '#15803d' : '#b45309'
                    }}>
                      {pmt.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    {pmt.status !== 'VERIFIED' ? (
                      <button
                        onClick={() => handleVerify(pmt.id)}
                        style={{
                          background: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px',
                          borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        <ShieldCheck size={14} /> Verify
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>Verified ✓</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
