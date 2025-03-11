// src/features/auth/authService.ts
import axios from 'axios';

const API_URL = 'https://your-api.com/auth';

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, {email, password});
  return response.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/logout`);
};
