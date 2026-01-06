import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import type { UsePropertyUpdateOptions, UsePropertyUpdateReturn } from './types';

export const usePropertyUpdate = (options?: UsePropertyUpdateOptions): UsePropertyUpdateReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof propertyService.update>[1];
    }) => propertyService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', data.property_id] });
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });

  return {
    update: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
