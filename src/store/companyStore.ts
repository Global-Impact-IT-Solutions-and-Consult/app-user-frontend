import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export interface CompanyMember {
    id: string;
    email: string;
    // Add other fields from response
    roles: string[];
    isActive: boolean;
    lastLoginAt: string;
    firstName?: string; // If available or derived
    lastName?: string;
}

export interface CompanySetting {
    id: string;
    type: 'test' | 'live';
    publicKey: string | null;
    secretKeyHash?: string | null;
    isActive: boolean;
    nrsClientId?: string;
    nrsClientSecret?: string;
    webhooks: any[]; // refined later
}

export interface CompanySettingsResponse {
    id: string;
    companyId: string;
    mfaRequired: boolean;
    settings: CompanySetting[];
}

interface Company {
    id: string;
    name: string;
    legalName?: string;
    taxId?: string;
    status: string;
    documents: any;
    approvedAt: string | null;
    approvedBy: string | null;
    isActive: boolean;
    onboardingSteps: any;
    createdAt: string;
    updatedAt: string;
    members: CompanyMember[];
}

interface Webhook {
    id: string;
    url: string;
    subscribedEvents: string[]; // Changed from events
    isActive: boolean;
    environment: 'test' | 'live'; // Note: response didn't explicitly show env but it's likely part of it or context
    signingSecret?: string; // For display after creation/regeneration
}

interface ApiKey {
    id: string;
    name: string;
    key: string; // usually a prefix or redacted version if it's a secret key, or full public key
    type: 'public' | 'secret';
    environment: 'test' | 'live';
    createdAt: string;
    lastUsedAt?: string;
}

interface CompanyState {
    companies: Company[];
    currentCompany: Company | null;
    isLoading: boolean;
    error: string | null;
    companySettings: CompanySettingsResponse | null;
    webhooks: Webhook[];
    apiKeys: ApiKey[];

    // Actions
    createCompany: (data: any) => Promise<void>;
    fetchCompanies: () => Promise<void>;
    setCurrentCompany: (company: Company) => void;

    // Webhooks
    fetchWebhooks: (companyId: string) => Promise<void>;
    createWebhook: (companyId: string, data: any) => Promise<any>;
    updateWebhook: (companyId: string, webhookId: string, data: any) => Promise<void>;

    // API Keys
    fetchCompanySettings: (companyId: string) => Promise<void>;
    fetchApiKeys: (companyId: string) => Promise<void>;
    revokeApiKey: (companyId: string, keyId: string) => Promise<void>;
    regenerateApiKey: (companyId: string, userId: string, type: 'live' | 'test') => Promise<void>;
}

export const useCompanyStore = create<CompanyState>()(
    persist(
        (set) => ({
            companies: [],
            currentCompany: null,
            isLoading: false,
            error: null,
            companySettings: null,
            webhooks: [],
            apiKeys: [],

            createCompany: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/companies', data);
                    console.log(response);
                    const result = response.data.data || response.data;

                    // The result is the full company object with settings as per user provided/log
                    set({ currentCompany: result });

                    // Also refresh list if needed
                    await useCompanyStore.getState().fetchCompanies();
                } catch (error: any) {
                    set({ error: error.response?.data?.message || 'Failed to create company' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchCompanies: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/companies');
                    console.log("Companies:", response);
                    const result = response.data.data
                    console.log("Companies result:", result);
                    set({ companies: result });

                    // Auto-select first company if none selected and list is not empty
                    if (result.length > 0 && !useCompanyStore.getState().currentCompany) {
                        set({ currentCompany: result[0] });
                    }

                } catch (error: any) {
                    set({ error: error.response?.data?.message || 'Failed to fetch companies' });
                } finally {
                    set({ isLoading: false });
                }
            },

            setCurrentCompany: (company) => {
                set({ currentCompany: company });
            },

            fetchWebhooks: async (companyId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/companies/${companyId}/webhooks`);
                    console.log("Webhooks:", response);
                    const result = response.data.data || response.data;
                    set({ webhooks: result });
                } catch (error: any) {
                    console.error("Failed to fetch webhooks", error);
                    // Optionally set error
                } finally {
                    set({ isLoading: false });
                }
            },

            createWebhook: async (companyId, data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post(`/companies/${companyId}/webhooks`, data);
                    console.log("Created webhook:", response.data);
                    const result = response.data.data || response.data;
                    set(state => ({ webhooks: [...state.webhooks, result] }));
                    return result;
                } catch (error: any) {
                    console.error("Failed to create webhook", error);
                    set({ error: error.response?.data?.message || 'Failed to create webhook' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            updateWebhook: async (companyId, webhookId, data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/companies/${companyId}/webhooks/${webhookId}`, data);
                    console.log("Updated webhook:", response);
                    // const result = response.data.data || response.data;
                    // Verify if PUT returns updated object or we just fetch fresh list
                    await useCompanyStore.getState().fetchWebhooks(companyId);
                } catch (error: any) {
                    console.error("Failed to update webhook", error);
                    set({ error: error.response?.data?.message || 'Failed to update webhook' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchCompanySettings: async (companyId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/company-settings/company/${companyId}`);
                    console.log("Company settings:", response);
                    const result = response.data.data || response.data;
                    set({ companySettings: result });
                } catch (error: any) {
                    console.error("Failed to fetch company settings", error);
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchApiKeys: async (companyId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/companies/${companyId}/api-keys`);
                    console.log("API keys:", response);
                    const result = response.data.data || response.data;
                    set({ apiKeys: result });
                } catch (error: any) {
                    console.error("Failed to fetch API keys", error);
                } finally {
                    set({ isLoading: false });
                }
            },

            revokeApiKey: async (companyId, keyId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.delete(`/companies/${companyId}/api-keys/${keyId}`);
                    console.log("API key revoked successfully", response);
                    // Refresh list
                    set(state => ({ apiKeys: state.apiKeys.filter(k => k.id !== keyId) }));
                } catch (error: any) {
                    console.error("Failed to revoke API key", error);
                    set({ error: error.response?.data?.message || 'Failed to revoke API key' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            regenerateApiKey: async (companyId, userId, type) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/companies/${companyId}/api-keys`, {
                        companyId,
                        userId,
                        settingsType: type
                    });
                    console.log("API key regenerated successfully", response);
                    // Fetch updated settings immediately as per user request "regenerate then fetch"
                    // Although UI handles it, having it here ensures consistency
                    // await useCompanyStore.getState().fetchCompanySettings(companyId); 
                    // (Commented out effectively because Settings.tsx does it, but maybe I should do it here?
                    // User said "logic should be similar to that to the webhook". 
                    // Webhook action: "createWebhook" updates state or returns result.
                    // I'll stick to just API call here.
                } catch (error: any) {
                    console.error("Failed to regenerate API key", error);
                    set({ error: error.response?.data?.message || 'Failed to regenerate API key' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'company-storage',
            partialize: (state) => ({
                companies: state.companies,
                currentCompany: state.currentCompany,
                webhooks: state.webhooks
            }),
        }
    )
);
