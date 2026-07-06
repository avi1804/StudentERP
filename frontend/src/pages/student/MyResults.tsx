import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { UserCircle, GraduationCap, Building2, Library, CheckCircle2, Award } from 'lucide-react';
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion } from "framer-motion";

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

  // ── Desktop (unchanged) ──
  return (
    <div style={{ padding: '0px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(183,142,254,0.1)', padding: '12px', borderRadius: '12px', marginRight: '16px' }}>
          <Award size={28} color="var(--secondary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>My Exam Results</h1>
          <div style={{ fontSize: '13px', color: 'var(--text3)' }}>View your examination scores and overall academic performance</div>
        </div>
      </div>

      <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(183,142,254,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="glass-header" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(183, 142, 254, 0.2), rgba(87, 46, 153, 0.4))', border: '2px solid rgba(183, 142, 254, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(183, 142, 254, 0.2)' }}>
              <UserCircle size={48} color="var(--secondary)" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '0 0 8px 0' }}>
                {user?.full_name || "Student"}
              </h2>
              <div style={{ display: 'flex', gap: '24px', color: 'var(--text3)', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={14} color="var(--secondary)" /> My Academic Profile
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Overall Result</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: overallPercentage >= 70 ? 'var(--green)' : overallPercentage >= 50 ? 'var(--amber)' : 'var(--red)', textShadow: `0 0 15px ${overallPercentage >= 70 ? 'rgba(34,197,94,0.4)' : overallPercentage >= 50 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                {overallPercentage}%
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <div className="report-stat-box">
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>Total Subjects Evaluated</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{data.length}</div>
            </div>
            <div className="report-stat-box" style={{ borderBottom: '3px solid var(--secondary)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><CheckCircle2 size={14} color="var(--secondary)"/> Total Marks Obtained</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary)' }}>{totalObtained}</div>
            </div>
            <div className="report-stat-box">
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>Maximum Possible Marks</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{totalMax}</div>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '16px', borderBottom: '1px solid rgba(183,142,254,0.2)', paddingBottom: '8px' }}>Subject-wise Marks</h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '20px' }}>Loading results...</div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>No exam marks found yet.</div>
          ) : (
            <div>
              {data.map((r, i) => (
                <div key={i} className="subject-breakdown-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{r.subjectName || `Subject ${r.subjectId}`} {r.subjectCode ? `(${r.subjectCode})` : ''}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Exam Type: {r.examType.replace('_', ' ')}</div>
                  </div>
                  <div style={{ width: '120px', textAlign: 'right', marginRight: '32px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{r.marksObtained}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text3)' }}> / {r.totalMarks}</span>
                  </div>
                  <div style={{ width: '200px', marginRight: '32px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ background: r.percentage >= 70 ? 'var(--green)' : r.percentage >= 50 ? 'var(--amber)' : 'var(--red)', width: `${r.percentage}%`, height: '100%', borderRadius: '3px', boxShadow: `0 0 10px ${r.percentage >= 70 ? 'var(--green)' : 'var(--red)'}` }}></div>
                    </div>
                  </div>
                  <div style={{ width: '80px', textAlign: 'right' }}>
                     <span className={`badge ${r.percentage >= 85 ? 'badge-green' : r.percentage >= 70 ? 'badge-amber' : r.percentage >= 50 ? 'badge-amber' : 'badge-red'}`}>{r.remark}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
