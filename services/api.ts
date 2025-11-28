import axios from 'axios';
import { Shift } from '../models/shift';

const API_BASE_URL = 'http://192.168.254.223:8080'; // Replace with your actual API

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response Error:', {
        url: error.response.config.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.log('ERRROR', JSON.stringify(error));
      // console.error('Network/Error:', JSON.stringify(error));
    }
    return Promise.reject(error);
  }
);

export const shiftsApi = {
  // Get all shifts
  getShifts: async (): Promise<Shift[]> => {
    try {
      const response = await api.get<Shift[]>('/shifts');
      return response.data;
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw error;
    }
  },

  // Book a shift
  bookShift: async (shiftId: string): Promise<Shift> => {
    try {
      const response = await api.post<Shift>(`/shifts/${shiftId}/book`, {});
      return response.data;
    } catch (error) {
      console.error('Error booking shift:', JSON.stringify(error));
      throw error;
    }
  },

  // Cancel a shift
  cancelShift: async (shiftId: string): Promise<Shift> => {
    try {
      const response = await api.post<Shift>(`/shifts/${shiftId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling shift:', error);
      throw error;
    }
  },
};

export default api;