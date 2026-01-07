/**
 * @summary
 * In-memory store instance for Property History Audit logs.
 * Provides singleton pattern for audit data storage without database.
 *
 * @module instances/propertyHistory/propertyAuditStore
 */

import { PropertyHistoryAuditRecord } from '@/services/propertyHistory';

/**
 * In-memory store for Property History Audit records
 */
class PropertyAuditStore {
  private audits: Map<string, PropertyHistoryAuditRecord> = new Map();

  /**
   * Add audit record
   */
  addAudit(audit: PropertyHistoryAuditRecord): PropertyHistoryAuditRecord {
    this.audits.set(audit.audit_id, audit);
    return audit;
  }

  /**
   * Get all audits for a property
   */
  getAuditsByPropertyId(property_id: string): PropertyHistoryAuditRecord[] {
    return Array.from(this.audits.values())
      .filter((a) => a.consulted_property_id === property_id)
      .sort(
        (a, b) =>
          new Date(b.consultation_timestamp).getTime() -
          new Date(a.consultation_timestamp).getTime()
      );
  }

  /**
   * Get all audits for a user
   */
  getAuditsByUserId(user_id: string): PropertyHistoryAuditRecord[] {
    return Array.from(this.audits.values())
      .filter((a) => a.user_id === user_id)
      .sort(
        (a, b) =>
          new Date(b.consultation_timestamp).getTime() -
          new Date(a.consultation_timestamp).getTime()
      );
  }

  /**
   * Get audit by ID
   */
  getAuditById(audit_id: string): PropertyHistoryAuditRecord | undefined {
    return this.audits.get(audit_id);
  }

  /**
   * Get total count of audits
   */
  count(): number {
    return this.audits.size;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.audits.clear();
  }
}

/**
 * Singleton instance of PropertyAuditStore
 */
export const propertyAuditStore = new PropertyAuditStore();
