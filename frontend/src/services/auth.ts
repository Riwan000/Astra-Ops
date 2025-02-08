import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    email: string;
}

export const login = async (credentials: LoginCredentials) => {
    const response = await axios.post(`${API_URL}/token`, 
        new URLSearchParams({
            username: credentials.username,
            password: credentials.password,
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );
    const token = response.data.access_token;
    localStorage.setItem('token', token);
    return token;
};

export const register = async (data: RegisterData) => {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}; 