import { apiClient } from '../api/axios';

export interface AdminDashboardData {
  total_students: number;
  total_faculty: number;
  total_departments: number;
  total_subjects: number;
  attendance_rate: number;
  attendance_trend: {
    date: string;
    attendance: number;
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
