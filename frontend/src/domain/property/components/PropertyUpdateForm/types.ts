import type { Property } from '../../types/models';

export interface PropertyUpdateFormProps {
  property: Property;
  onSuccess?: () => void;
  onCancel?: () => void;
}
