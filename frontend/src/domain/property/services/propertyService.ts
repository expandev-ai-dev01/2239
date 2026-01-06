/**
 * @service PropertyService
 * @domain property
 * @type REST
 *
 * Property service for managing property data operations.
 * Handles CRUD operations and CEP validation.
 */

import { authenticatedClient } from '@/core/lib/api';
import type { Property, CepValidationResponse } from '../types/models';
import type { PropertyFormOutput } from '../types/forms';

export const propertyService = {
  /**
   * List all properties
   */
  async list(): Promise<Property[]> {
    const { data } = await authenticatedClient.get<{ success: boolean; data: Property[] }>(
      '/property'
    );
    return data.data;
  },

  /**
   * Get property by ID
   */
  async getById(id: string): Promise<Property> {
    const { data } = await authenticatedClient.get<{ success: boolean; data: Property }>(
      `/property/${id}`
    );
    return data.data;
  },

  /**
   * Create new property
   */
  async create(propertyData: PropertyFormOutput): Promise<Property> {
    const { data } = await authenticatedClient.post<{ success: boolean; data: Property }>(
      '/property',
      propertyData
    );
    return data.data;
  },

  /**
   * Validate CEP and get address data
   */
  async validateCep(cep: string): Promise<CepValidationResponse | null> {
    try {
      const { data } = await authenticatedClient.post<{
        success: boolean;
        data: CepValidationResponse;
      }>('/property/validate-cep', { cep });

      if (data.data.apiAvailable === false) {
        return null;
      }

      return data.data;
    } catch (error) {
      return null;
    }
  },
};
