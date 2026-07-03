import {
  BarChart,
  Bar,
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
import { ArrowRight } from "lucide-react";
// import { PanelHeader } from "@/components/PanelHeader";
import { STATS, ATTENDANCE_DATA, OVERVIEW_DATA, COURSE_DATA, SUBJECT_DATA } from "@/Admin/AdminDashboard/DashboardData";

export function DashboardHome() {
  return (
    <>
      {/* stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, colorClass, icon: Icon }) => (
          <div
            key={label}
            className={`relative overflow-hidden rounded-md ${colorClass} text-white shadow-sm`}
          >
            <Icon className="absolute -right-2 top-3 h-16 w-16 text-white/20" />
            <div className="relative px-5 pt-4">
              <p className="text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm">{label}</p>
            </div>
            <button className="relative mt-4 flex w-full items-center justify-between bg-black/15 px-5 py-2 text-xs font-medium hover:bg-black/25">
              More info
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

    {/* charts */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/30 bg-[#0b0646] shadow-[0_0_25px_-5px_rgba(34,211,238,0.15)] backdrop-blur-sm">
          {/* <PanelHeader title="Attendance Per Subject" /> */}
          <p className="px-5 pt-4 text-sm font-semibold text-white/80">Attendance Per Subject</p>
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_DATA}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="subject" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickLine={false} />
                <YAxis
                  domain={[0, 1]}
                  ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
                  tick={{ fontSize: 11, fill: "rgba(255,255,255,0.6)" }}
                  tickFormatter={(v) => v.toFixed(1)}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                />
                {/* <Tooltip formatter={(v) => v.toFixed(1)} />
                <Legend
                  payload={[{ value: "Attendance Per Subject", type: "square", color: "#a78bfa" }]}
                /> */}
                <Bar dataKey="attendance" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
 
        <div className="overflow-hidden rounded-xl border border-white/30 bg-[#0b0646] shadow-[0_0_25px_-5px_rgba(34,211,238,0.15)] backdrop-blur-sm">
          {/* <PanelHeader title="Staffs - Students Overview" /> */}
          <p className="px-5 pt-4 text-sm font-semibold text-white/80">Staffs - Students Overview</p>
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={OVERVIEW_DATA} dataKey="value" nameKey="name" outerRadius={100} stroke="#0b0a1a" strokeWidth={2}>
                  {OVERVIEW_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="top" align="center" iconType="square" wrapperStyle={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#1a1733", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
 
      {/* course / subject breakdown */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/30 bg-[#0b0646] shadow-[0_0_25px_-5px_rgba(34,211,238,0.15)] backdrop-blur-sm">
          {/* <PanelHeader title="Total Students in Each Course" /> */}
          <p className="px-5 pt-4 text-sm font-semibold text-white/80">Total Students in Each Course</p>
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={COURSE_DATA} dataKey="value" nameKey="name" outerRadius={100} stroke="#0b0a1a" strokeWidth={2}>
                  {COURSE_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="top" align="center" iconType="square" wrapperStyle={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#1a1733", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
 
        <div className="overflow-hidden rounded-xl border border-white/30 bg-[#0b0646] shadow-[0_0_25px_-5px_rgba(34,211,238,0.15)] backdrop-blur-sm">
          {/* <PanelHeader title="Total Students in Each Subject" /> */}
          <p className="px-5 pt-4 text-sm font-semibold text-white/80">Total Students in Each Subject</p>
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SUBJECT_DATA} dataKey="value" nameKey="name" outerRadius={100} stroke="#0b0a1a" strokeWidth={2}>
                  {SUBJECT_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="top" align="center" iconType="square" wrapperStyle={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#1a1733", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
 
      {/* footer */}
      <div className="flex flex-col items-center justify-between gap-1 border-t border-white/10 px-1 py-4 text-xs text-white/40 sm:flex-row">
        <p>
          © 2026 - <span className="font-semibold text-white/70">College Management System</span> In
          react + Django
        </p>
        <p>Ver.1.0</p>
      </div>
    </>
  );
}
 