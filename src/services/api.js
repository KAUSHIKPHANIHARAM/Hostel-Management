const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Token Management
export const getToken = () => localStorage.getItem('dormquest_token');
export const setToken = (token) => {
    if (token) {
        localStorage.setItem('dormquest_token', token);
    } else {
        localStorage.removeItem('dormquest_token');
    }
};
export const removeToken = () => localStorage.removeItem('dormquest_token');

// Stored User Management
export const getStoredUser = () => {
    const userStr = localStorage.getItem('dormquest_user');
    try {
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};
export const setStoredUser = (user) => {
    if (user) {
        localStorage.setItem('dormquest_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('dormquest_user');
    }
};
export const removeStoredUser = () => localStorage.removeItem('dormquest_user');

// Centralized Request Handler
export async function apiRequest(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);
        
        // Try parsing json body
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const errorMessage = (typeof data === 'object' && data.message) ? data.message : (typeof data === 'string' && data ? data : `HTTP Error ${response.status}`);
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (err) {
        console.error(`API Request Error [${options.method || 'GET'} ${endpoint}]:`, err);
        throw err;
    }
}

// API Service Modules
export const authApi = {
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    login: (credentials) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    getMe: () => apiRequest('/auth/me')
};

export const hostelApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.append(key, value);
            }
        });
        const queryString = query.toString() ? `?${query.toString()}` : '';
        return apiRequest(`/hostels${queryString}`);
    },
    getById: (id) => apiRequest(`/hostels/${id}`)
};

export const bookingApi = {
    create: (bookingData) => apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
    }),
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/bookings${query ? `?${query}` : ''}`);
    },
    getById: (id) => apiRequest(`/bookings/${id}`),
    cancel: (id) => apiRequest(`/bookings/${id}`, {
        method: 'DELETE'
    })
};

export const userApi = {
    getProfile: (id = 'me') => apiRequest(`/users/${id}`),
    updateProfile: (id, userData) => apiRequest(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData)
    }),
    deleteAccount: (id) => apiRequest(`/users/${id}`, {
        method: 'DELETE'
    })
};

export default {
    auth: authApi,
    hostels: hostelApi,
    bookings: bookingApi,
    users: userApi
};
