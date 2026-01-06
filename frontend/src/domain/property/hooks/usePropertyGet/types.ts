import type { Property } from '../../types/models';

export interface UsePropertyGetReturn {
  property: Property | undefined;
  isLoading: boolean;
  error: Error | null;
}
