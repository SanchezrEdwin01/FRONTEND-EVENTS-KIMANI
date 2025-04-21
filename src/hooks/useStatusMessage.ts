import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

type GuestStatus = 'Approved' | 'Pending' | 'Rejected' | 'All';

interface StatusMessageData {
  statuses: GuestStatus[];
  message: string;
}

export const useStatusMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      messageData
    }: {
      eventId: string;
      messageData: StatusMessageData;
    }) => {
      const { data } = await apiClient.post(`/events/${eventId}/guests/notify`, {
        statuses: messageData.statuses,
        content: messageData.message
      });
      return data;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-guests', eventId] });
    }
  });
}; 