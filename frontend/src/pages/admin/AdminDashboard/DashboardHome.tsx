import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, GraduationCap, BookText, ClipboardList, IndianRupee, Hourglass } from "lucide-react";
import { dashboardService, type AdminDashboardData } from "@/services/dashboard.service";

export function DashboardHome() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dashboardService.getAdminStats();
        setData(result);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return <div style={{ padding: "40px", color: "var(--text2)" }}>Loading Dashboard Data...</div>;
  }

  const STATS = [
    { label: "Total Students", value: data.total_students, colorClass: "blue", icon: Users, sub: "Enrolled across all branches" },
    { label: "Total Faculty", value: data.total_faculty, colorClass: "purple", icon: GraduationCap, sub: "Active faculty members" },
    { label: "Total Subjects", value: data.total_subjects, colorClass: "teal", icon: BookText, sub: "Across all semesters" },
    { label: "Attendance Rate", value: `${data.attendance_rate.toFixed(1)}%`, colorClass: "amber", icon: ClipboardList, sub: "Overall across all subjects", badge: data.attendance_rate >= 75 ? "✔ On Track" : "⚠ Low" },
  ];

  return (
    <>
      <div className="dash-stat-grid">
        {STATS.map(({ label, value, colorClass, icon: Icon, sub, badge }) => {
          let valColor = "blue";
          if (colorClass.includes("red")) valColor = "red";
          else if (colorClass.includes("gray") || colorClass.includes("yellow") || colorClass.includes("amber")) valColor = "amber";
          else if (colorClass.includes("pink") || colorClass.includes("purple")) valColor = "purple";
          else if (colorClass.includes("green")) valColor = "green";
          else if (colorClass.includes("teal")) valColor = "teal";

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

      <div className="dash-charts-top">
        <div className="dash-chart-card card">
          <div className="dash-chart-title">Attendance Trend</div>
          <div className="dash-chart-sub">Daily attendance % - last 30 days</div>
          <div className="dash-chart-wrap h260">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.attendance_trend}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(79,142,247,0.28)" />
                    <stop offset="100%" stopColor="rgba(79,142,247,0)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--text3)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis
                  domain={[0, 1]}
                  ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
                  tick={{ fontSize: 11, fill: "var(--text3)" }}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <Tooltip contentStyle={{ background: "rgba(20,24,34,0.9)", border: "1px solid var(--border)", borderRadius: 8, color: "#fff" }} itemStyle={{ color: '#b0b4cf' }} />
                <Line type="monotone" dataKey="attendance" stroke="#4f8ef7" strokeWidth={3} dot={{ r: 4, fill: '#141822', stroke: '#4f8ef7', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#4f8ef7' }} fill="url(#lineGradient)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dash-charts-bottom" style={{ marginBottom: '24px' }}>
        <div className="dash-chart-card card">
          <div className="dash-chart-title">Subject-wise Performance</div>
          <div className="dash-chart-sub">Average marks % and attendance % per subject</div>
          <div className="dash-chart-wrap h260">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.subject_performance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="subject" tick={{ fontSize: 12, fill: "var(--text3)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis
                  domain={[0, 1]}
                  ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                  tick={{ fontSize: 11, fill: "var(--text3)" }}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <Tooltip contentStyle={{ background: "rgba(20,24,34,0.9)", border: "1px solid var(--border)", borderRadius: 8, color: "#fff" }} itemStyle={{ color: '#b0b4cf' }} />
                <Bar name="Attendance" dataKey="attendance" fill="#4f8ef7" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name="Marks" dataKey="marks" fill="#b78efe" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
} 
