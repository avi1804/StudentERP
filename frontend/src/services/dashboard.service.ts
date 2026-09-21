import { apiClient } from '../api/axios';

export interface AdminDashboardData {
  total_students: number;
  total_faculty: number;
  total_departments: number;
  total_subjects: number;
  attendance_rate: number;
  attendance_breakdown?: {
    present_count: number;
    absent_count: number;
    leave_count: number;
    present_rate: number;
    absent_rate: number;
    leave_rate: number;
    total_records: number;
  };
  enrollment_overview?: Record<string, { semester: string; students: number }[]>;
  fee_stats?: {
    total_fee: number;
    paid_fee: number;
    pending_fee: number;
    overdue_fee: number;
    collection_percentage: number;
    monthly_data: { month: string; collected: number }[];
  };
  complaints_stats?: {
    total: number;
    pending: number;
    in_progress: number;
    resolved: number;
  };
  recent_activities?: {
    id: string;
    dotColor: string;
    title: string;
    desc: string;
    time: string;
  }[];
  attendance_trend?: {
    date: string;
    attendance: number;
  }[];
  subject_performance?: {
    subject: string;
    attendance: number;
    marks: number;
  }[];
}

export const dashboardService = {
  getAdminStats: async (): Promise<AdminDashboardData> => {
    const response = await apiClient.get('/dashboard/admin');
    return response.data;
  },
};
