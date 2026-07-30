import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { 
  UserCircle, GraduationCap, Building2, Library, CheckCircle2, Award, 
  FileText, ClipboardList, TrendingUp, ChevronDown, Eye, Trophy, ArrowUpRight
} from 'lucide-react';
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import TextType from "../../components/TextType";

// ── Mobile Results ──
function MobileResults({ data, totalObtained, totalMax, overallPercentage }: any) {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Summary */}
      <motion.div variants={itemVariants} className="m-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <svg className="m-progress-ring" width={80} height={80}>
            <circle className="m-progress-ring-track" cx={40} cy={40} r={34} strokeWidth={6} />
            <circle
              className="m-progress-ring-fill"
              cx={40} cy={40} r={34} strokeWidth={6}
              stroke={overallPercentage >= 70 ? '#22c55e' : overallPercentage >= 50 ? '#f59e0b' : '#ef4444'}
              strokeDasharray={213.6}
              strokeDashoffset={213.6 - (overallPercentage / 100) * 213.6}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: overallPercentage >= 70 ? '#22c55e' : overallPercentage >= 50 ? '#f59e0b' : '#ef4444' }}>{overallPercentage}%</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Overall Result</div>
          <div style={{ fontSize: '12px', color: '#7a80a1' }}>{totalObtained} / {totalMax} marks scored</div>
        </div>
      </motion.div>

      {/* Compact Stats */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{data.length}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1' }}>Subjects</div>
        </div>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center', borderBottom: '2px solid #b78efe' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#b78efe' }}>{totalObtained}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1' }}>Obtained</div>
        </div>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{totalMax}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1' }}>Maximum</div>
        </div>
      </motion.div>

      {/* Subject Cards */}
      <motion.div variants={itemVariants}>
        <div className="m-section-label">Subject-wise Marks</div>
        {data.map((r: any, i: number) => {
          const pctColor = r.percentage >= 70 ? '#22c55e' : r.percentage >= 50 ? '#f59e0b' : '#ef4444';
          const badgeColor = r.percentage >= 85 ? '#22c55e' : r.percentage >= 50 ? '#f59e0b' : '#ef4444';
          return (
            <motion.div key={i} variants={itemVariants} className="m-subject-card" whileTap={{ scale: 0.98 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                    {r.subjectName || `Subject ${r.subjectId}`} {r.subjectCode ? `(${r.subjectCode})` : ''}
                  </div>
                  <div style={{ fontSize: '11px', color: '#7a80a1', marginTop: '2px' }}>
                    {r.examType?.replace('_', ' ')}
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: badgeColor, background: `${badgeColor}15`, padding: '3px 8px', borderRadius: '6px' }}>
                  {r.remark}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div className="m-progress-bar">
                    <div className="m-progress-bar-fill" style={{ width: `${r.percentage}%`, background: pctColor, boxShadow: `0 0 8px ${pctColor}44` }} />
                  </div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: pctColor, minWidth: '40px', textAlign: 'right' }}>{r.percentage}%</span>
              </div>
              <div style={{ fontSize: '12px', color: '#7a80a1' }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>{r.marksObtained}</span> / {r.totalMarks} marks
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// ── Main Export ──
export function MyResults() {
  const { user } = useAuthStore();
  const { isMobile } = useIsMobile();
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
  if (isMobile) {
    if (loading) {
      return (
        <div>
          <div className="m-skeleton" style={{ height: '100px', marginBottom: '16px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '20px' }}>
            {[1, 2, 3].map(i => <div key={i} className="m-skeleton" style={{ height: '60px' }} />)}
          </div>
          {[1, 2, 3, 4].map(i => <div key={i} className="m-skeleton" style={{ height: '100px', marginBottom: '10px' }} />)}
        </div>
      );
    }
    if (data.length === 0) {
      return <div className="m-card" style={{ textAlign: 'center', color: '#7a80a1', padding: '40px 16px' }}>No exam marks found yet.</div>;
    }
    return <MobileResults data={data} totalObtained={totalObtained} totalMax={totalMax} overallPercentage={overallPercentage} />;
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
                text={["Exam Results", "Grade Card", "Academic Marks"]}
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
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(87,60,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(87,60,250,0.08)' }}>
                <Award size={18} color="#573cfa" strokeWidth={2} />
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
              <span style={{ color: '#573cfa', fontWeight: 600 }}>+0.25</span> · Semester 7 Grade Point
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
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#573cfa', marginBottom: '24px' }}>Subject-wise Marks</h3>
          
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
                  <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#573cfa' }}>
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
            <div style={{ width: '48px', height: '48px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(87,60,250,0.1)' }}>
              <Trophy size={24} color="#573cfa" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#573cfa', marginBottom: '2px' }}>Great Job! Keep up the excellent work.</div>
              <div style={{ fontSize: '13px', color: '#4b5563' }}>You are performing brilliantly!</div>
            </div>
          </div>
        </div>

        {/* Right Column: Charts and Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="res-card">
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#573cfa', marginBottom: '16px' }}>Grade Distribution</h3>
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
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#573cfa', marginBottom: '16px' }}>Performance Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
