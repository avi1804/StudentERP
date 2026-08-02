import { apiClient } from '../api/axios';

export interface AssignSubstituteRequest {
  lecture_instance_id: string;
  original_faculty_id: number;
  substitute_faculty_id: number;
  substitute_faculty_name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
}

export interface MySubstituteAssignment {
  id: number;
  lecture_instance_id: string;
  original_faculty_id: number;
  original_faculty_name: string;
  start_date: string;
  end_date: string;
  status: string;
}

export const substituteService = {
  assignSubstitute: async (data: AssignSubstituteRequest) => {
    const response = await apiClient.post('/substitutes/assign', data);
    return response.data;
  },
  
  getMyAssignments: async (): Promise<MySubstituteAssignment[]> => {
    const response = await apiClient.get<MySubstituteAssignment[]>('/substitutes/my-assignments');
    return response.data;
  },
  
  markAttendance: async (lectureInstanceId: string, action: string) => {
    const response = await apiClient.post('/substitutes/mark-attendance', {
      lecture_instance_id: lectureInstanceId,
      action: action
    });
    return response.data;
  },

  getOutgoingRequests: async (): Promise<MySubstituteAssignment[]> => {
    const response = await apiClient.get<MySubstituteAssignment[]>('/substitutes/requests/outgoing');
    return response.data;
  },

  getIncomingRequests: async (): Promise<MySubstituteAssignment[]> => {
    const response = await apiClient.get<MySubstituteAssignment[]>('/substitutes/requests/incoming');
    return response.data;
  },

  respondRequest: async (assignmentId: number, status: 'ACCEPTED' | 'REJECTED') => {
    const response = await apiClient.post(`/substitutes/requests/${assignmentId}/respond`, {
      status
    });
    return response.data;
  }
};
