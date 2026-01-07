/**
 * @summary
 * In-memory store instance for Property History entity.
 * Provides singleton pattern for history data storage without database.
 *
 * @module instances/propertyHistory/propertyHistoryStore
 */

import {
  PropertyHistoryChangeRecord,
  PropertyLifecycleEventRecord,
} from '@/services/propertyHistory';

/**
 * In-memory store for Property History records
 */
class PropertyHistoryStore {
  private changes: Map<string, PropertyHistoryChangeRecord> = new Map();
  private events: Map<string, PropertyLifecycleEventRecord> = new Map();

  /**
   * Add change record
   */
  addChange(change: PropertyHistoryChangeRecord): PropertyHistoryChangeRecord {
    this.changes.set(change.change_id, change);
    return change;
  }

  /**
   * Add lifecycle event
   */
  addEvent(event: PropertyLifecycleEventRecord): PropertyLifecycleEventRecord {
    this.events.set(event.event_id, event);
    return event;
  }

  /**
   * Get all changes for a property
   */
  getChangesByPropertyId(property_id: string): PropertyHistoryChangeRecord[] {
    return Array.from(this.changes.values())
      .filter((c) => c.property_id === property_id)
      .sort((a, b) => new Date(b.change_date).getTime() - new Date(a.change_date).getTime());
  }

  /**
   * Get all events for a property
   */
  getEventsByPropertyId(property_id: string): PropertyLifecycleEventRecord[] {
    return Array.from(this.events.values())
      .filter((e) => e.property_id === property_id)
      .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
  }

  /**
   * Get change by ID
   */
  getChangeById(change_id: string): PropertyHistoryChangeRecord | undefined {
    return this.changes.get(change_id);
  }

  /**
   * Get event by ID
   */
  getEventById(event_id: string): PropertyLifecycleEventRecord | undefined {
    return this.events.get(event_id);
  }

  /**
   * Get total count of changes
   */
  countChanges(): number {
    return this.changes.size;
  }

  /**
   * Get total count of events
   */
  countEvents(): number {
    return this.events.size;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.changes.clear();
    this.events.clear();
  }
}

/**
 * Singleton instance of PropertyHistoryStore
 */
export const propertyHistoryStore = new PropertyHistoryStore();
