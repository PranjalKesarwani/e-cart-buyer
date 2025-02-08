import axios from 'axios';
import {API_URL} from '../config';

export const api = axios.create({
  baseURL: API_URL,
  headers: {'Content-Type': 'application/json'},
});

export const request = async (method: string, url: string, data?: any) => {
  try {
    const response = await api({method, url, data});
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
