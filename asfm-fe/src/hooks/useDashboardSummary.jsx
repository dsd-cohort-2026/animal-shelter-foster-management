import { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';

export function useDashboardSummary() {
  const [data, setData] = useState(null);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch total users count from /users endpoint
        const usersResponse = await apiClient.get('/users');
        const totalUsers = usersResponse.data.length;

        // Fetch total animals count from /animals endpoint
        let totalAnimals = 0;
        try {
          const animalsResponse = await apiClient.get('/animals');
          totalAnimals = animalsResponse.data.length;
        } catch (animalsError) {
          // If animals endpoint doesn't exist, return 0
          console.warn('Animals endpoint not available:', animalsError.message);
        }

        setData({
          totalUsers,
          totalAnimals
        });
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        setData({ totalUsers: 0, totalAnimals: 0 });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, isloading };
}
