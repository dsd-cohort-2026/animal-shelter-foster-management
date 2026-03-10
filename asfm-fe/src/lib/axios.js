import axios from 'axios';
import { useBoundStore } from '../store';

const apiClient = axios.create({
  // This points to real server API
  baseURL: 'http://localhost:8080/api',

  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const session = useBoundStore.getState().session;
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export default apiClient;
