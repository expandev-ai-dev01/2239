import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import type { UsePropertyGetReturn } from './types';

export const usePropertyGet = (id: string): UsePropertyGetReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getById(id),
    enabled: !!id,
  });

  return {
    property: data,
    isLoading,
    error: error as Error | null,
  };
};
