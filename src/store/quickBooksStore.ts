import { create } from 'zustand';
import api from '../lib/api';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export type QuickBooksJobStatus =
    | 'imported'
    | 'submitted'
    | 'processing'
    | 'processed'
    | 'writeback_pending'
    | 'completed'
    | 'failed';

export interface QuickBooksJob {
    id: string;
    companyId: string;
    quickbooksInvoiceId: string;
    quickbooksInvoiceNumber: string | null;
    receiptId: string | null;
    environment: string;
    status: QuickBooksJobStatus;
    error: string | null;
    sourcePayload?: Record<string, unknown> | null;
    processedPayload?: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
}

interface QuickBooksState {
    connected: boolean;
    configured: boolean;
    realmId: string | null;
    apiBaseUrl: string | null;
    lastSyncedAt: string | null;
    pollingEnabled: boolean;
    environment: string | null;
    expiresAt: string | null;
    connectedAt: string | null;
    message: string | null;

    jobs: QuickBooksJob[];
    jobsTotal: number;

    isLoading: boolean;
    isSyncing: boolean;
    error: string | null;

    fetchStatus: (companyId: string) => Promise<void>;
    connect: (companyId: string) => Promise<void>;
    disconnect: (companyId: string) => Promise<void>;
    updatePolling: (companyId: string, pollingEnabled: boolean) => Promise<void>;
    sync: (companyId: string) => Promise<void>;
    fetchJobs: (companyId: string, page?: number, perPage?: number) => Promise<void>;
}

export const useQuickBooksStore = create<QuickBooksState>()((set) => ({
    connected: false,
    configured: false,
    realmId: null,
    apiBaseUrl: null,
    lastSyncedAt: null,
    pollingEnabled: false,
    environment: null,
    expiresAt: null,
    connectedAt: null,
    message: null,

    jobs: [],
    jobsTotal: 0,

    isLoading: false,
    isSyncing: false,
    error: null,

    fetchStatus: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/quickbooks/${companyId}/status`);
            const result = response.data.data || response.data;
            set({
                connected: Boolean(result?.connected),
                configured: Boolean(result?.configured),
                realmId: result?.realmId || null,
                apiBaseUrl: result?.apiBaseUrl || null,
                lastSyncedAt: result?.lastSyncedAt || null,
                pollingEnabled: Boolean(result?.pollingEnabled),
                environment: result?.environment || null,
                expiresAt: result?.expiresAt || null,
                connectedAt: result?.connectedAt || null,
                message: result?.message || null,
            });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to fetch QuickBooks status' });
        } finally {
            set({ isLoading: false });
        }
    },

    connect: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/quickbooks/${companyId}/connect`);
            const result = response.data.data || response.data;
            if (!result?.url) {
                throw new Error('No authorization URL returned');
            }
            window.location.href = result.url;
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to start QuickBooks connection', isLoading: false });
            throw error;
        }
    },

    disconnect: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/quickbooks/${companyId}/connection`);
            set({
                connected: false,
                realmId: null,
                apiBaseUrl: null,
                lastSyncedAt: null,
                pollingEnabled: false,
                expiresAt: null,
                connectedAt: null,
            });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to disconnect QuickBooks' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updatePolling: async (companyId, pollingEnabled) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.patch(`/quickbooks/${companyId}/polling`, { pollingEnabled });
            const result = response.data.data || response.data;
            set({ pollingEnabled: Boolean(result?.pollingEnabled) });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to update QuickBooks polling' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    sync: async (companyId) => {
        set({ isSyncing: true, error: null });
        try {
            const response = await api.post(`/quickbooks/${companyId}/sync`);
            const result = response.data.data || response.data;
            set({ lastSyncedAt: result?.lastSyncedAt || new Date().toISOString() });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to sync QuickBooks invoices' });
            throw error;
        } finally {
            set({ isSyncing: false });
        }
    },

    fetchJobs: async (companyId, page, perPage) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/quickbooks/${companyId}/jobs`, { params: { page, perPage } });
            const result = response.data.data || response.data;
            set({
                jobs: Array.isArray(result) ? result : result?.items || [],
                jobsTotal: Array.isArray(result) ? result.length : result?.total || 0,
            });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to fetch QuickBooks jobs' });
        } finally {
            set({ isLoading: false });
        }
    },
}));
