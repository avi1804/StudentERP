import React from "react";
import { 
  Calendar, BookOpen, Clock, ChevronDown, Download, Info,
  ChevronLeft, ChevronRight, Utensils
} from "lucide-react";

export function MyTimetable() {

  const timetableData = [
    {
      time: "08:00 AM\n-\n09:00 AM",
      monday: { name: "Operating Systems", room: "Room 301", color: "purple" },
      tuesday: { name: "Computer Networks", room: "Room 302", color: "yellow" },
      wednesday: { name: "Operating Systems", room: "Room 301", color: "purple" },
      thursday: { name: "Software Engineering", room: "Room 303", color: "blue" },
      friday: { name: "Database Systems", room: "Room 301", color: "green" },
      saturday: null
    },
    {
      time: "09:00 AM\n-\n10:00 AM",
      monday: { name: "Database Systems", room: "Room 301", color: "green" },
      tuesday: { name: "Software Engineering", room: "Room 303", color: "blue" },
      wednesday: { name: "Computer Networks", room: "Room 302", color: "yellow" },
      thursday: { name: "Operating Systems", room: "Room 301", color: "purple" },
      friday: { name: "Machine Learning", room: "Room 304", color: "pink" },
      saturday: null
    },
    {
      time: "10:00 AM\n-\n11:00 AM",
      monday: { name: "Machine Learning", room: "Room 304", color: "pink" },
      tuesday: { name: "Database Systems", room: "Room 301", color: "green" },
      wednesday: { name: "Software Engineering", room: "Room 303", color: "blue" },
      thursday: { name: "Computer Networks", room: "Room 302", color: "yellow" },
      friday: { name: "Operating Systems", room: "Room 301", color: "purple" },
      saturday: null
    },
    {
      time: "11:00 AM\n-\n12:00 PM",
      monday: null,
      tuesday: null,
      wednesday: { name: "DBMS Lab", room: "Lab 2", color: "green" },
      thursday: null,
      friday: null,
      saturday: null
    },
    {
      time: "12:00 PM\n-\n01:00 PM",
      isBreak: true,
      breakName: "Lunch Break"
    },
    {
      time: "01:00 PM\n-\n02:00 PM",
      monday: { name: "Software Engineering", room: "Room 303", color: "blue" },
      tuesday: { name: "Machine Learning", room: "Room 304", color: "pink" },
      wednesday: { name: "Computer Networks", room: "Room 302", color: "yellow" },
      thursday: { name: "Database Systems", room: "Room 301", color: "green" },
      friday: { name: "DBMS Lab", room: "Lab 2", color: "green" },
      saturday: null
    },
    {
      time: "02:00 PM\n-\n03:00 PM",
      monday: { name: "DBMS Lab", room: "Lab 2", color: "green" },
      tuesday: null,
      wednesday: { name: "Machine Learning", room: "Room 304", color: "pink" },
      thursday: { name: "Software Engineering", room: "Room 303", color: "blue" },
      friday: { name: "Computer Networks", room: "Room 302", color: "yellow" },
      saturday: null
    },
    {
      time: "03:00 PM\n-\n04:00 PM",
      monday: null,
      tuesday: { name: "Mentorship", room: "Room 201", color: "purple" },
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null
    }
  ];

  const getColorStyles = (color: string) => {
    switch(color) {
      case "purple": return { bg: "#f3f0ff", text: "#573cfa" };
      case "green": return { bg: "#e8f5e9", text: "#10b981" };
      case "yellow": return { bg: "#fffbeb", text: "#f59e0b" };
      case "blue": return { bg: "#eff6ff", text: "#3b82f6" };
      case "pink": return { bg: "#fdf2f8", text: "#ec4899" };
      default: return { bg: "transparent", text: "transparent" };
    }
  };

  const renderCell = (cellData: Record<string, string> | null) => {
    if (!cellData) return <div style={{ textAlign: 'center', color: '#d1d5db' }}>-</div>;
    const colors = getColorStyles(cellData.color);
    return (
      <div style={{ background: colors.bg, padding: '8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.text, flexShrink: 0 }} />
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cellData.name}</div>
        </div>
        <div style={{ fontSize: '10px', color: '#6b7280', paddingLeft: '12px' }}>{cellData.room}</div>
      </div>
    );
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', background: '#f3f0ff', borderRadius: '12px', marginRight: '16px', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calendar size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>My Timetable</h1>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>View your class schedule and stay updated</div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Classes Today */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f0ff', color: '#573cfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Calendar size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Classes Today</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>4</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>2 Completed</div>
          </div>
        </div>

        {/* Total Subjects */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f5e9', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Total Subjects</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>6</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>This Semester</div>
          </div>
        </div>

        {/* Total Classes / Week */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Total Classes / Week</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>28</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Across all subjects</div>
          </div>
        </div>

        {/* Next Class */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '2px' }}>Next Class</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', lineHeight: 1.2 }}>11:00 AM</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>DBMS (Lab 2)</div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Weekly Timetable */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#573cfa', margin: 0 }}>Weekly Timetable</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                Week View <ChevronDown size={14} color="#6b7280" />
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #573cfa', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#573cfa', cursor: 'pointer' }}>
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={{ width: '100px', padding: '12px', fontSize: '12px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>Time</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>Monday</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>Tuesday</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>Wednesday</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>Thursday</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>Friday</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>Saturday</th>
                </tr>
              </thead>
              <tbody>
                {timetableData.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px 8px', fontSize: '11px', fontWeight: 600, color: '#4b5563', textAlign: 'center', whiteSpace: 'pre-line' }}>
                      {row.time}
                    </td>
                    {row.isBreak ? (
                      <td colSpan={6} style={{ padding: '16px 8px' }}>
                        <div style={{ background: '#fffbeb', color: '#f59e0b', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
                          <Utensils size={16} /> {row.breakName}
                        </div>
                      </td>
                    ) : (
                      <>
                        <td style={{ padding: '12px 8px' }}>{renderCell(row.monday)}</td>
                        <td style={{ padding: '12px 8px' }}>{renderCell(row.tuesday)}</td>
                        <td style={{ padding: '12px 8px' }}>{renderCell(row.wednesday)}</td>
                        <td style={{ padding: '12px 8px' }}>{renderCell(row.thursday)}</td>
                        <td style={{ padding: '12px 8px' }}>{renderCell(row.friday)}</td>
                        <td style={{ padding: '12px 8px' }}>{renderCell(row.saturday)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', color: '#6b7280', fontSize: '12px' }}>
            <Info size={16} /> Timetable is effective from 10 May 2024
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Calendar Widget */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Calendar</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer' }}><ChevronRight size={16} /></button>
              </div>
            </div>
            
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>May 2024</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '12px' }}>
              <div style={{ color: '#6b7280', fontWeight: 600, paddingBottom: '8px' }}>Mo</div>
              <div style={{ color: '#6b7280', fontWeight: 600, paddingBottom: '8px' }}>Tu</div>
              <div style={{ color: '#6b7280', fontWeight: 600, paddingBottom: '8px' }}>We</div>
              <div style={{ color: '#6b7280', fontWeight: 600, paddingBottom: '8px' }}>Th</div>
              <div style={{ color: '#6b7280', fontWeight: 600, paddingBottom: '8px' }}>Fr</div>
              <div style={{ color: '#6b7280', fontWeight: 600, paddingBottom: '8px' }}>Sa</div>
              <div style={{ color: '#6b7280', fontWeight: 600, paddingBottom: '8px' }}>Su</div>
              
              <div style={{ color: '#d1d5db', padding: '4px' }}>29</div>
              <div style={{ color: '#d1d5db', padding: '4px' }}>30</div>
              <div style={{ color: '#111827', padding: '4px' }}>1</div>
              <div style={{ color: '#111827', padding: '4px' }}>2</div>
              <div style={{ color: '#111827', padding: '4px' }}>3</div>
              <div style={{ color: '#111827', padding: '4px' }}>4</div>
              <div style={{ color: '#111827', padding: '4px' }}>5</div>
              
              <div style={{ color: '#111827', padding: '4px' }}>6</div>
              <div style={{ color: '#111827', padding: '4px' }}>7</div>
              <div style={{ color: '#111827', padding: '4px' }}>8</div>
              <div style={{ color: '#111827', padding: '4px' }}>9</div>
              <div style={{ color: '#111827', padding: '4px' }}>10</div>
              <div style={{ color: '#111827', padding: '4px' }}>11</div>
              <div style={{ color: '#111827', padding: '4px' }}>12</div>
              
              <div style={{ color: '#111827', padding: '4px' }}>13</div>
              <div style={{ color: '#111827', padding: '4px' }}>14</div>
              <div style={{ background: '#573cfa', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>15</div>
              <div style={{ color: '#111827', padding: '4px' }}>16</div>
              <div style={{ color: '#111827', padding: '4px' }}>17</div>
              <div style={{ color: '#111827', padding: '4px' }}>18</div>
              <div style={{ color: '#111827', padding: '4px' }}>19</div>
              
              <div style={{ color: '#111827', padding: '4px' }}>20</div>
              <div style={{ color: '#111827', padding: '4px' }}>21</div>
              <div style={{ color: '#111827', padding: '4px' }}>22</div>
              <div style={{ color: '#111827', padding: '4px' }}>23</div>
              <div style={{ color: '#111827', padding: '4px' }}>24</div>
              <div style={{ color: '#111827', padding: '4px' }}>25</div>
              <div style={{ color: '#111827', padding: '4px' }}>26</div>
              
              <div style={{ color: '#111827', padding: '4px' }}>27</div>
              <div style={{ color: '#111827', padding: '4px' }}>28</div>
              <div style={{ color: '#111827', padding: '4px' }}>29</div>
              <div style={{ color: '#111827', padding: '4px' }}>30</div>
              <div style={{ color: '#111827', padding: '4px' }}>31</div>
              <div style={{ color: '#d1d5db', padding: '4px' }}>1</div>
              <div style={{ color: '#d1d5db', padding: '4px' }}>2</div>
            </div>
          </div>

          {/* Upcoming Classes Widget */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#573cfa', margin: 0 }}>Upcoming Classes</h3>
              <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 600, cursor: 'pointer' }}>View all</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, width: '70px', textAlign: 'center' }}>11:00 AM</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Database Management Systems</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Lab 2</div>
                </div>
                <div style={{ background: '#e8f5e9', color: '#10b981', padding: '4px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600 }}>In 45 min</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, width: '70px', textAlign: 'center' }}>01:00 PM</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Machine Learning</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Room 304</div>
                </div>
                <div style={{ background: '#fffbeb', color: '#f59e0b', padding: '4px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600 }}>In 2h 45m</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, width: '70px', textAlign: 'center' }}>02:00 PM</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Software Engineering</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Room 303</div>
                </div>
                <div style={{ background: '#fffbeb', color: '#f59e0b', padding: '4px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600 }}>In 3h 45m</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, width: '70px', textAlign: 'center' }}>03:30 PM</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>Mentorship Session</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Room 201</div>
                </div>
                <div style={{ background: '#f3f0ff', color: '#573cfa', padding: '4px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600 }}>In 5h 15m</div>
              </div>
            </div>

            <button style={{ width: '100%', background: '#f3f0ff', border: 'none', color: '#573cfa', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginTop: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Calendar size={16} /> View Full Timetable
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
