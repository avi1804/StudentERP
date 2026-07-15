import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { 
  BookOpen, ClipboardList, TrendingUp, Award, 
  ChevronRight, CalendarDays, CheckCircle2 
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function MySubjects() {
  const { user } = useAuthStore();
  const { isMobile } = useIsMobile();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming semester 7 is requested
    api.get('/student-dash/subjects?semester=7')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Summary Metrics Calculation
  const totalSubjects = data.length || 6;
  let totalCredits = 0;
  data.forEach(s => totalCredits += (s.credits || 4));
  if (data.length === 0) totalCredits = 24; // Mock

  const completedSubjects = 18; // Mocked till now

  // Charts Mock Data
  const pieData = [
    { name: 'Core Subjects', value: 4, color: '#3b82f6' },
    { name: 'Elective Subjects', value: 1, color: '#f59e0b' },
    { name: 'Lab Subjects', value: 1, color: '#ec4899' },
    { name: 'Project', value: 0, color: '#10b981' },
    { name: 'Audit / Others', value: 0, color: '#9ca3af' }
  ];

  const getSubjectIconColor = (index: number) => {
    const colors = ['#f3f0ff', '#e8f5e9', '#fffbeb', '#eff6ff', '#fdf2f8', '#e6fffa'];
    const textColors = ['#573cfa', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6'];
    return { bg: colors[index % colors.length], text: textColors[index % textColors.length] };
  };

  const getBadgeClass = (grade: string) => {
    if (grade === "A+") return "light-purple";
    if (grade === "A") return "light-green";
    if (grade === "B" || grade === "C") return "light-amber";
    return "light-red";
  };

  if (isMobile) {
    return <div style={{ padding: '20px' }}>Mobile view is under construction for My Subjects.</div>;
  }

  return (
    <div className="premium-dashboard" style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ background: '#f3f0ff', padding: '12px', borderRadius: '12px', marginRight: '16px', color: '#573cfa' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>My Subjects</h1>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>View and manage all subjects you are enrolled in</div>
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

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="res-metric-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={20} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>Total Subjects</div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{totalSubjects}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>This Semester</div>
        </div>

        <div className="res-metric-box" style={{ borderBottom: '3px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>Total Credits</div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{totalCredits}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>Out of 24</div>
        </div>

        <div className="res-metric-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>Average Grade</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>A</div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>↑ 0.3<br/><span style={{ color: '#9ca3af', fontWeight: 'normal', fontSize: '10px' }}>vs last sem</span></div>
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '-4px' }}>Excellent</div>
        </div>

        <div className="res-metric-box" style={{ borderBottom: '3px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>Completed Subjects</div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{completedSubjects}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>Till Now</div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {loading ? (
           <div style={{ padding: '20px', color: '#6b7280' }}>Loading subjects...</div>
        ) : data.length === 0 ? (
           <div style={{ padding: '20px', color: '#6b7280' }}>No subjects found for this semester.</div>
        ) : (
          data.map((sub, i) => {
            const colors = getSubjectIconColor(i);
            const badgeClass = getBadgeClass(sub.grade || "N/A");
            return (
              <div key={i} className="res-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: colors.bg, color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>{sub.code || `CS70${i+1}`}</div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', marginBottom: '6px' }}>{sub.name || `Subject Name ${i+1}`}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{sub.credits || 4} Credits &bull; {sub.professor || "John Doe"}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                  {sub.grade && sub.grade !== "N/A" ? <span className={`res-badge ${badgeClass}`}>{sub.grade}</span> : <span className="res-badge light-purple">A+</span>}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer' }}>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <button style={{ background: '#f3f0ff', color: '#573cfa', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>View All Subjects ∨</button>
      </div>

      {/* Bottom Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '20px' }}>
        
        {/* Subject Overview */}
        <div className="res-card">
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>Subject Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
            <div style={{ width: '120px', height: '120px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>6</div>
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
                  <div style={{ color: '#111827', fontWeight: 'bold' }}>{g.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
            <CalendarDays size={14} /> 6/6 subjects enrolled this semester
          </div>
        </div>

        {/* Credits Summary */}
        <div className="res-card">
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>Credits Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            {/* Simple Gauge Mock */}
            <div style={{ position: 'relative', width: '200px', height: '100px', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '200px', height: '200px', borderRadius: '50%', border: '20px solid #eef2ff', borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)' }}></div>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '200px', height: '200px', borderRadius: '50%', border: '20px solid #573cfa', borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)' }}></div>
              <div style={{ position: 'absolute', bottom: '0', left: 0, width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>24 <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}>/ 24</span></div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Credits Completed</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>24</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Registered</div>
            </div>
            <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>24</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Completed</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
            <CheckCircle2 size={14} /> You are on track!
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="res-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Upcoming Classes</h3>
            <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View Timetable →</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#573cfa', width: '60px' }}>09:00 AM</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Operating Systems</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Room 301</div>
              </div>
              <div className="res-badge light-purple" style={{ fontSize: '10px', padding: '2px 8px' }}>Today</div>
            </div>
            
            <div style={{ height: '1px', background: '#f3f4f6' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#573cfa', width: '60px' }}>11:00 AM</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Database Management Systems</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Lab 2</div>
              </div>
              <div className="res-badge light-green" style={{ fontSize: '10px', padding: '2px 8px' }}>Today</div>
            </div>
            
            <div style={{ height: '1px', background: '#f3f4f6' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#573cfa', width: '60px' }}>02:00 PM</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Machine Learning</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Room 204</div>
              </div>
              <div className="res-badge light-amber" style={{ fontSize: '10px', padding: '2px 8px' }}>Tomorrow</div>
            </div>
          </div>

          <button style={{ width: '100%', background: '#fff', border: '1px solid #f3f0ff', color: '#573cfa', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, marginTop: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CalendarDays size={16} /> View Full Timetable
          </button>
        </div>

      </div>
    </div>
  );
}
