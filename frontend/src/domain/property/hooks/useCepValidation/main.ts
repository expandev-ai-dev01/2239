import { useMutation } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import type { UseCepValidationReturn } from './types';

export const useCepValidation = (): UseCepValidationReturn => {
  const mutation = useMutation({
    mutationFn: propertyService.validateCep,
  });

  return {
    validateCep: mutation.mutateAsync,
    isValidating: mutation.isPending,
    error: mutation.error,
  };
};
