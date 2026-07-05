import type { ComponentType, SVGProps } from "react";
import {
  Home,
  BookMarked,
  BookOpen,
  UserPlus,
  LayoutGrid,
  Megaphone,
  GraduationCap,
  Users,
  Layers,
  BookText,
  ClipboardList,
  IndianRupee,
  Hourglass
} from "lucide-react";

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface StatCardData {
  label: string;
  value: string | number;
  colorClass: string;
  icon: IconType;
  sub: string;
  badge?: string;
}

export type NavItem = 
  | { isCategory: true; label: string }
  | { isCategory?: false; label: string; icon: IconType; path: string };

/* ------------------------------------------------------------------ */
/* STATIC MOCK DATA — replace with real API data later.                */
/* ------------------------------------------------------------------ */
export const STATS: StatCardData[] = [
  { label: "Total Students", value: 13, colorClass: "blue", icon: Users, sub: "Enrolled across all branches" },
  { label: "Total Faculty", value: 8, colorClass: "purple", icon: GraduationCap, sub: "Active faculty members" },
  { label: "Total Subjects", value: 7, colorClass: "teal", icon: BookText, sub: "Across all semesters" },
  { label: "Attendance Rate", value: "77.5%", colorClass: "amber", icon: ClipboardList, sub: "Overall across all subjects", badge: "✔ On Track" },
  { label: "Fees Collected", value: "₹3.82L", colorClass: "green", icon: IndianRupee, sub: "Total amount received" },
  { label: "Fees Pending", value: "₹1.05L", colorClass: "red", icon: Hourglass, sub: "Outstanding balance" },
];

export const ATTENDANCE_DATA = [
  { subject: "math", attendance: 0.9 },
  { subject: "science", attendance: 0.9 },
  { subject: "Java", attendance: 0.9 },
  { subject: "Python", attendance: 0.9 },
];

export const OVERVIEW_DATA = [
  { name: "Students", value: 50, color: "#9aa8ff" }, // var(--primary)
  { name: "Faculty", value: 50, color: "#b78efe" }, // var(--secondary)
];

export const COURSE_DATA = [
  { name: "Btech", value: 4, color: "#9aa8ff" }, // primary
  { name: "Bcom", value: 0.001, color: "#81ecff" }, // tertiary
  { name: "Bsc", value: 0.001, color: "#b78efe" }, // secondary
  { name: "Mcom", value: 0.001, color: "#14b8a6" }, // teal
];

export const SUBJECT_DATA = [
  { name: "math", value: 1, color: "#ef4444" }, // red
  { name: "science", value: 1, color: "#f59e0b" }, // amber
  { name: "Java", value: 1, color: "#22c55e" }, // green
  { name: "Python", value: 1, color: "#81ecff" }, // tertiary
];

export const NAV_ITEMS: NavItem[] = [
  { isCategory: true, label: "OVERVIEW" },
  { label: "Dashboard", icon: LayoutGrid, path: "/admin/dashboard" },
  { isCategory: true, label: "ACADEMIC" },
  { label: "Students", icon: Users, path: "/admin/dashboard/students/manage" },
  { label: "Faculty", icon: GraduationCap, path: "/admin/dashboard/faculty/manage" },
  { label: "Subjects", icon: BookOpen, path: "/admin/dashboard/subject/manage" },
  { label: "Attendance", icon: BookMarked, path: "/admin/dashboard/attendance" },
  { label: "Marks & Results", icon: BookText, path: "/admin/dashboard/marks" },
  { label: "Notices", icon: Megaphone, path: "/admin/dashboard/notify/faculty" },
  { isCategory: true, label: "FINANCE" },
  { label: "Fees", icon: Layers, path: "/admin/dashboard/fees" },
  { isCategory: true, label: "ADD NEW" },
  { label: "Add Student", icon: UserPlus, path: "/admin/dashboard/students/add" },
  { label: "Add Faculty", icon: UserPlus, path: "/admin/dashboard/faculty/add" },
  { label: "Add Subject", icon: BookOpen, path: "/admin/dashboard/subject/add" },
  { label: "Post Notice", icon: Megaphone, path: "/admin/dashboard/notify/student" },
];
