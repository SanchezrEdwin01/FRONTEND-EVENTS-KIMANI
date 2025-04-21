import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Event, CreateEventPayload } from '@/types';

const CACHE_KEY = 'events';

export const useEvents = (enabled = false) => {
  return useQuery({
    queryKey: [CACHE_KEY],
    queryFn: async () => {
      const { data } = await apiClient.get(`/events`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: enabled,
  });
};

export function useEvent(id: string) {
  return useQuery<Event>({
    queryKey: [CACHE_KEY, id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/events/${id}`);
      return data;
    },
  });
}

interface CreateEventResponse {
  id: string;
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: CreateEventPayload) => {
      const { data } = await apiClient.post<CreateEventResponse>('/events/create', eventData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEY] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data } = await apiClient.delete(`/events/${eventId}`);
      return data;
    },
    onSuccess: (_, eventId) => {
      queryClient.removeQueries({ queryKey: [CACHE_KEY, eventId] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEY] });
    },
  });
}

export function useEditEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, eventData }: { eventId: string; eventData: Partial<CreateEventPayload> }) => {
      const { data } = await apiClient.patch(`/events/${eventId}`, eventData);
      return data;
    },
    onSuccess: (updatedEvent, { eventId }) => {
      queryClient.setQueryData([CACHE_KEY, eventId], updatedEvent);
      queryClient.invalidateQueries({ queryKey: [CACHE_KEY] });
    },
  });
}

export const useSaveEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data } = await apiClient.post(`/events/${eventId}/save`);
      return data;
    },
    onSuccess: (updatedEvent, eventId) => {
      queryClient.setQueryData([CACHE_KEY, eventId], updatedEvent);
      queryClient.invalidateQueries({ queryKey: [CACHE_KEY] });
    },
  });
};

export const useSavedEvents = (enabled = false) => {
  return useQuery({
    queryKey: ['savedEvents'],
    queryFn: async () => {
      const { data } = await apiClient.get('/events/saved');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: enabled,
  });
};

export const useCreatedEvents = (enabled = false) => {
  return useQuery({
    queryKey: ['createdEvents'],
    queryFn: async () => {
      const { data } = await apiClient.get('/events/created');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: enabled,
  });
};

