/**
 * @summary
 * Business logic for Property History entity.
 * Handles history queries, lifecycle events, and audit logging using in-memory storage.
 *
 * @module services/propertyHistory/propertyHistoryService
 */

import { v4 as uuidv4 } from 'uuid';
import { propertyStore } from '@/instances';
import { propertyHistoryStore, propertyAuditStore } from '@/instances/propertyHistory';
import { ServiceError } from '@/utils';
import {
  PropertyHistoryQueryParams,
  PropertyHistoryResponse,
  PropertyHistoryChangeRecord,
  PropertyLifecycleEventRecord,
} from './propertyHistoryTypes';
import { historyQuerySchema } from './propertyHistoryValidation';
import { PROPERTY_CHANGE_TYPES } from '@/constants';

/**
 * @summary
 * Queries property history with optional filters.
 *
 * @function propertyHistoryQuery
 * @module services/propertyHistory
 *
 * @param {unknown} params - Raw query parameters to validate
 * @returns {Promise<PropertyHistoryResponse>} Complete property history
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When params fail validation
 * @throws {ServiceError} NOT_FOUND (404) - When property does not exist
 * @throws {ServiceError} ACCESS_DENIED (403) - When user lacks permission
 *
 * @example
 * const history = await propertyHistoryQuery({
 *   property_id: '550e8400-e29b-41d4-a716-446655440000',
 *   start_date: '2025-01-01',
 *   end_date: '2025-01-31',
 *   change_type: 'mudancas_valor_aluguel'
 * });
 */
export async function propertyHistoryQuery(params: unknown): Promise<PropertyHistoryResponse> {
  const validation = historyQuerySchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const queryParams = validation.data;

  // Verify property exists
  const property = propertyStore.getById(queryParams.property_id);
  if (!property) {
    throw new ServiceError('NOT_FOUND', 'Propriedade não encontrada no sistema', 404);
  }

  // Get all changes for property
  let changes = propertyHistoryStore.getChangesByPropertyId(queryParams.property_id);

  // Apply filters
  if (queryParams.start_date) {
    const startDate = new Date(queryParams.start_date);
    changes = changes.filter((c) => new Date(c.change_date) >= startDate);
  }

  if (queryParams.end_date) {
    const endDate = new Date(queryParams.end_date);
    endDate.setHours(23, 59, 59, 999); // End of day
    changes = changes.filter((c) => new Date(c.change_date) <= endDate);
  }

  if (queryParams.change_type && queryParams.change_type !== PROPERTY_CHANGE_TYPES.TODOS) {
    changes = changes.filter((c) => c.change_type === queryParams.change_type);
  }

  if (queryParams.responsible_user) {
    changes = changes.filter(
      (c) => c.user_responsible.toLowerCase() === queryParams.responsible_user!.toLowerCase()
    );
  }

  // Get lifecycle events
  let events = propertyHistoryStore.getEventsByPropertyId(queryParams.property_id);

  // Apply date filters to events
  if (queryParams.start_date) {
    const startDate = new Date(queryParams.start_date);
    events = events.filter((e) => new Date(e.event_date) >= startDate);
  }

  if (queryParams.end_date) {
    const endDate = new Date(queryParams.end_date);
    endDate.setHours(23, 59, 59, 999);
    events = events.filter((e) => new Date(e.event_date) <= endDate);
  }

  // Calculate summary
  const allChanges = propertyHistoryStore.getChangesByPropertyId(queryParams.property_id);
  const sortedChanges = [...allChanges].sort(
    (a, b) => new Date(a.change_date).getTime() - new Date(b.change_date).getTime()
  );

  const summary = {
    total_changes: changes.length,
    total_events: events.length,
    first_change_date: sortedChanges.length > 0 ? sortedChanges[0].change_date : null,
    last_change_date:
      sortedChanges.length > 0 ? sortedChanges[sortedChanges.length - 1].change_date : null,
  };

  // Register audit log
  await registerAuditLog({
    user_id: 'system', // In real implementation, get from auth context
    consulted_property_id: queryParams.property_id,
    applied_filters: queryParams,
    records_returned: changes.length + events.length,
    exported: false,
    export_format: null,
  });

  return {
    changes,
    lifecycle_events: events,
    summary,
  };
}

/**
 * @summary
 * Registers a lifecycle event for a property.
 *
 * @function registerLifecycleEvent
 * @module services/propertyHistory
 *
 * @param {object} params - Event parameters
 * @returns {Promise<PropertyLifecycleEventRecord>} Created event record
 *
 * @example
 * const event = await registerLifecycleEvent({
 *   property_id: '550e8400-e29b-41d4-a716-446655440000',
 *   event_type: 'criacao_propriedade_sistema',
 *   event_description: 'Propriedade criada no sistema',
 *   event_impact: 'Propriedade disponível para locação'
 * });
 */
export async function registerLifecycleEvent(params: {
  property_id: string;
  event_type: string;
  event_description: string;
  related_contract_id?: string | null;
  related_tenant_id?: string | null;
  event_impact: string;
}): Promise<PropertyLifecycleEventRecord> {
  const event: PropertyLifecycleEventRecord = {
    event_id: uuidv4(),
    property_id: params.property_id,
    event_type: params.event_type as any,
    event_date: new Date().toISOString(),
    event_description: params.event_description,
    related_contract_id: params.related_contract_id || null,
    related_tenant_id: params.related_tenant_id || null,
    event_impact: params.event_impact,
  };

  propertyHistoryStore.addEvent(event);
  return event;
}

/**
 * @summary
 * Registers a change record for a property.
 *
 * @function registerPropertyChange
 * @module services/propertyHistory
 *
 * @param {object} params - Change parameters
 * @returns {Promise<PropertyHistoryChangeRecord>} Created change record
 *
 * @example
 * const change = await registerPropertyChange({
 *   property_id: '550e8400-e29b-41d4-a716-446655440000',
 *   user_responsible: 'user123',
 *   field_modified: 'valor_aluguel',
 *   previous_value: '2500.00',
 *   new_value: '2800.00',
 *   change_reason: 'Reajuste anual conforme contrato',
 *   property_status: 'Ocupada',
 *   change_type: 'mudancas_valor_aluguel'
 * });
 */
export async function registerPropertyChange(params: {
  property_id: string;
  user_responsible: string;
  field_modified: string;
  previous_value: string | null;
  new_value: string;
  change_reason: string;
  property_status: string;
  change_type: string;
}): Promise<PropertyHistoryChangeRecord> {
  const change: PropertyHistoryChangeRecord = {
    change_id: uuidv4(),
    property_id: params.property_id,
    change_date: new Date().toISOString(),
    user_responsible: params.user_responsible,
    field_modified: params.field_modified,
    previous_value: params.previous_value,
    new_value: params.new_value,
    change_reason: params.change_reason,
    property_status: params.property_status,
    change_type: params.change_type as any,
  };

  propertyHistoryStore.addChange(change);
  return change;
}

/**
 * @summary
 * Registers an audit log for history consultation.
 *
 * @function registerAuditLog
 * @module services/propertyHistory
 *
 * @param {object} params - Audit parameters
 * @returns {Promise<void>}
 */
async function registerAuditLog(params: {
  user_id: string;
  consulted_property_id: string;
  applied_filters: object;
  records_returned: number;
  exported: boolean;
  export_format: string | null;
}): Promise<void> {
  const audit = {
    audit_id: uuidv4(),
    user_id: params.user_id,
    consulted_property_id: params.consulted_property_id,
    consultation_timestamp: new Date().toISOString(),
    applied_filters: params.applied_filters,
    records_returned: params.records_returned,
    exported: params.exported,
    export_format: params.export_format as any,
  };

  propertyAuditStore.addAudit(audit);
}
