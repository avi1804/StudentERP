import { apiClient } from '../api/axios';

export interface GenerateQRResponse {
  token: string;
  expires_at: string;
  lecture_instance_id: string;
}

export interface ScanQRResponse {
  status: 'success' | 'expired' | 'duplicate' | 'mismatch';
  message: string;
}

export interface QRStatsResponse {
  scanned_count: number;
  total_students: number;
}

export const qrAttendanceService = {
  generateQR: async (lectureInstanceId: string): Promise<GenerateQRResponse> => {
    const response = await apiClient.post<GenerateQRResponse>('/qr/generate', {
      lecture_instance_id: lectureInstanceId,
    });
    return response.data;
  },

  scanQR: async (lectureInstanceId: string, token: string): Promise<ScanQRResponse> => {
    const response = await apiClient.post<ScanQRResponse>('/qr/scan', {
      lecture_instance_id: lectureInstanceId,
      token: token,
    });
    return response.data;
  },

  getStats: async (lectureInstanceId: string): Promise<QRStatsResponse> => {
    const response = await apiClient.get<QRStatsResponse>(`/qr/stats/${lectureInstanceId}`);
    return response.data;
  }
};
