import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from './apiConfig';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * Submit a lead from the website
 */
export const createLead = async (leadData) => {
    try {
        const response = await apiClient.post(ENDPOINTS.CREATE_LEAD, leadData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('API Error:', error);
        return { 
            success: false, 
            error: error.response?.data?.message || 'Server error occurred' 
        };
    }
};

export default apiClient;
