import type { PropertyFormOutput } from '../../types/forms';
import type { Property } from '../../types/models';

export interface UsePropertyCreateOptions {
  onSuccess?: (property: Property) => void;
  onError?: (error: Error) => void;
}

export interface UsePropertyCreateReturn {
  create: (data: PropertyFormOutput) => Promise<Property>;
  isLoading: boolean;
  error: Error | null;
}
