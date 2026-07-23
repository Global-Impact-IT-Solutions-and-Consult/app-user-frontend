import { create } from 'zustand';
import api from '../lib/api';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export interface ZohoJob {
    id: string;
    status: string;
    createdAt: string;
}

export type ZohoWebhookStatus = 'none' | 'pending' | 'connected';

function normalizeStatus(rawStatus: unknown, webhookUrl: unknown): ZohoWebhookStatus {
    if (rawStatus === 'connected' || rawStatus === 'pending') return rawStatus;
    return webhookUrl ? 'pending' : 'none';
}

interface ZohoBooksState {
    status: ZohoWebhookStatus;
    webhookUrl: string | null;
    webhookSecret: string | null;
    lastEventAt: string | null;
    jobs: ZohoJob[];
    isLoading: boolean;
    error: string | null;

    fetchStatus: (companyId: string) => Promise<void>;
    createWebhook: (companyId: string, environment: 'test' | 'live', rotate?: boolean) => Promise<void>;
    simulateWebhook: (companyId: string) => Promise<void>;
    disconnectWebhook: (companyId: string) => Promise<void>;
    fetchJobs: (companyId: string, page?: number, perPage?: number) => Promise<void>;
}

export const useZohoBooksStore = create<ZohoBooksState>()((set) => ({
    status: 'none',
    webhookUrl: null,
    webhookSecret: null,
    lastEventAt: null,
    jobs: [],
    isLoading: false,
    error: null,

    fetchStatus: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/zoho-books/${companyId}/webhook`);
            const result = response.data.data || response.data;
            set({
                status: normalizeStatus(result?.status, result?.webhookUrl),
                webhookUrl: result?.webhookUrl || null,
                webhookSecret: result?.webhookSecret || result?.signingSecret || null,
                lastEventAt: result?.lastEventAt || null,
            });
        } catch (error) {
            const status = (error as { response?: { status?: number } }).response?.status;
            if (status === 404) {
                set({ status: 'none', webhookUrl: null, webhookSecret: null, lastEventAt: null });
            } else {
                set({ error: (error as ApiError).response?.data?.message || 'Failed to fetch Zoho Books status' });
            }
        } finally {
            set({ isLoading: false });
        }
    },

    createWebhook: async (companyId, environment, rotate) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(`/zoho-books/${companyId}/webhook`, { environment, rotate });
            const result = response.data.data || response.data;
            set({
                status: 'pending',
                webhookUrl: result?.webhookUrl || null,
                webhookSecret: result?.webhookSecret || result?.signingSecret || null,
                lastEventAt: result?.lastEventAt || null,
            });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to create Zoho Books webhook' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    simulateWebhook: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            await api.post(`/zoho-books/${companyId}/webhook/simulate`);
            set({ status: 'connected', lastEventAt: new Date().toISOString() });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to simulate Zoho Books webhook' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    disconnectWebhook: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/zoho-books/${companyId}/webhook`);
            set({ status: 'none', webhookUrl: null, webhookSecret: null, lastEventAt: null });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to disconnect Zoho Books webhook' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    fetchJobs: async (companyId, page, perPage) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/zoho-books/${companyId}/jobs`, { params: { page, perPage } });
            const result = response.data.data || response.data;
            set({ jobs: Array.isArray(result) ? result : result?.items || [] });
        } catch (error) {
            set({ error: (error as ApiError).response?.data?.message || 'Failed to fetch Zoho Books jobs' });
        } finally {
            set({ isLoading: false });
        }
    },
}));
