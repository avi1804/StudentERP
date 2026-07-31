import { create } from 'zustand';
import { apiClient as api } from '../api/axios';

interface FeeState {
  adminDashboardData: any;
  studentDashboardData: any;
  feeStructures: any[];
  studentFees: any[];
  payments: any[];
  isLoading: boolean;
  error: string | null;

  fetchAdminDashboard: () => Promise<void>;
  fetchStudentDashboard: () => Promise<void>;
  fetchFeeStructures: () => Promise<void>;
  fetchStudentFees: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  verifyPayment: (id: number) => Promise<void>;
  payFee: (payData: { student_fee_id: number; amount: number; payment_mode: string; transaction_id?: string; fee_category?: string }) => Promise<any>;
  assignFee: (assignData: {
    bulk_semester?: number;
    student_id?: number;
    enrollment_number?: string;
    academic_year?: string;
    semester?: number;
    category?: string;
    tuition_fee?: number;
    exam_fee?: number;
    library_fee?: number;
    development_fee?: number;
    laboratory_fee?: number;
    hostel_fee?: number;
    sports_fee?: number;
    miscellaneous_fee?: number;
    due_date: string;
  }) => Promise<any>;
}

export const useFeeStore = create<FeeState>((set, get) => ({
  adminDashboardData: null,
  studentDashboardData: null,
  feeStructures: [],
  studentFees: [],
  payments: [],
  isLoading: false,
  error: null,

  fetchAdminDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/fees/admin-dashboard');
      set({ adminDashboardData: res.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to fetch admin dashboard', isLoading: false });
    }
  },

  fetchStudentDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/fees/student-dashboard');
      set({ studentDashboardData: res.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to fetch student dashboard', isLoading: false });
    }
  },

  fetchFeeStructures: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/fees/structures');
      set({ feeStructures: res.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to fetch fee structures', isLoading: false });
    }
  },

  fetchStudentFees: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/fees/student-fees');
      set({ studentFees: res.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to fetch student fees', isLoading: false });
    }
  },

  fetchPayments: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/fees/payments');
      set({ payments: res.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Failed to fetch payments', isLoading: false });
    }
  },

  verifyPayment: async (id: number) => {
    try {
      await api.patch(`/fees/payments/${id}/verify`);
      const resPayments = await api.get('/fees/payments');
      const resDashboard = await api.get('/fees/admin-dashboard');
      set({ payments: resPayments.data, adminDashboardData: resDashboard.data });
    } catch (err: any) {
      throw err;
    }
  },

  payFee: async (payData) => {
    try {
      const res = await api.post('/fees/pay-fee', payData);
      await get().fetchStudentDashboard();
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },

  assignFee: async (assignData) => {
    try {
      const res = await api.post('/fees/assign-fee', assignData);
      await get().fetchStudentFees();
      return res.data;
    } catch (err: any) {
      throw err;
    }
  }
}));
