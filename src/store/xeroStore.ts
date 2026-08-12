import { create } from 'zustand';
import api from '../lib/api';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export type XeroJobStatus =
    | 'imported'
    | 'submitted'
    | 'processing'
    | 'processed'
    | 'writeback_pending'
    | 'completed'
    | 'failed';

export interface XeroJob {
    id: string;
    companyId: string;
    xeroInvoiceId: string;
    xeroInvoiceNumber: string | null;
    receiptId: string | null;
    environment: string;
    status: XeroJobStatus;
    error: string | null;
    sourcePayload?: Record<string, unknown> | null;
    processedPayload?: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
}

export interface XeroTenant {
    id?: string;
    tenantId: string;
    tenantName?: string | null;
    tenantType?: string;
    createdDateUtc?: string;
    updatedDateUtc?: string;
}

interface XeroState {
    connected: boolean;
    configured: boolean;
    tenantId: string | null;
    tenantName: string | null;
    apiBaseUrl: string | null;
    lastSyncedAt: string | null;
    pollingEnabled: boolean;
    environment: string | null;
    expiresAt: string | null;
    connectedAt: string | null;
    message: string | null;

    tenants: XeroTenant[];
    jobs: XeroJob[];
    jobsTotal: number;

    isLoading: boolean;
    isSyncing: boolean;
    isLoadingTenants: boolean;
    error: string | null;

    fetchStatus: (companyId: string) => Promise<void>;
    connect: (companyId: string) => Promise<void>;
    disconnect: (companyId: string) => Promise<void>;
    updatePolling: (companyId: string, pollingEnabled: boolean) => Promise<void>;
    sync: (companyId: string) => Promise<void>;
    fetchTenants: (companyId: string) => Promise<void>;
    setTenant: (companyId: string, tenant: XeroTenant) => Promise<void>;
    fetchJobs: (companyId: string, page?: number, perPage?: number) => Promise<void>;
}

const getErrorMessage = (error: unknown, fallback: string) =>
    (error as ApiError).response?.data?.message || fallback;

export const useXeroStore = create<XeroState>()((set) => ({
    connected: false,
    configured: false,
    tenantId: null,
    tenantName: null,
    apiBaseUrl: null,
    lastSyncedAt: null,
    pollingEnabled: false,
    environment: null,
    expiresAt: null,
    connectedAt: null,
    message: null,

    tenants: [],
    jobs: [],
    jobsTotal: 0,

    isLoading: false,
    isSyncing: false,
    isLoadingTenants: false,
    error: null,

    fetchStatus: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/xero/${companyId}/status`);
            const result = response.data.data || response.data;
            set({
                connected: Boolean(result?.connected),
                configured: Boolean(result?.configured),
                tenantId: result?.tenantId || null,
                tenantName: result?.tenantName || null,
                apiBaseUrl: result?.apiBaseUrl || null,
                lastSyncedAt: result?.lastSyncedAt || null,
                pollingEnabled: Boolean(result?.pollingEnabled),
                environment: result?.environment || null,
                expiresAt: result?.expiresAt || null,
                connectedAt: result?.connectedAt || null,
                message: result?.message || null,
            });
        } catch (error) {
            set({ error: getErrorMessage(error, 'Failed to fetch Xero status') });
        } finally {
            set({ isLoading: false });
        }
    },

    connect: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/xero/${companyId}/connect`);
            const result = response.data.data || response.data;
            if (!result?.url) {
                throw new Error('No authorization URL returned');
            }
            window.location.href = result.url;
        } catch (error) {
            set({ error: getErrorMessage(error, 'Failed to start Xero connection'), isLoading: false });
            throw error;
        }
    },

    disconnect: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/xero/${companyId}/connection`);
            set({
                connected: false,
                tenantId: null,
                tenantName: null,
                apiBaseUrl: null,
                lastSyncedAt: null,
                pollingEnabled: false,
                expiresAt: null,
                connectedAt: null,
                tenants: [],
            });
        } catch (error) {
            set({ error: getErrorMessage(error, 'Failed to disconnect Xero') });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updatePolling: async (companyId, pollingEnabled) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.patch(`/xero/${companyId}/polling`, { pollingEnabled });
            const result = response.data.data || response.data;
            set({ pollingEnabled: Boolean(result?.pollingEnabled) });
        } catch (error) {
            set({ error: getErrorMessage(error, 'Failed to update Xero polling') });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    sync: async (companyId) => {
        set({ isSyncing: true, error: null });
        try {
            const response = await api.post(`/xero/${companyId}/sync`);
            const result = response.data.data || response.data;
            set({ lastSyncedAt: result?.lastSyncedAt || new Date().toISOString() });
        } catch (error) {
            set({ error: getErrorMessage(error, 'Failed to sync Xero invoices') });
            throw error;
        } finally {
            set({ isSyncing: false });
        }
    },

    fetchTenants: async (companyId) => {
        set({ isLoadingTenants: true, error: null });
        try {
            const response = await api.get(`/xero/${companyId}/tenants`);
            const result = response.data.data || response.data;
            set({
                tenantId: result?.currentTenantId || null,
                tenants: Array.isArray(result?.tenants) ? result.tenants : [],
            });
        } catch (error) {
            set({ error: getErrorMessage(error, 'Failed to fetch Xero organisations') });
        } finally {
            set({ isLoadingTenants: false });
        }
    },

    setTenant: async (companyId, tenant) => {
        set({ isLoadingTenants: true, error: null });
        try {
            const response = await api.put(`/xero/${companyId}/tenant`, {
                tenantId: tenant.tenantId,
                tenantName: tenant.tenantName || null,
            });
            const result = response.data.data || response.data;
            set({
                tenantId: result?.tenantId || tenant.tenantId,
                tenantName: result?.tenantName || tenant.tenantName || null,
            });
        } catch (error) {
            set({ error: getErrorMessage(error, 'Failed to update Xero organisation') });
            throw error;
        } finally {
            set({ isLoadingTenants: false });
        }
    },

    fetchJobs: async (companyId, page, perPage) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/xero/${companyId}/jobs`, { params: { page, perPage } });
            const result = response.data.data || response.data;
            set({
                jobs: Array.isArray(result) ? result : result?.items || [],
                jobsTotal: Array.isArray(result) ? result.length : result?.total || 0,
            });
        } catch (error) {
            set({ error: getErrorMessage(error, 'Failed to fetch Xero jobs') });
        } finally {
            set({ isLoading: false });
        }
    },
}));
