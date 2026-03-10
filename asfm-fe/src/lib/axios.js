import axios from 'axios';
import { supabase } from '@/lib/supabaseClient';

const apiClient = axios.create({
  // This points to real server API
  baseURL: 'http://localhost:8080/api',

  // // This points to mock API
  // baseURL: 'http://localhost:3001/api',

  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach Supabase auth token to all API calls
apiClient.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
