import { apiClient } from '../api/axios';
import type { OverallAttendanceStats } from './timetableAttendanceService';

export const studentAttendanceService = {
  getRealAttendanceStats: async (): Promise<OverallAttendanceStats> => {
    const response = await apiClient.get<OverallAttendanceStats>('/student-dash/attendance');
    return response.data;
  }
};
