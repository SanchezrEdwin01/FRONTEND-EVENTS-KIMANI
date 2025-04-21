import { AxiosError } from 'axios';

export function handleApiError(error: unknown) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
} 