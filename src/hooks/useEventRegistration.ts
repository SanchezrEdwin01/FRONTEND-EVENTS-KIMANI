import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface GuestInfo {
  name: string;
  email: string;
  phone?: string;
  plus_one?: boolean;
  plus_one_info?: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  is_main_contact: boolean;
}

export const useRegisterGuests = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      guests,
      contactInfo
    }: {
      eventId: string;
      guests: GuestInfo[];
      contactInfo: ContactInfo;
    }) => {
      const { data } = await apiClient.post(`/events/${eventId}/guests/bulk`, {
        additional_guests: guests,
        main_contact: contactInfo
      });
      return data;
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate both guests and event queries
      queryClient.invalidateQueries({ queryKey: ['event-guests', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
    }
  });
};

export const useUpdateGuestInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      guestId,
      guestInfo
    }: {
      eventId: string;
      guestId: string;
      guestInfo: Partial<GuestInfo>;
    }) => {
      const { data } = await apiClient.patch(
        `/events/${eventId}/guests/${guestId}`,
        guestInfo
      );
      return data;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-guests', eventId] });
    }
  });
}; 