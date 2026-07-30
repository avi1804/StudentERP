import React, { useState, useEffect } from 'react';
import { Search, Filter, UserCheck, Clock, CheckCircle, AlertTriangle, Eye, ArrowUpRight } from 'lucide-react';
import { useFeeStore } from '../../../store/useFeeStore';

export function StudentFees() {
  const { studentFees, fetchStudentFees, isLoading } = useFeeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchStudentFees();
  }, [fetchStudentFees]);

  const filteredFees = (studentFees || []).filter(item => {
    const matchesSearch = item.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.enrollment_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px' }}>
          Student Fee Ledger
        </h1>
        <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
          Monitor individual student fee allocations, collection status, and outstanding balances
        </p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Total Assigned Students</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#09090b' }}>{studentFees.length}</div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Fully Paid Students</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a' }}>
            {studentFees.filter(s => s.status === 'PAID').length}
          </div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Partial Payments</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ca8a04' }}>
            {studentFees.filter(s => s.status === 'PARTIAL').length}
          </div>
        </div>

        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#52525b', marginBottom: '8px' }}>Pending / Overdue</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#dc2626' }}>
            {studentFees.filter(s => s.status === 'PENDING' || s.status === 'OVERDUE').length}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e4e4e7', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, background: '#f4f4f5', padding: '8px 14px', borderRadius: '10px' }}>
          <Search size={16} color="#71717a" />
          <input
            type="text"
            placeholder="Search by student name or enrollment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e4e4e7', fontSize: '13px', background: '#fff', cursor: 'pointer' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PARTIAL">Partial</option>
          <option value="PENDING">Pending</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e4e7' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Student Info</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Total Fee</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Paid Amount</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Pending Amount</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Due Date</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>Status</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No student fee records found.
                </td>
              </tr>
            ) : (
              filteredFees.map((sf) => (
                <tr key={sf.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{sf.student_name || 'Rahul Sharma'}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{sf.enrollment_number || 'ENR2024001'}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: '#334155' }}>₹ {sf.total_fee?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 20px', color: '#16a34a', fontWeight: 600 }}>₹ {sf.paid_amount?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 20px', color: sf.pending_amount > 0 ? '#dc2626' : '#64748b', fontWeight: 600 }}>
                    ₹ {sf.pending_amount?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#64748b' }}>{sf.due_date ? new Date(sf.due_date).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: sf.status === 'PAID' ? '#dcfce7' : sf.status === 'PARTIAL' ? '#fef3c7' : '#fee2e2',
                      color: sf.status === 'PAID' ? '#15803d' : sf.status === 'PARTIAL' ? '#b45309' : '#b91c1c'
                    }}>
                      {sf.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6366f1' }}>
                      <Eye size={16} />
                    </button>
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
