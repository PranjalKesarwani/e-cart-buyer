import axios from 'axios';
import {API_URL} from '../config';
import {getBuyerToken} from '../utils/helper';

export const api = axios.create({
  baseURL: API_URL,
  headers: {'Content-Type': 'application/json'},
});

export const request = async (method: string, url: string, data?: any) => {
  try {
    const response = await api({method, url, data});
    return {success: true, data: response.data};
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        'Something went wrong. Please try again.',
      status: error.response?.status || 500,
    };
  }
};

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 10-second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    const token = await getBuyerToken(); // Retrieve from storage (e.g., AsyncStorage)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);
