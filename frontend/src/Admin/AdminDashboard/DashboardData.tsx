import type { ComponentType, SVGProps } from "react";
import {
  Home,
  IdCard,
  BookMarked,
  BookOpen,
  UserPlus,
  LayoutGrid,
  Megaphone,
  GraduationCap,
  Users,
  Layers,
  BookText,
} from "lucide-react";

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface StatCardData {
  label: string;
  value: number;
  colorClass: string;
  icon: IconType;
}

export interface NavSubItem {
  label: string;
  path: string;
}

export interface NavItem {
  label: string;
  icon: IconType;
  path?: string; // present on non-expandable items — clicking navigates directly
  subItems?: NavSubItem[]; // present on expandable items
}

/* ------------------------------------------------------------------ */
/* STATIC MOCK DATA — replace with real API data later.                */
/* ------------------------------------------------------------------ */
export const STATS: StatCardData[] = [
  { label: "Total Students", value: 1, colorClass: "bg-red-500", icon: GraduationCap },
  { label: "Total Staff", value: 1, colorClass: "bg-blue-500", icon: Users },
  { label: "Total Course", value: 4, colorClass: "bg-gray-700", icon: Layers },
  { label: "Total Subjects", value: 4, colorClass: "bg-pink-500", icon: BookText },
];

export const ATTENDANCE_DATA = [
  { subject: "math", attendance: 0.9 },
  { subject: "science", attendance: 0.9 },
  { subject: "Java", attendance: 0.9 },
  { subject: "Python", attendance: 0.9 },
];

export const OVERVIEW_DATA = [
  { name: "Students", value: 50, color: "#2563eb" },
  { name: "Staff", value: 50, color: "#dc2626" },
];

export const COURSE_DATA = [
  { name: "Btech", value: 4, color: "#e11d1d" },
  { name: "Bcom", value: 0.001, color: "#1e293b" },
  { name: "Bsc", value: 0.001, color: "#f59e0b" },
  { name: "Mcom", value: 0.001, color: "#0ea5e9" },
];

export const SUBJECT_DATA = [
  { name: "math", value: 1, color: "#7f1d1d" },
  { name: "science", value: 1, color: "#1e293b" },
  { name: "Java", value: 1, color: "#f59e0b" },
  { name: "Python", value: 1, color: "#0ea5e9" },
];

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home, path: "/Admin-Dashboard" },
  { label: "Update Profile", icon: IdCard, path: "AdminProfile" },
  {
    label: "Course",
    icon: BookMarked,
    subItems: [
      { label: "Add Course", path: "/Admin-Dashboard/course/add" },
      { label: "Manage Course", path: "/Admin-Dashboard/course/manage" },
    ],
  },
  {
    label: "Subject",
    icon: BookOpen,
    subItems: [
      { label: "Add Subject", path: "/Admin-Dashboard/subject/add" },
      { label: "Manage Subject", path: "/Admin-Dashboard/subject/manage" },
    ],
  },

  { label: "Add Staff", icon: UserPlus, path: "/Admin-Dashboard/staff/add" },
  { label: "Manage Staff", icon: LayoutGrid, path: "/Admin-Dashboard/staff/manage" },
  { label: "Add Student", icon: UserPlus, path: "/Admin-Dashboard/students/add" },
  { label: "Manage Student", icon: LayoutGrid, path: "/Admin-Dashboard/students/manage" },
  { label: "Notify Staff", icon: Megaphone, path: "/Admin-Dashboard/notify/staff" },
  { label: "Notify Student", icon: Megaphone, path: "/Admin-Dashboard/notify/student" },
];