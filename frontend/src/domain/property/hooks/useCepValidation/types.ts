import type { CepValidationResponse } from '../../types/models';

export interface UseCepValidationReturn {
  validateCep: (cep: string) => Promise<CepValidationResponse | null>;
  isValidating: boolean;
  error: Error | null;
}
