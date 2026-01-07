/**
 * @service PropertyHistoryService
 * @domain propertyHistory
 * @type REST
 *
 * Property History service for querying property change history and lifecycle events.
 */

import { authenticatedClient } from '@/core/lib/api';
import type { PropertyHistoryResponse, PropertyHistoryFilters } from '../types/models';

export const propertyHistoryService = {
  /**
   * Query property history with optional filters
   */
  async query(filters: PropertyHistoryFilters): Promise<PropertyHistoryResponse> {
    const { property_id, ...queryParams } = filters;

    const params = new URLSearchParams();
    if (queryParams.start_date) params.append('start_date', queryParams.start_date);
    if (queryParams.end_date) params.append('end_date', queryParams.end_date);
    if (queryParams.change_type) params.append('change_type', queryParams.change_type);
    if (queryParams.responsible_user)
      params.append('responsible_user', queryParams.responsible_user);

    const queryString = params.toString();
    const url = `/property-history/${property_id}${queryString ? `?${queryString}` : ''}`;

    const { data } = await authenticatedClient.get<{
      success: boolean;
      data: PropertyHistoryResponse;
    }>(url);

    return data.data;
  },
};
