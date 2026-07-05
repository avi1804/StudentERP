import { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { Calendar, GraduationCap, CheckCircle2, TrendingUp, Bell } from "lucide-react";

export function StudentHome() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    api.get('/student-dash/dashboard').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <div className="page-center"><div style={{color:'var(--text3)'}}>Loading dashboard...</div></div>;

  return (
    <div className="page-center">
      {/* Welcome Banner */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '32px', background: 'linear-gradient(135deg, rgba(154,168,255,0.1) 0%, rgba(183,142,254,0.05) 100%)', border: '1px solid rgba(154,168,255,0.2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
            Good Morning,<br/>
            <span style={{ color: 'var(--primary)' }}>{user?.full_name || 'Student'} 👋</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Welcome back to StudentERP.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon amber"><CheckCircle2 className="h-5 w-5" /></div>
          <div className="stat-val">{data.attendance_rate}%</div>
          <div className="stat-lbl">Attendance Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><GraduationCap className="h-5 w-5" /></div>
          <div className="stat-val">{data.total_subjects}</div>
          <div className="stat-lbl">Total Subjects</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><TrendingUp className="h-5 w-5" /></div>
          <div className="stat-val">0</div>
          <div className="stat-lbl">Pending Results</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="glass-card">
          <div className="card-header"><span className="card-title"><Calendar className="h-4 w-4 inline mr-2" /> Today's Classes</span></div>
          <div className="panel-body">
            {data.todays_classes?.map((c: any, i: number) => (
              <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text)' }}>{c.subject}</span>
                  <span style={{ color: 'var(--tertiary)', fontSize: '12px', fontWeight: 600 }}>{c.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text3)', fontSize: '13px' }}>
                  <span>{c.faculty}</span>
                  <span>{c.room}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="card-header"><span className="card-title"><Bell className="h-4 w-4 inline mr-2" /> Recent Announcements</span></div>
          <div className="panel-body">
            {data.recent_announcements?.map((a: any, i: number) => (
              <div key={i} style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>{a.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{a.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
