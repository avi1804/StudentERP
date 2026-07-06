import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookText, ClipboardList } from "lucide-react";

export const FacultyDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/faculty-dash/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", color: "var(--text2)" }}>Loading Dashboard Data...</div>;
  }

  const chartData = [
    { name: 'Math', averageMarks: 0.75, attendance: 0.85 },
    { name: 'Physics', averageMarks: 0.82, attendance: 0.90 },
    { name: 'CS101', averageMarks: 0.90, attendance: 0.78 },
  ];

  const STATS = [
    { 
      label: "Total Assigned Subjects", 
      value: stats?.total_assigned_subjects || 0, 
      colorClass: "teal", 
      icon: BookText, 
      sub: "Currently active subjects" 
    },
    { 
      label: "Average Attendance Rate", 
      value: `${stats?.attendance_rate || 0}%`, 
      colorClass: "amber", 
      icon: ClipboardList, 
      sub: "Overall across all subjects", 
      badge: (stats?.attendance_rate || 0) >= 75 ? "✔ On Track" : "⚠ Low" 
    },
  ];

  return (
    <div style={{ padding: '0px' }}>
      <div className="dash-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)' }}>
          Welcome, {stats?.name || 'Faculty'}!
        </h1>
      </div>
      
      <div className="dash-stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {STATS.map(({ label, value, colorClass, icon: Icon, sub, badge }) => {
          let valColor = "teal";
          if (colorClass === "amber") valColor = "amber";

          return (
            <div key={label} className="dash-stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div className="stat-label" style={{ textTransform: 'uppercase' }}>{label}</div>
              <div className={`stat-val ${valColor}`}>{value}</div>
              {sub && <div className="stat-sub">{sub}</div>}
              {badge && (
                <div style={{ display: 'inline-flex', alignItems: 'center', background: badge.includes('✔') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: badge.includes('✔') ? 'var(--green)' : 'var(--red)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, marginTop: '8px', border: badge.includes('✔') ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)' }}>
                  {badge}
                </div>
              )}
              <Icon style={{ position: 'absolute', bottom: '0', right: '0', width: '80px', height: '80px', color: 'rgba(255,255,255,0.02)', transform: 'translate(10%, 20%)', pointerEvents: 'none' }} />
            </div>
          );
        })}
      </div>

      <div className="dash-charts-bottom" style={{ marginBottom: '24px' }}>
        <div className="dash-chart-card card">
          <div className="dash-chart-title">Subject Performance</div>
          <div className="dash-chart-sub">Average marks % and attendance % per assigned subject</div>
          <div className="dash-chart-wrap h260">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text3)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis 
                  domain={[0, 1]}
                  ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                  tick={{ fontSize: 11, fill: "var(--text3)" }}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ background: "rgba(20,24,34,0.9)", border: "1px solid var(--border)", borderRadius: 8, color: "#fff" }} 
                  itemStyle={{ color: '#b0b4cf' }} 
                  formatter={(value: any, name: any) => [`${(Number(value) * 100).toFixed(0)}%`, name]}
                />
                <Bar name="Attendance" dataKey="attendance" fill="#4f8ef7" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name="Marks" dataKey="averageMarks" fill="#b78efe" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};


