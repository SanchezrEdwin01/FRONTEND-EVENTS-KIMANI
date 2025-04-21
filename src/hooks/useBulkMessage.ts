import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface MessageData {
  user_id: string;
  content: string;
}

export const useBulkMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      messages
    }: {
      eventId: string;
      messages: MessageData[];
    }) => {
      const { data } = await apiClient.post(`/events/${eventId}/guests/message`, {
        messages
      });
      return data;
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['event-guests', eventId] });
    }
  });
}; 