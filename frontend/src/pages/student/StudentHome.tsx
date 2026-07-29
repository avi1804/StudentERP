import React from 'react';
import { useAuthStore } from "../../store/authStore";
import { 
  Check, TrendingUp, Play, MonitorPlay, 
  User, IdCard, CheckCircle2, Calendar, 
  BarChart2, Book, Megaphone, Layers, Briefcase, ArrowUpRight,
  CheckCircle, FileText, Activity
} from "lucide-react";
import { motion } from "framer-motion";

export function StudentHome() {
  const { user } = useAuthStore();
  const firstName = user?.full_name?.split(' ')[0] || 'Student';

  return (
    <div className="premium-dashboard">
      {/* ── Welcome Header (AutoML-style) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 32 }}
      >
        <p style={{ fontSize: 16, color: '#71717a', marginBottom: 6, fontWeight: 400 }}>Welcome back,</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
          <h1 style={{ fontSize: 48, fontWeight: 600, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, margin: 0 }}>
            {user?.full_name || 'Student'}
          </h1>
          <span style={{ padding: '5px 14px', borderRadius: 999, background: 'rgba(99,102,241,0.12)', color: '#6366f1', fontSize: 13, fontWeight: 600, border: '1px solid rgba(99,102,241,0.25)' }}>
            Student
          </span>
        </div>
      </motion.div>

      {/* ── KPI Cards Row (AutoML Studio design) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 36 }}
      >
        {/* Card 1 — Attendance */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: 28,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 200,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)' }}>
                <CheckCircle size={16} color="#18181b" strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#52525b' }}>Attendance</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 28 }}>
            <div style={{ fontSize: 52, fontWeight: 600, color: '#09090b', letterSpacing: '-2px', lineHeight: 1, marginBottom: 8 }}>87%</div>
            <div style={{ fontSize: 12, color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#10b981', fontWeight: 600 }}>+3.2%</span> from last month
            </div>
          </div>
        </motion.div>

        {/* Card 2 — CGPA */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: 28,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 200,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)' }}>
                <FileText size={16} color="#18181b" strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#52525b' }}>CGPA</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 28 }}>
            <div style={{ fontSize: 52, fontWeight: 600, color: '#09090b', letterSpacing: '-2px', lineHeight: 1, marginBottom: 8 }}>8.4</div>
            <div style={{ fontSize: 12, color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#10b981', fontWeight: 600 }}>+0.3</span> from last semester
            </div>
          </div>
        </motion.div>

        {/* Card 3 — Assignments (Neon accent) */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#d4ff3f',
            border: '1.5px solid rgba(0,0,0,0.10)',
            borderRadius: 28,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 200,
            boxShadow: '0 4px 20px rgba(212,255,63,0.35)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={16} color="#09090b" strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(0,0,0,0.75)' }}>Assignments Done</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
              <ArrowUpRight size={15} color="#ffffff" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 28 }}>
            <div style={{ fontSize: 52, fontWeight: 600, color: '#09090b', letterSpacing: '-2px', lineHeight: 1, marginBottom: 8 }}>12</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', fontWeight: 500 }}>
              <span style={{ fontWeight: 600 }}>3 pending</span> this week
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="dash-grid-main">
        {/* LEFT COLUMN */}
        <div className="dash-col-left">


          <div className="section-header">
            <h3>Learning progress</h3>
            <a href="#">View all &gt;</a>
          </div>
          
          <div className="metrics-row">
            <div className="metric-card">
              <div className="m-label">Completed</div>
              <div className="m-val-row">
                <div className="m-val">18 <span className="m-sub">Lessons</span></div>
                <div className="m-icon m-icon-green"><Check strokeWidth={3} size={18} /></div>
              </div>
            </div>
            <div className="metric-card">
              <div className="m-label">Your score</div>
              <div className="m-val-row">
                <div className="m-val">72% <span className="m-sub">Average Score</span></div>
                <div className="m-icon m-icon-yellow"><TrendingUp strokeWidth={3} size={18} /></div>
              </div>
            </div>
            <div className="metric-card">
              <div className="m-label">Active</div>
              <div className="m-val-row">
                <div className="m-val">14 <span className="m-sub">Ongoing</span></div>
                <div className="m-icon m-icon-purple"><Play fill="currentColor" size={16} /></div>
              </div>
            </div>
          </div>

          <div className="current-banner">
            <div className="cb-icon"><MonitorPlay size={24} color="#573cfa" /></div>
            <div className="cb-info">
              <h4>Database Management Systems</h4>
              <p>Chapter 4: Normalization</p>
              <div className="cb-progress-bar"><div className="cb-progress-fill" style={{width: '75%'}}></div></div>
            </div>
            <div className="cb-right">
              <div className="cb-pct">75% Complete</div>
              <button className="cb-btn">→</button>
            </div>
          </div>

          {/* Quick Access */}
          <div className="section-header mt-28">
            <h3>Quick access</h3>
          </div>
          <div className="quick-access-grid">
             <div className="qa-item"><div className="qa-icon qa-purple"><User size={24}/></div><span>My Profile</span></div>
             <div className="qa-item"><div className="qa-icon qa-blue"><IdCard size={24}/></div><span>ID Card</span></div>
             <div className="qa-item"><div className="qa-icon qa-green"><CheckCircle2 size={24}/></div><span>Attendance</span></div>
             <div className="qa-item"><div className="qa-icon qa-orange"><Calendar size={24}/></div><span>Timetable</span></div>
             <div className="qa-item"><div className="qa-icon qa-red"><BarChart2 size={24}/></div><span>Results</span></div>
             <div className="qa-item"><div className="qa-icon qa-indigo"><Book size={24}/></div><span>Library</span></div>
          </div>

          {/* Bottom Row */}
          <div className="bottom-panels-row mt-28">
            <div className="dash-panel">
              <div className="section-header">
                <h3>Upcoming tasks</h3>
              </div>
              <div className="task-list">
                <div className="task-item"><div className="task-circle"></div><div className="task-name">DBMS Assignment Submission</div><div className="task-date red-date">10 Jul 2024</div></div>
                <div className="task-item"><div className="task-circle"></div><div className="task-name">Operating Systems Quiz</div><div className="task-date">12 Jul 2024</div></div>
                <div className="task-item"><div className="task-circle"></div><div className="task-name">CN Lab Record Submission</div><div className="task-date">15 Jul 2024</div></div>
                <div className="task-item"><div className="task-circle"></div><div className="task-name">Software Engineering Project</div><div className="task-date">20 Jul 2024</div></div>
              </div>
            </div>

            <div className="dash-panel">
              <div className="section-header">
                <h3>My attendance</h3>
                <a href="#">View all &gt;</a>
              </div>
              <div className="attendance-widget">
                 <div className="att-donut">
                   <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset="32.6" transform="rotate(-90 50 50)" strokeLinecap="round" />
                   </svg>
                   <div className="att-donut-text">
                     <div className="pct">87%</div>
                     <div className="lbl">Overall</div>
                   </div>
                 </div>
                 <div className="att-stats">
                    <div className="att-stat-row"><span className="dot dot-green"></span> Present <span className="val">18 Days</span></div>
                    <div className="att-stat-row"><span className="dot dot-red"></span> Absent <span className="val">3 Days</span></div>
                    <div className="att-stat-row"><span className="dot dot-grey"></span> Leave <span className="val">2 Days</span></div>
                 </div>
              </div>
              <div className="att-total">Total Classes: 23</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="dash-col-right">
          <div className="dash-panel mb-24">
            <h3>Lesson schedule</h3>
            <div className="calendar-widget">
               <div className="cal-header">
                  <h4>July 2024</h4>
                  <div className="cal-nav"><span>&lt;</span><span>&gt;</span></div>
               </div>
               <div className="cal-grid">
                  <div className="cal-day">MON</div><div className="cal-day">TUE</div><div className="cal-day">WED</div><div className="cal-day">THU</div><div className="cal-day">FRI</div><div className="cal-day">SAT</div><div className="cal-day">SUN</div>
                  <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div>
                  <div>8</div><div className="cal-active-light">9</div><div>10</div><div>11</div><div className="cal-active-light">12</div><div>13</div><div>14</div>
                  <div>15</div><div>16</div><div className="cal-active">17</div><div>18</div><div>19</div><div>20</div><div>21</div>
                  <div>22</div><div>23</div><div>24</div><div>25</div><div>26</div><div>27</div><div>28</div>
                  <div>29</div><div>30</div><div>31</div><div className="cal-muted">1</div><div className="cal-muted">2</div><div className="cal-muted">3</div><div className="cal-muted">4</div>
               </div>
            </div>
          </div>

          <div className="dash-panel mb-24">
            <div className="section-header">
              <h3>Today's classes</h3>
              <a href="#">View all &gt;</a>
            </div>
            <div className="classes-list">
               <div className="class-item">
                  <div className="class-icon class-green"><Calendar size={20}/></div>
                  <div className="class-info">
                     <div className="class-time"><span className="dot dot-green"></span> 09:00 AM - 10:00 AM</div>
                     <div className="class-name">Operating Systems</div>
                     <div className="class-room">Room - 301</div>
                  </div>
               </div>
               <div className="class-item">
                  <div className="class-icon class-yellow"><Calendar size={20}/></div>
                  <div className="class-info">
                     <div className="class-time"><span className="dot dot-yellow"></span> 11:15 AM - 12:15 PM</div>
                     <div className="class-name">Computer Networks</div>
                     <div className="class-room">Room - 302</div>
                  </div>
               </div>
               <div className="class-item">
                  <div className="class-icon class-purple"><Calendar size={20}/></div>
                  <div className="class-info">
                     <div className="class-time"><span className="dot dot-purple"></span> 02:00 PM - 03:00 PM</div>
                     <div className="class-name">Software Engineering</div>
                     <div className="class-room">Room - 303</div>
                  </div>
               </div>
            </div>
          </div>

          <div className="dash-panel">
            <div className="section-header">
              <h3>Announcements</h3>
              <a href="#">View all &gt;</a>
            </div>
            <div className="announcements-list">
               <div className="ann-item">
                 <div className="ann-icon ann-green"><Megaphone size={18}/></div>
                 <div className="ann-info">
                   <h4>Internal Exam Schedule</h4>
                   <p>Internal exams for all 4th year students will start from 15th July 2024.</p>
                 </div>
                 <div className="ann-time">2h ago</div>
               </div>
               <div className="ann-item">
                 <div className="ann-icon ann-yellow"><Megaphone size={18}/></div>
                 <div className="ann-info">
                   <h4>Workshop on AI/ML</h4>
                   <p>A workshop on "Introduction to AI/ML" will be held on 20th July 2024.</p>
                 </div>
                 <div className="ann-time">1d ago</div>
               </div>
               <div className="ann-item">
                 <div className="ann-icon ann-purple"><Megaphone size={18}/></div>
                 <div className="ann-info">
                   <h4>Placement Drive</h4>
                   <p>Infosys placement drive is scheduled on 25th July 2024.</p>
                 </div>
                 <div className="ann-time">2d ago</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}