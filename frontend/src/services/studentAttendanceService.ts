import { apiClient } from '../api/axios';
import { OverallAttendanceStats } from './timetableAttendanceService'; // Import the type

export const studentAttendanceService = {
  getRealAttendanceStats: async (): Promise<OverallAttendanceStats> => {
    const response = await apiClient.get<OverallAttendanceStats>('/student-dash/attendance');
    return response.data;
  }
};
