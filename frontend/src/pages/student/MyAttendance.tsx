import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { UserCircle, GraduationCap, Building2, Library, CheckCircle2, XCircle, TrendingUp, Calendar, ChevronDown, ChevronLeft, ChevronRight, Download, Monitor, Database, Network, Cpu, BrainCircuit, ArrowRight, ArrowUp, ArrowUpRight, Book, Code, MoreHorizontal, User } from 'lucide-react';
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion } from "framer-motion";
import TextType from "../../components/TextType";

// ── Mobile Progress Ring ──
function ProgressRing({ percentage, size = 80, strokeWidth = 6 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 75 ? '#22c55e' : percentage >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg className="m-progress-ring" width={size} height={size}>
        <circle className="m-progress-ring-track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        <circle
          className="m-progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '18px', fontWeight: 700, color, letterSpacing: '-0.02em' }}>{percentage}%</span>
      </div>
    </div>
  );
}

// ── Mobile Attendance ──
function MobileAttendance({ user, data, totalLectures, totalAttended, totalNotAttended, overallPercentage }: any) {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Summary Card */}
      <motion.div variants={itemVariants} className="m-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
        <ProgressRing percentage={overallPercentage} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
            Overall Attendance
          </div>
          <div style={{ fontSize: '12px', color: '#7a80a1', lineHeight: 1.5 }}>
            {totalAttended} of {totalLectures} lectures attended
          </div>
        </div>
      </motion.div>

      {/* Compact Stats Row */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{totalLectures}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1', fontWeight: 500 }}>Total</div>
        </div>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center', borderBottom: '2px solid #22c55e' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>{totalAttended}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1', fontWeight: 500 }}>Present</div>
        </div>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center', borderBottom: '2px solid #ef4444' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444' }}>{totalNotAttended}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1', fontWeight: 500 }}>Absent</div>
        </div>
      </motion.div>

      {/* Subject Cards */}
      <motion.div variants={itemVariants}>
        <div className="m-section-label">Subject Breakdown</div>
        {data.map((r: any, i: number) => {
          const pctColor = r.percentage >= 75 ? '#22c55e' : r.percentage >= 60 ? '#f59e0b' : '#ef4444';
          return (
            <motion.div key={i} variants={itemVariants} className="m-subject-card" whileTap={{ scale: 0.98 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', flex: 1 }}>
                  {r.subjectName || `Subject ${r.subjectId}`}
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: pctColor }}>{r.percentage}%</span>
              </div>
              <div className="m-progress-bar" style={{ marginBottom: '8px' }}>
                <div className="m-progress-bar-fill" style={{ width: `${r.percentage}%`, background: pctColor, boxShadow: `0 0 8px ${pctColor}44` }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#7a80a1' }}>
                <span><CheckCircle2 size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px', color: '#22c55e' }} />{r.present} Present</span>
                <span><XCircle size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px', color: '#ef4444' }} />{r.absent} Absent</span>
                <span>{r.totalClasses} Total</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// ── Engagement / Attendance Pill Chart Component (Pixel-perfect matching reference UI) ──
function AttendanceGraphCard({ data }: { data?: any[] }) {
  const [timeframe, setTimeframe] = useState<'monthly' | 'annually'>('monthly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Base dataset with full month names and lecture ratios
  const monthlyData = [
    { label: 'Jan', fullMonth: 'January 2024', value: 38, change: '+4.2%', lectures: '18/25' },
    { label: 'Feb', fullMonth: 'February 2024', value: 70, change: '+8.5%', lectures: '22/26' },
    { label: 'Mar', fullMonth: 'March 2024', value: 50, change: '-3.1%', lectures: '20/25' },
    { label: 'Apr', fullMonth: 'April 2024', value: 92, change: '+12.8%', lectures: '24/26' },
    { label: 'May', fullMonth: 'May 2024', value: 55, change: '-5.0%', lectures: '21/25' },
    { label: 'Jun', fullMonth: 'June 2024', value: 82, change: '+7.0%', lectures: '23/26' },
  ];

  const annuallyData = [
    { label: '2021', fullMonth: 'Year 2021', value: 45, change: '+5.0%', lectures: '240/300' },
    { label: '2022', fullMonth: 'Year 2022', value: 68, change: '+4.0%', lectures: '252/300' },
    { label: '2023', fullMonth: 'Year 2023', value: 75, change: '+4.0%', lectures: '264/300' },
    { label: '2024', fullMonth: 'Year 2024', value: 94, change: '+12.8%', lectures: '279/300' },
    { label: '2025', fullMonth: 'Year 2025', value: 60, change: '-2.0%', lectures: '258/300' },
    { label: '2026', fullMonth: 'Year 2026', value: 85, change: '+5.0%', lectures: '273/300' },
  ];

  // Dynamic real-time calculation: update April active value from real subject data if present
  if (data && data.length > 0) {
    const totalPresent = data.reduce((acc, curr) => acc + (curr.present || 0) + (curr.late || 0), 0);
    const totalClasses = data.reduce((acc, curr) => acc + (curr.totalClasses || 0), 0);
    if (totalClasses > 0) {
      const calculatedPct = Math.round((totalPresent / totalClasses) * 100);
      monthlyData[3].value = Math.min(Math.max(calculatedPct, 20), 98);
      monthlyData[3].lectures = `${totalPresent}/${totalClasses}`;
    }
  }

  const currentDataset = timeframe === 'monthly' ? monthlyData : annuallyData;
  const activeItem = hoveredIndex !== null ? currentDataset[hoveredIndex] : null;

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid rgba(0,0,0,0.06)',
      borderRadius: '28px',
      padding: '28px 32px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
      marginBottom: '0',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="#18181b" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#09090b', margin: 0, letterSpacing: '-0.3px' }}>
            Engagement rate
          </h3>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#f4f4f5',
            borderRadius: '24px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <button
              onClick={() => { setTimeframe('monthly'); setActiveIndex(3); }}
              style={{
                border: 'none',
                background: timeframe === 'monthly' ? '#e8e5ff' : 'transparent',
                color: timeframe === 'monthly' ? '#573cfa' : '#71717a',
                fontSize: '13px',
                fontWeight: timeframe === 'monthly' ? 700 : 500,
                padding: '6px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => { setTimeframe('annually'); setActiveIndex(3); }}
              style={{
                border: 'none',
                background: timeframe === 'annually' ? '#e8e5ff' : 'transparent',
                color: timeframe === 'annually' ? '#573cfa' : '#71717a',
                fontSize: '13px',
                fontWeight: timeframe === 'annually' ? 700 : 500,
                padding: '6px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Annually
            </button>
          </div>

          <button style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '1px solid rgba(0,0,0,0.08)',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#18181b',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div 
        onMouseLeave={() => setHoveredIndex(null)}
        style={{ position: 'relative', height: '280px', marginTop: '10px', paddingLeft: '50px', paddingRight: '20px' }}
      >
        {/* Y-Axis Gridlines */}
        {[
          { label: '100%', top: '0%' },
          { label: '80%', top: '20%' },
          { label: '60%', top: '40%' },
          { label: '40%', top: '60%' },
          { label: '20%', top: '80%' },
          { label: '0%', top: '100%' },
        ].map((lvl, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: lvl.top,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            pointerEvents: 'none',
          }}>
            <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 500, width: '40px', textAlign: 'right' }}>
              {lvl.label}
            </span>
            <div style={{ flex: 1, height: '1px', borderTop: '1px solid #f4f4f5' }} />
          </div>
        ))}

        {/* Floating White Tooltip Card */}
        {hoveredIndex !== null && activeItem && (
          <motion.div
            key={`${timeframe}-${hoveredIndex}`}
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            style={{
              position: 'absolute',
              top: '12%',
              left: `calc(52px + ${(hoveredIndex + 0.5) * (100 / currentDataset.length)}%)`,
              transform: 'translateX(-50%)',
              background: '#ffffff',
              borderRadius: '20px',
              padding: '14px 22px',
              boxShadow: '0 16px 40px rgba(87,60,250,0.15), 0 2px 8px rgba(0,0,0,0.04)',
              border: '1.5px solid rgba(87,60,250,0.12)',
              zIndex: 30,
              minWidth: '150px',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 600, marginBottom: '4px' }}>
              {activeItem.fullMonth}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#573cfa', letterSpacing: '-0.8px', lineHeight: 1 }}>
              {activeItem.value}%
            </div>
            <div style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 600, marginTop: '4px' }}>
              {activeItem.lectures} Lectures
            </div>
          </motion.div>
        )}

        {/* Bars Container */}
        <div style={{
          position: 'absolute',
          left: '52px',
          right: '20px',
          top: '20px',
          bottom: '36px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
        }}>
          {currentDataset.map((item, index) => {
            const isActive = index === hoveredIndex;
            const barHeightPct = Math.min(Math.max((item.value / 100) * 88, 25), 88);

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  height: '100%',
                  justifyContent: 'flex-end',
                  width: '56px',
                }}
              >
                {/* Floating Green Change Badge & Downward Triangle */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{
                      position: 'absolute',
                      bottom: `calc(${barHeightPct}% + 18px)`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 20,
                    }}
                  >
                    <span style={{
                      background: '#dcfce7',
                      color: '#16a34a',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '14px',
                      boxShadow: '0 2px 6px rgba(22,163,74,0.15)',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.change}
                    </span>
                    <div style={{
                      width: 0,
                      height: 0,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: '5px solid #dcfce7',
                      marginTop: '-1px',
                    }} />
                  </motion.div>
                )}

                {/* Capsule Bar */}
                <motion.div
                  whileHover={{ scaleY: 1.04, scaleX: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    width: '48px',
                    height: `${barHeightPct}%`,
                    borderRadius: '24px',
                    position: 'relative',
                    transition: 'height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.25s, box-shadow 0.25s',
                    background: isActive
                      ? 'linear-gradient(180deg, #8c71ff 0%, #6d4bf5 100%)'
                      : 'repeating-linear-gradient(135deg, rgba(167, 139, 250, 0.25), rgba(167, 139, 250, 0.25) 5px, rgba(245, 243, 255, 0.9) 5px, rgba(245, 243, 255, 0.9) 11px)',
                    border: isActive
                      ? 'none'
                      : '1.5px solid rgba(167, 139, 250, 0.3)',
                    boxShadow: isActive
                      ? '0 10px 28px rgba(109, 75, 245, 0.4)'
                      : 'none',
                  }}
                >
                  {/* Top Dot Cap Indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: isActive ? '14px' : '10px',
                    height: isActive ? '14px' : '10px',
                    borderRadius: '50%',
                    background: isActive ? '#ffffff' : '#6d4bf5',
                    border: isActive ? '3px solid #6d4bf5' : 'none',
                    boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.9)' : 'none',
                  }} />
                </motion.div>

                {/* X-Axis Month Label */}
                <span style={{
                  position: 'absolute',
                  bottom: '-28px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#09090b' : '#71717a',
                  transition: 'color 0.2s',
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── College Attendance Details Calendar Component (Matching Reference UI) ──
function AttendanceCalendarCard({ data }: { data?: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Default June 2026 as per screenshot
  const [selectedSubject, setSelectedSubject] = useState<string>('CLOUD COMPUTING - LECTURE');
  const [activeTab, setActiveTab] = useState<'overall' | 'this_month'>('this_month');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Extract subjects list from API or fallback
  const subjectList = data && data.length > 0
    ? data.map(s => `${(s.subjectName || 'Subject').toUpperCase()} - LECTURE`)
    : [
        'CLOUD COMPUTING - LECTURE',
        'OPERATING SYSTEMS - LECTURE',
        'DATABASE MANAGEMENT SYSTEMS - LECTURE',
        'COMPUTER NETWORKS - LECTURE',
        'SOFTWARE ENGINEERING - LECTURE',
        'MACHINE LEARNING - LECTURE',
      ];

  // Calendar matrix calculation
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Attendance dots map for days (simulated realistic college attendance pattern matching reference)
  const getAttendanceForDay = (d: number) => {
    const dayOfWeek = new Date(year, month, d).getDay(); // 0 = Sun
    if (dayOfWeek === 0) return []; // Sunday no classes

    // Deterministic attendance generator matching reference image dots
    if (d === 1) return ['absent'];
    if (d === 4) return ['present', 'absent'];
    if (d === 5 || d === 6 || d === 8 || d === 11 || d === 12 || d === 13 || d === 15) return ['present'];
    if (d === 18) return ['present', 'absent'];
    if (d === 19 || d === 20 || d === 22) return ['present'];
    if (d === 25) return ['absent'];
    if (d === 26 || d === 27 || d === 29) return ['present'];

    if (dayOfWeek === 1 || dayOfWeek === 4) return ['present', 'present'];
    if (dayOfWeek === 2 || dayOfWeek === 5) return ['present'];
    if (dayOfWeek === 3) return d % 2 === 0 ? ['present'] : ['absent'];
    if (dayOfWeek === 6) return d % 4 === 0 ? ['present'] : [];
    return [];
  };

  // Calculate monthly stats
  let totalPresent = 0;
  let totalAbsent = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const records = getAttendanceForDay(d);
    records.forEach(r => {
      if (r === 'present') totalPresent++;
      if (r === 'absent') totalAbsent++;
    });
  }

  const totalClasses = totalPresent + totalAbsent || 33;
  const presentPct = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(1) : '81.8';
  const absentPct = totalClasses > 0 ? ((totalAbsent / totalClasses) * 100).toFixed(1) : '18.2';

  // Calendar cells
  const gridCells = [];
  // Prev month filler
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    gridCells.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    gridCells.push({ day: d, isCurrentMonth: true, attendance: getAttendanceForDay(d) });
  }
  // Next month filler
  const remaining = 42 - gridCells.length;
  for (let i = 1; i <= remaining; i++) {
    gridCells.push({ day: i, isCurrentMonth: false });
  }

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid rgba(0,0,0,0.06)',
      borderRadius: '28px',
      padding: '28px 32px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
      marginBottom: '28px',
      width: '100%',
    }}>
      {/* Top Header Card / Subject Selector */}
      <div style={{
        background: '#f0f3ff',
        borderRadius: '20px',
        padding: '16px 22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          }}>
            <Monitor size={20} color="#573cfa" />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '16px',
              fontWeight: 800,
              color: '#09090b',
              cursor: 'pointer',
              outline: 'none',
              letterSpacing: '-0.3px',
            }}
          >
            {subjectList.map((sub, idx) => (
              <option key={idx} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>
            {totalPresent}/{totalClasses}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', letterSpacing: '-0.5px' }}>
            {presentPct}%
          </div>
        </div>
      </div>

      {/* Month Navigation Bar */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '0 12px',
        marginBottom: '20px',
      }}>
        <button
          onClick={handlePrevMonth}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#18181b',
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#09090b', margin: 0, letterSpacing: '-0.3px' }}>
          {monthNames[month]} {year}
        </h3>

        <button
          onClick={handleNextMonth}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#18181b',
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Days of Week Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        background: '#f4f4f5',
        borderRadius: '12px',
        padding: '10px 0',
        marginBottom: '12px',
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <span key={i} style={{ fontSize: '13px', fontWeight: 700, color: '#52525b' }}>
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        rowGap: '12px',
        marginBottom: '28px',
      }}>
        {gridCells.map((cell, idx) => (
          <div
            key={idx}
            onMouseEnter={() => cell.isCurrentMonth && setHoveredDay(cell.day)}
            onMouseLeave={() => setHoveredDay(null)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '48px',
              borderRadius: '12px',
              background: hoveredDay === cell.day ? '#f4f4f5' : 'transparent',
              transition: 'background 0.15s',
              cursor: cell.isCurrentMonth ? 'pointer' : 'default',
              position: 'relative',
            }}
          >
            <span style={{
              fontSize: '14px',
              fontWeight: cell.isCurrentMonth ? 600 : 400,
              color: cell.isCurrentMonth ? '#09090b' : '#d4d4d8',
            }}>
              {cell.day}
            </span>

            {/* Attendance Dots */}
            {cell.isCurrentMonth && cell.attendance && cell.attendance.length > 0 && (
              <div style={{ display: 'flex', gap: '3px', marginTop: '3px' }}>
                {cell.attendance.map((st, dotIdx) => (
                  <div
                    key={dotIdx}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: st === 'present' ? '#16a34a' : '#ef4444',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Export ──
export function MyAttendance() {
  const { user } = useAuthStore();
  const { isMobile } = useIsMobile();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive Filter States
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
  );
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All Subjects');
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  useEffect(() => {
    api.get('/student-dash/attendance?semester=7')
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

  // ── Mobile ──
  if (isMobile) {
    if (loading) {
      return (
        <div>
          <div className="m-skeleton" style={{ height: '100px', marginBottom: '16px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '20px' }}>
            {[1, 2, 3].map(i => <div key={i} className="m-skeleton" style={{ height: '60px' }} />)}
          </div>
          {[1, 2, 3, 4].map(i => <div key={i} className="m-skeleton" style={{ height: '90px', marginBottom: '10px' }} />)}
        </div>
      );
    }
    if (data.length === 0) {
      return <div className="m-card" style={{ textAlign: 'center', color: '#7a80a1', padding: '40px 16px' }}>No attendance records found.</div>;
    }
    return <MobileAttendance user={user} data={data} totalLectures={totalLectures} totalAttended={totalAttended} totalNotAttended={totalNotAttended} overallPercentage={overallPercentage} />;
  }

  // ── Desktop ──
  return (
    <div className="premium-dashboard" style={{ padding: '0' }}>
      {/* ── Header with Animated Highlighted Text Badge (Matching Main Dashboard) ── */}
      <div style={{ marginBottom: '28px' }}>
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
              text={["Attendance", "Lecture Stats", "Class Tracker"]}
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
        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Track your subject-wise attendance and overall performance</div>
      </div>

      {/* ── Main Dashboard Style 3 KPI Cards ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}
      >
        {/* KPI 1 — Total Lectures Delivered */}
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
                <Book size={18} color="#573cfa" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Total Lectures Delivered</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {totalLectures || 9}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#573cfa', fontWeight: 600 }}>100%</span> · Total Curriculum
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Attended Lectures */}
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
                <CheckCircle2 size={18} color="#22c55e" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Attended Lectures</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {totalAttended || 8}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>{overallPercentage || 89}%</span> · Attended Rate
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Missed Lectures */}
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
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)' }}>
                <XCircle size={18} color="#ef4444" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#52525b' }}>Missed Lectures</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {totalNotAttended || 1}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>{(totalLectures || 9) > 0 ? Math.round(((totalNotAttended || 1) / (totalLectures || 9)) * 100) : 11}%</span> · Missed Rate
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 1. College Attendance Details Calendar */}
      <AttendanceCalendarCard data={data} />

      {/* 2. Subject-wise Breakdown Table */}
      <div className="dash-panel" style={{ padding: '24px', marginBottom: '28px', position: 'relative' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 40 }}>
               {/* Month Filter Dropdown */}
               <div style={{ position: 'relative' }}>
                 <button
                   onClick={() => {
                     setIsMonthDropdownOpen(!isMonthDropdownOpen);
                     setIsSubjectDropdownOpen(false);
                   }}
                   className="att-filter-btn"
                   style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px',
                     background: '#f4f4f5',
                     border: '1px solid rgba(0,0,0,0.08)',
                     borderRadius: '16px',
                     padding: '8px 16px',
                     fontSize: '13px',
                     fontWeight: 600,
                     color: '#18181b',
                     cursor: 'pointer',
                   }}
                 >
                   {selectedMonth} <Calendar size={14} color="#573cfa" />
                 </button>

                 {isMonthDropdownOpen && (
                   <div style={{
                     position: 'absolute',
                     top: 'calc(100% + 6px)',
                     left: 0,
                     background: '#ffffff',
                     border: '1px solid rgba(0,0,0,0.08)',
                     borderRadius: '16px',
                     boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                     padding: '6px',
                     zIndex: 50,
                     minWidth: '170px',
                   }}>
                     {[
                       new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
                       'June 2024',
                       'May 2024',
                       'April 2024',
                       'March 2024'
                     ].map(m => (
                       <div
                         key={m}
                         onClick={() => {
                           setSelectedMonth(m);
                           setIsMonthDropdownOpen(false);
                         }}
                         style={{
                           padding: '8px 14px',
                           fontSize: '13px',
                           fontWeight: selectedMonth === m ? 700 : 500,
                           color: selectedMonth === m ? '#573cfa' : '#3f3f46',
                           background: selectedMonth === m ? '#e8e5ff' : 'transparent',
                           borderRadius: '10px',
                           cursor: 'pointer',
                           transition: 'all 0.15s',
                         }}
                       >
                         {m}
                       </div>
                     ))}
                   </div>
                 )}
               </div>

               {/* Subject Filter Dropdown */}
               <div style={{ position: 'relative' }}>
                 <button
                   onClick={() => {
                     setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
                     setIsMonthDropdownOpen(false);
                   }}
                   className="att-filter-btn"
                   style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px',
                     background: '#f4f4f5',
                     border: '1px solid rgba(0,0,0,0.08)',
                     borderRadius: '16px',
                     padding: '8px 16px',
                     fontSize: '13px',
                     fontWeight: 600,
                     color: '#18181b',
                     cursor: 'pointer',
                   }}
                 >
                   {selectedSubjectFilter} <ChevronDown size={14} color="#71717a" />
                 </button>

                 {isSubjectDropdownOpen && (
                   <div style={{
                     position: 'absolute',
                     top: 'calc(100% + 6px)',
                     left: 0,
                     background: '#ffffff',
                     border: '1px solid rgba(0,0,0,0.08)',
                     borderRadius: '16px',
                     boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                     padding: '6px',
                     zIndex: 50,
                     minWidth: '220px',
                   }}>
                     {[
                       'All Subjects',
                       ...Array.from(new Set(
                         data && data.length > 0
                           ? data.map(r => r.subjectName || `Subject ${r.subjectId}`)
                           : ['Operating Systems', 'Database Management Systems', 'Computer Networks', 'Software Engineering', 'Machine Learning']
                       ))
                     ].map(sub => (
                       <div
                         key={sub}
                         onClick={() => {
                           setSelectedSubjectFilter(sub);
                           setIsSubjectDropdownOpen(false);
                         }}
                         style={{
                           padding: '8px 14px',
                           fontSize: '13px',
                           fontWeight: selectedSubjectFilter === sub ? 700 : 500,
                           color: selectedSubjectFilter === sub ? '#573cfa' : '#3f3f46',
                           background: selectedSubjectFilter === sub ? '#e8e5ff' : 'transparent',
                           borderRadius: '10px',
                           cursor: 'pointer',
                           transition: 'all 0.15s',
                         }}
                       >
                         {sub}
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </div>

            {/* Download Report Button */}
            <button
              onClick={() => {
                const listToExport = (data && data.length > 0 ? data : [
                  { subjectName: 'Operating Systems', subjectCode: 'CS401', percentage: 94, present: 16, late: 0, absent: 1, totalClasses: 17 },
                  { subjectName: 'Database Management Systems', subjectCode: 'CS402', percentage: 88, present: 15, late: 0, absent: 2, totalClasses: 17 },
                  { subjectName: 'Computer Networks', subjectCode: 'CS403', percentage: 75, present: 12, late: 0, absent: 4, totalClasses: 16 },
                  { subjectName: 'Software Engineering', subjectCode: 'CS404', percentage: 93, present: 14, late: 0, absent: 1, totalClasses: 15 },
                  { subjectName: 'Machine Learning', subjectCode: 'CS405', percentage: 60, present: 6, late: 0, absent: 4, totalClasses: 10 },
                ]).filter(item => selectedSubjectFilter === 'All Subjects' || (item.subjectName || item.name) === selectedSubjectFilter);

                const headers = ["Subject Name", "Subject Code", "Attended", "Total Classes", "Attendance Percentage"];
                const rows = listToExport.map(s => [
                  `"${s.subjectName || `Subject ${s.subjectId}`}"`,
                  `"${s.subjectCode || 'CSXXX'}"`,
                  (s.present || 0) + (s.late || 0),
                  s.totalClasses || 0,
                  `"${s.percentage || 0}%"`
                ]);
                const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `Attendance_Report_${selectedMonth.replace(/\s+/g, '_')}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="att-download-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                border: '1.5px solid #573cfa',
                color: '#573cfa',
                borderRadius: '16px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
               <Download size={14} /> Download Report
            </button>
         </div>

         <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#573cfa', marginBottom: '16px' }}>Subject-wise Breakdown</h3>
         
         <div className="att-table-header">
            <div style={{ flex: 2 }}>SUBJECT</div>
            <div style={{ flex: 3, textAlign: 'center' }}>ATTENDANCE</div>
            <div style={{ flex: 1, textAlign: 'right', paddingRight: '40px' }}>LECTURES</div>
         </div>

         <div className="att-subject-list">
            {(() => {
              const displayList = (data && data.length > 0 ? data : [
                { subjectName: 'Operating Systems', subjectCode: 'CS401', percentage: 94, present: 16, late: 0, totalClasses: 17, Icon: Monitor, bg: 'bg-green' },
                { subjectName: 'Database Management Systems', subjectCode: 'CS402', percentage: 88, present: 15, late: 0, totalClasses: 17, Icon: Database, bg: 'bg-purple' },
                { subjectName: 'Computer Networks', subjectCode: 'CS403', percentage: 75, present: 12, late: 0, totalClasses: 16, Icon: Network, bg: 'bg-orange' },
                { subjectName: 'Software Engineering', subjectCode: 'CS404', percentage: 93, present: 14, late: 0, totalClasses: 15, Icon: Code, bg: 'bg-blue' },
                { subjectName: 'Machine Learning', subjectCode: 'CS405', percentage: 60, present: 6, late: 0, totalClasses: 10, Icon: BrainCircuit, bg: 'bg-red' },
              ]).filter(item => selectedSubjectFilter === 'All Subjects' || (item.subjectName || item.name) === selectedSubjectFilter);

              if (displayList.length === 0) {
                return (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#71717a', fontSize: '13px' }}>
                    No subjects found for "{selectedSubjectFilter}".
                  </div>
                );
              }

              return displayList.map((r, i) => {
                const IconComponent = r.Icon || (i % 5 === 0 ? Monitor : i % 5 === 1 ? Database : i % 5 === 2 ? Network : i % 5 === 3 ? Code : BrainCircuit);
                const iconBg = r.bg || (i % 5 === 0 ? 'bg-green' : i % 5 === 1 ? 'bg-purple' : i % 5 === 2 ? 'bg-orange' : i % 5 === 3 ? 'bg-blue' : 'bg-red');

                return (
                  <div key={i} className="att-subject-row">
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div className={`att-subject-icon ${iconBg}`}><IconComponent size={16} /></div>
                       <div>
                          <div className="att-subject-name">{r.subjectName || `Subject ${r.subjectId}`}</div>
                          <div className="att-subject-code">{r.subjectCode || 'CSXXX'}</div>
                       </div>
                    </div>
                    <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '16px' }}>
                       <div className="att-progress-bg">
                          <div className="att-progress-fill" style={{ width: `${r.percentage}%`, background: r.percentage >= 75 ? '#10b981' : r.percentage >= 60 ? '#f59e0b' : '#ef4444' }}></div>
                       </div>
                       <div style={{ width: '40px', fontSize: '13px', fontWeight: 700, color: r.percentage >= 75 ? '#10b981' : r.percentage >= 60 ? '#f59e0b' : '#ef4444' }}>{r.percentage}%</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', color: '#6b7280', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
                       {(r.present || 0) + (r.late || 0)} / {r.totalClasses}
                       <ArrowRight size={14} color="#9ca3af" />
                    </div>
                  </div>
                );
              });
            })()}
         </div>
      </div>

      {/* 3. 2-Column Grid: Engagement Rate Graph | Recent Missed Lectures (50-50 split) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px', alignItems: 'stretch' }}>
        <AttendanceGraphCard data={data} />

        {/* Recent Missed Lectures Card */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid rgba(0,0,0,0.06)',
          borderRadius: '28px',
          padding: '28px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XCircle size={20} color="#ef4444" strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#09090b', margin: 0, letterSpacing: '-0.3px' }}>
                Recent Missed Lectures
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: '#573cfa', fontWeight: 700, cursor: 'pointer', background: '#e8e5ff', padding: '5px 14px', borderRadius: '16px' }}>
              View all
            </span>
          </div>

          {/* Missed Lectures List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '14px 16px', background: '#f4f4f5', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={18} color="#ef4444" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b' }}>Machine Learning</div>
                <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>Jul 15, 2024 • 10:00 AM</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                Absent
              </span>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '14px 16px', background: '#f4f4f5', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={18} color="#f59e0b" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b' }}>Computer Networks</div>
                <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>Jul 12, 2024 • 02:00 PM</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                Late
              </span>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '14px 16px', background: '#f4f4f5', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={18} color="#ef4444" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b' }}>Database Systems</div>
                <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>Jul 08, 2024 • 11:00 AM</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                Absent
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
