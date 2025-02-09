import axios from 'axios';
import {API_URL} from '../config';

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
