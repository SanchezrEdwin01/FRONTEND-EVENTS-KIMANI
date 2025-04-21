import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { DEFAULT_SERVER_ID } from '@/utils/constants';
const CACHE_KEY = 'serverMembers';

export const useServerMembers = (enabled = false) => {
  return useQuery({
    queryKey: [CACHE_KEY],
    queryFn: async () => {
      const { data } = await apiClient.get(`/servers/${DEFAULT_SERVER_ID}/members`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: enabled,
  });
}; 