import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFeeStore } from '../../../store/useFeeStore';
import { 
  Wallet, Receipt, Users, CreditCard, 
  ArrowUpRight, Download, Search
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function FeeDashboard() {
  const { adminDashboardData, fetchAdminDashboard, isLoading } = useFeeStore();

  useEffect(() => {
    fetchAdminDashboard();
  }, [fetchAdminDashboard]);

  if (isLoading || !adminDashboardData) {
    return <div className="flex h-96 items-center justify-center text-gray-500">Loading Fee Dashboard...</div>;
  }

  const { kpis, recent_payments } = adminDashboardData;

  const collectionData = [
    { name: 'Collected', value: kpis.total_collected, color: '#10b981' },
    { name: 'Pending', value: kpis.pending_collection, color: '#f59e0b' }
  ];

  return (
    <div style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Fee</span>
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
              Dashboard
            </span>
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Overview of collections, pending dues, and recent transactions</p>
        </div>
        <button 
          style={{
            padding: '12px 22px',
            background: '#282B4A',
            color: '#EEEBDA',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 700,
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
          <Download size={16} color="#EEEBDA" /> Export Report
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { title: "Total Collection", amount: kpis.total_collected, icon: Wallet, color: "#10b981", bg: "#e8f5e9" },
          { title: "Pending Dues", amount: kpis.pending_collection, icon: Receipt, color: "#f59e0b", bg: "#fffbeb" },
          { title: "Today's Collection", amount: kpis.today_collection, icon: CreditCard, color: "#3b82f6", bg: "#eff6ff" },
          { title: "Total Students", amount: kpis.total_students, isCount: true, icon: Users, color: "#8b5cf6", bg: "#f3f0ff" }
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ 
              background: 'white', borderRadius: '16px', padding: '24px', 
              border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: kpi.bg, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={20} />
              </div>
              <ArrowUpRight size={16} color="#9ca3af" />
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>{kpi.title}</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#111827' }}>
              {kpi.isCount ? kpi.amount : `₹ ${kpi.amount.toLocaleString('en-IN')}`}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Tables Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        
        {/* Recent Transactions */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>Recent Transactions</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f9fafb', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Search size={14} color="#6b7280" />
              <input type="text" placeholder="Search receipt..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px' }} />
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <th style={{ padding: '0 0 12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textAlign: 'left' }}>Receipt No</th>
                <th style={{ padding: '0 0 12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textAlign: 'left' }}>Student</th>
                <th style={{ padding: '0 0 12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '0 0 12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textAlign: 'left' }}>Mode</th>
                <th style={{ padding: '0 0 12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent_payments.map((pmt: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '12px 0', fontSize: '12px', fontWeight: 600, color: '#3b82f6' }}>{pmt.receipt_no}</td>
                  <td style={{ padding: '12px 0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{pmt.student_name}</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{pmt.enrollment_number}</div>
                  </td>
                  <td style={{ padding: '12px 0', fontSize: '12px', fontWeight: 700, color: '#111827' }}>₹ {pmt.amount.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 0', fontSize: '11px', color: '#4b5563', fontWeight: 500 }}>{pmt.mode}</td>
                  <td style={{ padding: '12px 0', fontSize: '11px', color: '#6b7280' }}>{new Date(pmt.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Collection Overview */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>Collection Overview</h3>
          <div style={{ flex: 1, position: 'relative', minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={collectionData} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                  {collectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => `₹ ${val.toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>{((kpis.total_collected / kpis.total_expected) * 100 || 0).toFixed(1)}%</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Collected</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            {collectionData.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4b5563', fontWeight: 500 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }}></div>
                  {d.name}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>
                  ₹ {d.value.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
