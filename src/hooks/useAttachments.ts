import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { AttachmentResponse } from '@/types';
import { AUTUMN_API_URL } from '@/utils/constants';
export function useUploadAttachment() {
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);

            const { data } = await apiClient.post<AttachmentResponse>(
                `${AUTUMN_API_URL}/events`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return data;
        },
    });
} 