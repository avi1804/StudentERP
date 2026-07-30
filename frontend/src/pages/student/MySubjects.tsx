import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";

import { 
  BookOpen, ClipboardList, TrendingUp, Award, 
  ChevronRight, CalendarDays, CheckCircle2,
  Monitor, Database, Network, Code2, Brain, BarChart2,
  ChevronDown, ArrowUpRight
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import TextType from "../../components/TextType";

export function MySubjects() {
  const { isMobile } = useIsMobile();
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<number>(7);

  useEffect(() => {
    setLoading(true);
    api.get(`/student-dash/subjects?semester=${selectedSemester}`)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedSemester]);

  const pieData = [
    { name: 'Core Subjects', value: 4, color: '#10b981' },
    { name: 'Elective Subjects', value: 1, color: '#f59e0b' },
    { name: 'Lab Subjects', value: 1, color: '#ec4899' },
    { name: 'Project', value: 0, color: '#d946ef' },
    { name: 'Audit / Others', value: 0, color: '#9ca3af' }
  ];

  const defaultSubjects = [
    { code: "CS701", name: "Operating Systems", credits: 4, professor: "Dr. Mehul Shah", grade: "A+", icon: Monitor, colorType: "purple" },
    { code: "CS702", name: "Database Management Systems", credits: 4, professor: "Prof. Kinjal Patel", grade: "A+", icon: Database, colorType: "green" },
    { code: "CS703", name: "Computer Networks", credits: 4, professor: "Prof. Jigar Sheth", grade: "A", icon: Network, colorType: "yellow" },
    { code: "CS704", name: "Software Engineering", credits: 4, professor: "Dr. Nirav Bhatt", grade: "A+", icon: Code2, colorType: "blue" },
    { code: "CS705", name: "Machine Learning", credits: 4, professor: "Prof. Rutvik Shah", grade: "A", icon: Brain, colorType: "pink" },
    { code: "CS706", name: "Elective - Data Science", credits: 4, professor: "Prof. Deeksha Joshi", grade: "A", icon: BarChart2, colorType: "teal" }
  ];

  const subjectsList = data.length > 0 ? data : defaultSubjects;

  // Real-time metric calculations
  const totalSubjects = subjectsList.length;
  const totalCredits = subjectsList.reduce((acc: number, curr: any) => acc + (Number(curr.credits) || 4), 0);
  const completedSubjects = subjectsList.filter((s: any) => s.grade || s.status === 'Completed' || s.completed).length || (totalSubjects > 0 ? totalSubjects - 1 : 5);

  const getColorStyles = (type: string) => {
    switch(type) {
      case "purple": return { bg: "#f3f0ff", text: "#573cfa" };
      case "green": return { bg: "#e8f5e9", text: "#10b981" };
      case "yellow": return { bg: "#fffbeb", text: "#f59e0b" };
      case "blue": return { bg: "#eff6ff", text: "#3b82f6" };
      case "pink": return { bg: "#fdf2f8", text: "#ec4899" };
      case "teal": return { bg: "#e6fffa", text: "#14b8a6" };
      default: return { bg: "#f3f0ff", text: "#573cfa" };
    }
  };

  if (isMobile) {
    return <div style={{ padding: '20px' }}>Mobile view is under construction for My Subjects.</div>;
  }

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto' }}>
      {/* ── Header with Animated Highlighted Text Badge (Matching Dashboard & Attendance) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>My</span>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <TextType
                text={["Subjects", "Courses", "Curriculum"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#ffffff' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>View and manage all subjects you are enrolled in</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px' }}>Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
            style={{
              padding: '8px 16px', background: 'white',
              border: '1px solid #e5e7eb', borderRadius: '12px',
              fontSize: '13px', color: '#374151', cursor: 'pointer',
              fontWeight: 600, outline: 'none',
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>
                Semester {sem} {sem === 7 ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Real-Time KPI Cards Row (AutoML Studio design matching Dashboard & Attendance) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}
      >
        {/* KPI 1 — Total Subjects */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(87,60,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(87,60,250,0.08)' }}>
                <BookOpen size={18} color="#573cfa" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Subjects</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {totalSubjects}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#573cfa', fontWeight: 600 }}>100%</span> · Enrolled Curriculum
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Total Credits */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.08)' }}>
                <Award size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Credits</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {totalCredits}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>{totalCredits} / {totalCredits}</span> · Semester Credits
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Completed Subjects */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.08)' }}>
                <CheckCircle2 size={18} color="#3b82f6" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Completed Subjects</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {completedSubjects}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>{totalSubjects > 0 ? Math.round((completedSubjects / totalSubjects) * 100) : 100}%</span> · Completion Progress
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Subjects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {loading ? (
           <div style={{ padding: '20px', color: '#6b7280' }}>Loading subjects...</div>
        ) : (
          subjectsList.map((sub, i) => {
            const colors = getColorStyles(sub.colorType || "purple");
            const IconComp = sub.icon || BookOpen;
            
            return (
              <div key={i} style={{ padding: '20px', background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: colors.bg, color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconComp size={24} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px' }}>{sub.code}</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>{sub.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{sub.credits} Credits &bull; {sub.professor}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', background: colors.bg, color: colors.text }}>{sub.grade}</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', cursor: 'pointer', marginTop: 'auto' }}>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>



      {/* ── 50-50 Split: Subject Overview | Credits Summary (Modern UI/UX Design) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px', alignItems: 'stretch' }}>
        
        {/* Subject Overview Card */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid rgba(0,0,0,0.06)',
          borderRadius: '28px',
          padding: '28px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(87,60,250,0.08)', border: '1px solid rgba(87,60,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} color="#573cfa" strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#09090b', margin: 0, letterSpacing: '-0.3px' }}>
                Subject Overview
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 700, background: '#e8e5ff', padding: '5px 14px', borderRadius: '16px' }}>
              {totalSubjects} Enrolled
            </span>
          </div>

          {/* Donut Chart & Legend Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, marginY: '12px' }}>
            <div style={{ width: '150px', height: '150px', position: 'relative', flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={52} outerRadius={72} paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#09090b', lineHeight: 1 }}>{totalSubjects}</div>
                <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 600, marginTop: '2px' }}>Subjects</div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pieData.map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: '#f4f4f5', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#27272a' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.color }} />
                    {g.name}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#09090b' }}>{g.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f4f4f5' }}>
            <CalendarDays size={14} color="#573cfa" /> All {totalSubjects} subjects actively tracked for Semester 7
          </div>
        </div>

        {/* Credits Summary Card */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid rgba(0,0,0,0.06)',
          borderRadius: '28px',
          padding: '28px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={20} color="#22c55e" strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#09090b', margin: 0, letterSpacing: '-0.3px' }}>
                Credits Summary
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '5px 14px', borderRadius: '16px' }}>
              On Track
            </span>
          </div>

          {/* Semi-Circle Progress Gauge */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginY: '8px' }}>
            <div style={{ position: 'relative', width: '220px', height: '110px' }}>
              <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="creditGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#573cfa" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                {/* Background Track Arc */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f4f4f5" strokeWidth="18" strokeLinecap="round" />
                {/* Active Progress Arc */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#creditGradient)" strokeWidth="18" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="0" />
              </svg>
              <div style={{ position: 'absolute', bottom: '0', left: 0, width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.8px', lineHeight: 1 }}>
                  {totalCredits} <span style={{ fontSize: '15px', color: '#71717a', fontWeight: 600 }}>/ {totalCredits}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 600, marginTop: '4px' }}>Credits Completed</div>
              </div>
            </div>
          </div>

          {/* Registered vs Completed Stats Row */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{ flex: 1, background: '#f4f4f5', padding: '14px 18px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.03)', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#573cfa' }}>{totalCredits}</div>
              <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 600, marginTop: '2px' }}>Registered</div>
            </div>
            <div style={{ flex: 1, background: '#f4f4f5', padding: '14px 18px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.03)', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>{totalCredits}</div>
              <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 600, marginTop: '2px' }}>Completed</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
