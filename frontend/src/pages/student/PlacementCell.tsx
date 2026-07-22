import React from "react";
import { 
  Briefcase, BarChart2, Users, Target, Award,
  ChevronRight, Megaphone, FileText, MonitorPlay, Brain, Building2,
  Circle, ChevronDown, Check
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function PlacementCell() {

  const pieData = [
    { name: 'Software Engineer', value: 68, color: '#8b5cf6' },
    { name: 'Data Analyst', value: 24, color: '#3b82f6' },
    { name: 'Product Manager', value: 12, color: '#10b981' },
    { name: 'Consultant', value: 8, color: '#f59e0b' },
    { name: 'Others', value: 12, color: '#ef4444' }
  ];

  const packageDistribution = [
    { label: "20 LPA +", percent: 12, color: "#8b5cf6" },
    { label: "10 - 20 LPA", percent: 28, color: "#3b82f6" },
    { label: "5 - 10 LPA", percent: 40, color: "#10b981" },
    { label: "3 - 5 LPA", percent: 15, color: "#f59e0b" },
    { label: "Below 3 LPA", percent: 5, color: "#ef4444" }
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', background: '#f3f0ff', borderRadius: '12px', marginRight: '16px', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Briefcase size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Placement Cell</h1>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>Track opportunities, prepare and achieve your dream career</div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {/* Dream Offers */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BarChart2 size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Dream Offers</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>18</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>This Year</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>↑ 22%</div>
            </div>
          </div>
        </div>

        {/* Active Drives */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Briefcase size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Active Drives</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>7</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Ongoing</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: '20px', right: '20px', height: '3px', background: '#10b981', borderRadius: '3px 3px 0 0' }} />
        </div>

        {/* Students Placed */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Students Placed</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>124</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>This Year</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>↑ 18%</div>
            </div>
          </div>
        </div>

        {/* Highest Package */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Target size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Highest Package</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>28.5 <span style={{ fontSize: '14px' }}>LPA</span></div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>This Year</div>
          </div>
        </div>

        {/* Avg Package */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Avg Package</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>7.8 <span style={{ fontSize: '14px' }}>LPA</span></div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>This Year</div>
          </div>
        </div>

      </div>

      {/* Middle Section (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left Column: Upcoming Placement Drives */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#573cfa', margin: 0 }}>Upcoming Placement Drives</h3>
            <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            
            {/* Microsoft */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  {/* Mocking logo with emoji/text for now */}
                  Ⓜ️
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Microsoft</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>SDE Intern</span>
                    <span style={{ background: '#f3f0ff', color: '#573cfa', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>On-Campus</span>
                    <span style={{ background: '#e8f5e9', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>Full Time</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Apply By</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444' }}>25 May 2024</div>
                </div>
                <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #573cfa', color: '#573cfa', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Apply Now</button>
              </div>
            </div>
            <div style={{ height: '1px', background: '#f3f4f6' }}></div>

            {/* Google */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  🇬
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Google</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>Software Engineer</span>
                    <span style={{ background: '#f3f0ff', color: '#573cfa', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>On-Campus</span>
                    <span style={{ background: '#e8f5e9', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>Full Time</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Apply By</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444' }}>30 May 2024</div>
                </div>
                <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #573cfa', color: '#573cfa', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Apply Now</button>
              </div>
            </div>
            <div style={{ height: '1px', background: '#f3f4f6' }}></div>

            {/* Amazon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  🅰️
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Amazon</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>Data Analyst</span>
                    <span style={{ background: '#fdf2f8', color: '#ec4899', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>Off-Campus</span>
                    <span style={{ background: '#fffbeb', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>Internship</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Apply By</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444' }}>05 Jun 2024</div>
                </div>
                <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #573cfa', color: '#573cfa', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Apply Now</button>
              </div>
            </div>
            <div style={{ height: '1px', background: '#f3f4f6' }}></div>

            {/* TCS */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                  tcs
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>TCS</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>System Engineer</span>
                    <span style={{ background: '#f3f0ff', color: '#573cfa', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>On-Campus</span>
                    <span style={{ background: '#e8f5e9', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>Full Time</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Apply By</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444' }}>10 Jun 2024</div>
                </div>
                <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #573cfa', color: '#573cfa', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Apply Now</button>
              </div>
            </div>

          </div>

          <button style={{ width: '100%', background: '#f8fafc', border: 'none', color: '#573cfa', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginTop: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Browse All Drives <ChevronRight size={16} />
          </button>
        </div>

        {/* Right Column: Stats & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Placement Statistics */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Placement Statistics</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', color: '#374151', cursor: 'pointer' }}>
                This Year <ChevronDown size={14} color="#6b7280" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
              {/* Pie chart and Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '120px', height: '120px', position: 'relative', flexShrink: 0 }}>
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
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>124</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>Total Placed</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  {pieData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.color }}></div>
                        {d.name}
                      </div>
                      <div style={{ color: '#6b7280' }}>{d.value} <span style={{ fontSize: '9px', opacity: 0.7 }}>({Math.round((d.value/124)*100)}%)</span></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Distribution Bar Charts */}
              <div style={{ borderLeft: '1px solid #f3f4f6', paddingLeft: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Package Distribution</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {packageDistribution.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '70px', fontSize: '11px', color: '#4b5563' }}>{item.label}</div>
                      <div style={{ flex: 1, height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.percent}%`, height: '100%', background: item.color, borderRadius: '3px' }}></div>
                      </div>
                      <div style={{ width: '28px', fontSize: '11px', fontWeight: 600, color: '#111827', textAlign: 'right' }}>{item.percent}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preparation Progress */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Preparation Progress</h3>
              <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View Details</span>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              
              <div style={{ flex: 1, padding: '16px', border: '1px solid #f3f4f6', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f0ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Brain size={16} /></div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>75%</div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563' }}>Aptitude</div>
                <div style={{ position: 'absolute', bottom: 0, left: '16px', right: '16px', height: '4px', background: '#f3f4f6', borderRadius: '2px' }}>
                  <div style={{ width: '75%', height: '100%', background: '#8b5cf6', borderRadius: '2px' }}></div>
                </div>
              </div>

              <div style={{ flex: 1, padding: '16px', border: '1px solid #f3f4f6', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MonitorPlay size={16} /></div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>60%</div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563' }}>DSA</div>
                <div style={{ position: 'absolute', bottom: 0, left: '16px', right: '16px', height: '4px', background: '#f3f4f6', borderRadius: '2px' }}>
                  <div style={{ width: '60%', height: '100%', background: '#3b82f6', borderRadius: '2px' }}></div>
                </div>
              </div>

              <div style={{ flex: 1, padding: '16px', border: '1px solid #f3f4f6', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={16} /></div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>80%</div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563' }}>HR Rounds</div>
                <div style={{ position: 'absolute', bottom: 0, left: '16px', right: '16px', height: '4px', background: '#f3f4f6', borderRadius: '2px' }}>
                  <div style={{ width: '80%', height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
                </div>
              </div>

              <div style={{ flex: 1, padding: '16px', border: '1px solid #f3f4f6', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={16} /></div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>85%</div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563' }}>Resume Score</div>
                <div style={{ position: 'absolute', bottom: 0, left: '16px', right: '16px', height: '4px', background: '#f3f4f6', borderRadius: '2px' }}>
                  <div style={{ width: '85%', height: '100%', background: '#f59e0b', borderRadius: '2px' }}></div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section (3 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Placement Resources */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>Placement Resources</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #f3f4f6', borderRadius: '12px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={20} /></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Resume Builder</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Create & improve your resume</div>
                </div>
              </div>
              <ChevronRight size={16} color="#9ca3af" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #f3f4f6', borderRadius: '12px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MonitorPlay size={20} /></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Mock Interviews</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Practice with AI & experts</div>
                </div>
              </div>
              <ChevronRight size={16} color="#9ca3af" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #f3f4f6', borderRadius: '12px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Brain size={20} /></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Aptitude Tests</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Quant, Reasoning, Verbal</div>
                </div>
              </div>
              <ChevronRight size={16} color="#9ca3af" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #f3f4f6', borderRadius: '12px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={20} /></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Company Insights</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Explore profiles & reviews</div>
                </div>
              </div>
              <ChevronRight size={16} color="#9ca3af" />
            </div>

          </div>
        </div>

        {/* Recent Announcements */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Recent Announcements</h3>
            <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}><Megaphone size={16} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Infosys Off-Campus Drive 2024</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>Registration open for B.Tech 2024 batch</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>15 May 2024</div>
                  <div style={{ background: '#fef2f2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>New</div>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: '#f3f4f6' }}></div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}><Megaphone size={16} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Business Communication Workshop</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>Improve your communication skills</div>
                <div style={{ fontSize: '10px', color: '#9ca3af' }}>12 May 2024</div>
              </div>
            </div>

            <div style={{ height: '1px', background: '#f3f4f6' }}></div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}><Megaphone size={16} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>TCS Ninja Hiring Challenge</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>Take the test and get shortlisted</div>
                <div style={{ fontSize: '10px', color: '#9ca3af' }}>10 May 2024</div>
              </div>
            </div>

            <div style={{ height: '1px', background: '#f3f4f6' }}></div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}><Megaphone size={16} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Resume Building Session</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>Join the session on 18th May</div>
                <div style={{ fontSize: '10px', color: '#9ca3af' }}>08 May 2024</div>
              </div>
            </div>

          </div>
        </div>

        {/* Your Placement Journey */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>Your Placement Journey</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
            
            {/* Timeline Line */}
            <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '24px', width: '2px', background: '#e5e7eb' }}></div>
            <div style={{ position: 'absolute', left: '11px', top: '24px', height: '60%', width: '2px', background: '#10b981' }}></div>

            {/* Step 1 */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={14} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Profile Completion</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Complete your profile</div>
              </div>
              <span style={{ background: '#e8f5e9', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, height: 'fit-content' }}>Completed</span>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={14} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Skills Assessment</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Take skill tests</div>
              </div>
              <span style={{ background: '#e8f5e9', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, height: 'fit-content' }}>Completed</span>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={14} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Resume Submitted</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Your resume is ready</div>
              </div>
              <span style={{ background: '#e8f5e9', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, height: 'fit-content' }}>Completed</span>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: '2px solid #3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Circle size={10} fill="#3b82f6" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Applications</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>You have applied to 8 drives</div>
              </div>
              <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, height: 'fit-content' }}>In Progress</span>
            </div>

            {/* Step 5 */}
            <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: '2px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Interviews</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Keep going, you're doing great!</div>
              </div>
              <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, height: 'fit-content' }}>Pending</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
