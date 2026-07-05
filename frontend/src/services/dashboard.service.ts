import { apiClient } from '../api/axios';

export interface AdminDashboardData {
  total_students: number;
  total_faculty: number;
  total_departments: number;
  total_subjects: number;
  pending_fees_total: number;
  fees_collected_total: number;
  attendance_rate: number;
  attendance_trend: {
    date: string;
    attendance: number;
  }[];
  fees_analytics: {
    name: string;
    value: number;
    color: string;
  }[];
  subject_performance: {
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
