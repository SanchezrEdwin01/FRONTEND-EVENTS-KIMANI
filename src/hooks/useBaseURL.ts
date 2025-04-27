import { BASE_URL_KEY, BASE_URL } from '@/utils/constants';

export const useBaseURL = (): any => {
  return localStorage.getItem(BASE_URL_KEY) || BASE_URL;
};
