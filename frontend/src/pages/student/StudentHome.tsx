import React, { useEffect, useState } from 'react';
import { useAuthStore } from "../../store/authStore";
import { apiClient as api } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  Check, TrendingUp, Play, MonitorPlay, 
  User, IdCard, CheckCircle2, Calendar, 
  BarChart2, Book, Megaphone, Layers, Briefcase, ArrowUpRight,
  CheckCircle, FileText, Activity, ChevronLeft, ChevronRight, Clock, Monitor, Database, Network, Brain
} from "lucide-react";
import { motion } from "framer-motion";
import TextType from "../../components/TextType";

/* ── Interactive Real-Time Calendar Component with Circular Badges & Surprising UX ── */
function InteractiveCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Mock events mapping for surprising UX
  const eventsMap: Record<number, { title: string; type: 'class' | 'deadline' | 'quiz' }> = {
    10: { title: "DBMS Assignment Submission", type: "deadline" },
    12: { title: "Operating Systems Quiz", type: "quiz" },
    15: { title: "CN Lab Record Submission", type: "deadline" },
    20: { title: "Software Engineering Project", type: "class" },
    30: { title: "3 Active Classes Today (OS, CN, SE)", type: "class" },
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDay(now.getDate());
  };

  // Calendar math (Monday start)
  const firstDayRaw = new Date(year, month, 1).getDay();
  const firstDayIndex = (firstDayRaw + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const isCurrentMonthToday = today.getMonth() === month && today.getFullYear() === year;

  // Build grid items
  const calendarCells = [];

  // 1. Previous month days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const itIsToday = isCurrentMonthToday && today.getDate() === d;
    const itIsSelected = selectedDay === d;
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      isToday: itIsToday,
      isSelected: itIsSelected,
      event: eventsMap[d],
    });
  }

  // 3. Next month days padding to 35 or 42
  const totalGridCells = calendarCells.length <= 35 ? 35 : 42;
  const nextDaysNeeded = totalGridCells - calendarCells.length;
  for (let n = 1; n <= nextDaysNeeded; n++) {
    calendarCells.push({
      day: n,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    });
  }

  const selectedEvent = selectedDay ? eventsMap[selectedDay] : null;

  return (
    <div className="calendar-widget" style={{ width: '100%' }}>
      {/* Dynamic Header with Live Month/Year & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h4 style={{ fontSize: 18, fontWeight: 700, color: '#09090b', letterSpacing: '-0.3px', margin: 0 }}>
            {monthNames[month]} {year}
          </h4>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: 12 }}>
            🔥 Live
          </span>
          {(!isCurrentMonthToday || selectedDay !== today.getDate()) && (
            <button
              onClick={jumpToToday}
              style={{
                fontSize: 11, fontWeight: 600, color: '#573cfa', background: 'rgba(87, 60, 250, 0.08)',
                border: 'none', borderRadius: 12, padding: '3px 10px', cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Today
            </button>
          )}
        </div>
        
        {/* Month Prev / Next buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={prevMonth}
            title="Previous Month"
            style={{
              width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)',
              background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#18181b', transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f4f4f5')}
            onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            title="Next Month"
            style={{
              width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)',
              background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#18181b', transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f4f4f5')}
            onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Circular Day Grid */}
      <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, textAlign: 'center' }}>
        {daysOfWeek.map(day => (
          <div key={day} style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', paddingBottom: 6 }}>
            {day}
          </div>
        ))}
        {calendarCells.map((cell, idx) => {
          let bg = 'transparent';
          let textColor = cell.isCurrentMonth ? '#1f2937' : '#d1d5db';
          let fontWeight: number | string = 500;
          let border = 'none';
          let boxShadow = 'none';

          if (cell.isToday) {
            bg = 'linear-gradient(135deg, #573cfa 0%, #7c3aed 100%)';
            textColor = '#ffffff';
            fontWeight = 700;
            boxShadow = '0 4px 14px rgba(87, 60, 250, 0.45)';
          } else if (cell.isSelected && cell.isCurrentMonth) {
            bg = 'rgba(87, 60, 250, 0.12)';
            textColor = '#573cfa';
            fontWeight = 700;
            border = '2px solid #573cfa';
          }

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 44,
              }}
            >
              <motion.div
                whileHover={cell.isCurrentMonth ? { scale: 1.15 } : {}}
                whileTap={cell.isCurrentMonth ? { scale: 0.95 } : {}}
                onClick={() => {
                  if (cell.isCurrentMonth) {
                    setSelectedDay(cell.day);
                  }
                }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%', // 🌟 PERFECT CIRCULAR BADGE!
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight,
                  color: textColor,
                  background: bg,
                  border,
                  boxShadow,
                  cursor: cell.isCurrentMonth ? 'pointer' : 'default',
                  transition: 'background 0.15s, border 0.15s, color 0.15s',
                  position: 'relative',
                }}
              >
                {cell.day}
                {/* Event Dot Indicator */}
                {cell.event && cell.isCurrentMonth && !cell.isToday && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 3,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: cell.event.type === 'deadline' ? '#ef4444' : cell.event.type === 'quiz' ? '#f59e0b' : '#10b981',
                    }}
                  />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* 🌟 SURPRISE UI/UX: Floating Selected Day Event Pill */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: 18,
            padding: '12px 16px',
            borderRadius: 18,
            background: selectedEvent ? 'rgba(87, 60, 250, 0.06)' : '#f4f4f5',
            border: selectedEvent ? '1px solid rgba(87, 60, 250, 0.15)' : '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: selectedEvent ? '#573cfa' : '#e4e4e7',
                color: selectedEvent ? '#ffffff' : '#71717a',
                fontSize: 12, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {selectedDay}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#18181b' }}>
                {selectedEvent ? selectedEvent.title : `${monthNames[month]} ${selectedDay}, ${year}`}
              </div>
              <div style={{ fontSize: 11, color: '#71717a' }}>
                {selectedEvent ? (
                  selectedEvent.type === 'deadline' ? '⚠️ High Priority Deadline' :
                  selectedEvent.type === 'quiz' ? '✏️ Scheduled Exam Quiz' : '📚 Live Classes Scheduled'
                ) : (
                  '✨ No pending deadlines — All caught up!'
                )}
              </div>
            </div>
          </div>
          {selectedEvent && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#573cfa', background: '#ffffff', padding: '4px 10px', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              Details
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ── Real-Time Single Box Current Class Component ──
function CurrentClassCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const schedule = [
    { name: 'Operating Systems', code: 'CS701', room: 'Room 301', prof: 'Dr. Mehul Shah', startH: 9, startM: 0, endH: 10, endM: 30, icon: Monitor, color: '#573cfa', bg: '#f0f3ff' },
    { name: 'Database Management Systems', code: 'CS702', room: 'Lab 2', prof: 'Prof. Kinjal Patel', startH: 10, startM: 45, endH: 12, endM: 15, icon: Database, color: '#10b981', bg: '#e8f5e9' },
    { name: 'Computer Networks', code: 'CS703', room: 'Room 302', prof: 'Prof. Jigar Sheth', startH: 13, startM: 30, endH: 15, endM: 0, icon: Network, color: '#f59e0b', bg: '#fffbeb' },
    { name: 'Machine Learning', code: 'CS705', room: 'Room 204', prof: 'Prof. Rutvik Shah', startH: 15, startM: 15, endH: 16, endM: 45, icon: Brain, color: '#ec4899', bg: '#fdf2f8' },
  ];

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let activeClass = schedule.find(c => {
    const start = c.startH * 60 + c.startM;
    const end = c.endH * 60 + c.endM;
    return currentMinutes >= start && currentMinutes < end;
  });

  let statusText = 'ONGOING LECTURE';
  let isLive = true;

  if (!activeClass) {
    activeClass = schedule.find(c => (c.startH * 60 + c.startM) > currentMinutes);
    if (activeClass) {
      statusText = 'NEXT CLASS';
      isLive = false;
    } else {
      activeClass = schedule[0];
      statusText = 'CLASSES COMPLETED FOR TODAY';
      isLive = false;
    }
  }

  const startTotal = activeClass.startH * 60 + activeClass.startM;
  const endTotal = activeClass.endH * 60 + activeClass.endM;
  const duration = endTotal - startTotal;
  const elapsed = Math.max(0, Math.min(duration, currentMinutes - startTotal));
  const progressPct = isLive ? Math.round((elapsed / duration) * 100) : 100;

  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const IconComp = activeClass.icon;

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid rgba(0,0,0,0.06)',
      borderRadius: '28px',
      padding: '26px 30px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
      width: '100%',
    }}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: isLive ? '#ef4444' : '#10b981',
            boxShadow: isLive ? '0 0 10px #ef4444' : '0 0 10px #10b981',
          }} />
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: isLive ? '#ef4444' : '#10b981',
            letterSpacing: '0.5px',
          }}>
            {statusText}
          </span>
        </div>

        <div style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#52525b',
          background: '#f4f4f5',
          padding: '6px 14px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Clock size={14} color="#573cfa" />
          {formattedTime}
        </div>
      </div>

      {/* Main Subject Content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '18px',
          background: activeClass.bg,
          color: activeClass.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        }}>
          <IconComp size={28} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.4px', marginBottom: '4px' }}>
            {activeClass.name}
          </div>
          <div style={{ fontSize: '13px', color: '#71717a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>{activeClass.prof}</span>
            <span>•</span>
            <span style={{ color: '#573cfa', fontWeight: 700 }}>{activeClass.room}</span>
          </div>
        </div>
      </div>

      {/* Time & Progress Bar Row */}
      <div style={{ background: '#f4f4f5', borderRadius: '18px', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#18181b' }}>
            {String(activeClass.startH).padStart(2, '0')}:{String(activeClass.startM).padStart(2, '0')} {activeClass.startH >= 12 ? 'PM' : 'AM'} - {String(activeClass.endH).padStart(2, '0')}:{String(activeClass.endM).padStart(2, '0')} {activeClass.endH >= 12 ? 'PM' : 'AM'}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: isLive ? '#573cfa' : '#10b981' }}>
            {isLive ? `${progressPct}% Elapsed` : 'Scheduled'}
          </span>
        </div>

        <div style={{ width: '100%', height: '6px', background: '#e4e4e7', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: isLive ? `${progressPct}%` : '100%',
            height: '100%',
            background: isLive ? 'linear-gradient(90deg, #573cfa, #6366f1)' : '#10b981',
            borderRadius: '4px',
            transition: 'width 1s linear',
          }} />
        </div>
      </div>
    </div>
  );
}

export function StudentHome() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>(user?.full_name || '');
  const [dashData, setDashData] = useState<{
    enrollment_number: string;
    attendance_rate: number;
    total_classes: number;
    present_classes: number;
    cgpa: number;
  }>({
    enrollment_number: 'ENR20260481',
    attendance_rate: 87,
    total_classes: 0,
    present_classes: 0,
    cgpa: 8.4,
  });

  useEffect(() => {
    if (user?.full_name) {
      setUserName(user.full_name);
    } else {
      api.get('/student-dash/profile')
        .then(res => {
          const name = res.data?.full_name;
          if (name) {
            setUserName(name);
            if (user) {
              setUser({ ...user, full_name: name, email: res.data.email || user.email });
            }
          }
        })
        .catch(() => {});
    }

    // Fetch real-time KPI data
    api.get('/student-dash/dashboard')
      .then(res => {
        if (res.data) {
          setDashData({
            enrollment_number: res.data.enrollment_number || 'ENR20260481',
            attendance_rate: res.data.attendance_rate ?? 87,
            total_classes: res.data.total_classes ?? 0,
            present_classes: res.data.present_classes ?? 0,
            cgpa: res.data.cgpa ?? 8.4,
          });
        }
      })
      .catch(() => {});
  }, [user, setUser]);

  const displayName = userName || user?.full_name || 'Student';

  return (
    <div className="premium-dashboard">
      {/* ── Welcome Header with TextType Animation ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#09090b', letterSpacing: '-0.8px', margin: 0, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span>Welcome back,</span>
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
              key={displayName}
              text={[`${displayName}!`, "Happy learning!", "Ready for your classes?"]}
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
      </motion.div>

      {/* ── Real-Time KPI Cards Row (AutoML Studio design) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 36 }}
      >
        {/* Card 1 — Enrollment Number */}
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
                <IdCard size={16} color="#18181b" strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#52525b' }}>Enrollment Number</span>
            </div>
            <div
              onClick={() => navigate('/dashboard/idcard')}
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 28 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: 8, wordBreak: 'break-all' }}>
              {dashData.enrollment_number || 'ENR20260481'}
            </div>
            <div style={{ fontSize: 12, color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Active</span> · Verified Student ID
            </div>
          </div>
        </motion.div>

        {/* Card 2 — Attendance */}
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
            <div
              onClick={() => navigate('/dashboard/attendance')}
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 28 }}>
            <div style={{ fontSize: 52, fontWeight: 600, color: '#09090b', letterSpacing: '-2px', lineHeight: 1, marginBottom: 8 }}>
              {dashData.attendance_rate}%
            </div>
            <div style={{ fontSize: 12, color: '#71717a', fontWeight: 500 }}>
              {dashData.total_classes > 0 ? (
                <span><span style={{ color: '#10b981', fontWeight: 600 }}>{dashData.present_classes}/{dashData.total_classes}</span> classes attended</span>
              ) : (
                <span><span style={{ color: '#10b981', fontWeight: 600 }}>+3.2%</span> from last month</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Card 3 — CGPA (Neon accent) */}
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
                <FileText size={16} color="#09090b" strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(0,0,0,0.75)' }}>CGPA</span>
            </div>
            <div
              onClick={() => navigate('/dashboard/results')}
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
            >
              <ArrowUpRight size={15} color="#ffffff" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 28 }}>
            <div style={{ fontSize: 52, fontWeight: 600, color: '#09090b', letterSpacing: '-2px', lineHeight: 1, marginBottom: 8 }}>
              {dashData.cgpa}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', fontWeight: 500 }}>
              <span style={{ fontWeight: 600 }}>+0.3</span> from last semester
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Quick Access Row (Full Width spanning 100% below KPI Cards) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ marginBottom: 36 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#09090b', letterSpacing: '-0.3px', margin: 0 }}>
            Quick Access
          </h3>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#71717a' }}>Direct Shortcuts</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, width: '100%' }}>
          {[
            { label: 'My Profile', icon: <User size={22} color="#6366f1" />, bg: 'rgba(99, 102, 241, 0.08)', path: '/dashboard/profile' },
            { label: 'ID Card', icon: <IdCard size={22} color="#3b82f6" />, bg: 'rgba(59, 130, 246, 0.08)', path: '/dashboard/idcard' },
            { label: 'Attendance', icon: <CheckCircle2 size={22} color="#10b981" />, bg: 'rgba(16, 185, 129, 0.08)', path: '/dashboard/attendance' },
            { label: 'Timetable', icon: <Calendar size={22} color="#f59e0b" />, bg: 'rgba(245, 158, 11, 0.08)', path: '/dashboard/timetable' },
            { label: 'Results', icon: <BarChart2 size={22} color="#ef4444" />, bg: 'rgba(239, 68, 68, 0.08)', path: '/dashboard/results' },
            { label: 'Subjects', icon: <Book size={22} color="#8b5cf6" />, bg: 'rgba(139, 92, 246, 0.08)', path: '/dashboard/subjects' },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              style={{
                background: '#f4f4f5',
                border: '1.5px solid rgba(0,0,0,0.06)',
                borderRadius: 22,
                padding: '20px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#18181b', textAlign: 'center' }}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="dash-grid-main">
        {/* LEFT COLUMN */}
        <div className="dash-col-left">

          {/* Today's Ongoing Class Single Box */}
          <CurrentClassCard />
        </div>

        {/* RIGHT COLUMN */}
        <div className="dash-col-right">
          {/* Lesson Schedule with Real-Time Interactive Calendar */}
          <div className="dash-panel">
            <div className="section-header" style={{ marginBottom: 12 }}>
              <h3>Lesson schedule</h3>
            </div>
            <InteractiveCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}