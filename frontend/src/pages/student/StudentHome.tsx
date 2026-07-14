import React from 'react';
import { useAuthStore } from "../../store/authStore";
import { 
  Check, TrendingUp, Play, MonitorPlay, 
  User, IdCard, CheckCircle2, Calendar, 
  BarChart2, Book, Megaphone 
} from "lucide-react";

export function StudentHome() {
  const { user } = useAuthStore();
  const firstName = user?.full_name?.split(' ')[0] || 'Student';

  return (
    <div className="premium-dashboard">
      <div className="dash-header">
        <h1>
          Welcome back, <span>{firstName}!</span> 👋
        </h1>
        <p>Here's what's happening with your learning today.</p>
      </div>

      <div className="dash-grid-main">
        {/* LEFT COLUMN */}
        <div className="dash-col-left">
          
          {/* Course Cards */}
          <div className="course-cards-row">
            <div className="course-card course-green">
               <div className="course-card-top">
                 <div className="avatars-group">
                    <img src="https://i.pravatar.cc/150?u=1" alt="student" />
                    <img src="https://i.pravatar.cc/150?u=2" alt="student" />
                    <img src="https://i.pravatar.cc/150?u=3" alt="student" />
                    <div className="avatars-more">+8</div>
                 </div>
                 <div className="course-rating">⭐ 4.8</div>
               </div>
               <h3 className="course-title">Data Structures</h3>
               <div className="course-sub">
                 <span>CSE 401</span>
                 <button className="course-arrow">→</button>
               </div>
            </div>
            
            <div className="course-card course-pink">
               <div className="course-card-top">
                 <div className="avatars-group">
                    <img src="https://i.pravatar.cc/150?u=4" alt="student" />
                    <img src="https://i.pravatar.cc/150?u=5" alt="student" />
                    <img src="https://i.pravatar.cc/150?u=6" alt="student" />
                    <div className="avatars-more">+6</div>
                 </div>
                 <div className="course-rating">⭐ 4.4</div>
               </div>
               <h3 className="course-title">Machine Learning</h3>
               <div className="course-sub">
                 <span>CSE 402</span>
                 <button className="course-arrow">→</button>
               </div>
            </div>
          </div>

          {/* Learning progress */}
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