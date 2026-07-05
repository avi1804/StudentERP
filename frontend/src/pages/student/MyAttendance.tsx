import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { UserCircle, GraduationCap, Building2, Library, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

export function MyAttendance() {
  const { user } = useAuthStore();
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

  return (
    <div style={{ padding: '0px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(183,142,254,0.1)', padding: '12px', borderRadius: '12px', marginRight: '16px' }}>
          <TrendingUp size={28} color="var(--secondary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>My Attendance</h1>
          <div style={{ fontSize: '13px', color: 'var(--text3)' }}>Track your subject-wise attendance and overall performance</div>
        </div>
      </div>

      <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Subtle gradient background glow */}
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
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Overall Attendance</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: overallPercentage >= 75 ? 'var(--green)' : overallPercentage >= 60 ? 'var(--amber)' : 'var(--red)', textShadow: `0 0 15px ${overallPercentage >= 75 ? 'rgba(34,197,94,0.4)' : overallPercentage >= 60 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                {overallPercentage}%
              </div>
            </div>
          </div>

          {/* Overall Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <div className="report-stat-box">
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>Total Lectures Delivered</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{totalLectures}</div>
            </div>
            <div className="report-stat-box" style={{ borderBottom: '3px solid var(--green)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><CheckCircle2 size={14} color="var(--green)"/> Attended Lectures</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--green)' }}>{totalAttended}</div>
            </div>
            <div className="report-stat-box" style={{ borderBottom: '3px solid var(--red)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><XCircle size={14} color="var(--red)"/> Missed Lectures</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--red)' }}>{totalNotAttended}</div>
            </div>
          </div>

          {/* Subject Breakdown */}
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '16px', borderBottom: '1px solid rgba(183,142,254,0.2)', paddingBottom: '8px' }}>Subject-wise Breakdown</h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '20px' }}>Loading attendance...</div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>No attendance records found yet.</div>
          ) : (
            <div>
              {data.map((r, i) => (
                <div key={i} className="subject-breakdown-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{r.subjectName || `Subject ${r.subjectId}`}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{r.present} Present • {r.absent} Absent • {r.totalClasses} Total</div>
                  </div>
                  <div style={{ width: '200px', marginRight: '32px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ background: r.percentage >= 75 ? 'var(--green)' : r.percentage >= 60 ? 'var(--amber)' : 'var(--red)', width: `${r.percentage}%`, height: '100%', borderRadius: '3px', boxShadow: `0 0 10px ${r.percentage >= 75 ? 'var(--green)' : 'var(--red)'}` }}></div>
                    </div>
                  </div>
                  <div style={{ width: '60px', textAlign: 'right', fontWeight: 'bold', color: r.percentage >= 75 ? 'var(--green)' : r.percentage >= 60 ? 'var(--amber)' : 'var(--red)' }}>
                    {r.percentage}%
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
