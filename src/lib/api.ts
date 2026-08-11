import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4002/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
    (config) => {
        const storage = localStorage.getItem('auth-storage');
        if (storage) {
            try {
                const parsedStorage = JSON.parse(storage);
                const token = parsedStorage.state?.accessToken;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                console.error("Failed to parse auth storage", e);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors (like 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., clear token, redirect to login)
            // For now, we just reject the promise and let the caller handle it
            // or the store can handle logout
        }
        return Promise.reject(error);
    }
);

export default api;
