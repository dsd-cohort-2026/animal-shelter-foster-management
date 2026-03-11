import apiClient from '@/lib/axios';

export async function fetchMedicalLogs() {
  try {
    const response = await apiClient.get('/medical-logs');
    if (!response.ok && response.status !== 200) {
      throw new Error(`Failed to fetch medical logs: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching medical logs:', error);
    throw error;
  }
}

export async function fetchMedicalLogById(id) {
  try {
    const response = await apiClient.get(`/medical-logs/${id}`);
    if (!response.ok && response.status !== 200) {
      throw new Error(`Failed to fetch medical log: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching medical log:', error);
    throw error;
  }
}