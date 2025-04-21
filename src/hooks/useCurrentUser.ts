import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { User } from '@/types';
import { AxiosError } from 'axios';
import { getUrlParameter } from '@/utils/utils';

const CACHE_KEY = 'currentUser';

export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  return useQuery<User | null>({
    queryKey: [CACHE_KEY],
    queryFn: async () => {
      const urlToken = getUrlParameter('token');
      if (urlToken) {
        localStorage.setItem('token', urlToken);
        apiClient.defaults.headers.common['X-Session-Token'] = urlToken;
      }

      const headerToken = apiClient.defaults.headers.common['X-Session-Token'];
      const localStorageToken = localStorage.getItem('token'); 
      
      if (!urlToken && !headerToken && !localStorageToken) {
        return false;
      }

      try {
        const { data } = await apiClient.get('/users/@me');
        return data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          localStorage.removeItem('token');
          delete apiClient.defaults.headers.common['X-Session-Token'];
          queryClient.removeQueries({ queryKey: [CACHE_KEY] });
        }
      }
      return false;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true,
  });
}; 