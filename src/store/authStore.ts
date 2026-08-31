import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/api';
import { useCompanyStore } from './companyStore';

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    currentEnvironment?: 'test' | 'live';
    currentCompanyId?: string;
    isEmailVerified?: boolean;
    isMfaEnabled?: boolean;
}

interface DecodedToken {
    userId: string;
    type?: string;
    exp?: number;
    iat?: number;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    tempToken: string | null; // For MFA verification flow
    userId: string | null;    // For MFA verification flow
    isAuthenticated: boolean;
    requiresMfa: boolean;
    tempMfaEnabled?: boolean;

    // Actions
    signup: (data: Record<string, unknown>) => Promise<void>;
    login: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
    completeGoogleLogin: (tempToken: string, requiresMfa: boolean) => void;
    verifyMfa: (code: string) => Promise<void>;
    resendOtp: () => Promise<void>;
    fetchUser: () => Promise<void>;
    setupMfa: () => Promise<{ qrCode: string; secret: string; manualEntryKey: string }>;
    enableMfa: (code: string, secret: string) => Promise<void>;
    disableMfa: (code: string) => Promise<void>;
    setEnvironment: (env: 'test' | 'live') => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            tempToken: null,
            userId: null,
            isAuthenticated: false,
            requiresMfa: false,
            tempMfaEnabled: false,

            signup: async (data: Record<string, unknown>) => {
                try {
                    const response = await api.post('/auth/signup', data);
                    console.log("Signup response:", response);
                    const result = response.data.data || response.data;
                    const { userId, tempToken, requiresMfa } = result;

                    set({
                        userId,
                        tempToken,
                        requiresMfa: !!requiresMfa
                    });
                } catch (error) {
                    console.error('Signup failed:', error);
                    throw error;
                }
            },

            login: async (data: Record<string, unknown>) => {
                try {
                    const response = await api.post('/auth/login', data);
                    console.log("Login response:", response.data.data);
                    const result = response.data.data
                    // Check if direct login (no MFA) or MFA required
                    const { requiresMfa, tempToken, message, accessToken, user, totpEnabled } = result;

                    if (accessToken && user) {
                        // Direct login success
                        set({
                            isAuthenticated: true,
                            accessToken,
                            user,
                            requiresMfa: false,
                            tempToken: null,
                            userId: user.id
                        });
                    } else {
                        // MFA required flow or other intermediate state
                        let userId = result.userId;
                        if (!userId && tempToken) {
                            try {
                                const decoded = jwtDecode<DecodedToken>(tempToken);
                                userId = decoded.userId;
                            } catch (e) {
                                console.error("Failed to decode tempToken", e);
                            }
                        }

                        set({
                            tempToken,
                            requiresMfa: !!requiresMfa,
                            userId,
                            tempMfaEnabled: !!totpEnabled,
                        });
                    }

                    return { message }
                } catch (error) {
                    console.error('Login failed:', error);
                    throw error;
                }
            },

            // Landed back from the Google OAuth callback (?google=ok&tempToken=...).
            // Same shape as login()'s MFA-required branch, since the backend always
            // routes a Google sign-in through the OTP step.
            completeGoogleLogin: (tempToken, requiresMfa) => {
                let userId: string | null = null;
                try {
                    const decoded = jwtDecode<DecodedToken>(tempToken);
                    userId = decoded.userId;
                } catch (e) {
                    console.error("Failed to decode tempToken", e);
                }

                set({
                    tempToken,
                    requiresMfa,
                    userId,
                    tempMfaEnabled: false,
                });
            },

            verifyMfa: async (code) => {
                const { userId, tempToken } = get();
                try {
                    const payload = {
                        userId: userId || "",
                        code,
                        tempToken
                    };

                    const response = await api.post('/auth/verify-mfa', payload);
                    console.log("Verify MFA response:", response.data.data);
                    const result = response.data.data || response.data;
                    const { accessToken, user } = result;

                    set({
                        isAuthenticated: true,
                        accessToken,
                        user: { ...user, isMfaEnabled: user.isMfaEnabled ?? get().tempMfaEnabled },
                        tempToken: null,
                        requiresMfa: false
                    });
                } catch (error) {
                    console.error('MFA Verification failed:', error);
                    throw error;
                }
            },

            resendOtp: async () => {
                const { userId } = get();
                if (!userId) {
                    throw new Error("User ID missing unable to resend OTP");
                }
                try {
                    await api.post('/auth/resend-otp', { userId });
                    console.log("Resend OTP successful");
                } catch (error) {
                    console.error('Resend OTP failed:', error);
                    throw error;
                }
            },

            logout: () => {
                console.log("Logging out...");
                // Ideally call server logout if exists, but currently client-side only
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    tempToken: null,
                    userId: null,
                    requiresMfa: false
                });
                // Company data is per-account and must not survive a logout - otherwise
                // it (and stale onboardingSteps within it) could leak into whoever logs
                // in next on this browser.
                useCompanyStore.setState({
                    companies: [],
                    currentCompany: null,
                    companySettings: null,
                    webhooks: [],
                    apiKeys: [],
                });
            },

            setEnvironment: async (env: 'test' | 'live') => {
                try {
                    const response = await api.post('/auth/switch-environment', { environment: env });
                    console.log("Switch environment successful", response);
                    const result = response.data.data || response.data;
                    const { accessToken, currentEnvironment, currentCompanyId } = result;
                    set(state => ({
                        accessToken,
                        user: state.user ? { ...state.user, currentEnvironment, currentCompanyId } : null
                    }));
                } catch (error) {
                    console.error('Switch environment failed:', error);
                    throw error;
                }
            },

            fetchUser: async () => {
                try {
                    const response = await api.get('/auth/me');
                    console.log("Fetch user response:", response.data);
                    const userData = response.data.data || response.data;
                    set({ user: userData });
                } catch (error) {
                    console.error('Fetch user failed:', error);
                }
            },

            setupMfa: async () => {
                try {
                    const response = await api.get('/auth/mfa/setup');
                    console.log("Setup MFA response:", response.data);
                    return response.data.data || response.data;
                } catch (error) {
                    console.error('Setup MFA failed:', error);
                    throw error;
                }
            },

            enableMfa: async (code, secret) => {
                try {
                    await api.post('/auth/mfa/enable', { code, secret });
                    console.log("Enable MFA successful");
                    // Refresh user to update MFA status if backend updates profile
                    const currentUser = get().user;
                    if (currentUser) {
                        set({
                            user: { ...currentUser, isMfaEnabled: true }
                        });
                    }
                } catch (error) {
                    console.error('Enable MFA failed:', error);
                    throw error;
                }
            },

            disableMfa: async (code) => {
                try {
                    await api.post('/auth/mfa/disable', { code });
                    console.log("Disable MFA successful");
                    const currentUser = get().user;
                    if (currentUser) {
                        set({
                            user: { ...currentUser, isMfaEnabled: false }
                        });
                    }
                } catch (error) {
                    console.error('Disable MFA failed:', error);
                    throw error;
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                accessToken: state.accessToken,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                userId: state.userId
            }),
        }
    )
);
