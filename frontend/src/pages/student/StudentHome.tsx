ximport React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from "../../store/authStore";
import { apiClient as api } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Check, TrendingUp, Play, MonitorPlay,
  User, IdCard, CheckCircle2, Calendar,
  BarChart2, Book, Megaphone, Layers, Briefcase, ArrowUpRight,
  CheckCircle, FileText, Activity, ChevronLeft, ChevronRight, Clock, Monitor, Database, Network, Brain, Code2, Utensils, BookOpen, AlertCircle, RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import TextType from "../../components/TextType";
import { TimetableAttendanceService } from "../../services/timetableAttendanceService";

/* ── Interactive Real-Time Calendar Component with Circular Badges & Surprising UX ── */
/* ── Interactive Real-Time Calendar Component with Live Database Assignments ── */
interface CalendarAssignment {
  id: number;
  title: string;
  subject_id: number;
  subject_code: string;
  subject_name: string;
  assignment_type: string;
  faculty_name: string;
  faculty_id?: number;
  semester?: number;
  assigned_on: string;
  due_date: string;
  due_date_raw: string; // "YYYY-MM-DD"
  due_time: string;
  max_marks: number;
  description: string;
  status: 'PENDING' | 'SUBMITTED' | 'OVERDUE' | 'GRADED' | string;
}

function InteractiveCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [assignments, setAssignments] = useState<CalendarAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const fetchAssignments = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await api.get('/assignments/student');
      setAssignments(res.data || []);
    } catch (err) {
      console.error('Failed to load real-time assignments for schedule:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();

    // Auto-refresh when tab gains focus or on a 25-second poll
    const onFocus = () => fetchAssignments();
    window.addEventListener('focus', onFocus);
    const interval = setInterval(() => fetchAssignments(), 25000);
    return () => {
      window.removeEventListener('focus', onFocus);
      clearInterval(interval);
    };
  }, [fetchAssignments]);

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
      assignments: [] as CalendarAssignment[],
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const itIsToday = isCurrentMonthToday && today.getDate() === d;
    const itIsSelected = selectedDay === d;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayAsgs = assignments.filter(a => a.due_date_raw === dateStr);

    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      isToday: itIsToday,
      isSelected: itIsSelected,
      dateStr,
      assignments: dayAsgs,
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
      assignments: [] as CalendarAssignment[],
    });
  }

  // Selected date matching
  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : '';
  const selectedDayAssignments = selectedDay
    ? assignments.filter(a => a.due_date_raw === selectedDateStr)
    : [];

  // Next upcoming pending assignments across the database
  const upcomingAssignments = assignments
    .filter(a => a.status === 'PENDING' || a.status === 'OVERDUE')
    .sort((a, b) => a.due_date_raw.localeCompare(b.due_date_raw));

  return (
    <div className="calendar-widget" style={{ width: '100%' }}>
      {/* Dynamic Header with Live Month/Year & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <h4 style={{ fontSize: 17, fontWeight: 700, color: '#09090b', letterSpacing: '-0.3px', margin: 0 }}>
            {monthNames[month]} {year}
          </h4>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 7px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            Live DB
          </span>
          <button
            onClick={() => fetchAssignments(true)}
            disabled={refreshing}
            title="Refresh database deadlines"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 2,
              color: '#71717a', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          </button>
          {(!isCurrentMonthToday || selectedDay !== today.getDate()) && (
            <button
              onClick={jumpToToday}
              style={{
                fontSize: 11, fontWeight: 600, color: '#282B4A', background: 'rgba(40, 43, 74, 0.08)',
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
              width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)',
              background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#18181b', transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f4f4f5')}
            onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={nextMonth}
            title="Next Month"
            style={{
              width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)',
              background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#18181b', transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f4f4f5')}
            onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Calendar Circular Day Grid */}
      <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center' }}>
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

          const hasAssignments = cell.assignments && cell.assignments.length > 0;
          const hasPending = hasAssignments && cell.assignments.some(a => a.status === 'PENDING' || a.status === 'OVERDUE');
          const isAllDone = hasAssignments && !hasPending;

          if (cell.isToday) {
            bg = 'linear-gradient(135deg, #282B4A 0%, #3a3e68 100%)';
            textColor = '#EEEBDA';
            fontWeight = 700;
            boxShadow = '0 4px 14px rgba(40, 43, 74, 0.35)';
          } else if (cell.isSelected && cell.isCurrentMonth) {
            bg = 'rgba(40, 43, 74, 0.12)';
            textColor = '#282B4A';
            fontWeight = 700;
            border = '2px solid #282B4A';
          }

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 42,
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
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
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
                {/* Real-Time Database Event Dot Indicator */}
                {hasAssignments && cell.isCurrentMonth && !cell.isToday && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 3,
                      display: 'flex',
                      gap: 2,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: hasPending ? '#ef4444' : '#10b981',
                        boxShadow: hasPending ? '0 0 4px rgba(239, 68, 68, 0.6)' : 'none'
                      }}
                    />
                    {cell.assignments.length > 1 && (
                      <div
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: '#f59e0b'
                        }}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* ── Real-Time Database Deadline Display Section ── */}
      {selectedDay && (
        <div style={{ marginTop: 16 }}>
          {selectedDayAssignments.length > 0 ? (
            /* Specific Deadlines Due on Selected Date */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Deadlines on {monthNames[month]} {selectedDay}, {year}:</span>
                <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>
                  {selectedDayAssignments.length} assignment{selectedDayAssignments.length > 1 ? 's' : ''}
                </span>
              </div>
              {selectedDayAssignments.map(asg => {
                const isPending = asg.status === 'PENDING';
                const isSubmitted = asg.status === 'SUBMITTED' || asg.status === 'GRADED';
                const isOverdue = asg.status === 'OVERDUE';

                return (
                  <motion.div
                    key={asg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 14,
                      background: isPending ? 'rgba(239, 68, 68, 0.04)' : isSubmitted ? 'rgba(16, 185, 129, 0.05)' : 'rgba(40, 43, 74, 0.05)',
                      border: isPending ? '1.5px solid rgba(239, 68, 68, 0.2)' : isSubmitted ? '1.5px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#282B4A', background: 'rgba(40, 43, 74, 0.1)', padding: '2px 8px', borderRadius: 8 }}>
                            {asg.subject_name} ({asg.subject_code})
                          </span>
                          <span
                            style={{
                              fontSize: 10, fontWeight: 700,
                              color: isPending ? '#dc2626' : isSubmitted ? '#059669' : '#d97706',
                              background: isPending ? '#fee2e2' : isSubmitted ? '#ecfdf5' : '#fef3c7',
                              padding: '2px 8px', borderRadius: 8
                            }}
                          >
                            {isPending ? '⚠️ Pending Due' : isSubmitted ? '✅ Submitted' : '⏰ Overdue'}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#18181b', lineHeight: 1.3 }}>
                          {asg.title}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate('/dashboard/assignments')}
                        style={{
                          fontSize: 11, fontWeight: 700, color: '#282B4A', background: '#ffffff',
                          border: '1px solid rgba(40,43,74,0.15)', padding: '5px 10px', borderRadius: 10,
                          cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          display: 'flex', alignItems: 'center', gap: 4
                        }}
                      >
                        <span>{isSubmitted ? 'View' : 'Submit'}</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#71717a', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: '#3f3f46' }}>
                        👩‍🏫 {asg.faculty_name}
                      </span>
                      <span>⏰ Due {asg.due_time || '23:59'}</span>
                      <span>🎯 {asg.max_marks} Marks</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* No Deadlines on Selected Date - Show Date Status + Real Upcoming Deadlines */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: '#e2e8f0', color: '#475569',
                    fontSize: 12, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {selectedDay}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{monthNames[month]} {selectedDay}, {year}</span>
                  <div>No deadlines due on this day</div>
                </div>
              </div>

              {/* Real Upcoming Deadlines Feed */}
              {upcomingAssignments.length > 0 ? (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: 'rgba(40, 43, 74, 0.04)',
                    border: '1px dashed rgba(40, 43, 74, 0.18)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#282B4A', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      📌 Next Upcoming Deadline
                    </span>
                    <button
                      onClick={() => navigate('/dashboard/assignments')}
                      style={{ fontSize: 11, fontWeight: 700, color: '#282B4A', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}
                    >
                      <span>All</span>
                      <ArrowUpRight size={11} />
                    </button>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: '#18181b', marginBottom: 3 }}>
                    {upcomingAssignments[0].title}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: '#282B4A' }}>{upcomingAssignments[0].subject_name}</span>
                    <span>•</span>
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>Due: {upcomingAssignments[0].due_date} ({upcomingAssignments[0].due_time || '23:59'})</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#71717a', marginTop: 4 }}>
                    Uploaded by: {upcomingAssignments[0].faculty_name}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px', fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                  ✨ No pending deadlines — All caught up!
                </div>
              )}
            </div>
          )}
        </div>
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
    { name: 'Software Group Project', code: 'CS01', room: 'Room 301', prof: 'Parth Nirmal', startH: 9, startM: 0, endH: 10, endM: 0, icon: Monitor, color: '#282B4A', bg: 'rgba(40, 43, 74, 0.08)' },
    { name: 'Machine Learning', code: 'CS02', room: 'Lab 2', prof: 'Babita Patel', startH: 10, startM: 0, endH: 11, endM: 0, icon: Brain, color: '#10b981', bg: '#e8f5e9' },
    { name: 'NLP', code: 'CS03', room: 'Room 302', prof: 'Ashwin Patni', startH: 11, startM: 0, endH: 12, endM: 0, icon: Network, color: '#f59e0b', bg: '#fffbeb' },
    { name: 'Cloud Computing', code: 'CS04', room: 'Room 204', prof: 'Vrushali', startH: 12, startM: 0, endH: 13, endM: 0, icon: Database, color: '#3b82f6', bg: '#eff6ff' },
    { name: 'Lunch Break 🍱', code: 'LUNCH', room: 'Cafeteria', prof: 'Rest & Refreshment', startH: 13, startM: 0, endH: 14, endM: 0, icon: Clock, color: '#ec4899', bg: '#fdf2f8', isLunch: true },
    { name: 'Flat', code: 'CS05', room: 'Room 105', prof: 'Dipali Jeetya', startH: 14, startM: 0, endH: 15, endM: 0, icon: Code2, color: '#8b5cf6', bg: '#f3e8ff' },
    { name: 'Software Project Lab', code: 'CS01-L', room: 'Lab 3', prof: 'Parth Nirmal', startH: 15, startM: 0, endH: 16, endM: 0, icon: Monitor, color: '#282B4A', bg: 'rgba(40, 43, 74, 0.08)' },
  ];

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let activeClass = schedule.find(c => {
    const start = c.startH * 60 + c.startM;
    const end = c.endH * 60 + c.endM;
    return currentMinutes >= start && currentMinutes < end;
  });

  let statusText = 'ONGOING LECTURE';
  let isLive = true;

  if (activeClass && activeClass.isLunch) {
    statusText = 'LUNCH BREAK 🍱';
  } else if (!activeClass) {
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
  const IconComp = activeClass.icon || Monitor;

  if (statusText === 'CLASSES COMPLETED FOR TODAY') {
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
              background: '#282B4A',
              boxShadow: '0 0 10px rgba(40, 43, 74, 0.5)',
            }} />
            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#282B4A',
              letterSpacing: '0.5px',
            }}>
              CLASSES COMPLETED FOR TODAY
            </span>
          </div>

          <div style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#282B4A',
            background: '#f4f4f5',
            padding: '6px 14px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Clock size={14} color="#282B4A" />
            {formattedTime}
          </div>
        </div>

        {/* Main Subject Content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: 'rgba(40, 43, 74, 0.08)',
            color: '#282B4A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(40, 43, 74, 0.1)',
          }}>
            <CheckCircle2 size={28} color="#282B4A" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#282B4A', letterSpacing: '-0.4px', marginBottom: '4px' }}>
              All 6 Lectures Completed
            </div>
            <div style={{ fontSize: '13px', color: '#71717a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>7th Semester</span>
              <span>•</span>
              <span style={{ color: '#282B4A', fontWeight: 700 }}>5 Active DB Subjects</span>
            </div>
          </div>
        </div>

        {/* Time & Progress Bar Row */}
        <div style={{ background: '#f4f4f5', borderRadius: '18px', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#18181b' }}>
              09:00 AM - 04:00 PM (Full Day)
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#282B4A' }}>
              100% Completed
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: '#e4e4e7', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #282B4A, #353960)',
              borderRadius: '4px',
            }} />
          </div>
        </div>
      </div>
    );
  }

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
          <Clock size={14} color="#282B4A" />
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
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#282B4A', letterSpacing: '-0.4px', marginBottom: '4px' }}>
            {activeClass.name}
          </div>
          <div style={{ fontSize: '13px', color: '#71717a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>{activeClass.prof}</span>
            <span>•</span>
            <span style={{ color: '#282B4A', fontWeight: 700 }}>{activeClass.room}</span>
          </div>
        </div>
      </div>

      {/* Time & Progress Bar Row */}
      <div style={{ background: '#f4f4f5', borderRadius: '18px', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#18181b' }}>
            {String(activeClass.startH).padStart(2, '0')}:{String(activeClass.startM).padStart(2, '0')} {activeClass.startH >= 12 ? 'PM' : 'AM'} - {String(activeClass.endH).padStart(2, '0')}:{String(activeClass.endM).padStart(2, '0')} {activeClass.endH >= 12 ? 'PM' : 'AM'}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: isLive ? '#282B4A' : '#10b981' }}>
            {isLive ? `${progressPct}% Elapsed` : 'Scheduled'}
          </span>
        </div>

        <div style={{ width: '100%', height: '6px', background: '#e4e4e7', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: isLive ? `${progressPct}%` : '100%',
            height: '100%',
            background: isLive ? 'linear-gradient(90deg, #282B4A, #3a3e68)' : '#10b981',
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
    attendance_rate: 0,
    total_classes: 0,
    present_classes: 0,
    cgpa: 8.4,
  });

  const [complaintStats, setComplaintStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 });
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);

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
        .catch(() => { });
    }

    // Fetch real-time KPI data from backend APIs
    Promise.all([
      api.get('/student-dash/dashboard').catch(() => null),
      api.get('/student-dash/attendance').catch(() => null),
    ]).then(([dashRes, attRes]) => {
      const dash = dashRes?.data || {};
      const att = attRes?.data;

      const attRate = att?.overallPercentage ?? dash.attendance_rate ?? 0;
      const totalCls = att?.totalDelivered ?? dash.total_classes ?? 0;
      const presentCls = att?.totalAttended ?? dash.present_classes ?? 0;
      const realCgpa = typeof dash.cgpa === 'number' ? dash.cgpa : 8.4;

      setDashData({
        enrollment_number: dash.enrollment_number || 'ENR20260481',
        attendance_rate: attRate,
        total_classes: totalCls,
        present_classes: presentCls,
        cgpa: realCgpa,
      });
    });

    // Fetch real-time student complaints
    api.get('/complaints/kpi')
      .then(res => {
        if (res.data) setComplaintStats(res.data);
      })
      .catch(() => { });

    api.get('/complaints/my')
      .then(res => {
        if (res.data) setRecentComplaints(res.data.slice(0, 4));
      })
      .catch(() => { });
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
            background: 'linear-gradient(135deg, #282B4A 0%, #3a3e68 100%)',
            color: '#EEEBDA',
            padding: '4px 18px',
            borderRadius: '14px',
            boxShadow: '0 4px 20px rgba(40, 43, 74, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: 1.2,
            border: '1px solid rgba(238, 235, 218, 0.2)',
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
              style={{ color: '#EEEBDA' }}
            />
          </span>
        </h1>
      </motion.div>

      {/* ── Real-Time KPI Cards Row (AutoML Studio design matching Main Dashboard) ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 36 }}
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
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(40,43,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(40,43,74,0.08)' }}>
                <IdCard size={16} color="#282B4A" strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#52525b' }}>Enrollment Number</span>
            </div>
            <div
              onClick={() => navigate('/dashboard/idcard')}
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 28 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#09090b', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: 8, wordBreak: 'break-all' }}>
              {dashData.enrollment_number || 'ENR20260481'}
            </div>
            <div style={{ fontSize: 12, color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#282B4A', fontWeight: 700 }}>Active</span> · Verified Student ID
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
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(40,43,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(40,43,74,0.08)' }}>
                <CheckCircle size={16} color="#282B4A" strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#52525b' }}>Attendance</span>
            </div>
            <div
              onClick={() => navigate('/dashboard/attendance')}
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 28 }}>
            <div style={{ fontSize: 44, fontWeight: 600, color: '#09090b', letterSpacing: '-2px', lineHeight: 1, marginBottom: 8 }}>
              {dashData.attendance_rate}%
            </div>
            <div style={{ fontSize: 12, color: '#71717a', fontWeight: 500 }}>
              {dashData.total_classes > 0 ? (
                <span><span style={{ color: '#282B4A', fontWeight: 700 }}>{dashData.present_classes}/{dashData.total_classes}</span> classes attended</span>
              ) : (
                <span><span style={{ color: '#282B4A', fontWeight: 700 }}>+3.2%</span> overall rate</span>
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
            <div style={{ fontSize: 44, fontWeight: 600, color: '#09090b', letterSpacing: '-2px', lineHeight: 1, marginBottom: 8 }}>
              {dashData.cgpa}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', fontWeight: 500 }}>
              <span style={{ fontWeight: 600 }}>Cumulative</span> Grade Point
            </div>
          </div>
        </motion.div>

        {/* Card 4 — Complaints & Support KPI Card */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          style={{
            background: '#ffffff',
            border: '1.5px solid rgba(87,60,250,0.15)',
            borderRadius: 28,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 200,
            boxShadow: '0 4px 20px rgba(40, 43, 74, 0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(40, 43, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Megaphone size={18} color="#282B4A" strokeWidth={2} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#18181b' }}>Complaints & Support</span>
            </div>
            <div
              onClick={() => navigate('/dashboard/complaints')}
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#282B4A', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(40, 43, 74, 0.25)' }}
            >
              <ArrowUpRight size={15} color="#EEEBDA" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: '#282B4A', letterSpacing: '-1.5px', lineHeight: 1, marginBottom: 6 }}>
              {complaintStats.total}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#71717a', fontWeight: 500 }}>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>{complaintStats.open + complaintStats.in_progress} Active</span> · {complaintStats.resolved} Resolved
              </span>
              <button
                onClick={() => navigate('/dashboard/complaints')}
                style={{ background: 'rgba(40, 43, 74, 0.08)', color: '#282B4A', border: 'none', borderRadius: '10px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
              >
                + Complain
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Quick Access Row (7 direct shortcuts) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ marginBottom: 36 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#282B4A', letterSpacing: '-0.3px', margin: 0 }}>
            Quick Access
          </h3>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#71717a' }}>Direct Shortcuts</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 14, width: '100%' }}>
          {[
            { label: 'My Profile', icon: <User size={22} color="#282B4A" />, bg: 'rgba(40, 43, 74, 0.08)', path: '/dashboard/profile' },
            { label: 'ID Card', icon: <IdCard size={22} color="#282B4A" />, bg: 'rgba(40, 43, 74, 0.08)', path: '/dashboard/idcard' },
            { label: 'Attendance', icon: <CheckCircle2 size={22} color="#282B4A" />, bg: 'rgba(40, 43, 74, 0.08)', path: '/dashboard/attendance' },
            { label: 'Timetable', icon: <Calendar size={22} color="#282B4A" />, bg: 'rgba(40, 43, 74, 0.08)', path: '/dashboard/timetable' },
            { label: 'Results', icon: <BarChart2 size={22} color="#282B4A" />, bg: 'rgba(40, 43, 74, 0.08)', path: '/dashboard/results' },
            { label: 'Subjects', icon: <Book size={22} color="#282B4A" />, bg: 'rgba(40, 43, 74, 0.08)', path: '/dashboard/subjects' },
            { label: 'Complaints', icon: <Megaphone size={22} color="#282B4A" />, bg: 'rgba(40, 43, 74, 0.08)', path: '/dashboard/complaints' },
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
                padding: '18px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#282B4A', textAlign: 'center' }}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="dash-grid-main">
        {/* LEFT COLUMN */}
        <div className="dash-col-left" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Today's Ongoing Class Single Box */}
          <CurrentClassCard />

          {/* Real-time Student Complaints & Grievances Widget */}
          <div style={{ background: '#ffffff', borderRadius: 28, border: '1.5px solid rgba(0,0,0,0.06)', padding: 26, boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#282B4A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Megaphone size={18} color="#282B4A" /> My Complaints Status
                </h3>
                <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>Real-time status of your past and current complaints</div>
              </div>
              <button
                onClick={() => navigate('/dashboard/complaints')}
                style={{ background: '#282B4A', color: '#EEEBDA', border: 'none', borderRadius: 14, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 10px rgba(40, 43, 74, 0.25)' }}
              >
                + Complain Now
              </button>
            </div>

            {recentComplaints.length === 0 ? (
              <div style={{ background: '#f8fafc', borderRadius: 18, padding: '24px', textAlign: 'center', border: '1px dashed #e2e8f0' }}>
                <CheckCircle2 size={32} color="#282B4A" style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: '#282B4A' }}>No active complaints</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>You have no unresolved complaints in the system. Click above to file a grievance if needed.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentComplaints.map((c) => {
                  const statusColors: Record<string, { bg: string; text: string }> = {
                    RESOLVED: { bg: '#e8f5e9', text: '#10b981' },
                    IN_PROGRESS: { bg: '#fffbeb', text: '#f59e0b' },
                    OPEN: { bg: '#eff6ff', text: '#3b82f6' },
                    CLOSED: { bg: '#f3f4f6', text: '#6b7280' },
                  };
                  const color = statusColors[c.status] || { bg: '#f3f4f6', text: '#6b7280' };

                  return (
                    <div
                      key={c.id}
                      onClick={() => navigate('/dashboard/complaints')}
                      style={{ background: '#f9fafb', borderRadius: 16, padding: '14px 18px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.15s' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ background: 'rgba(40, 43, 74, 0.08)', color: '#282B4A', padding: '3px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                          {c.ticket_number}
                        </span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#282B4A' }}>{c.subject}</div>
                          <div style={{ fontSize: 11, color: '#6b7280' }}>
                            Category: {c.category || 'General'} · Raised: {new Date(c.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ background: color.bg, color: color.text, padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                          {c.status.replace('_', ' ')}
                        </span>
                        <ArrowUpRight size={14} color="#9ca3af" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

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