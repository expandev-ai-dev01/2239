/**
 * @summary
 * In-memory store instance for Property entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/property/propertyStore
 */

import { PropertyEntity } from '@/services/property';

/**
 * In-memory store for Property records
 */
class PropertyStore {
  private records: Map<string, PropertyEntity> = new Map();

  /**
   * Get all records
   */
  getAll(): PropertyEntity[] {
    return Array.from(this.records.values());
  }

  /**
   * Get record by ID
   */
  getById(property_id: string): PropertyEntity | undefined {
    return this.records.get(property_id);
  }

  /**
   * Check if property exists by address combination
   */
  existsByAddress(
    endereco_completo: string,
    bairro: string,
    cep: string,
    cidade: string,
    estado: string
  ): boolean {
    return Array.from(this.records.values()).some(
      (p) =>
        p.endereco_completo.toLowerCase() === endereco_completo.toLowerCase() &&
        p.bairro.toLowerCase() === bairro.toLowerCase() &&
        p.cep === cep &&
        p.cidade.toLowerCase() === cidade.toLowerCase() &&
        p.estado.toUpperCase() === estado.toUpperCase()
    );
  }

  /**
   * Add new record
   */
  add(record: PropertyEntity): PropertyEntity {
    this.records.set(record.property_id, record);
    return record;
  }

  /**
   * Update existing record
   */
  update(property_id: string, data: PropertyEntity): PropertyEntity {
    this.records.set(property_id, data);
    return data;
  }

  /**
   * Check if record exists
   */
  exists(property_id: string): boolean {
    return this.records.has(property_id);
  }

  /**
   * Get total count of records
   */
  count(): number {
    return this.records.size;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.records.clear();
  }
}

/**
 * Singleton instance of PropertyStore
 */
export const propertyStore = new PropertyStore();
