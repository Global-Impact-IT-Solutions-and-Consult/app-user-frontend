import { create } from 'zustand';
import api from '../lib/api';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export type ZohoJobStatus =
    | 'imported'
    | 'submitted'
    | 'processing'
    | 'processed'
    | 'writeback_pending'
    | 'completed'
    | 'failed';

export interface ZohoJob {
    id: string;
    companyId: string;
    zohoInvoiceId: string;
    zohoInvoiceNumber: string | null;
    receiptId: string | null;
    environment: string;
    status: ZohoJobStatus;
    error: string | null;
    writeBackAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface ZohoBooksState {
    connected: boolean;
    configured: boolean;
    organizationId: string | null;
    apiDomain: string | null;
    lastSyncedAt: string | null;
    pollingEnabled: boolean;
    environment: string | null;
    connectedAt: string | null;
    message: string | null;

    jobs: ZohoJob[];
    jobsTotal: number;

    isLoading: boolean;
    isSyncing: boolean;
    error: string | null;

    fetchStatus: (companyId: string) => Promise<void>;
    connect: (companyId: string) => Promise<void>;
    disconnect: (companyId: string) => Promise<void>;
    sync: (companyId: string) => Promise<void>;
    fetchJobs: (companyId: string, page?: number, perPage?: number) => Promise<void>;
}

export const useZohoBooksStore = create<ZohoBooksState>()((set) => ({
    connected: false,
    configured: false,
    organizationId: null,
    apiDomain: null,
    lastSyncedAt: null,
    pollingEnabled: false,
    environment: null,
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
            const response = await api.get(`/zoho-books/${companyId}/status`);
            const result = response.data.data || response.data;
            set({
                connected: Boolean(result?.connected),
                configured: Boolean(result?.configured),
                organizationId: result?.organizationId || null,
                apiDomain: result?.apiDomain || null,
                lastSyncedAt: result?.lastSyncedAt || null,
                pollingEnabled: Boolean(result?.pollingEnabled),
                environment: result?.environment || null,
                connectedAt: result?.connectedAt || null,
                message: result?.message || null,
            });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to fetch Zoho Books status' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Kicks off the OAuth handshake: fetch the authorize URL, then navigate
    // the whole browser to Zoho (redirects back to /callback on the backend,
    // which in turn redirects to ZOHO_SUCCESS_REDIRECT_URL on success).
    connect: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/zoho-books/${companyId}/connect`);
            const result = response.data.data || response.data;
            if (!result?.url) {
                throw new Error('No authorization URL returned');
            }
            window.location.href = result.url;
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to start Zoho Books connection', isLoading: false });
            throw error;
        }
    },

    disconnect: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/zoho-books/${companyId}/connection`);
            set({
                connected: false,
                organizationId: null,
                apiDomain: null,
                lastSyncedAt: null,
                pollingEnabled: false,
                connectedAt: null,
            });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to disconnect Zoho Books' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    sync: async (companyId) => {
        set({ isSyncing: true, error: null });
        try {
            const response = await api.post(`/zoho-books/${companyId}/sync`);
            const result = response.data.data || response.data;
            set({ lastSyncedAt: result?.lastSyncedAt || new Date().toISOString() });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to sync Zoho Books invoices' });
            throw error;
        } finally {
            set({ isSyncing: false });
        }
    },

    fetchJobs: async (companyId, page, perPage) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/zoho-books/${companyId}/jobs`, { params: { page, perPage } });
            const result = response.data.data || response.data;
            set({
                jobs: Array.isArray(result) ? result : result?.items || [],
                jobsTotal: Array.isArray(result) ? result.length : result?.total || 0,
            });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to fetch Zoho Books jobs' });
        } finally {
            set({ isLoading: false });
        }
    },
}));
