import { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { Calendar, GraduationCap, CheckCircle2, TrendingUp, Bell, BookOpen } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion } from "framer-motion";

// ── Mobile Dashboard ──
function MobileStudentHome({ user, data }: { user: any; data: any }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Greeting */}
      <motion.div variants={itemVariants} className="m-card" style={{ marginBottom: '16px', background: 'linear-gradient(135deg, rgba(154,168,255,0.08) 0%, rgba(183,142,254,0.04) 100%)', border: '1px solid rgba(154,168,255,0.12)' }}>
        <div style={{ fontSize: '14px', color: '#7a80a1' }}>{greeting},</div>
        <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginTop: '4px', letterSpacing: '-0.02em' }}>
          {user?.full_name || 'Student'} 👋
        </div>
        <div style={{ fontSize: '12px', color: '#7a80a1', marginTop: '6px' }}>Welcome back to StudentERP</div>
      </motion.div>

      {/* Quick Stats — 2 per row */}
      <motion.div variants={itemVariants} className="m-stat-grid" style={{ marginBottom: '20px' }}>
        <div className="m-stat-card">
          <div className="m-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <CheckCircle2 size={18} color="#f59e0b" />
          </div>
          <div className="m-stat-value">{data.attendance_rate}%</div>
          <div className="m-stat-label">Attendance</div>
        </div>
        <div className="m-stat-card">
          <div className="m-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <GraduationCap size={18} color="#3b82f6" />
          </div>
          <div className="m-stat-value">{data.total_subjects}</div>
          <div className="m-stat-label">Subjects</div>
        </div>
        <div className="m-stat-card">
          <div className="m-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
            <TrendingUp size={18} color="#22c55e" />
          </div>
          <div className="m-stat-value">0</div>
          <div className="m-stat-label">Pending Results</div>
        </div>
        <div className="m-stat-card">
          <div className="m-stat-icon" style={{ background: 'rgba(183, 142, 254, 0.1)' }}>
            <BookOpen size={18} color="#b78efe" />
          </div>
          <div className="m-stat-value">{data.todays_classes?.length || 0}</div>
          <div className="m-stat-label">Today's Classes</div>
        </div>
      </motion.div>

      {/* Today's Classes */}
      <motion.div variants={itemVariants}>
        <div className="m-section-label">
          <Calendar size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Today's Classes
        </div>
        {data.todays_classes && data.todays_classes.length > 0 ? (
          data.todays_classes.map((c: any, i: number) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="m-card"
              style={{ marginBottom: '10px' }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>{c.subject}</span>
                <span style={{ color: '#81ecff', fontSize: '11px', fontWeight: 600, background: 'rgba(129, 236, 255, 0.08)', padding: '3px 8px', borderRadius: '6px' }}>{c.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7a80a1', fontSize: '12px' }}>
                <span>{c.faculty}</span>
                <span>{c.room}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="m-card" style={{ textAlign: 'center', color: '#7a80a1', fontSize: '13px', padding: '24px 16px' }}>
            No classes scheduled for today.
          </div>
        )}
      </motion.div>

      {/* Announcements */}
      <motion.div variants={itemVariants} style={{ marginTop: '10px' }}>
        <div className="m-section-label">
          <Bell size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Announcements
        </div>
        {data.recent_announcements && data.recent_announcements.length > 0 ? (
          <div className="m-card" style={{ padding: 0, overflow: 'hidden' }}>
            {data.recent_announcements.map((a: any, i: number) => (
              <div key={i} style={{ padding: '14px 16px', borderBottom: i < data.recent_announcements.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#ebedfb', marginBottom: '4px' }}>{a.title}</div>
                <div style={{ fontSize: '11px', color: '#7a80a1' }}>{a.date}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="m-card" style={{ textAlign: 'center', color: '#7a80a1', fontSize: '13px', padding: '24px 16px' }}>
            No announcements yet.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Skeleton Loader ──
function MobileDashboardSkeleton() {
  return (
    <div>
      <div className="m-skeleton" style={{ height: '100px', marginBottom: '16px' }} />
      <div className="m-stat-grid" style={{ marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="m-skeleton" style={{ height: '100px' }} />
        ))}
      </div>
      <div className="m-skeleton" style={{ height: '16px', width: '120px', marginBottom: '12px' }} />
      {[1, 2, 3].map(i => (
        <div key={i} className="m-skeleton" style={{ height: '70px', marginBottom: '10px' }} />
      ))}
    </div>
  );
}

// ── Main Export ──
export function StudentHome() {
  const { user } = useAuthStore();
  const { isMobile } = useIsMobile();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/student-dash/dashboard').then(res => setData(res.data)).catch(console.error);
  }, []);

  // ── Mobile ──
  if (isMobile) {
    if (!data) return <MobileDashboardSkeleton />;
    return <MobileStudentHome user={user} data={data} />;
  }

  // ── Desktop (unchanged) ──
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
