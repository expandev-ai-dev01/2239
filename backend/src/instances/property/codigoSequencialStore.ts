/**
 * @summary
 * In-memory store for property code sequential control.
 * Implements concurrency control for generating unique sequential codes.
 *
 * @module instances/property/codigoSequencialStore
 */

/**
 * Sequential control record structure
 */
interface SequencialRecord {
  data_referencia: string; // YYYYMMDD format
  ultimo_sequencial: number;
  created_at: string;
  updated_at: string;
}

/**
 * In-memory store for sequential code control
 */
class CodigoSequencialStore {
  private records: Map<string, SequencialRecord> = new Map();
  private locks: Map<string, boolean> = new Map();

  /**
   * Get next sequential number for a given date with concurrency control
   * @param {string} dateRef - Date reference in YYYYMMDD format
   * @returns {number} Next sequential number
   */
  getNextSequential(dateRef: string): number {
    // Acquire lock for this date
    this.acquireLock(dateRef);

    try {
      const existing = this.records.get(dateRef);
      const now = new Date().toISOString();

      if (existing) {
        // Increment existing sequential
        existing.ultimo_sequencial += 1;
        existing.updated_at = now;
        this.records.set(dateRef, existing);
        return existing.ultimo_sequencial;
      } else {
        // Create new sequential record for this date
        const newRecord: SequencialRecord = {
          data_referencia: dateRef,
          ultimo_sequencial: 1,
          created_at: now,
          updated_at: now,
        };
        this.records.set(dateRef, newRecord);
        return 1;
      }
    } finally {
      // Always release lock
      this.releaseLock(dateRef);
    }
  }

  /**
   * Acquire lock for date reference (simulates database lock)
   * In production with real database, this would be a SELECT FOR UPDATE
   */
  private acquireLock(dateRef: string): void {
    const maxAttempts = 50;
    const delayMs = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (!this.locks.get(dateRef)) {
        this.locks.set(dateRef, true);
        return;
      }

      // Wait before retry (synchronous wait for simplicity in this example)
      const start = Date.now();
      while (Date.now() - start < delayMs) {
        // Busy wait
      }
    }

    throw new Error('Lock timeout: Sistema ocupado, tente novamente em alguns segundos');
  }

  /**
   * Release lock for date reference
   */
  private releaseLock(dateRef: string): void {
    this.locks.delete(dateRef);
  }

  /**
   * Get current sequential for a date (without incrementing)
   */
  getCurrentSequential(dateRef: string): number {
    const record = this.records.get(dateRef);
    return record ? record.ultimo_sequencial : 0;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.records.clear();
    this.locks.clear();
  }
}

/**
 * Singleton instance of CodigoSequencialStore
 */
export const codigoSequencialStore = new CodigoSequencialStore();
