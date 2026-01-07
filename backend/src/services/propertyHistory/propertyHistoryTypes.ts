/**
 * @summary
 * Type definitions for Property History entity.
 *
 * @module services/propertyHistory/propertyHistoryTypes
 */

import { PropertyChangeType, PropertyLifecycleEvent, PropertyExportFormat } from '@/constants';

/**
 * @interface PropertyHistoryChangeRecord
 * @description Represents a single change record in property history
 *
 * @property {string} change_id - Unique change identifier (UUID)
 * @property {string} property_id - Property identifier (UUID)
 * @property {string} change_date - Date and time of change (ISO 8601)
 * @property {string} user_responsible - User who made the change
 * @property {string} field_modified - Field that was modified
 * @property {string | null} previous_value - Previous value (null if new field)
 * @property {string} new_value - New value
 * @property {string} change_reason - Reason for the change (mandatory)
 * @property {string} property_status - Property status at time of change
 * @property {PropertyChangeType} change_type - Type of change
 */
export interface PropertyHistoryChangeRecord {
  change_id: string;
  property_id: string;
  change_date: string;
  user_responsible: string;
  field_modified: string;
  previous_value: string | null;
  new_value: string;
  change_reason: string;
  property_status: string;
  change_type: PropertyChangeType;
}

/**
 * @interface PropertyLifecycleEventRecord
 * @description Represents a lifecycle event in property history
 *
 * @property {string} event_id - Unique event identifier (UUID)
 * @property {string} property_id - Property identifier (UUID)
 * @property {PropertyLifecycleEvent} event_type - Type of lifecycle event
 * @property {string} event_date - Date and time of event (ISO 8601)
 * @property {string} event_description - Detailed event description
 * @property {string | null} related_contract_id - Related contract ID (if applicable)
 * @property {string | null} related_tenant_id - Related tenant ID (if applicable)
 * @property {string} event_impact - Impact description on property
 */
export interface PropertyLifecycleEventRecord {
  event_id: string;
  property_id: string;
  event_type: PropertyLifecycleEvent;
  event_date: string;
  event_description: string;
  related_contract_id: string | null;
  related_tenant_id: string | null;
  event_impact: string;
}

/**
 * @interface PropertyHistoryQueryParams
 * @description Query parameters for property history consultation
 *
 * @property {string} property_id - Property UUID (required)
 * @property {string} [start_date] - Start date filter (YYYY-MM-DD)
 * @property {string} [end_date] - End date filter (YYYY-MM-DD)
 * @property {PropertyChangeType} [change_type] - Change type filter
 * @property {string} [responsible_user] - User filter
 */
export interface PropertyHistoryQueryParams {
  property_id: string;
  start_date?: string;
  end_date?: string;
  change_type?: PropertyChangeType;
  responsible_user?: string;
}

/**
 * @interface PropertyHistoryResponse
 * @description Complete property history response
 *
 * @property {PropertyHistoryChangeRecord[]} changes - List of change records
 * @property {PropertyLifecycleEventRecord[]} lifecycle_events - List of lifecycle events
 * @property {object} summary - History summary
 * @property {number} summary.total_changes - Total number of changes
 * @property {number} summary.total_events - Total number of events
 * @property {string} summary.first_change_date - Date of first change
 * @property {string} summary.last_change_date - Date of last change
 */
export interface PropertyHistoryResponse {
  changes: PropertyHistoryChangeRecord[];
  lifecycle_events: PropertyLifecycleEventRecord[];
  summary: {
    total_changes: number;
    total_events: number;
    first_change_date: string | null;
    last_change_date: string | null;
  };
}

/**
 * @interface PropertyHistoryExportParams
 * @description Parameters for history export
 *
 * @property {string} property_id - Property UUID
 * @property {PropertyExportFormat} export_format - Export format
 * @property {boolean} [include_details] - Include complementary information
 * @property {string[]} [structured_sections] - Sections for structured PDF
 * @property {string[]} [tabular_columns] - Columns for tabular export
 * @property {object} [condensed_criteria] - Criteria for condensed PDF
 */
export interface PropertyHistoryExportParams {
  property_id: string;
  export_format: PropertyExportFormat;
  include_details?: boolean;
  structured_sections?: string[];
  tabular_columns?: string[];
  condensed_criteria?: {
    apenas_alteracoes_principais?: boolean;
    eventos_criticos_apenas?: boolean;
    periodo_resumido?: boolean;
  };
}

/**
 * @interface PropertyHistoryAuditRecord
 * @description Audit record for history consultation
 *
 * @property {string} audit_id - Unique audit identifier (UUID)
 * @property {string} user_id - User who performed consultation (UUID)
 * @property {string} consulted_property_id - Property consulted (UUID)
 * @property {string} consultation_timestamp - Consultation timestamp (ISO 8601)
 * @property {object | null} applied_filters - Filters applied in consultation
 * @property {number} records_returned - Number of records returned
 * @property {boolean} exported - Whether data was exported
 * @property {PropertyExportFormat | null} export_format - Export format used (if exported)
 */
export interface PropertyHistoryAuditRecord {
  audit_id: string;
  user_id: string;
  consulted_property_id: string;
  consultation_timestamp: string;
  applied_filters: object | null;
  records_returned: number;
  exported: boolean;
  export_format: PropertyExportFormat | null;
}
