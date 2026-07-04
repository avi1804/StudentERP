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
import { STATS, ATTENDANCE_DATA, OVERVIEW_DATA, COURSE_DATA, SUBJECT_DATA } from "@/pages/admin/AdminDashboard/DashboardData";

export function DashboardHome() {
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
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(34,197,94,0.1)', color: 'var(--green)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, marginTop: '8px', border: '1px solid rgba(34,197,94,0.2)' }}>
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
              <LineChart data={ATTENDANCE_DATA}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(79,142,247,0.28)" />
                    <stop offset="100%" stopColor="rgba(79,142,247,0)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="subject" tick={{ fontSize: 12, fill: "var(--text3)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
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

        <div className="dash-chart-card card">
          <div className="dash-chart-title">Fees Analytics</div>
          <div className="dash-chart-sub">Collected vs Pending</div>
          <div className="dash-chart-wrap h240">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={OVERVIEW_DATA} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={70}
                  outerRadius={90} 
                  stroke="var(--bg)" 
                  strokeWidth={2}
                >
                  {OVERVIEW_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ color: "var(--text2)", fontSize: 12, paddingTop: '10px' }} />
                <Tooltip contentStyle={{ background: "rgba(20,24,34,0.9)", border: "1px solid var(--border)", borderRadius: 8, color: "#fff" }} itemStyle={{ color: '#b0b4cf' }} />
              </PieChart>
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
              <BarChart data={ATTENDANCE_DATA}>
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
                <Bar dataKey="attendance" fill="#4f8ef7" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="attendance" fill="#b78efe" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
 
