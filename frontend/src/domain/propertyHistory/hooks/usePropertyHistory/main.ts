import { useQuery } from '@tanstack/react-query';
import { propertyHistoryService } from '../../services/propertyHistoryService';
import type { UsePropertyHistoryReturn, UsePropertyHistoryFilters } from './types';

export const usePropertyHistory = (
  filters: UsePropertyHistoryFilters
): UsePropertyHistoryReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['property-history', filters],
    queryFn: () => propertyHistoryService.query(filters),
    enabled: !!filters.property_id,
  });

  return {
    history: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
