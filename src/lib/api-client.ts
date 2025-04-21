import axios from 'axios';
import { API_URL } from '@/utils/constants';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['X-Session-Token'] = `${token}`;
  }
  return config;
}); 