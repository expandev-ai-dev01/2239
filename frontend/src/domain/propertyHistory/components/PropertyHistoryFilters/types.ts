import type { PropertyHistoryFilters as FiltersType } from '../../types/models';

export interface PropertyHistoryFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: Partial<FiltersType>) => void;
}
