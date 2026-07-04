import { useState, useEffect } from 'react';
import { apiClient } from '../../../api/axios';

interface FeeStats {
  total_collected: number;
  total_pending: number;
  paid_count: number;
  partial_count: number;
  overdue_count: number;
  pending_count: number;
}

interface Student {
  id: number;
  enrollment_number: string;
  user: {
    full_name: string;
  };
}

interface Fee {
  id: number;
  student_id: number;
  fee_type: string;
  amount_total: number;
  amount_paid: number;
  due_date: string;
  status: string;
  academic_year: string;
  student?: Student;
}

export default function Fees() {
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState<FeeStats | null>(null);
  const [fees, setFees] = useState<Fee[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, feesRes, studentsRes] = await Promise.all([
        apiClient.get('/fees/stats'),
        apiClient.get('/fees/all'),
        apiClient.get('/students')
      ]);
      setStats(statsRes.data);
      setFees(feesRes.data);
      setStudentsList(studentsRes.data.items || []);
    } catch (error) {
      console.error('Error fetching fees data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Real-time polling every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return <span className="badge badge-green" style={{ fontSize: '11px', padding: '2px 8px' }}>PAID</span>;
      case 'pending': return <span className="badge badge-amber" style={{ fontSize: '11px', padding: '2px 8px' }}>PENDING</span>;
      case 'overdue': return <span className="badge badge-red" style={{ fontSize: '11px', padding: '2px 8px' }}>OVERDUE</span>;
      case 'partial': return <span className="badge badge-blue" style={{ fontSize: '11px', padding: '2px 8px' }}>PARTIAL</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      TUITION: 'badge-purple',
      EXAM: 'badge-blue',
      LIBRARY: 'badge-amber',
      HOSTEL: 'badge-green',
    };
    const cls = colors[type] || 'badge-purple';
    return <span className={`badge ${cls}`} style={{ fontSize: '11px', padding: '2px 8px' }}>{type}</span>;
  };

  return (
    <div className="page-wide">
      {/* Summary cards */}
      <div className="stat-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-label">TOTAL COLLECTED</div>
          <div className="stat-val" style={{ color: 'var(--green)' }}>
            {stats ? formatCurrency(stats.total_collected) : '...'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">TOTAL PENDING</div>
          <div className="stat-val" style={{ color: 'var(--red)' }}>
            {stats ? formatCurrency(stats.total_pending) : '...'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">PAID</div>
          <div className="stat-val" style={{ color: 'var(--primary)' }}>
            {stats ? `${stats.paid_count} records` : '...'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">PARTIAL</div>
          <div className="stat-val" style={{ color: 'var(--amber)' }}>
            {stats ? `${stats.partial_count} records` : '...'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">OVERDUE</div>
          <div className="stat-val" style={{ color: 'var(--red)' }}>
            {stats ? `${stats.overdue_count} records` : '...'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">PENDING</div>
          <div className="stat-val" style={{ color: 'var(--amber)' }}>
            {stats ? `${stats.pending_count} records` : '...'}
          </div>
        </div>
      </div>

      {/* Add Fee form */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header">
          <span className="card-title">+ Add Fee Record</span>
          <button className="card-btn" onClick={() => setShowForm(!showForm)}>Toggle Form</button>
        </div>
        {showForm && (
          <div id="fee-form-body" style={{ padding: '24px' }}>
            <div className="two-input-row">
              <div className="fg">
                <label>Student</label>
                <select id="fee-student-sel">
                  <option value="">- Select Student -</option>
                  {studentsList.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.user?.full_name} ({student.enrollment_number})
                    </option>
                  ))}
                </select>
              </div>
              <div className="fg">
                <label>Fee Type</label>
                <select id="fee-type-sel">
                  <option value="TUITION">Tuition Fee</option>
                  <option value="HOSTEL">Hostel Fee</option>
                  <option value="EXAM">Exam Fee</option>
                  <option value="LIBRARY">Library Fee</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div className="two-input-row">
              <div className="fg">
                <label>Total Fees (₹)</label>
                <input type="number" placeholder="50000" min="1" step="0.01" />
              </div>
              <div className="fg">
                <label>Paid Amount (₹)</label>
                <input type="number" placeholder="0" min="0" step="0.01" defaultValue="0" />
              </div>
            </div>
            <div className="fg" style={{ maxWidth: '300px' }}>
              <label>Due Date</label>
              <input type="date" />
            </div>
            <button className="btn btn-primary" style={{ maxWidth: '200px' }}>Add Fee Record</button>
          </div>
        )}
      </div>

      {/* All fees table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Fee Records</span>
          <button className="card-btn" onClick={fetchData} disabled={loading}>
            {loading ? '↻ Refreshing...' : '↻ Refresh'}
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>ROLL NO</th>
                <th>TYPE</th>
                <th>TOTAL (₹)</th>
                <th>PAID (₹)</th>
                <th>REMAINING (₹)</th>
                <th>DUE DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 && !loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>
                    No fee records found.
                  </td>
                </tr>
              ) : (
                fees.map((fee) => {
                  const remaining = fee.amount_total - fee.amount_paid;
                  return (
                    <tr key={fee.id}>
                      <td style={{ fontWeight: 600 }}>{fee.student?.user?.full_name || 'Unknown'}</td>
                      <td className="mono">{fee.student?.enrollment_number || '-'}</td>
                      <td>{getTypeBadge(fee.fee_type)}</td>
                      <td className="mono">{formatCurrency(fee.amount_total)}</td>
                      <td className="mono" style={{ color: 'var(--green)' }}>{formatCurrency(fee.amount_paid)}</td>
                      <td className="mono" style={{ color: fee.amount_paid < fee.amount_total ? 'var(--red)' : 'var(--green)' }}>
                        {formatCurrency(remaining)}
                      </td>
                      <td className="mono">{fee.due_date}</td>
                      <td>{getStatusBadge(fee.status)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ padding: '4px 10px', fontSize: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text)', cursor: 'pointer' }}>Pay</button>
                          <button style={{ padding: '4px 10px', fontSize: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text)', cursor: 'pointer' }}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
