import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { UserCircle, GraduationCap, Building2, Library, CheckCircle2, Award, FileText, ClipboardList, TrendingUp, ChevronDown, Eye, Trophy } from 'lucide-react';
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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

  useEffect(() => {
    api.get('/student-dash/results')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
    <div className="premium-dashboard" style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ background: '#f3f0ff', padding: '12px', borderRadius: '12px', marginRight: '16px', color: '#573cfa' }}>
          <TrendingUp size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>My Exam Results</h1>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>View your examination scores and overall academic performance</div>
        </div>
      </div>

      {/* Top Summary Card */}
      <div className="res-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f3f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#573cfa' }}>
              <UserCircle size={40} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>{user?.full_name || "Student"}</h2>
              <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <GraduationCap size={14} /> B.Tech Computer Science Engineering
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', paddingLeft: '20px' }}>
                Enrollment No. CS629
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px' }}>Semester</div>
            <select className="res-select">
              <option>Semester 7 (Current)</option>
              <option>Semester 6</option>
              <option>Semester 5</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {/* SGPA */}
          <div className="res-metric-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={20} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>SGPA</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>9.02</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Out of 10</div>
          </div>

          {/* Total Subjects */}
          <div className="res-metric-box" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>Total Subjects</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{data.length || 6}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Evaluated</div>
          </div>

          {/* Total Marks */}
          <div className="res-metric-box" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>Total Marks Obtained</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{totalObtained || 541}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Out of {totalMax || 600}</div>
          </div>

          {/* Overall Result */}
          <div className="res-metric-box" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={20} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#b45309' }}>Overall Result</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{overallPercentage || 90}%</div>
              <div className="res-badge light-green" style={{ background: '#dcfce7', border: '1px solid #86efac' }}>Excellent</div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Past Results */}
      <div className="res-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#573cfa', margin: 0 }}>Past Results</h3>
          <ChevronDown size={20} color="#9ca3af" style={{ cursor: 'pointer' }} />
        </div>
        
        <div className="res-past-header">
          <div>SEMESTER</div>
          <div style={{ textAlign: 'center' }}>SGPA</div>
          <div style={{ textAlign: 'center' }}>TOTAL MARKS</div>
          <div style={{ textAlign: 'center' }}>PERCENTAGE</div>
          <div style={{ textAlign: 'center' }}>RESULT</div>
          <div style={{ textAlign: 'center' }}>VIEW</div>
        </div>

        <div className="res-past-row">
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Semester 6</div>
          <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>8.45</div>
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#4b5563' }}>502 / 600</div>
          <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#111827' }}>83.67%</div>
          <div style={{ textAlign: 'center' }}>
            <span className="res-badge light-green" style={{ border: '1px solid #86efac' }}>Passed</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Eye size={18} color="#573cfa" style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
