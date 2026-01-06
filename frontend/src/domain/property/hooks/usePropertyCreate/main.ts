import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import type { UsePropertyCreateOptions, UsePropertyCreateReturn } from './types';

export const usePropertyCreate = (options?: UsePropertyCreateOptions): UsePropertyCreateReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: propertyService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });

  return {
    create: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
