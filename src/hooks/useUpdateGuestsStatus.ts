import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface GuestStatusUpdate {
  guest_id: string;
  status: 'approved' | 'rejected';
}

export const useUpdateGuestsStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      guestUpdates
    }: {
      eventId: string;
      guestUpdates: GuestStatusUpdate[];
    }) => {
      const { data } = await apiClient.patch(`/events/${eventId}/guests/bulk/status`, {
        updates: guestUpdates
      });
      return data;
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['event-guests', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
    }
  });
}; 