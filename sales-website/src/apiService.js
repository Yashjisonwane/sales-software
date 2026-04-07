import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

export const createLead = async (leadData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/leads`, leadData);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/leads/categories`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const fetchSubscriptions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/leads/subscriptions`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const submitProfessionalRequest = async (requestData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/professional-requests`, requestData);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error("Login API Error:", error);
        throw error;
    }
};
