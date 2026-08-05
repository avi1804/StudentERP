import { apiClient } from '../api/axios';

export interface GenerateQRRequest {
  lecture_instance_id: string;
  subject_id?: number;
  department?: string;
  semester?: number;
  section?: string;
  expiry_seconds?: number; // 120–300 seconds (2–5 min)
}

export interface GenerateQRResponse {
  token: string;
  expires_at: string;
  lecture_instance_id: string;
  qr_payload: string; // JSON string to encode in the QR code image
}

export interface ScanQRResponse {
  status: 'success' | 'expired' | 'duplicate' | 'mismatch' | 'error';
  message: string;
}

export interface QRStatsResponse {
  scanned_count: number;
  total_students: number;
}

export interface BulkAttendanceRecord {
  student_id: number;
  status: 'PRESENT' | 'ABSENT';
}

export interface BulkAttendanceRequest {
  subject_id: number;
  date: string;
  lecture_id: string;
  attendance_method?: 'Manual' | 'QR';
  records: BulkAttendanceRecord[];
}

export const qrAttendanceService = {
  generateQR: async (req: GenerateQRRequest): Promise<GenerateQRResponse> => {
    const response = await apiClient.post<GenerateQRResponse>('/qr/generate', req);
    return response.data;
  },

  scanQR: async (lectureInstanceId: string, token: string, subjectId?: number): Promise<ScanQRResponse> => {
    const response = await apiClient.post<ScanQRResponse>('/qr/scan', {
      lecture_instance_id: lectureInstanceId,
      token: token,
      subject_id: subjectId,
    });
    return response.data;
  },

  getStats: async (lectureInstanceId: string): Promise<QRStatsResponse> => {
    const response = await apiClient.get<QRStatsResponse>(`/qr/stats/${lectureInstanceId}`);
    return response.data;
  },
};

export const attendanceService = {
  bulkSave: async (req: BulkAttendanceRequest): Promise<{ message: string; total: number; present: number; absent: number }> => {
    const response = await apiClient.post('/faculty-dash/attendance/bulk', req);
    return response.data;
  },

  isSubmitted: async (lectureId: string): Promise<boolean> => {
    const response = await apiClient.get<{ submitted: boolean }>(`/faculty-dash/attendance/is-submitted/${encodeURIComponent(lectureId)}`);
    return response.data.submitted;
  },

  getStudentsForSubject: async (subjectId: number): Promise<any[]> => {
    const response = await apiClient.get(`/faculty-dash/subjects/${subjectId}/students`);
    return response.data;
  },

  getLectureAttendance: async (lectureId: string): Promise<{ student_id: number; status: 'PRESENT' | 'ABSENT' }[]> => {
    const response = await apiClient.get(`/faculty-dash/attendance/lecture/${encodeURIComponent(lectureId)}`);
    return response.data;
  },
};
