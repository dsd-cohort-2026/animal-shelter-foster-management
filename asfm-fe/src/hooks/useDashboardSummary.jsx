
import { useEffect, useState } from 'react';

export function useDashboardSummary() {
    const[data , setData] = useState(null);
    const [isloading, setIsLoading] = useState(true)

    useEffect(() => { 
        
        async function fetchData() {
            try {
                setIsLoading(true);
                    setTimeout(() => {
                    setIsLoading(false);
                    }, 2000);
            }
            catch (error) {
                console.error('Error fetching dashboard summary:', error);
                setIsLoading(false);
            }
        }
        fetchData();
    }, [])

    return {data, isloading}
}