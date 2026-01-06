import type { PropertyUpdateFormOutput } from '../../types/forms';
import type { Property } from '../../types/models';

export interface UsePropertyUpdateOptions {
  onSuccess?: (property: Property) => void;
  onError?: (error: Error) => void;
}

export interface UsePropertyUpdateReturn {
  update: (params: { id: string; data: PropertyUpdateFormOutput }) => Promise<Property>;
  isLoading: boolean;
  error: Error | null;
}
