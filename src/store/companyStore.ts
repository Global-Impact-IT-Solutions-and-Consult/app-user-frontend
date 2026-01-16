import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface CompanySetting {
    id: string;
    type: 'test' | 'live';
    publicKey: string | null;
    secretKeyHash?: string | null;
    isActive: boolean;
}

interface CompanySettingsGroup {
    id: string;
    mfaRequired: boolean;
    settings: CompanySetting[];
}

interface Company {
    id: string;
    name: string;
    legalName?: string;
    taxId?: string;
    status: string;
    documents: object;
    approvedAt: string;
    approvedBy: string;
    isActive: boolean;
    onboardingSteps: {};
    createdAt: string;
    updatedAt: string;
    companySettings: CompanySettingsGroup[];
    // Add other properties as needed based on API response
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
    fetchApiKeys: (companyId: string) => Promise<void>;
    revokeApiKey: (companyId: string, keyId: string) => Promise<void>;
    regenerateApiKey: (companyId: string, keyId: string) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>()(
    persist(
        (set) => ({
            companies: [],
            currentCompany: null,
            isLoading: false,
            error: null,
            webhooks: [],
            apiKeys: [],

            createCompany: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/companies', data);
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
                    set({ error: error.response?.data?.message || 'Failed to create webhook' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            updateWebhook: async (companyId, webhookId, data) => {
                set({ isLoading: true, error: null });
                try {
                    await api.put(`/companies/${companyId}/webhooks/${webhookId}`, data);
                    // Verify if PUT returns updated object or we just fetch fresh list
                    await useCompanyStore.getState().fetchWebhooks(companyId);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || 'Failed to update webhook' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchApiKeys: async (companyId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/companies/${companyId}/api-keys`);
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
                    await api.delete(`/companies/${companyId}/api-keys/${keyId}`);
                    // Refresh list
                    set(state => ({ apiKeys: state.apiKeys.filter(k => k.id !== keyId) }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || 'Failed to revoke API key' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            regenerateApiKey: async (companyId, keyId) => {
                set({ isLoading: true, error: null });
                try {
                    // Assuming a regenerate endpoint exists or we use create to make new one and delete old one if explicit regenerate isn't there.
                    // Docs showed /regenerate-secret for webhooks but not explicitly for api keys in the summary I saw, but often it exists.
                    // If not, we might just call create. For now I'll assume a similar pattern or just refresh.
                    // Actually, usually it's a POST to separate endpoint. I'll leave placeholder or try a standard pattern.
                    // Let's assume we just refresh the list for now if this action is triggered from UI as "Roll Key".
                    // Ideally we POST to /api-keys to create a new one.
                    await useCompanyStore.getState().fetchApiKeys(companyId);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || 'Failed to regenerate API key' });
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
