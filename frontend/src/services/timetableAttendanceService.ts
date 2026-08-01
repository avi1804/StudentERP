export interface TimetableEntry {
  id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "10:00 AM"
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  room: string;
  colorType: string;
}

export interface LectureInstance {
  id: string; // e.g. "inst_2026-08-03_1"
  timetableEntryId: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  room: string;
  colorType: string;
  status: 'scheduled' | 'cancelled';
}

export interface AttendanceRecord {
  id: string;
  lectureInstanceId: string;
  date: string; // YYYY-MM-DD
  subjectId: number;
  subjectCode: string;
  studentId?: number;
  status: 'present' | 'absent' | 'cancelled';
  markedAt: string;
}

export interface SubjectAttendanceStat {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  present: number;
  absent: number;
  cancelled: number;
  totalClasses: number;
  percentage: number;
  remark: string;
  colorType: string;
}

export interface OverallAttendanceStats {
  totalDelivered: number;
  totalAttended: number;
  totalMissed: number;
  totalCancelled: number;
  overallPercentage: number;
  subjects: SubjectAttendanceStat[];
}

// ── Master Timetable Data (Single Source of Truth) ──
export const MASTER_TIMETABLE: TimetableEntry[] = [
  // MONDAY
  { id: "tt_mon_1", day: "monday", startTime: "09:00 AM", endTime: "10:00 AM", subjectId: 1, subjectCode: "CS01", subjectName: "Software Group Project", teacherId: 101, teacherName: "Parth Nirmal", room: "Room 301", colorType: "purple" },
  { id: "tt_mon_2", day: "monday", startTime: "10:00 AM", endTime: "11:00 AM", subjectId: 2, subjectCode: "CS02", subjectName: "Machine Learning", teacherId: 102, teacherName: "Babita Patel", room: "Lab 2", colorType: "green" },
  { id: "tt_mon_3", day: "monday", startTime: "11:00 AM", endTime: "12:00 PM", subjectId: 3, subjectCode: "CS03", subjectName: "NLP", teacherId: 103, teacherName: "Ashwin Patni", room: "Room 302", colorType: "yellow" },
  { id: "tt_mon_4", day: "monday", startTime: "12:00 PM", endTime: "01:00 PM", subjectId: 4, subjectCode: "CS04", subjectName: "Cloud Computing", teacherId: 104, teacherName: "Vrushali", room: "Room 204", colorType: "blue" },
  { id: "tt_mon_5", day: "monday", startTime: "02:00 PM", endTime: "03:00 PM", subjectId: 5, subjectCode: "CS05", subjectName: "Flat", teacherId: 105, teacherName: "Dipali Jeetya", room: "Room 105", colorType: "pink" },
  { id: "tt_mon_6", day: "monday", startTime: "03:00 PM", endTime: "04:00 PM", subjectId: 1, subjectCode: "CS01", subjectName: "Software Project Lab", teacherId: 101, teacherName: "Parth Nirmal", room: "Lab 3", colorType: "purple" },

  // TUESDAY
  { id: "tt_tue_1", day: "tuesday", startTime: "09:00 AM", endTime: "10:00 AM", subjectId: 2, subjectCode: "CS02", subjectName: "Machine Learning", teacherId: 102, teacherName: "Babita Patel", room: "Lab 2", colorType: "green" },
  { id: "tt_tue_2", day: "tuesday", startTime: "10:00 AM", endTime: "11:00 AM", subjectId: 3, subjectCode: "CS03", subjectName: "NLP", teacherId: 103, teacherName: "Ashwin Patni", room: "Room 302", colorType: "yellow" },
  { id: "tt_tue_3", day: "tuesday", startTime: "11:00 AM", endTime: "12:00 PM", subjectId: 5, subjectCode: "CS05", subjectName: "Flat", teacherId: 105, teacherName: "Dipali Jeetya", room: "Room 105", colorType: "pink" },
  { id: "tt_tue_4", day: "tuesday", startTime: "12:00 PM", endTime: "01:00 PM", subjectId: 1, subjectCode: "CS01", subjectName: "Software Group Project", teacherId: 101, teacherName: "Parth Nirmal", room: "Room 301", colorType: "purple" },
  { id: "tt_tue_5", day: "tuesday", startTime: "02:00 PM", endTime: "03:00 PM", subjectId: 4, subjectCode: "CS04", subjectName: "Cloud Computing", teacherId: 104, teacherName: "Vrushali", room: "Room 204", colorType: "blue" },
  { id: "tt_tue_6", day: "tuesday", startTime: "03:00 PM", endTime: "04:00 PM", subjectId: 2, subjectCode: "CS02", subjectName: "Machine Learning Lab", teacherId: 102, teacherName: "Babita Patel", room: "Lab 2", colorType: "green" },

  // WEDNESDAY
  { id: "tt_wed_1", day: "wednesday", startTime: "09:00 AM", endTime: "10:00 AM", subjectId: 4, subjectCode: "CS04", subjectName: "Cloud Computing", teacherId: 104, teacherName: "Vrushali", room: "Room 204", colorType: "blue" },
  { id: "tt_wed_2", day: "wednesday", startTime: "10:00 AM", endTime: "11:00 AM", subjectId: 5, subjectCode: "CS05", subjectName: "Flat", teacherId: 105, teacherName: "Dipali Jeetya", room: "Room 105", colorType: "pink" },
  { id: "tt_wed_3", day: "wednesday", startTime: "11:00 AM", endTime: "12:00 PM", subjectId: 1, subjectCode: "CS01", subjectName: "Software Group Project", teacherId: 101, teacherName: "Parth Nirmal", room: "Room 301", colorType: "purple" },
  { id: "tt_wed_4", day: "wednesday", startTime: "12:00 PM", endTime: "01:00 PM", subjectId: 2, subjectCode: "CS02", subjectName: "Machine Learning", teacherId: 102, teacherName: "Babita Patel", room: "Lab 2", colorType: "green" },
  { id: "tt_wed_5", day: "wednesday", startTime: "02:00 PM", endTime: "03:00 PM", subjectId: 3, subjectCode: "CS03", subjectName: "NLP", teacherId: 103, teacherName: "Ashwin Patni", room: "Room 302", colorType: "yellow" },
  { id: "tt_wed_6", day: "wednesday", startTime: "03:00 PM", endTime: "04:00 PM", subjectId: 3, subjectCode: "CS03", subjectName: "NLP Practical", teacherId: 103, teacherName: "Ashwin Patni", room: "Lab 1", colorType: "yellow" },

  // THURSDAY
  { id: "tt_thu_1", day: "thursday", startTime: "09:00 AM", endTime: "10:00 AM", subjectId: 3, subjectCode: "CS03", subjectName: "NLP", teacherId: 103, teacherName: "Ashwin Patni", room: "Room 302", colorType: "yellow" },
  { id: "tt_thu_2", day: "thursday", startTime: "10:00 AM", endTime: "11:00 AM", subjectId: 1, subjectCode: "CS01", subjectName: "Software Group Project", teacherId: 101, teacherName: "Parth Nirmal", room: "Room 301", colorType: "purple" },
  { id: "tt_thu_3", day: "thursday", startTime: "11:00 AM", endTime: "12:00 PM", subjectId: 2, subjectCode: "CS02", subjectName: "Machine Learning", teacherId: 102, teacherName: "Babita Patel", room: "Lab 2", colorType: "green" },
  { id: "tt_thu_4", day: "thursday", startTime: "12:00 PM", endTime: "01:00 PM", subjectId: 5, subjectCode: "CS05", subjectName: "Flat", teacherId: 105, teacherName: "Dipali Jeetya", room: "Room 105", colorType: "pink" },
  { id: "tt_thu_5", day: "thursday", startTime: "02:00 PM", endTime: "03:00 PM", subjectId: 4, subjectCode: "CS04", subjectName: "Cloud Computing", teacherId: 104, teacherName: "Vrushali", room: "Room 204", colorType: "blue" },
  { id: "tt_thu_6", day: "thursday", startTime: "03:00 PM", endTime: "04:00 PM", subjectId: 4, subjectCode: "CS04", subjectName: "Cloud Computing Lab", teacherId: 104, teacherName: "Vrushali", room: "Lab 4", colorType: "blue" },

  // FRIDAY
  { id: "tt_fri_1", day: "friday", startTime: "09:00 AM", endTime: "10:00 AM", subjectId: 5, subjectCode: "CS05", subjectName: "Flat", teacherId: 105, teacherName: "Dipali Jeetya", room: "Room 105", colorType: "pink" },
  { id: "tt_fri_2", day: "friday", startTime: "10:00 AM", endTime: "11:00 AM", subjectId: 4, subjectCode: "CS04", subjectName: "Cloud Computing", teacherId: 104, teacherName: "Vrushali", room: "Room 204", colorType: "blue" },
  { id: "tt_fri_3", day: "friday", startTime: "11:00 AM", endTime: "12:00 PM", subjectId: 1, subjectCode: "CS01", subjectName: "Software Group Project", teacherId: 101, teacherName: "Parth Nirmal", room: "Room 301", colorType: "purple" },
  { id: "tt_fri_4", day: "friday", startTime: "12:00 PM", endTime: "01:00 PM", subjectId: 3, subjectCode: "CS03", subjectName: "NLP", teacherId: 103, teacherName: "Ashwin Patni", room: "Room 302", colorType: "yellow" },
  { id: "tt_fri_5", day: "friday", startTime: "02:00 PM", endTime: "03:00 PM", subjectId: 2, subjectCode: "CS02", subjectName: "Machine Learning", teacherId: 102, teacherName: "Babita Patel", room: "Lab 2", colorType: "green" },
  { id: "tt_fri_6", day: "friday", startTime: "03:00 PM", endTime: "04:00 PM", subjectId: 5, subjectCode: "CS05", subjectName: "Flat Problem Solving", teacherId: 105, teacherName: "Dipali Jeetya", room: "Room 105", colorType: "pink" },
];

// ── Semester Date Range (7th Sem: Aug 2026 – Dec 2026) ──
export const SEMESTER_START = '2026-08-01';
export const SEMESTER_END = '2026-12-31';

// ── Faculty Name → Teacher ID Resolution ──
// Matches the logged-in faculty's full_name from auth against teacherName in timetable
// This is robust regardless of what user.id the database assigns
export function resolveTeacherIdByName(facultyName: string | undefined): number {
  if (!facultyName) return 102; // Default to Babita Patel (Machine Learning)
  const normalizedInput = facultyName.trim().toLowerCase();

  // Direct keyword matching for common demo faculty
  if (normalizedInput.includes('babita')) return 102; // Babita Patel -> Machine Learning
  if (normalizedInput.includes('parth')) return 101;  // Parth Nirmal -> Software Group Project
  if (normalizedInput.includes('ashwin')) return 103; // Ashwin Patni -> NLP
  if (normalizedInput.includes('vrushali')) return 104; // Vrushali -> Cloud Computing
  if (normalizedInput.includes('dipali')) return 105; // Dipali Jeetya -> Flat

  // Try exact match
  const exactMatch = MASTER_TIMETABLE.find(
    t => t.teacherName.trim().toLowerCase() === normalizedInput
  );
  if (exactMatch) return exactMatch.teacherId;

  // Try partial match
  const partialMatch = MASTER_TIMETABLE.find(t => {
    const tName = t.teacherName.trim().toLowerCase();
    return tName.includes(normalizedInput) || normalizedInput.includes(tName);
  });
  if (partialMatch) return partialMatch.teacherId;

  // Try first or last name match
  const inputParts = normalizedInput.split(/\s+/);
  const firstOrLastMatch = MASTER_TIMETABLE.find(t => {
    const tParts = t.teacherName.trim().toLowerCase().split(/\s+/);
    return inputParts.some(p => tParts.includes(p) && p.length > 2);
  });
  if (firstOrLastMatch) return firstOrLastMatch.teacherId;

  // Default fallback: Babita Patel (teacherId 102 - Machine Learning)
  return 102;
}

const STORAGE_KEY_ATTENDANCE = "student_erp_timetable_attendance_v3";
const STORAGE_KEY_CANCELLED_INSTANCES = "student_erp_cancelled_instances_v3";

// Helper: Start with clean attendance records (no pre-marked data)
function initializeDefaultAttendanceRecords(): Record<string, AttendanceRecord> {
  return {};
}

export class TimetableAttendanceService {
  public static clearAllAttendance(): void {
    localStorage.removeItem(STORAGE_KEY_ATTENDANCE);
    localStorage.removeItem(STORAGE_KEY_CANCELLED_INSTANCES);
  }

  private static getStoredRecords(): Record<string, AttendanceRecord> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
      if (!raw) {
        const initial = initializeDefaultAttendanceRecords();
        localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  private static saveStoredRecords(records: Record<string, AttendanceRecord>): void {
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(records));
    window.dispatchEvent(new Event('attendance_updated'));
  }

  private static getCancelledInstanceIds(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CANCELLED_INSTANCES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private static setInstanceCancelled(instId: string, isCancelled: boolean): void {
    const cancelled = this.getCancelledInstanceIds();
    if (isCancelled && !cancelled.includes(instId)) {
      cancelled.push(instId);
    } else if (!isCancelled) {
      const idx = cancelled.indexOf(instId);
      if (idx !== -1) cancelled.splice(idx, 1);
    }
    localStorage.setItem(STORAGE_KEY_CANCELLED_INSTANCES, JSON.stringify(cancelled));
    window.dispatchEvent(new Event('attendance_updated'));
  }

  /**
   * Auto-generate lecture instances for a specific date from the Master Timetable
   */
  public static getLectureInstancesForDate(dateStr: string): LectureInstance[] {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return [];

    const dayOfWeekIndex = dateObj.getDay();
    const dayNames: TimetableEntry['day'][] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeekIndex];

    if (dayName === 'saturday' || dayName === 'sunday') {
      return []; // No timetable entry = no slot generated
    }

    const matchingEntries = MASTER_TIMETABLE.filter(t => t.day === dayName);
    const cancelledIds = this.getCancelledInstanceIds();

    return matchingEntries.map(entry => {
      const instId = `inst_${dateStr}_${entry.id}`;
      return {
        id: instId,
        timetableEntryId: entry.id,
        date: dateStr,
        dayOfWeek: dayName,
        startTime: entry.startTime,
        endTime: entry.endTime,
        subjectId: entry.subjectId,
        subjectCode: entry.subjectCode,
        subjectName: entry.subjectName,
        teacherId: entry.teacherId,
        teacherName: entry.teacherName,
        room: entry.room,
        colorType: entry.colorType,
        status: cancelledIds.includes(instId) ? 'cancelled' : 'scheduled'
      };
    });
  }

  /**
   * Get lecture instances for a specific date filtered to a specific teacher
   * Used by faculty to only see their own assigned slots
   */
  public static getLectureInstancesForDateByTeacher(dateStr: string, teacherId: number): LectureInstance[] {
    return this.getLectureInstancesForDate(dateStr).filter(inst => inst.teacherId === teacherId);
  }

  /**
   * Get the unique subjects assigned to a specific teacher from the master timetable
   */
  public static getAssignedSubjectsForTeacher(teacherId: number): { subjectId: number; subjectCode: string; subjectName: string }[] {
    const seen = new Set<number>();
    const result: { subjectId: number; subjectCode: string; subjectName: string }[] = [];
    MASTER_TIMETABLE.filter(t => t.teacherId === teacherId).forEach(entry => {
      if (!seen.has(entry.subjectId)) {
        seen.add(entry.subjectId);
        result.push({ subjectId: entry.subjectId, subjectCode: entry.subjectCode, subjectName: entry.subjectName });
      }
    });
    return result;
  }

  /**
   * Fetch saved attendance record for a specific lecture instance
   */
  public static getAttendanceForInstance(lectureInstanceId: string): AttendanceRecord | null {
    const records = this.getStoredRecords();
    return records[lectureInstanceId] || null;
  }

  /**
   * Mark attendance for a single auto-generated lecture instance slot
   */
  public static markAttendance(
    lectureInstanceId: string,
    dateStr: string,
    subjectId: number,
    subjectCode: string,
    status: 'present' | 'absent' | 'cancelled'
  ): AttendanceRecord {
    const records = this.getStoredRecords();

    if (status === 'cancelled') {
      this.setInstanceCancelled(lectureInstanceId, true);
    } else {
      this.setInstanceCancelled(lectureInstanceId, false);
    }

    const record: AttendanceRecord = {
      id: `att_${lectureInstanceId}`,
      lectureInstanceId,
      date: dateStr,
      subjectId,
      subjectCode,
      status,
      markedAt: new Date().toISOString(),
    };

    records[lectureInstanceId] = record;
    this.saveStoredRecords(records);
    return record;
  }

  /**
   * Calculate uniform attendance statistics across all subjects and overall
   */
  public static getAttendanceStats(): OverallAttendanceStats {
    const records = this.getStoredRecords();
    const subjectMap: Record<number, { present: number; absent: number; cancelled: number; name: string; code: string; teacher: string; color: string }> = {
      1: { present: 0, absent: 0, cancelled: 0, name: "Software Group Project", code: "CS01", teacher: "Parth Nirmal", color: "purple" },
      2: { present: 0, absent: 0, cancelled: 0, name: "Machine Learning", code: "CS02", teacher: "Babita Patel", color: "green" },
      3: { present: 0, absent: 0, cancelled: 0, name: "NLP", code: "CS03", teacher: "Ashwin Patni", color: "yellow" },
      4: { present: 0, absent: 0, cancelled: 0, name: "Cloud Computing", code: "CS04", teacher: "Vrushali", color: "blue" },
      5: { present: 0, absent: 0, cancelled: 0, name: "Flat", code: "CS05", teacher: "Dipali Jeetya", color: "pink" },
    };

    let totalDelivered = 0;
    let totalAttended = 0;
    let totalMissed = 0;
    let totalCancelled = 0;

    Object.values(records).forEach(rec => {
      const sub = subjectMap[rec.subjectId];
      if (rec.status === 'cancelled') {
        totalCancelled++;
        if (sub) sub.cancelled++;
      } else if (rec.status === 'present') {
        totalDelivered++;
        totalAttended++;
        if (sub) sub.present++;
      } else if (rec.status === 'absent') {
        totalDelivered++;
        totalMissed++;
        if (sub) sub.absent++;
      }
    });

    const overallPercentage = totalDelivered > 0 ? Math.round((totalAttended / totalDelivered) * 100) : 0;

    const subjects: SubjectAttendanceStat[] = Object.entries(subjectMap).map(([idStr, val]) => {
      const subId = Number(idStr);
      const subTotal = val.present + val.absent;
      const pct = subTotal > 0 ? Math.round((val.present / subTotal) * 100) : 0;
      const remark = pct >= 80 ? "Good" : pct >= 65 ? "Average" : "Low";

      return {
        subjectId: subId,
        subjectCode: val.code,
        subjectName: val.name,
        teacherName: val.teacher,
        present: val.present,
        absent: val.absent,
        cancelled: val.cancelled,
        totalClasses: subTotal,
        percentage: pct,
        remark,
        colorType: val.color
      };
    });

    return {
      totalDelivered,
      totalAttended,
      totalMissed,
      totalCancelled,
      overallPercentage,
      subjects
    };
  }

  /**
   * Scan saved attendance records to find orphan records (records that don't match any valid timetable slot for that date/time/subject)
   */
  public static detectOrphanRecords(): AttendanceRecord[] {
    const records = this.getStoredRecords();
    const orphans: AttendanceRecord[] = [];

    Object.values(records).forEach(rec => {
      const dateObj = new Date(rec.date);
      const dayOfWeekIndex = dateObj.getDay();
      const dayNames: TimetableEntry['day'][] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[dayOfWeekIndex];

      // Weekend = orphan
      if (dayName === 'saturday' || dayName === 'sunday') {
        orphans.push(rec);
        return;
      }

      // Check if subject exists in timetable for that day
      const validSlots = MASTER_TIMETABLE.filter(t => t.day === dayName && t.subjectId === rec.subjectId);
      if (validSlots.length === 0) {
        orphans.push(rec);
      }
    });

    return orphans;
  }

  /**
   * Purge orphan records after confirmation
   */
  public static purgeOrphanRecords(orphanIds: string[]): number {
    const records = this.getStoredRecords();
    let removedCount = 0;

    Object.keys(records).forEach(key => {
      const rec = records[key];
      if (orphanIds.includes(rec.id) || orphanIds.includes(rec.lectureInstanceId)) {
        delete records[key];
        removedCount++;
      }
    });

    this.saveStoredRecords(records);
    return removedCount;
  }

  /**
   * Get lecture instances for a specific date filtered to a single subject
   */
  public static getLectureInstancesForDateAndSubject(dateStr: string, subjectId: number): LectureInstance[] {
    return this.getLectureInstancesForDate(dateStr).filter(inst => inst.subjectId === subjectId);
  }

  /**
   * Build a map of date -> attendance status dots for a specific subject in a given month/year.
   * Returns Record<dayNumber, status[]> for calendar rendering.
   */
  public static getSubjectCalendarDots(
    year: number,
    month: number, // 0-indexed
    subjectId: number
  ): Record<number, string[]> {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: Record<number, string[]> = {};

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const slots = this.getLectureInstancesForDateAndSubject(dateStr, subjectId);
      if (slots.length === 0) continue;

      const dots: string[] = [];
      slots.forEach(s => {
        const rec = this.getAttendanceForInstance(s.id);
        dots.push(rec ? rec.status : 'not_marked');
      });
      result[d] = dots;
    }

    return result;
  }
}
