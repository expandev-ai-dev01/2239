/**
 * Property History domain type definitions
 * @module domain/propertyHistory/types/models
 */

export interface PropertyChange {
  change_id: string;
  property_id: string;
  change_date: string;
  user_responsible: string;
  field_modified: string;
  previous_value: string | null;
  new_value: string;
  change_reason: string;
  property_status: string;
  change_type: string;
}

export interface PropertyLifecycleEvent {
  event_id: string;
  property_id: string;
  event_type: string;
  event_date: string;
  event_description: string;
  related_contract_id: string | null;
  related_tenant_id: string | null;
  event_impact: string;
}

export interface PropertyHistorySummary {
  total_changes: number;
  total_events: number;
  first_change_date: string | null;
  last_change_date: string | null;
}

export interface PropertyHistoryResponse {
  changes: PropertyChange[];
  lifecycle_events: PropertyLifecycleEvent[];
  summary: PropertyHistorySummary;
}

export interface PropertyHistoryFilters {
  property_id: string;
  start_date?: string;
  end_date?: string;
  change_type?: string;
  responsible_user?: string;
}
