import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient as api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { 
  UserCircle, GraduationCap, Building2, Library, CheckCircle2, Award, 
  FileText, ClipboardList, TrendingUp, ChevronDown, Eye, Trophy, ArrowUpRight,
  ArrowLeft, Cloud, Cpu, Binary, Wifi, BarChart2, Calendar
} from 'lucide-react';
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import TextType from "../../components/TextType";

// Helper for subject icons and color
function getSubjectTheme(name: string) {
  const lower = (name || '').toLowerCase();
  if (lower.includes('cloud')) return { icon: Cloud, bg: '#eff6ff', color: '#2563eb' };
  if (lower.includes('machine') || lower.includes('ml')) return { icon: Cpu, bg: '#fff7ed', color: '#ea580c' };
  if (lower.includes('nlp') || lower.includes('natural')) return { icon: FileText, bg: '#faf5ff', color: '#9333ea' };
  if (lower.includes('flat') || lower.includes('automata')) return { icon: Binary, bg: '#fefce8', color: '#ca8a04' };
  if (lower.includes('network')) return { icon: Wifi, bg: '#ecfeff', color: '#0891b2' };
  return { icon: Award, bg: '#f1f5f9', color: '#475569' };
}

// ── Mobile Results (Reference Screen 6: Exams & Marks) ──
function MobileResults({ data, selectedSemester, onSemesterChange }: any) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'marks' | 'exams'>('marks');

  // Default mock subjects matching reference if data is empty or generic
  const defaultList = [
    { subjectName: "Cloud Computing", examType: "Internal - 1", marksObtained: 28, totalMarks: 30 },
    { subjectName: "Machine Learning", examType: "Internal - 1", marksObtained: 25, totalMarks: 30 },
    { subjectName: "NLP", examType: "Internal - 1", marksObtained: 26, totalMarks: 30 },
    { subjectName: "FLAT", examType: "Internal - 1", marksObtained: 24, totalMarks: 30 },
    { subjectName: "Computer Networks", examType: "Internal - 1", marksObtained: 27, totalMarks: 30 },
  ];

  const resultsList = data && data.length > 0 ? data : defaultList;

  const upcomingExams = [
    { name: "Cloud Computing Final", date: "15 Oct 2026", time: "10:00 AM", room: "Hall A" },
    { name: "Machine Learning Mid-Sem", date: "18 Oct 2026", time: "02:00 PM", room: "Lab 2" },
    { name: "NLP Practical Exam", date: "22 Oct 2026", time: "11:00 AM", room: "Lab 1" },
    { name: "FLAT Theory Exam", date: "26 Oct 2026", time: "10:00 AM", room: "Hall B" },
  ];

  return (
    <div style={{ padding: '0 4px', maxWidth: '500px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0 16px 0',
        gap: '12px',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            border: 'none',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#09090b',
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#09090b', margin: 0, letterSpacing: '-0.3px' }}>
          Exams & Marks
        </h1>
      </div>

      {/* Segmented Pill Tabs: [ Marks ] [ Exams ] */}
      <div style={{
        display: 'flex',
        background: '#f1f5f9',
        borderRadius: '16px',
        padding: '4px',
        marginBottom: '20px',
      }}>
        <button
          onClick={() => setActiveTab('marks')}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: '12px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            background: activeTab === 'marks' ? '#ede9fe' : 'transparent',
            color: activeTab === 'marks' ? '#4f46e5' : '#64748b',
            transition: 'all 0.2s ease',
          }}
        >
          Marks
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: '12px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            background: activeTab === 'exams' ? '#ede9fe' : 'transparent',
            color: activeTab === 'exams' ? '#4f46e5' : '#64748b',
            transition: 'all 0.2s ease',
          }}
        >
          Exams
        </button>
      </div>

      {activeTab === 'marks' && (
        <>
          {/* CGPA Card (Reference Screen 6) */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '22px 24px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                Current CGPA
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '32px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.8px', lineHeight: 1 }}>
                  7.8
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#16a34a',
                  background: '#dcfce7',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}>
                  ↑ 0.2
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginTop: '4px' }}>
                Out of 10
              </div>
            </div>

            {/* Visual Icon Box */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: '#eff6ff',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BarChart2 size={24} />
            </div>
          </div>

          {/* Section: Semester 7 (Ongoing) */}
          <div style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#09090b',
            marginBottom: '12px',
            letterSpacing: '-0.3px',
          }}>
            Semester 7 (Ongoing)
          </div>

          {/* Subject Marks Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {resultsList.map((r: any, i: number) => {
              const theme = getSubjectTheme(r.subjectName);
              const Icon = theme.icon;

              return (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    borderRadius: '18px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: theme.bg,
                    color: theme.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={20} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#09090b',
                      marginBottom: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {r.subjectName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {r.examType || 'Internal - 1'}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#09090b',
                    letterSpacing: '-0.3px',
                    flexShrink: 0,
                  }}>
                    {r.marksObtained}/{r.totalMarks}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'exams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {upcomingExams.map((exam, i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                border: '1px solid rgba(0,0,0,0.06)',
                padding: '16px 18px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#09090b' }}>{exam.name}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '8px' }}>
                  {exam.room}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> {exam.date}
                </span>
                <span>•</span>
                <span>{exam.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Export ──
export function MyResults() {
  const { user } = useAuthStore();
  const { isMobile, isTablet } = useIsMobile();
  const isSmallScreen = isMobile || isTablet;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("7");

  useEffect(() => {
    setLoading(true);
    api.get(`/student-dash/results?semester=${selectedSemester}`)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedSemester]);

  let totalObtained = 0;
  let totalMax = 0;
  let overallPercentage = 0;

  if (data && data.length > 0) {
    data.forEach(r => {
      totalObtained += r.marksObtained;
      totalMax += r.totalMarks;
    });
    overallPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
  }

  // ── Mobile ──
  if (isSmallScreen) {
    if (loading) {
      return (
        <div style={{ padding: '40px 16px', textAlign: 'center', color: '#64748b' }}>
          Loading exam results...
        </div>
      );
    }
    return (
      <MobileResults
        data={data}
        totalObtained={totalObtained}
        totalMax={totalMax}
        overallPercentage={overallPercentage}
        selectedSemester={selectedSemester}
        onSemesterChange={setSelectedSemester}
      />
    );
  }

  // ── Desktop ──
  
  // Grade Distribution Calculation
  let gradeCounts = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0 };
  if (data && data.length > 0) {
    data.forEach(r => {
      if (r.percentage >= 90) gradeCounts['A+']++;
      else if (r.percentage >= 80) gradeCounts['A']++;
      else if (r.percentage >= 70) gradeCounts['B']++;
      else if (r.percentage >= 60) gradeCounts['C']++;
      else gradeCounts['D']++;
    });
  }
  const pieData = [
    { name: 'A+ (90-100)', value: gradeCounts['A+'], color: '#22c55e' },
    { name: 'A (80-89)', value: gradeCounts['A'], color: '#4ade80' },
    { name: 'B (70-79)', value: gradeCounts['B'], color: '#facc15' },
    { name: 'C (60-69)', value: gradeCounts['C'], color: '#f97316' },
    { name: 'D (Below 60)', value: gradeCounts['D'], color: '#ef4444' }
  ];

  return (
    <div className="premium-dashboard" style={{ padding: '0', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header with Animated Highlighted Text Badge (Matching Main Dashboard & Attendance) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>My</span>
            <span style={{
              background: 'linear-gradient(135deg, #282B4A 0%, #3a3e68 100%)',
              color: '#EEEBDA',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(40, 43, 74, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(238, 235, 218, 0.2)',
            }}>
              <TextType
                text={["Exam Results", "Grade Card", "Academic Marks"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#EEEBDA' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>View your examination scores and overall academic performance</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px' }}>Semester</label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                padding: '8px 36px 8px 16px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '13px',
                color: '#374151',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <option value="7">Semester 7 (Current)</option>
              <option value="6">Semester 6</option>
              <option value="5">Semester 5</option>
              <option value="4">Semester 4</option>
              <option value="3">Semester 3</option>
              <option value="2">Semester 2</option>
              <option value="1">Semester 1</option>
            </select>
            <ChevronDown size={14} color="#6b7280" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* ── Real-Time Top KPI Cards Row (AutoML Studio design matching Main Dashboard) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}
      >
        {/* KPI 1 — SGPA */}
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
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(40,43,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(40,43,74,0.08)' }}>
                <Award size={18} color="#282B4A" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>SGPA</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              8.75
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#282B4A', fontWeight: 600 }}>+0.25</span> · Semester 7 Grade Point
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Total Subject */}
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
                <FileText size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Subjects</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {data.length || 6}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>100%</span> · Subjects Evaluated
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Overall Result */}
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
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Overall Result</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '38px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {overallPercentage || 90}%
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>PASSED</span> · First Class Distinction
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 2-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left Column: Subject-wise Marks */}
        <div className="res-card">
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#282B4A', marginBottom: '24px' }}>Subject-wise Marks</h3>
          
          <div className="res-table-header">
            <div>SUBJECT CODE</div>
            <div>SUBJECT NAME</div>
            <div style={{ textAlign: 'center' }}>CREDITS</div>
            <div style={{ textAlign: 'center' }}>MARKS OBTAINED</div>
            <div style={{ textAlign: 'center' }}>MAX MARKS</div>
            <div style={{ textAlign: 'center' }}>GRADE</div>
            <div style={{ textAlign: 'center' }}>POINTS</div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading subjects...</div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No subjects found.</div>
          ) : (
            <div>
              {data.map((r, i) => (
                <div key={i} className="res-table-row">
                  <div>
                    <span className="res-badge light-purple">{r.subjectCode || `CS70${i+1}`}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                    {r.subjectName || `Subject ${i+1}`}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '13px', color: '#4b5563' }}>4</div>
                  <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#282B4A' }}>
                    {r.marksObtained}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '13px', color: '#4b5563' }}>{r.totalMarks}</div>
                  <div style={{ textAlign: 'center' }}>
                    <span className={`res-badge ${r.percentage >= 80 ? 'light-green' : r.percentage >= 60 ? 'light-amber' : 'light-red'}`}>
                      {r.percentage >= 90 ? 'A+' : r.percentage >= 80 ? 'A' : r.percentage >= 70 ? 'B' : r.percentage >= 60 ? 'C' : 'D'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '13px', color: '#4b5563' }}>
                    {r.percentage >= 90 ? 10 : r.percentage >= 80 ? 9 : r.percentage >= 70 ? 8 : r.percentage >= 60 ? 7 : 0}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="res-banner">
            <div style={{ width: '48px', height: '48px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(40,43,74,0.1)' }}>
              <Trophy size={24} color="#282B4A" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#282B4A', marginBottom: '2px' }}>Great Job! Keep up the excellent work.</div>
              <div style={{ fontSize: '13px', color: '#4b5563' }}>You are performing brilliantly!</div>
            </div>
          </div>
        </div>

        {/* Right Column: Charts and Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="res-card">
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#282B4A', marginBottom: '16px' }}>Grade Distribution</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '140px', height: '140px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>{data.length || 6}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>Subjects</div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pieData.map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.color }}></div>
                      {g.name}
                    </div>
                    <div style={{ color: '#9ca3af' }}>
                      {g.value} ({data.length ? Math.round((g.value/data.length)*100) : 0}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="res-card">
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#282B4A', marginBottom: '16px' }}>Performance Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(40,43,74,0.08)', color: '#282B4A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={16} />
                  </div>
                  Class Average
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>78%</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={16} />
                  </div>
                  Your Percentage
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981' }}>{overallPercentage || 90}%</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={16} />
                  </div>
                  Rank in Class
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>3 / 60</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f4f6', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={16} />
                  </div>
                  Percentile
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>96th</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
