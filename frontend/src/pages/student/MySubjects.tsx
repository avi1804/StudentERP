import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";

import { 
  BookOpen, ClipboardList, TrendingUp, Award, 
  ChevronRight, CalendarDays, CheckCircle2,
  Monitor, Database, Network, Code2, Brain, BarChart2,
  ChevronDown
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function MySubjects() {
  const { isMobile } = useIsMobile();
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming semester 7 is requested
    api.get('/student-dash/subjects?semester=7')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pieData = [
    { name: 'Core Subjects', value: 4, color: '#10b981' },
    { name: 'Elective Subjects', value: 1, color: '#f59e0b' },
    { name: 'Lab Subjects', value: 1, color: '#ec4899' },
    { name: 'Project', value: 0, color: '#d946ef' },
    { name: 'Audit / Others', value: 0, color: '#9ca3af' }
  ];

  const defaultSubjects = [
    { code: "CS701", name: "Operating Systems", credits: 4, professor: "Dr. Mehul Shah", grade: "A+", icon: Monitor, colorType: "purple" },
    { code: "CS702", name: "Database Management Systems", credits: 4, professor: "Prof. Kinjal Patel", grade: "A+", icon: Database, colorType: "green" },
    { code: "CS703", name: "Computer Networks", credits: 4, professor: "Prof. Jigar Sheth", grade: "A", icon: Network, colorType: "yellow" },
    { code: "CS704", name: "Software Engineering", credits: 4, professor: "Dr. Nirav Bhatt", grade: "A+", icon: Code2, colorType: "blue" },
    { code: "CS705", name: "Machine Learning", credits: 4, professor: "Prof. Rutvik Shah", grade: "A", icon: Brain, colorType: "pink" },
    { code: "CS706", name: "Elective - Data Science", credits: 4, professor: "Prof. Deeksha Joshi", grade: "A", icon: BarChart2, colorType: "teal" }
  ];

  const subjectsList = data.length > 0 ? data : defaultSubjects;

  const getColorStyles = (type: string) => {
    switch(type) {
      case "purple": return { bg: "#f3f0ff", text: "#573cfa" };
      case "green": return { bg: "#e8f5e9", text: "#10b981" };
      case "yellow": return { bg: "#fffbeb", text: "#f59e0b" };
      case "blue": return { bg: "#eff6ff", text: "#3b82f6" };
      case "pink": return { bg: "#fdf2f8", text: "#ec4899" };
      case "teal": return { bg: "#e6fffa", text: "#14b8a6" };
      default: return { bg: "#f3f0ff", text: "#573cfa" };
    }
  };

  if (isMobile) {
    return <div style={{ padding: '20px' }}>Mobile view is under construction for My Subjects.</div>;
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', background: '#f3f0ff', borderRadius: '12px', marginRight: '16px', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>My Subjects</h1>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>View and manage all subjects you are enrolled in</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px' }}>Semester</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
            Semester 7 (Current) <ChevronDown size={14} color="#6b7280" />
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Total Subjects */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ClipboardList size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Total Subjects</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>6</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>This Semester</div>
          </div>
        </div>

        {/* Total Credits */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ClipboardList size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Total Credits</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>24</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Out of 24</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: '20px', right: '20px', height: '3px', background: '#10b981', borderRadius: '3px 3px 0 0' }} />
        </div>

        {/* Average Grade */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Average Grade</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>A</div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>↑ 0.3 <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>vs last sem</span></div>
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Excellent</div>
          </div>
        </div>

        {/* Completed Subjects */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Completed Subjects</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>18</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Till Now</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: '20px', right: '20px', height: '3px', background: '#f59e0b', borderRadius: '3px 3px 0 0' }} />
        </div>
      </div>

      {/* Subjects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {loading ? (
           <div style={{ padding: '20px', color: '#6b7280' }}>Loading subjects...</div>
        ) : (
          subjectsList.map((sub, i) => {
            const colors = getColorStyles(sub.colorType || "purple");
            const IconComp = sub.icon || BookOpen;
            
            return (
              <div key={i} style={{ padding: '20px', background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: colors.bg, color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconComp size={24} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px' }}>{sub.code}</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>{sub.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{sub.credits} Credits &bull; {sub.professor}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', background: colors.bg, color: colors.text }}>{sub.grade}</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', cursor: 'pointer', marginTop: 'auto' }}>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <button style={{ background: '#f3f0ff', color: '#573cfa', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          View All Subjects <ChevronDown size={14} />
        </button>
      </div>

      {/* Bottom Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        
        {/* Subject Overview */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>Subject Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
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
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1 }}>6</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Subjects</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
            <CalendarDays size={14} /> 6/6 subjects enrolled this semester
          </div>
        </div>

        {/* Credits Summary */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 32px 0' }}>Credits Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            {/* SVG Semi-Circle */}
            <div style={{ position: 'relative', width: '200px', height: '100px' }}>
              <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%' }}>
                {/* Background arc */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#eef2ff" strokeWidth="20" strokeLinecap="round" />
                {/* Progress arc */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#a78bfa" strokeWidth="20" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="0" />
              </svg>
              <div style={{ position: 'absolute', bottom: '0', left: 0, width: '100%', textAlign: 'center', paddingBottom: '8px' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>24 <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 'normal' }}>/ 24</span></div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Credits Completed</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, background: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>24</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Registered</div>
            </div>
            <div style={{ flex: 1, background: '#f8fafc', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>24</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Completed</div>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, marginTop: 'auto' }}>
            <CheckCircle2 size={16} /> You are on track!
          </div>
        </div>

        {/* Upcoming Classes */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Upcoming Classes</h3>
            <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View Timetable &rarr;</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#573cfa', width: '60px', marginTop: '2px' }}>09:00 AM</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Operating Systems</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Room 301</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#573cfa', background: '#f3f0ff', padding: '4px 10px', borderRadius: '6px' }}>Today</div>
            </div>
            
            <div style={{ height: '1px', background: '#f3f4f6' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#573cfa', width: '60px', marginTop: '2px' }}>11:00 AM</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Database Management Systems</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Lab 2</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981', background: '#e8f5e9', padding: '4px 10px', borderRadius: '6px' }}>Today</div>
            </div>
            
            <div style={{ height: '1px', background: '#f3f4f6' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#573cfa', width: '60px', marginTop: '2px' }}>02:00 PM</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Machine Learning</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Room 204</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b', background: '#fffbeb', padding: '4px 10px', borderRadius: '6px' }}>Tomorrow</div>
            </div>
          </div>

          <button style={{ width: '100%', background: 'white', border: '1px solid #e5e7eb', color: '#573cfa', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginTop: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CalendarDays size={16} /> View Full Timetable
          </button>
        </div>

      </div>
    </div>
  );
}
