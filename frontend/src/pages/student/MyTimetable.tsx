import React from "react";
import { 
  Calendar, BookOpen, Clock, ChevronDown, Download, Info,
  Utensils, ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import TextType from "../../components/TextType";

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
      <div style={{ background: colors.bg, padding: '10px 12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.text, flexShrink: 0 }} />
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cellData.name}</div>
        </div>
        <div style={{ fontSize: '11px', color: '#6b7280', paddingLeft: '12px', fontWeight: 500 }}>{cellData.room}</div>
      </div>
    );
  };

  return (
    <div style={{ padding: '0', maxWidth: '100%', margin: '0 auto', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* ── Header with Animated Highlighted Text Badge (Matching Attendance & Dashboard) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>My</span>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              padding: '4px 18px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <TextType
                text={["Timetable", "Schedule", "Routine"]}
                typingSpeed={60}
                deletingSpeed={35}
                pauseDuration={2200}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                style={{ color: '#ffffff' }}
              />
            </span>
          </h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>View your weekly class schedule and stay updated</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            Week View <ChevronDown size={14} color="#6b7280" />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px', background: 'white', border: '1.5px solid #573cfa', borderRadius: '12px', fontSize: '13px', fontWeight: 700, color: '#573cfa', cursor: 'pointer' }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* ── Top Real-Time KPI Cards Row (AutoML Studio design matching Main Dashboard) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}
      >
        {/* KPI 1 — Classes Today */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(87,60,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(87,60,250,0.08)' }}>
                <Calendar size={18} color="#573cfa" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Classes Today</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              4
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#573cfa', fontWeight: 600 }}>4 Classes</span> · Scheduled Today
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Total Classes / Week */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.08)' }}>
                <Clock size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Classes / Week</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              24
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>24 Classes</span> · Weekly Schedule
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Next Class */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '185px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.08)' }}>
                <BookOpen size={18} color="#3b82f6" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Next Class</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '38px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              10:45 AM
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>DBMS</span> · Next Scheduled
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Full Width Weekly Timetable Panel ── */}
      <div style={{ background: 'white', borderRadius: '28px', border: '1.5px solid rgba(0,0,0,0.06)', padding: '28px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#09090b', margin: 0, letterSpacing: '-0.3px' }}>Weekly Schedule Overview</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr>
                <th style={{ width: '110px', padding: '14px 12px', fontSize: '13px', fontWeight: 700, color: '#52525b', textAlign: 'center', background: '#f4f4f5', borderRadius: '12px 0 0 12px' }}>Time</th>
                <th style={{ padding: '14px 12px', fontSize: '13px', fontWeight: 700, color: '#52525b', textAlign: 'center', background: '#f4f4f5' }}>Monday</th>
                <th style={{ padding: '14px 12px', fontSize: '13px', fontWeight: 700, color: '#52525b', textAlign: 'center', background: '#f4f4f5' }}>Tuesday</th>
                <th style={{ padding: '14px 12px', fontSize: '13px', fontWeight: 700, color: '#52525b', textAlign: 'center', background: '#f4f4f5' }}>Wednesday</th>
                <th style={{ padding: '14px 12px', fontSize: '13px', fontWeight: 700, color: '#52525b', textAlign: 'center', background: '#f4f4f5' }}>Thursday</th>
                <th style={{ padding: '14px 12px', fontSize: '13px', fontWeight: 700, color: '#52525b', textAlign: 'center', background: '#f4f4f5' }}>Friday</th>
                <th style={{ padding: '14px 12px', fontSize: '13px', fontWeight: 700, color: '#52525b', textAlign: 'center', background: '#f4f4f5', borderRadius: '0 12px 12px 0' }}>Saturday</th>
              </tr>
            </thead>
            <tbody>
              {timetableData.map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f4f4f5' }}>
                  <td style={{ padding: '16px 8px', fontSize: '12px', fontWeight: 700, color: '#52525b', textAlign: 'center', whiteSpace: 'pre-line' }}>
                    {row.time}
                  </td>
                  {row.isBreak ? (
                    <td colSpan={6} style={{ padding: '16px 8px' }}>
                      <div style={{ background: '#fffbeb', color: '#f59e0b', padding: '14px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', color: '#71717a', fontSize: '13px', fontWeight: 500 }}>
          <Info size={16} color="#573cfa" /> Timetable is effective from 10 May 2024
        </div>
      </div>
    </div>
  );
}
