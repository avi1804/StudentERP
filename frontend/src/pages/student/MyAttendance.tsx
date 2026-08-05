import React, { useState } from "react";
import {
  CheckCircle2, XCircle, ChevronDown, ChevronLeft, ChevronRight,
  Calendar, Book, ArrowUpRight, QrCode, AlertCircle, RefreshCw
} from 'lucide-react';
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion, AnimatePresence } from "framer-motion";
import TextType from "../../components/TextType";
import {
  TimetableAttendanceService,
  SEMESTER_START
} from "../../services/timetableAttendanceService";
import type {
  SubjectAttendanceStat,
  OverallAttendanceStats
} from "../../services/timetableAttendanceService";
import { qrAttendanceService } from "../../services/qrAttendanceService";
import { studentAttendanceService } from "../../services/studentAttendanceService";
import { Html5QrcodeScanner } from 'html5-qrcode';

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

// ── Mobile Attendance View ──
function MobileAttendance({ stats, onRefresh }: {
  stats: OverallAttendanceStats;
  onRefresh: () => void;
}) {
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Summary Card */}
      <motion.div variants={itemVariants} className="m-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
        <ProgressRing percentage={stats.overallPercentage} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
            Overall Attendance
          </div>
          <div style={{ fontSize: '12px', color: '#7a80a1', lineHeight: 1.5 }}>
            {stats.totalAttended} of {stats.totalDelivered} lectures attended
          </div>
        </div>
      </motion.div>

      {/* Compact Stats Row */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{stats.totalDelivered}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1', fontWeight: 500 }}>Total</div>
        </div>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center', borderBottom: '2px solid #22c55e' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>{stats.totalAttended}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1', fontWeight: 500 }}>Present</div>
        </div>
        <div className="m-stat-card" style={{ padding: '12px', alignItems: 'center', textAlign: 'center', borderBottom: '2px solid #ef4444' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444' }}>{stats.totalMissed}</div>
          <div style={{ fontSize: '10px', color: '#7a80a1', fontWeight: 500 }}>Absent</div>
        </div>
      </motion.div>

      {/* Subject Cards — expandable on mobile too */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ marginTop: '24px' }}>
        <div className="m-section-label">Subject Breakdown</div>
        {stats.subjectWise.map((r, i) => {
          const pctColor = r.percentage >= 75 ? '#22c55e' : r.percentage >= 60 ? '#f59e0b' : '#ef4444';
          const isExpanded = expandedSubject === r.subjectId;

          return (
            <motion.div key={i} variants={itemVariants}>
              <div
                className="m-subject-card"
                onClick={() => setExpandedSubject(isExpanded ? null : r.subjectId)}
                style={{ cursor: 'pointer', marginBottom: isExpanded ? 0 : undefined, borderRadius: isExpanded ? '16px 16px 0 0' : undefined }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', flex: 1 }}>
                    {r.subjectName} ({r.subjectCode})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: pctColor }}>{r.percentage}%</span>
                    <ChevronDown size={16} color="#7a80a1" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </div>
                </div>
                <div className="m-progress-bar" style={{ marginBottom: '8px' }}>
                  <div className="m-progress-bar-fill" style={{ width: `${r.percentage}%`, background: pctColor, boxShadow: `0 0 8px ${pctColor}44` }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#7a80a1' }}>
                  <span><CheckCircle2 size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px', color: '#22c55e' }} />{r.present} Present</span>
                  <span><XCircle size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px', color: '#ef4444' }} />{r.absent} Absent</span>
                  <span>{r.totalClasses} Total</span>
                </div>
              </div>
              {isExpanded && (
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '16px', marginBottom: '12px' }}>
                  <SubjectCalendarAccordionContent
                    subjectStat={r}
                    calendarData={stats.calendarData}
                    onAttendanceUpdated={onRefresh}
                    isMobile={true}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// ── Subject Calendar Accordion Content (shared between mobile & desktop) ──
function SubjectCalendarAccordionContent({
  subjectStat,
  calendarData = {},
  isMobile = false
}: {
  subjectStat: SubjectAttendanceStat;
  calendarData: Record<string, { date: string; records: Record<string, unknown>[] }>;
  isMobile?: boolean;
}) {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [selectedDateStr, setSelectedDateStr] = useState(SEMESTER_START);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Calendar cells
  const gridCells: { day: number; isCurrentMonth: boolean; fullDateStr: string; dots?: string[] }[] = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    gridCells.push({ day: prevMonthDays - i, isCurrentMonth: false, fullDateStr: '' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const fullDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    
    // Extract dots for this day from backend calendarData
    const dayData = calendarData[fullDateStr];
    let dots: string[] = [];
    if (dayData && dayData.records) {
      dots = dayData.records
        .filter(r => r.subjectId === subjectStat.subjectId)
        .map(r => r.status);
    }
    
    gridCells.push({
      day: d,
      isCurrentMonth: true,
      fullDateStr,
      dots
    });
  }
  const remaining = 42 - gridCells.length;
  for (let i = 1; i <= remaining; i++) {
    gridCells.push({ day: i, isCurrentMonth: false, fullDateStr: '' });
  }

  const dateObj = new Date(selectedDateStr);
  const formattedSelectedDate = isNaN(dateObj.getTime())
    ? selectedDateStr
    : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const currentSlots = TimetableAttendanceService.getLectureInstancesForDateAndSubject(selectedDateStr, subjectStat.subjectId);

  const textColor = isMobile ? '#ffffff' : '#09090b';
  const subtextColor = isMobile ? '#7a80a1' : '#71717a';
  const bgCard = isMobile ? 'rgba(255,255,255,0.04)' : '#fafafa';
  const bgButton = isMobile ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const borderColor = isMobile ? 'rgba(255,255,255,0.08)' : '#e4e4e7';

  return (
    <div>
      {/* Month Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', marginBottom: '16px' }}>
        <button
          onClick={handlePrevMonth}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', borderRadius: '50%', color: textColor }}
        >
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontSize: '15px', fontWeight: 800, color: textColor, letterSpacing: '-0.3px' }}>
          {monthNames[month]} {year}
        </span>
        <button
          onClick={handleNextMonth}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', borderRadius: '50%', color: textColor }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center',
        background: isMobile ? 'rgba(255,255,255,0.04)' : '#f4f4f5',
        borderRadius: '10px', padding: '8px 0', marginBottom: '8px'
      }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
          <span key={i} style={{ fontSize: '11px', fontWeight: 700, color: subtextColor }}>{day}</span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '6px', marginBottom: '16px' }}>
        {gridCells.map((cell, idx) => {
          const isSelected = cell.fullDateStr === selectedDateStr;
          const hasDots = cell.dots && cell.dots.length > 0;

          return (
            <div
              key={idx}
              onClick={() => cell.isCurrentMonth && cell.fullDateStr && setSelectedDateStr(cell.fullDateStr)}
              onMouseEnter={() => cell.isCurrentMonth && setHoveredDay(cell.day)}
              onMouseLeave={() => setHoveredDay(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '42px',
                borderRadius: '10px',
                background: isSelected ? '#573cfa' : hoveredDay === cell.day && cell.isCurrentMonth ? (isMobile ? 'rgba(255,255,255,0.06)' : '#f4f4f5') : 'transparent',
                transition: 'all 0.15s',
                cursor: cell.isCurrentMonth ? 'pointer' : 'default',
                position: 'relative',
              }}
            >
              <span style={{
                fontSize: '13px',
                fontWeight: isSelected || cell.isCurrentMonth ? 700 : 400,
                color: isSelected ? '#ffffff' : cell.isCurrentMonth ? textColor : (isMobile ? 'rgba(255,255,255,0.2)' : '#d4d4d8'),
              }}>
                {cell.day}
              </span>

              {cell.isCurrentMonth && hasDots && (
                <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                  {cell.dots!.slice(0, 3).map((st, dotIdx) => (
                    <div
                      key={dotIdx}
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: isSelected
                          ? '#ffffff'
                          : st === 'present'
                          ? '#16a34a'
                          : st === 'absent'
                          ? '#ef4444'
                          : st === 'cancelled'
                          ? '#f59e0b'
                          : '#a1a1aa',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', justifyContent: 'center' }}>
        {[
          { label: 'Present', color: '#16a34a' },
          { label: 'Absent', color: '#ef4444' },
          { label: 'Cancelled', color: '#f59e0b' },
          { label: 'Not Marked', color: '#a1a1aa' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: subtextColor }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Lecture Slots for selected date */}
      <div style={{
        background: bgCard,
        border: `1px solid ${borderColor}`,
        borderRadius: '14px',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: textColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="#573cfa" />
              <span>{formattedSelectedDate}</span>
            </div>
            <div style={{ fontSize: '11px', color: subtextColor, marginTop: '2px' }}>
              {currentSlots.length > 0
                ? `${currentSlots.length} lecture${currentSlots.length > 1 ? 's' : ''} scheduled`
                : 'No lectures on this date'}
            </div>
          </div>
        </div>

        {currentSlots.length === 0 ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            background: bgButton,
            borderRadius: '12px',
            border: `1px dashed ${borderColor}`,
            color: subtextColor,
            fontSize: '12px',
          }}>
            No {subjectStat.subjectName} lectures on this date
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentSlots.map(slot => {
              const dayData = calendarData[selectedDateStr];
              const rec = dayData?.records?.find(r => r.lectureInstanceId === slot.id || r.subjectId === subjectStat.subjectId);
              const currentStatus = rec ? rec.status : 'not_marked';

              return (
                <div
                  key={slot.id}
                  style={{
                    background: bgButton,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#573cfa',
                      background: isMobile ? 'rgba(87,60,250,0.15)' : '#f3f0ff',
                      padding: '2px 8px',
                      borderRadius: '8px',
                    }}>
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: textColor, marginTop: '6px' }}>
                      {slot.subjectName}
                    </div>
                    <div style={{ fontSize: '11px', color: subtextColor, marginTop: '2px' }}>
                      {slot.room} • Prof. {slot.teacherName}
                    </div>
                  </div>

                  {/* Status Badge (read-only) */}
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '10px',
                    background: currentStatus === 'present' ? '#dcfce7' : currentStatus === 'absent' ? '#fee2e2' : currentStatus === 'cancelled' ? '#fef3c7' : (isMobile ? 'rgba(255,255,255,0.06)' : '#f4f4f5'),
                    color: currentStatus === 'present' ? '#15803d' : currentStatus === 'absent' ? '#b91c1c' : currentStatus === 'cancelled' ? '#b45309' : subtextColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {currentStatus === 'not_marked' ? 'Pending' : currentStatus}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


// ── Subject Accordion Card (Desktop) ──
function SubjectAccordionCard({
  subjectStat,
  calendarData = {},
  isExpanded,
  onToggle,
  onAttendanceUpdated,
}: {
  subjectStat: SubjectAttendanceStat;
  calendarData: Record<string, { date: string; records: Record<string, unknown>[] }>;
  isExpanded: boolean;
  onToggle: () => void;
  onAttendanceUpdated: () => void;
}) {
  const pctColor = subjectStat.percentage >= 75 ? '#10b981' : subjectStat.percentage >= 60 ? '#f59e0b' : '#ef4444';

  // Color map for subject icon backgrounds
  const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
    purple: { bg: 'rgba(87,60,250,0.08)', border: 'rgba(87,60,250,0.15)', icon: '#573cfa' },
    green: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)', icon: '#22c55e' },
    yellow: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', icon: '#f59e0b' },
    blue: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', icon: '#3b82f6' },
    pink: { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.15)', icon: '#ec4899' },
  };
  const colors = colorMap[subjectStat.colorType] || colorMap.purple;

  return (
    <div style={{
      background: '#ffffff',
      border: isExpanded ? '1.5px solid rgba(87,60,250,0.15)' : '1.5px solid rgba(0,0,0,0.06)',
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'border-color 0.25s, box-shadow 0.25s',
      boxShadow: isExpanded ? '0 8px 32px rgba(87,60,250,0.08)' : '0 2px 8px rgba(0,0,0,0.02)',
    }}>
      {/* Header Row — always visible */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '18px 24px',
          cursor: 'pointer',
          gap: '16px',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Subject Icon */}
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px',
          background: colors.bg, border: `1px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Book size={18} color={colors.icon} />
        </div>

        {/* Subject Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.2px' }}>
            {subjectStat.subjectName}
          </div>
          <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500, marginTop: '2px' }}>
            {subjectStat.subjectCode} • Prof. {subjectStat.teacherName}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '120px' }}>
              <div className="att-progress-bg" style={{ height: '6px', borderRadius: '3px' }}>
                <div className="att-progress-fill" style={{
                  width: `${subjectStat.percentage}%`,
                  background: pctColor,
                  height: '6px',
                  borderRadius: '3px',
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: pctColor, minWidth: '40px', textAlign: 'right' }}>
              {subjectStat.percentage}%
            </span>
          </div>

          <div style={{ fontSize: '13px', color: '#71717a', fontWeight: 500, minWidth: '60px', textAlign: 'right' }}>
            {subjectStat.present} / {subjectStat.totalClasses}
          </div>

          {/* Expand Chevron */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} color="#9ca3af" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              borderTop: '1px solid #f4f4f5',
              padding: '24px',
              background: '#fafbff',
            }}>
              {/* Quick Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Total', value: subjectStat.totalClasses, color: '#09090b', bg: '#f4f4f5' },
                  { label: 'Present', value: subjectStat.present, color: '#16a34a', bg: '#dcfce7' },
                  { label: 'Absent', value: subjectStat.absent, color: '#ef4444', bg: '#fee2e2' },
                  { label: 'Cancelled', value: subjectStat.cancelled, color: '#f59e0b', bg: '#fef3c7' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: stat.bg,
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: stat.color, letterSpacing: '-0.5px' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: stat.color, opacity: 0.7, marginTop: '2px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Per-Subject Calendar */}
              <SubjectCalendarAccordionContent
                subjectStat={subjectStat}
                calendarData={calendarData}
                onAttendanceUpdated={onAttendanceUpdated}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ── Main Component Export ──
export function MyAttendance() {
  const { isMobile } = useIsMobile();

  const [stats, setStats] = useState<OverallAttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSubjectId, setExpandedSubjectId] = useState<number | null>(null);

  // QR Scan States
  const [showScanner, setShowScanner] = useState(false);
  const [scanMessage, setScanMessage] = useState({ text: '', type: '' });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await studentAttendanceService.getRealAttendanceStats();
      if (data && data.subjectWise) {
        setStats(data);
      } else {
        setStats(TimetableAttendanceService.getAttendanceStats());
      }
    } catch (error) {
      console.error("Failed to load attendance stats from backend, using local fallback", error);
      setStats(TimetableAttendanceService.getAttendanceStats());
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setTimeout(fetchStats, 0);
    
    // Listen for cross-tab or scan updates
    const handleUpdate = () => fetchStats();
    window.addEventListener('attendance_updated', handleUpdate);
    return () => {
      window.removeEventListener('attendance_updated', handleUpdate);
    };
  }, []);

  // Initialize QR Scanner when modal opens
  const isScanningRef = React.useRef(false);

  React.useEffect(() => {
    if (!showScanner) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(async (decodedText) => {
      if (isScanningRef.current) return;
      isScanningRef.current = true;

      try {
        // Parse the enriched QR payload from the new API
        const data = JSON.parse(decodedText);
        const lectureInstanceId = data.lectureInstanceId;
        const token = data.token;
        const subjectId = data.subjectId;

        if (!lectureInstanceId || !token) {
          throw new Error("Invalid QR code. Please scan the correct attendance QR.");
        }

        scanner.pause(true);

        // Call the backend scan endpoint
        const res = await qrAttendanceService.scanQR(lectureInstanceId, token, subjectId);

        if (res.status === 'success') {
          setScanMessage({ text: '✓ ' + res.message, type: 'success' });

          // Re-fetch stats from backend
          fetchStats();
          setTimeout(() => {
            setShowScanner(false);
            isScanningRef.current = false;
            scanner.clear();
          }, 2500);

        } else if (res.status === 'expired') {
          setScanMessage({ text: '⏰ ' + res.message, type: 'warning' });
          setTimeout(() => { isScanningRef.current = false; scanner.resume(); }, 2500);

        } else if (res.status === 'duplicate') {
          setScanMessage({ text: '✓ ' + res.message, type: 'info' });
          setTimeout(() => {
            setShowScanner(false);
            isScanningRef.current = false;
            scanner.clear();
          }, 2500);

        } else {
          setScanMessage({ text: res.message, type: 'error' });
          setTimeout(() => { isScanningRef.current = false; scanner.resume(); }, 2000);
        }

      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as any;
        const msg = error.response?.data?.detail || error.message || 'Failed to scan QR. Please try again.';
        setScanMessage({ text: msg, type: 'error' });
        setTimeout(() => { isScanningRef.current = false; scanner.resume(); }, 2000);
      }
    }, () => {
      // Ignore empty scan frames
    });

    return () => {
      scanner.clear().catch(e => console.error("Failed to clear scanner", e));
    };
  }, [showScanner]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280', fontSize: '15px' }}>
        <RefreshCw size={24} className="spin" style={{ marginBottom: '12px', color: '#3b82f6' }} />
        <div>Loading your live attendance stats...</div>
      </div>
    );
  }

  // Ensure stats is non-null using fallback if state was somehow clear
  const activeStats = stats || TimetableAttendanceService.getAttendanceStats();

  // Mobile View
  if (isMobile) {
    return (
      <MobileAttendance
        stats={activeStats}
        onRefresh={fetchStats}
      />
    );
  }

  // Desktop View
  return (
    <div className="premium-dashboard" style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
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
                text={["Attendance", "7th Semester", "Aug – Dec 2026"]}
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
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            Timetable-synced attendance records • Semester 7 (August – December 2026)
          </div>
        </div>
        <button
          onClick={() => { setShowScanner(true); setScanMessage({ text: '', type: '' }); }}
          style={{ padding: '12px 24px', borderRadius: '14px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <QrCode size={18} /> Scan QR
        </button>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', margin: '0 0 8px 0' }}>Scan Attendance QR</h2>
            <p style={{ fontSize: '14px', color: '#71717a', margin: '0 0 24px 0' }}>Point your camera at the QR code displayed by your faculty.</p>

            <div id="qr-reader" style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}></div>

            {scanMessage.text && (
              <div style={{
                padding: '12px 16px', borderRadius: '12px', marginBottom: '16px',
                fontWeight: 600, fontSize: '14px',
                background:
                  scanMessage.type === 'success' ? '#dcfce7' :
                  scanMessage.type === 'error' ? '#fee2e2' :
                  scanMessage.type === 'warning' ? '#fef3c7' : '#eff6ff',
                color:
                  scanMessage.type === 'success' ? '#15803d' :
                  scanMessage.type === 'error' ? '#b91c1c' :
                  scanMessage.type === 'warning' ? '#b45309' : '#1d4ed8',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                {scanMessage.type === 'success' && <CheckCircle2 size={16} />}
                {scanMessage.type === 'error' && <XCircle size={16} />}
                {scanMessage.type === 'warning' && <AlertCircle size={16} />}
                {scanMessage.text}
              </div>
            )}

            <button
              onClick={() => setShowScanner(false)}
              style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#f4f4f5', color: '#09090b', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* KPI Cards */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}
      >
        {/* KPI 1 — Total Lectures Delivered */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {activeStats.totalDelivered}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#573cfa', fontWeight: 600 }}>100%</span> · Timetable Synced
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Attended Lectures */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {activeStats.totalAttended}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>{activeStats.overallPercentage}%</span> · Attended Rate
            </div>
          </div>
        </motion.div>

        {/* KPI 3 — Missed Lectures */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={15} color="#18181b" />
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div style={{ fontSize: '44px', fontWeight: 700, color: '#09090b', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '6px' }}>
              {activeStats.totalMissed}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>{activeStats.totalDelivered > 0 ? Math.round((activeStats.totalMissed / activeStats.totalDelivered) * 100) : 0}%</span> · Missed Rate
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Subject-wise Attendance Breakdown — Accordion Cards */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', margin: 0, letterSpacing: '-0.3px' }}>
            Subject-wise Attendance Breakdown
          </h3>
          <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 500 }}>
            Click a subject to view its calendar & mark attendance
          </div>
        </div>

        {/* Table Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 24px',
          marginBottom: '8px',
          gap: '16px',
        }}>
          <div style={{ width: '42px' }} /> {/* Icon spacer */}
          <div style={{ flex: 1, fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Subject & Faculty
          </div>
          <div style={{ width: '120px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
            Progress
          </div>
          <div style={{ width: '40px' }} /> {/* Percentage spacer */}
          <div style={{ minWidth: '60px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
            Attended
          </div>
          <div style={{ width: '18px' }} /> {/* Chevron spacer */}
        </div>

        {/* Accordion Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(activeStats.subjectWise || []).map((subjectStat) => (
            <SubjectAccordionCard
              key={subjectStat.subjectId}
              subjectStat={subjectStat}
              calendarData={activeStats.calendarData || {}}
              isExpanded={expandedSubjectId === subjectStat.subjectId}
              onToggle={() => setExpandedSubjectId(
                expandedSubjectId === subjectStat.subjectId ? null : subjectStat.subjectId
              )}
              onAttendanceUpdated={fetchStats}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
