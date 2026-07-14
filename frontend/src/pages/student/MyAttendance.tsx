import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { UserCircle, GraduationCap, Building2, Library, CheckCircle2, XCircle, TrendingUp, Calendar, ChevronDown, Download, Monitor, Database, Network, Cpu, BrainCircuit, ArrowRight, ArrowUp, Book, Code } from 'lucide-react';
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion } from "framer-motion";

// ── Mobile Progress Ring ──
function ProgressRing({ percentage, size = 80, strokeWidth = 6 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 75 ? '#22c55e' : percentage >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg className="m-progress-ring" width={size} height={size}>
        <circle className="m-progress-ring-track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        <circle
          className="m-progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '18px', fontWeight: 700, color, letterSpacing: '-0.02em' }}>{percentage}%</span>
      </div>
    </div>
  );
}

// ── Mobile Attendance ──
function MobileAttendance({ user, data, totalLectures, totalAttended, totalNotAttended, overallPercentage }: any) {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Summary Card */}
      <motion.div variants={itemVariants} className="m-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
        <ProgressRing percentage={overallPercentage} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
            Overall Attendance
          </div>
          <div style={{ fontSize: '12px', color: '#7a80a1', lineHeight: 1.5 }}>
            {totalAttended} of {totalLectures} lectures attended
          </div>
        </div>
      </motion.div>

      {/* Compact Stats Row */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{totalLectures}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1', fontWeight: 500 }}>Total</div>
        </div>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center', borderBottom: '2px solid #22c55e' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>{totalAttended}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1', fontWeight: 500 }}>Present</div>
        </div>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center', borderBottom: '2px solid #ef4444' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444' }}>{totalNotAttended}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1', fontWeight: 500 }}>Absent</div>
        </div>
      </motion.div>

      {/* Subject Cards */}
      <motion.div variants={itemVariants}>
        <div className="m-section-label">Subject Breakdown</div>
        {data.map((r: any, i: number) => {
          const pctColor = r.percentage >= 75 ? '#22c55e' : r.percentage >= 60 ? '#f59e0b' : '#ef4444';
          return (
            <motion.div key={i} variants={itemVariants} className="m-subject-card" whileTap={{ scale: 0.98 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', flex: 1 }}>
                  {r.subjectName || `Subject ${r.subjectId}`}
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: pctColor }}>{r.percentage}%</span>
              </div>
              <div className="m-progress-bar" style={{ marginBottom: '8px' }}>
                <div className="m-progress-bar-fill" style={{ width: `${r.percentage}%`, background: pctColor, boxShadow: `0 0 8px ${pctColor}44` }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#7a80a1' }}>
                <span><CheckCircle2 size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px', color: '#22c55e' }} />{r.present} Present</span>
                <span><XCircle size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px', color: '#ef4444' }} />{r.absent} Absent</span>
                <span>{r.totalClasses} Total</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// ── Main Export ──
export function MyAttendance() {
  const { user } = useAuthStore();
  const { isMobile } = useIsMobile();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student-dash/attendance')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  let totalLectures = 0;
  let totalAttended = 0;
  let totalNotAttended = 0;
  let overallPercentage = 0;

  if (data && data.length > 0) {
    data.forEach(r => {
      totalLectures += r.totalClasses;
      totalAttended += (r.present + r.late);
      totalNotAttended += r.absent;
    });
    overallPercentage = totalLectures > 0 ? Math.round((totalAttended / totalLectures) * 100) : 0;
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
          {[1, 2, 3, 4].map(i => <div key={i} className="m-skeleton" style={{ height: '90px', marginBottom: '10px' }} />)}
        </div>
      );
    }
    if (data.length === 0) {
      return <div className="m-card" style={{ textAlign: 'center', color: '#7a80a1', padding: '40px 16px' }}>No attendance records found.</div>;
    }
    return <MobileAttendance user={user} data={data} totalLectures={totalLectures} totalAttended={totalAttended} totalNotAttended={totalNotAttended} overallPercentage={overallPercentage} />;
  }

  // ── Desktop ──
  return (
    <div className="premium-dashboard" style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ background: '#f3f0ff', padding: '10px', borderRadius: '12px', marginRight: '16px' }}>
          <TrendingUp size={24} color="#573cfa" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '2px' }}>My Attendance</h1>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>Track your subject-wise attendance and overall performance</div>
        </div>
      </div>

      {/* Top Summary Card */}
      <div className="dash-panel" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCircle size={40} />
              </div>
              <div>
                 <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '8px' }}>{user?.full_name || 'Student'}</h2>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                   <GraduationCap size={14} color="#573cfa" /> {user?.course !== "Unknown" ? `${user?.course} ${user?.department !== "Unknown" ? user?.department : ''}` : 'B.Tech Computer Science Engineering'}
                 </div>
                 <div style={{ fontSize: '13px', color: '#6b7280', paddingLeft: '20px' }}>
                   Enrollment No. {user?.enrollment_number || 'C5629'}
                 </div>
              </div>
           </div>
           
           <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px', textTransform: 'uppercase' }}>Overall Attendance</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                 <div style={{ fontSize: '40px', fontWeight: 700, color: '#10b981', lineHeight: 1 }}>{overallPercentage}%</div>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}><ArrowUp size={12} strokeWidth={3} /> 5.2%</div>
                    <div style={{ color: '#6b7280', fontSize: '11px' }}>vs last month</div>
                 </div>
              </div>
           </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
           <div className="att-metric-box" style={{ borderBottom: '3px solid #573cfa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Book size={18} /></div>
                 <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Total Lectures Delivered</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>{totalLectures || 8}</div>
           </div>
           <div className="att-metric-box" style={{ borderBottom: '3px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={18} /></div>
                 <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Attended Lectures</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>{totalAttended || 7}</div>
           </div>
           <div className="att-metric-box" style={{ borderBottom: '3px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><XCircle size={18} /></div>
                 <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>Missed Lectures</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>{totalNotAttended || 1}</div>
           </div>
        </div>
      </div>

      {/* Subject-wise Breakdown */}
      <div className="dash-panel" style={{ padding: '24px', marginBottom: '24px' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
               <div className="att-filter-btn">
                 July 2024 <Calendar size={14} />
               </div>
               <div className="att-filter-btn">
                 All Subjects <ChevronDown size={14} />
               </div>
            </div>
            <button className="att-download-btn">
               <Download size={14} /> Download Report
            </button>
         </div>

         <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#573cfa', marginBottom: '16px' }}>Subject-wise Breakdown</h3>
         
         <div className="att-table-header">
            <div style={{ flex: 2 }}>SUBJECT</div>
            <div style={{ flex: 3, textAlign: 'center' }}>ATTENDANCE</div>
            <div style={{ flex: 1, textAlign: 'right', paddingRight: '40px' }}>LECTURES</div>
         </div>

         <div className="att-subject-list">
            {/* Hardcoded rows matching design exactly if no data, else map data */}
            {data && data.length > 0 ? data.map((r, i) => (
               <div key={i} className="att-subject-row">
                 <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="att-subject-icon bg-green"><Monitor size={16} /></div>
                    <div>
                       <div className="att-subject-name">{r.subjectName || `Subject ${r.subjectId}`}</div>
                       <div className="att-subject-code">{r.subjectCode || 'CSXXX'}</div>
                    </div>
                 </div>
                 <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="att-progress-bg">
                       <div className="att-progress-fill" style={{ width: `${r.percentage}%`, background: r.percentage >= 75 ? '#10b981' : r.percentage >= 60 ? '#f59e0b' : '#ef4444' }}></div>
                    </div>
                    <div style={{ width: '40px', fontSize: '13px', fontWeight: 700, color: r.percentage >= 75 ? '#10b981' : r.percentage >= 60 ? '#f59e0b' : '#ef4444' }}>{r.percentage}%</div>
                 </div>
                 <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: '#6b7280', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
                    {r.present + r.late} / {r.totalClasses}
                    <ArrowRight size={14} color="#9ca3af" />
                 </div>
               </div>
            )) : (
               <>
               <div className="att-subject-row">
                 <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="att-subject-icon bg-green"><Monitor size={16} /></div>
                    <div><div className="att-subject-name">Operating Systems</div><div className="att-subject-code">CS401</div></div>
                 </div>
                 <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="att-progress-bg"><div className="att-progress-fill" style={{ width: `94%`, background: '#10b981' }}></div></div>
                    <div style={{ width: '40px', fontSize: '13px', fontWeight: 700, color: '#10b981' }}>94%</div>
                 </div>
                 <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: '#6b7280', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
                    16 / 17 <ArrowRight size={14} color="#9ca3af" />
                 </div>
               </div>
               
               <div className="att-subject-row">
                 <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="att-subject-icon bg-purple"><Database size={16} /></div>
                    <div><div className="att-subject-name">Database Management Systems</div><div className="att-subject-code">CS402</div></div>
                 </div>
                 <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="att-progress-bg"><div className="att-progress-fill" style={{ width: `88%`, background: '#10b981' }}></div></div>
                    <div style={{ width: '40px', fontSize: '13px', fontWeight: 700, color: '#10b981' }}>88%</div>
                 </div>
                 <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: '#6b7280', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
                    15 / 17 <ArrowRight size={14} color="#9ca3af" />
                 </div>
               </div>

               <div className="att-subject-row">
                 <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="att-subject-icon bg-orange"><Network size={16} /></div>
                    <div><div className="att-subject-name">Computer Networks</div><div className="att-subject-code">CS403</div></div>
                 </div>
                 <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="att-progress-bg"><div className="att-progress-fill" style={{ width: `75%`, background: '#f59e0b' }}></div></div>
                    <div style={{ width: '40px', fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>75%</div>
                 </div>
                 <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: '#6b7280', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
                    12 / 16 <ArrowRight size={14} color="#9ca3af" />
                 </div>
               </div>

               <div className="att-subject-row">
                 <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="att-subject-icon bg-blue"><Code size={16} /></div>
                    <div><div className="att-subject-name">Software Engineering</div><div className="att-subject-code">CS404</div></div>
                 </div>
                 <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="att-progress-bg"><div className="att-progress-fill" style={{ width: `93%`, background: '#10b981' }}></div></div>
                    <div style={{ width: '40px', fontSize: '13px', fontWeight: 700, color: '#10b981' }}>93%</div>
                 </div>
                 <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: '#6b7280', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
                    14 / 15 <ArrowRight size={14} color="#9ca3af" />
                 </div>
               </div>

               <div className="att-subject-row">
                 <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="att-subject-icon bg-red"><BrainCircuit size={16} /></div>
                    <div><div className="att-subject-name">Machine Learning</div><div className="att-subject-code">CS405</div></div>
                 </div>
                 <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="att-progress-bg"><div className="att-progress-fill" style={{ width: `60%`, background: '#ef4444' }}></div></div>
                    <div style={{ width: '40px', fontSize: '13px', fontWeight: 700, color: '#ef4444' }}>60%</div>
                 </div>
                 <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: '#6b7280', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
                    6 / 10 <ArrowRight size={14} color="#9ca3af" />
                 </div>
               </div>
               </>
            )}
         </div>
      </div>

      {/* Bottom Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
         <div className="dash-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>Attendance Trend</h3>
               <div className="att-filter-btn" style={{ fontSize: '11px', padding: '6px 10px', height: 'auto', background: 'transparent' }}>Last 6 Months <ChevronDown size={12} /></div>
            </div>
            {/* Mock Chart */}
            <div style={{ position: 'relative', height: '160px', width: '100%', background: 'linear-gradient(180deg, rgba(87,60,250,0.1) 0%, rgba(255,255,255,0) 100%)', borderRadius: '8px', borderBottom: '1px solid #e5e7eb', borderLeft: '1px solid #e5e7eb', marginTop: '20px' }}>
               <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path d="M0 60 Q 15 40, 30 50 T 60 40 T 80 50 T 100 20" fill="none" stroke="#573cfa" strokeWidth="2" />
                  <circle cx="15" cy="40" r="3" fill="#573cfa" />
                  <circle cx="30" cy="50" r="3" fill="#573cfa" />
                  <circle cx="60" cy="40" r="3" fill="#573cfa" />
                  <circle cx="80" cy="50" r="3" fill="#573cfa" />
                  <circle cx="100" cy="20" r="3" fill="#573cfa" />
               </svg>
               <div style={{ position: 'absolute', right: '-8px', top: '10px', background: '#573cfa', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>88%</div>
               <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '-24px', left: 0, width: '100%', fontSize: '11px', color: '#9ca3af' }}>
                  <span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'absolute', left: '-30px', top: 0, height: '100%', fontSize: '11px', color: '#9ca3af', textAlign: 'right' }}>
                  <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
               </div>
            </div>
         </div>

         <div className="dash-panel">
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0, marginBottom: '24px' }}>Attendance Summary</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', paddingLeft: '16px', marginTop: '32px' }}>
               <div className="att-donut-mock">
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                     <circle cx="50" cy="50" r="40" stroke="#ef4444" strokeWidth="16" fill="none" strokeDasharray="251.2" strokeDashoffset="0" />
                     <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="16" fill="none" strokeDasharray="251.2" strokeDashoffset="30" />
                  </svg>
                  <div className="att-donut-inner">
                     <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>67</div>
                     <div style={{ fontSize: '10px', color: '#6b7280' }}>Total Lectures</div>
                  </div>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div> Present
                     </div>
                     <div style={{ fontSize: '12px', color: '#6b7280', marginLeft: '16px' }}>88% (59)</div>
                  </div>
                  <div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div> Absent
                     </div>
                     <div style={{ fontSize: '12px', color: '#6b7280', marginLeft: '16px' }}>12% (8)</div>
                  </div>
               </div>
            </div>
         </div>

         <div className="dash-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>Recent Missed Lectures</h3>
               <a href="#" style={{ fontSize: '12px', color: '#573cfa', textDecoration: 'none', fontWeight: 600 }}>View all</a>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={16} /></div>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Machine Learning</div>
                     <div style={{ fontSize: '11px', color: '#6b7280' }}>Jul 15, 2024 • 10:00 AM</div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444' }}>Absent</div>
               </div>
               
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={16} /></div>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Computer Networks</div>
                     <div style={{ fontSize: '11px', color: '#6b7280' }}>Jul 12, 2024 • 02:00 PM</div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444' }}>Absent</div>
               </div>

               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={16} /></div>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Machine Learning</div>
                     <div style={{ fontSize: '11px', color: '#6b7280' }}>Jul 08, 2024 • 11:00 AM</div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444' }}>Absent</div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
