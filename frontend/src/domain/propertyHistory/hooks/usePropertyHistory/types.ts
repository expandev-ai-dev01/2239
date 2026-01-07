import type { PropertyHistoryResponse, PropertyHistoryFilters } from '../../types/models';

export interface UsePropertyHistoryReturn {
  history: PropertyHistoryResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export type UsePropertyHistoryFilters = PropertyHistoryFilters;
