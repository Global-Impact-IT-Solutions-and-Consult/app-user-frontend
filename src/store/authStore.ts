import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/api';

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    currentEnvironment?: 'test' | 'live';
    currentCompanyId?: string;
    isEmailVerified?: boolean;
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

    // Actions
    signup: (data: any) => Promise<void>;
    login: (data: any) => Promise<any>;
    verifyMfa: (code: string) => Promise<void>;
    resendOtp: () => Promise<void>;
    logout: () => void;
    setEnvironment: (env: 'test' | 'live') => Promise<void>;
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

            signup: async (data) => {
                try {
                    const response = await api.post('/auth/signup', data);
                    // Handle potential nested data structure (NestJS common pattern)
                    // Try data.data first, then fallback to data
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

            login: async (data) => {
                try {
                    const response = await api.post('/auth/login', data);
                    console.log(response.data.data);
                    // Handle nested data structure: { data: { statusCode: 200, data: { ... } } }
                    const result = response.data.data
                    const { requiresMfa, tempToken, message } = result;

                    let userId = result.userId;

                    // If userId is not directly in response, try to extract from tempToken
                    if (!userId && tempToken) {
                        try {
                            const decoded = jwtDecode<DecodedToken>(tempToken);
                            console.log(decoded);
                            userId = decoded.userId;
                        } catch (e) {
                            console.error("Failed to decode tempToken", e);
                        }
                    }

                    set({
                        tempToken,
                        requiresMfa: !!requiresMfa,
                        userId,
                    });

                    return {message}
                } catch (error) {
                    console.error('Login failed:', error);
                    throw error;
                }
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
                    const result = response.data.data || response.data;
                    const { accessToken, user } = result;

                    set({
                        isAuthenticated: true,
                        accessToken,
                        user,
                        tempToken: null, // Clear temp stuff
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
                } catch (error) {
                    console.error('Resend OTP failed:', error);
                    throw error;
                }
            },

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    tempToken: null,
                    userId: null,
                    requiresMfa: false
                });
            },

            setEnvironment: async (env) => {
                try {
                    const response = await api.post('/auth/switch-environment', { environment: env });
                    const result = response.data.data || response.data;
                    const { accessToken, currentEnvironment, currentCompanyId } = result;
                    set(state => ({
                        accessToken, // Token might be rotated
                        user: state.user ? { ...state.user, currentEnvironment, currentCompanyId } : null
                    }));
                } catch (error) {
                    console.error('Switch environment failed:', error);
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
