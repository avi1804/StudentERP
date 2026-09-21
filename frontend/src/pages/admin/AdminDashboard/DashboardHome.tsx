import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  GraduationCap,
  BookText,
  Wallet,
  ArrowUpRight,
  ArrowRight,
  UserPlus,
  BookPlus,
  BellRing,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Clock,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  MessageSquare
} from "lucide-react";
import { dashboardService, type AdminDashboardData } from "@/services/dashboard.service";
import { motion } from "framer-motion";
import TextType from "@/components/TextType";

export function DashboardHome() {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<"All" | "CSE" | "CE" | "IT" | "AIML">("All");

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
    return (
      <div style={{ padding: "40px", color: "#6b7280", fontFamily: "Space Grotesk, sans-serif" }}>
        Loading Dashboard Data...
      </div>
    );
  }

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "₹0";
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val.toLocaleString()}`;
  };

  // Real Enrollment data from database
  const enrollmentData =
    data.enrollment_overview && data.enrollment_overview[selectedBranch]
      ? data.enrollment_overview[selectedBranch]
      : data.enrollment_overview?.["All"] || [];

  // Real Attendance data from database
  const presentRate = data.attendance_breakdown?.present_rate ?? (data.attendance_rate > 0 ? Number(data.attendance_rate.toFixed(1)) : 0);
  const absentRate = data.attendance_breakdown?.absent_rate ?? 0;
  const leaveRate = data.attendance_breakdown?.leave_rate ?? 0;

  const ATTENDANCE_PIE_DATA = [
    { name: "Present", value: presentRate, color: "#282B4A" },
    { name: "Absent", value: absentRate, color: "#f59e0b" },
    { name: "Leave", value: leaveRate, color: "rgba(40, 43, 74, 0.2)" },
  ];

  // Real Monthly Fee data from database
  const monthlyFeeData =
    data.fee_stats?.monthly_data && data.fee_stats.monthly_data.length > 0
      ? data.fee_stats.monthly_data
      : [];

  const QUICK_ACTIONS = [
    { label: "Add Student", icon: UserPlus, path: "/admin/dashboard/students/add" },
    { label: "Add Faculty", icon: GraduationCap, path: "/admin/dashboard/faculty/add" },
    { label: "Add Subject", icon: BookPlus, path: "/admin/dashboard/subject/add" },
    { label: "Post Notice", icon: BellRing, path: "/admin/dashboard/notify/student" },
    { label: "Import Students", icon: FileSpreadsheet, path: "/admin/dashboard/students/add" },
    { label: "Export Report", icon: Download, path: "/admin/dashboard/fees/reports" },
  ];

  // Real Recent Activities from database
  const recentActivities =
    data.recent_activities && data.recent_activities.length > 0
      ? data.recent_activities
      : [];

  return (
    <div style={{ fontFamily: "Space Grotesk, sans-serif" }}>
      {/* ── Header with Midnight Indigo Animated Badge ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 700,
              color: "#09090b",
              letterSpacing: "-0.8px",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span>Admin</span>
            <span
              style={{
                background: "#282B4A",
                color: "#EEEBDA",
                padding: "4px 18px",
                borderRadius: "14px",
                boxShadow: "0 4px 20px rgba(40, 43, 74, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                lineHeight: 1.2,
                border: "1px solid rgba(238, 235, 218, 0.2)",
              }}
            >
              <TextType
                text={["Dashboard", "Analytics", "Control Center"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: "#EEEBDA" }}
              />
            </span>
          </h1>
          <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
            Monitor system performance, student enrollment, and academic metrics
          </div>
        </div>
      </div>

      {/* ── Top KPI Cards Row ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" }}
      >
        {/* KPI 1 — Total Students */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          style={{
            background: "#f4f4f5",
            border: "1.5px solid rgba(0,0,0,0.07)",
            borderRadius: "24px",
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "180px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "1px solid rgba(40,43,74,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(40,43,74,0.08)",
                }}
              >
                <Users size={18} color="#282B4A" strokeWidth={2} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#52525b" }}>Total Students</span>
            </div>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/admin/dashboard/students/manage")}
            >
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: "auto", paddingTop: "18px" }}>
            <div style={{ fontSize: "44px", fontWeight: 700, color: "#09090b", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "6px" }}>
              {data.total_students}
            </div>
            <div style={{ fontSize: "12px", color: "#71717a", fontWeight: 500 }}>
              <span style={{ color: "#282B4A", fontWeight: 700 }}>Active</span> · Enrolled Across Branches
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Total Faculty */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          style={{
            background: "#f4f4f5",
            border: "1.5px solid rgba(0,0,0,0.07)",
            borderRadius: "24px",
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "180px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "1px solid rgba(40,43,74,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(40,43,74,0.08)",
                }}
              >
                <GraduationCap size={18} color="#282B4A" strokeWidth={2} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#52525b" }}>Total Faculty</span>
            </div>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/admin/dashboard/faculty/manage")}
            >
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: "auto", paddingTop: "18px" }}>
            <div style={{ fontSize: "44px", fontWeight: 700, color: "#09090b", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "6px" }}>
              {data.total_faculty}
            </div>
            <div style={{ fontSize: "12px", color: "#71717a", fontWeight: 500 }}>
              <span style={{ color: "#282B4A", fontWeight: 700 }}>Active</span> · Faculty Members
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Total Subjects */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          style={{
            background: "#f4f4f5",
            border: "1.5px solid rgba(0,0,0,0.07)",
            borderRadius: "24px",
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "180px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "1px solid rgba(34,197,94,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(34,197,94,0.08)",
                }}
              >
                <BookText size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#52525b" }}>Total Subjects</span>
            </div>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/admin/dashboard/subject/manage")}
            >
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: "auto", paddingTop: "18px" }}>
            <div style={{ fontSize: "44px", fontWeight: 700, color: "#09090b", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "6px" }}>
              {data.total_subjects}
            </div>
            <div style={{ fontSize: "12px", color: "#71717a", fontWeight: 500 }}>
              <span style={{ color: "#22c55e", fontWeight: 600 }}>All Semesters</span> · Active Courses
            </div>
          </div>
        </motion.div>

        {/* KPI 4 — Pending Fees */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          style={{
            background: "#f4f4f5",
            border: "1.5px solid rgba(0,0,0,0.07)",
            borderRadius: "24px",
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "180px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "1px solid rgba(239,68,68,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(239,68,68,0.08)",
                }}
              >
                <Wallet size={18} color="#ef4444" strokeWidth={2} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#52525b" }}>Pending Fees</span>
            </div>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/admin/dashboard/fees")}
            >
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: "auto", paddingTop: "18px" }}>
            <div style={{ fontSize: "44px", fontWeight: 700, color: "#09090b", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "6px" }}>
              {formatCurrency(data.fee_stats?.pending_fee)}
            </div>
            <div style={{ fontSize: "12px", color: "#71717a", fontWeight: 500 }}>
              <span style={{ color: "#ef4444", fontWeight: 600 }}>Uncollected</span> · Outstanding Dues
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Quick Actions Row ── */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#282B4A", margin: 0 }}>Quick Actions</h3>
          <span style={{ fontSize: "12px", color: "#71717a", fontWeight: 500 }}>Common Administrative Shortcuts</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "14px" }}>
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "16px 12px",
                  background: "#ffffff",
                  border: "1px solid rgba(40, 43, 74, 0.1)",
                  borderRadius: "18px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "#282B4A";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(40, 43, 74, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(40, 43, 74, 0.1)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "rgba(40, 43, 74, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#282B4A",
                  }}
                >
                  <Icon size={18} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#282B4A", textAlign: "center" }}>
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 1. Main Analytics Row (Student Enrollment + Attendance Overview) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "24px", marginBottom: "28px" }}>
        {/* Left: Student Enrollment Overview */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "24px 28px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#282B4A", margin: "0 0 4px" }}>
                Student Enrollment Overview
              </h3>
              <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>
                Semester-wise student distribution across branches
              </p>
            </div>
            {/* Filter Pills */}
            <div style={{ display: "flex", gap: "6px", background: "#f4f4f5", padding: "4px", borderRadius: "12px" }}>
              {(["All", "CSE", "CE", "IT", "AIML"] as const).map((branch) => (
                <button
                  key={branch}
                  onClick={() => setSelectedBranch(branch)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: selectedBranch === branch ? "#282B4A" : "transparent",
                    color: selectedBranch === branch ? "#EEEBDA" : "#52525b",
                    transition: "all 0.15s ease",
                  }}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>

          <div style={{ width: "100%", height: "230px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(40, 43, 74, 0.06)" />
                <XAxis dataKey="semester" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(40, 43, 74, 0.04)" }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            background: "#282B4A",
                            color: "#EEEBDA",
                            padding: "8px 14px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            boxShadow: "0 4px 14px rgba(40, 43, 74, 0.3)",
                            border: "1px solid rgba(238, 235, 218, 0.2)",
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
                          <div>Students: <span style={{ fontWeight: 700 }}>{payload[0].value}</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="students" fill="#282B4A" radius={[6, 6, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Attendance Overview (Donut Chart) */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "24px 28px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#282B4A", margin: "0 0 4px" }}>
              Attendance Overview
            </h3>
            <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>
              Campus-wide attendance ratio
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, gap: "16px" }}>
            {/* Donut Chart with Center Label */}
            <div style={{ width: "160px", height: "160px", position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ATTENDANCE_PIE_DATA}
                    innerRadius={52}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ATTENDANCE_PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <span style={{ fontSize: "24px", fontWeight: 800, color: "#282B4A", lineHeight: 1 }}>
                  {presentRate}%
                </span>
                <span style={{ fontSize: "11px", color: "#71717a", fontWeight: 600, marginTop: "2px" }}>
                  Avg Rate
                </span>
              </div>
            </div>

            {/* Attendance Breakdown Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  background: "rgba(40, 43, 74, 0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#282B4A" }}></span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#282B4A" }}>Present</span>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#282B4A" }}>{presentRate}%</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  background: "rgba(245, 158, 11, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#b45309" }}>Absent</span>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#b45309" }}>{absentRate}%</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  background: "rgba(40, 43, 74, 0.03)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(40, 43, 74, 0.3)" }}></span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Leave</span>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#52525b" }}>{leaveRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Second Row — Fees + Complaints ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "24px", marginBottom: "28px" }}>
        {/* Left: Fee Collection */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "24px 28px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#282B4A", margin: "0 0 4px" }}>
                Fee Collection
              </h3>
              <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>
                Academic Year 2026-27 Revenue Status
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/dashboard/fees")}
              style={{
                background: "rgba(40, 43, 74, 0.06)",
                color: "#282B4A",
                border: "none",
                borderRadius: "10px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Fee Portal <ChevronRight size={14} />
            </button>
          </div>

          {/* Metrics summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "18px" }}>
            <div style={{ background: "rgba(40, 43, 74, 0.04)", padding: "12px 14px", borderRadius: "14px" }}>
              <span style={{ fontSize: "11px", color: "#71717a", fontWeight: 600, textTransform: "uppercase" }}>Collected</span>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#282B4A", marginTop: "2px" }}>
                {formatCurrency(data.fee_stats?.paid_fee)}
              </div>
            </div>
            <div style={{ background: "rgba(245, 158, 11, 0.08)", padding: "12px 14px", borderRadius: "14px" }}>
              <span style={{ fontSize: "11px", color: "#b45309", fontWeight: 600, textTransform: "uppercase" }}>Pending</span>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#b45309", marginTop: "2px" }}>
                {formatCurrency(data.fee_stats?.pending_fee)}
              </div>
            </div>
            <div style={{ background: "rgba(239, 68, 68, 0.08)", padding: "12px 14px", borderRadius: "14px" }}>
              <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600, textTransform: "uppercase" }}>Overdue</span>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#ef4444", marginTop: "2px" }}>
                {formatCurrency(data.fee_stats?.overdue_fee)}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
              <span style={{ color: "#52525b" }}>Collection Progress</span>
              <span style={{ color: "#282B4A" }}>{data.fee_stats?.collection_percentage ?? 0}% Completed</span>
            </div>
            <div style={{ height: "10px", background: "#f4f4f5", borderRadius: "999px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, Math.max(0, data.fee_stats?.collection_percentage ?? 0))}%`,
                  background: "linear-gradient(90deg, #282B4A 0%, #353960 100%)",
                  borderRadius: "999px",
                }}
              />
            </div>
          </div>

          {/* Monthly Bar Chart */}
          <div style={{ width: "100%", height: "120px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFeeData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(40, 43, 74, 0.06)" />
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(40, 43, 74, 0.04)" }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            background: "#282B4A",
                            color: "#EEEBDA",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "11px",
                            border: "1px solid rgba(238, 235, 218, 0.2)",
                          }}
                        >
                          <div>{label}: <b>₹{payload[0].value}L</b></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="collected" fill="#282B4A" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Student Complaints */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "24px 28px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#282B4A", margin: "0 0 4px" }}>
                  Student Complaints
                </h3>
                <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>
                  Active resolution tracker
                </p>
              </div>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "12px",
                  background: "rgba(40, 43, 74, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#282B4A",
                }}
              >
                <MessageSquare size={18} />
              </div>
            </div>

            {/* Complaints breakdown tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              <div style={{ background: "#f4f4f5", padding: "12px 14px", borderRadius: "14px" }}>
                <span style={{ fontSize: "11px", color: "#71717a", fontWeight: 600 }}>Total Filed</span>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#18181b", marginTop: "2px" }}>
                  {data.complaints_stats?.total ?? 0}
                </div>
              </div>
              <div style={{ background: "rgba(245, 158, 11, 0.08)", padding: "12px 14px", borderRadius: "14px" }}>
                <span style={{ fontSize: "11px", color: "#b45309", fontWeight: 600 }}>● Pending</span>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#b45309", marginTop: "2px" }}>
                  {data.complaints_stats?.pending ?? 0}
                </div>
              </div>
              <div style={{ background: "rgba(59, 130, 246, 0.08)", padding: "12px 14px", borderRadius: "14px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 600 }}>● In Progress</span>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#1d4ed8", marginTop: "2px" }}>
                  {data.complaints_stats?.in_progress ?? 0}
                </div>
              </div>
              <div style={{ background: "rgba(16, 185, 129, 0.08)", padding: "12px 14px", borderRadius: "14px" }}>
                <span style={{ fontSize: "11px", color: "#047857", fontWeight: 600 }}>● Resolved</span>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#047857", marginTop: "2px" }}>
                  {data.complaints_stats?.resolved ?? 0}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/dashboard/complaints")}
            style={{
              width: "100%",
              padding: "14px",
              background: "#282B4A",
              color: "#EEEBDA",
              border: "none",
              borderRadius: "14px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(40, 43, 74, 0.2)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#353960";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#282B4A";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            View Complaints <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 3. Third Row — Recent Activity ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "24px 28px",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#282B4A", margin: "0 0 4px" }}>
              Recent Activity
            </h3>
            <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>
              Live audit and administrative event updates
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard/notify/student")}
            style={{
              background: "transparent",
              color: "#282B4A",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            View All <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {recentActivities.length > 0 ? (
            recentActivities.map((act) => (
              <div
                key={act.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "14px",
                  background: "#f9fafb",
                  border: "1px solid rgba(0,0,0,0.03)",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f4f4f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: act.dotColor,
                      boxShadow: `0 0 8px ${act.dotColor}`,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#18181b" }}>{act.title}</div>
                    <div style={{ fontSize: "12px", color: "#71717a", marginTop: "2px" }}>{act.desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#a1a1aa" }}>
                  <Clock size={13} />
                  <span>{act.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: "13px", color: "#71717a", padding: "12px 0" }}>
              No recent administrative activity found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
