import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1';

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
