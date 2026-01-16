import { create } from 'zustand';
import api from '../lib/api';

interface Receipt {
    id: string;
    receiptNumber?: string; // or similar identifier
    issueDate: string;
    dueDate?: string;
    totalAmount: number;
    currency: string;
    status: string;
    type: 'sent' | 'received'; // Assuming these types based on UI
    counterpartyName?: string;
    counterpartyId?: string;
    // Add other fields as they come from API
}

interface ReceiptLog {
    id: string;
    receiptId: string;
    timestamp: string;
    eventType: string;
    status: string;
    details?: string;
}

interface ReceiptState {
    receipts: Receipt[];
    currentReceipt: Receipt | null;
    currentReceiptLogs: ReceiptLog[];
    totalReceipts: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchReceipts: (params?: any) => Promise<void>;
    fetchReceipt: (id: string) => Promise<void>;
    fetchReceiptLogs: (id: string, params?: any) => Promise<void>;
    downloadReceipt: (id: string, format?: string) => Promise<void>;
}

export const useReceiptStore = create<ReceiptState>((set) => ({
    receipts: [],
    currentReceipt: null,
    currentReceiptLogs: [],
    totalReceipts: 0,
    isLoading: false,
    error: null,

    fetchReceipts: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/receipts', { params });
            console.log(response);
            const result = response.data.data || response.data;
            // Handle both array response or paginated response format
            if (Array.isArray(result)) {
                set({ receipts: result, totalReceipts: result.length });
            } else {
                set({
                    receipts: result.receipts || [],
                    totalReceipts: result.total || 0
                });
            }
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch invoices' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchReceipt: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/receipts/${id}`);
            console.log(response);
            const result = response.data.data || response.data;
            set({ currentReceipt: result });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch invoice details' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchReceiptLogs: async (id, params) => {
        // Don't set global loading here to avoid flickering main content if just updating logs
        // or we can add a specific loading state for logs
        try {
            const response = await api.get(`/receipts/${id}/logs`, { params });
            console.log(response);
            const result = response.data.data || response.data;
            set({ currentReceiptLogs: Array.isArray(result) ? result : (result.logs || []) });
        } catch (error: any) {
            console.error("Failed to fetch receipt logs", error);
        }
    },

    downloadReceipt: async (id, format = 'pdf') => {
        try {
            const response = await api.get(`/receipts/${id}/download`, {
                params: { format },
                responseType: 'blob'
            });
            console.log(response);
            // Create a blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${id}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download receipt", error);
            throw error;
        }
    }
}));
