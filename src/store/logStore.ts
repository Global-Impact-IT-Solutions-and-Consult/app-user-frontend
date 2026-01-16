import { create } from 'zustand';
import api from '../lib/api';

interface Log {
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'success';
    message: string;
    source: string; // e.g. "API", "Webhook", "System"
    category?: string; // e.g. "Auth", "Invoice"
    metadata?: any;
    traceId?: string;
}

interface LogState {
    logs: Log[];
    totalLogs: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchLogs: (params?: any) => Promise<void>;
    clearLogs: () => Promise<void>;
}

export const useLogStore = create<LogState>((set) => ({
    logs: [],
    totalLogs: 0,
    isLoading: false,
    error: null,

    fetchLogs: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/logs', { params });
            console.log(response);
            const result = response.data.data || response.data;
            if (Array.isArray(result)) {
                set({ logs: result, totalLogs: result.length });
            } else {
                set({
                    logs: result.logs || [],
                    totalLogs: result.total || (result.logs ? result.logs.length : 0)
                });
            }
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch logs' });
        } finally {
            set({ isLoading: false });
        }
    },

    clearLogs: async () => {
        // Assuming there might be a clear logs endpoint, if not we just clear local state or implement delete API
        try {
            // await api.delete('/logs'); // Uncomment if delete endpoint exists
            set({ logs: [], totalLogs: 0 });
        } catch (error: any) {
            console.error("Failed to clear logs", error);
        }
    }
}));
