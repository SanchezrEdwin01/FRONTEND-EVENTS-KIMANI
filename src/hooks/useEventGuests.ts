import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface Guest {
  _id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  plus_one?: boolean;
  plus_one_info?: {
    name: string;
    email: string;
  };
  created_at: string;
}

export const useEventGuests = (eventId: string, enabled = true) => {
  return useQuery({
    queryKey: ['event-guests', eventId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/events/${eventId}/guests`);
      return data;
    },
    enabled
  });
};

export const useApproveGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, guestId }: { eventId: string; guestId: string }) => {
      const { data } = await apiClient.post(`/events/${eventId}/guests/${guestId}/approve`);
      return data;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-guests', eventId] });
    }
  });
};

export const useRejectGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, guestId }: { eventId: string; guestId: string }) => {
      const { data } = await apiClient.post(`/events/${eventId}/guests/${guestId}/reject`);
      return data;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-guests', eventId] });
    }
  });
};

export const useRemoveGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, guestId }: { eventId: string; guestId: string }) => {
      const { data } = await apiClient.delete(`/events/${eventId}/guests/${guestId}`);
      return data;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-guests', eventId] });
    }
  });
}; 