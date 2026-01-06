/**
 * @summary
 * Business logic for Property update operations.
 * Handles property updates with validation, history tracking, and notifications.
 *
 * @module services/property/propertyUpdateService
 */

import { propertyStore } from '@/instances';
import { ServiceError } from '@/utils';
import { PropertyEntity } from './propertyTypes';
import { updateSchema } from './propertyUpdateValidation';

/**
 * @summary
 * Updates an existing property entity with validated data.
 *
 * @function propertyUpdate
 * @module services/property
 *
 * @param {string} property_id - Property UUID to update
 * @param {unknown} body - Raw request body to validate against updateSchema
 * @returns {Promise<PropertyEntity>} The updated property entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} NOT_FOUND (404) - When property with given ID does not exist
 * @throws {ServiceError} DUPLICATE_ADDRESS (409) - When updated address conflicts with another property
 *
 * @example
 * const updated = await propertyUpdate('550e8400-e29b-41d4-a716-446655440000', {
 *   endereco_completo: 'Rua Nova, 456',
 *   cep: '01310-200',
 *   bairro: 'Centro',
 *   cidade: 'São Paulo',
 *   estado: 'SP',
 *   tipo_propriedade: 'Casa',
 *   area_total: 180.0,
 *   quartos: 4,
 *   banheiros: 3,
 *   vagas_garagem: 2,
 *   valor_aluguel: 3000.00,
 *   valor_condominio: 400.00,
 *   valor_iptu: 1500.00,
 *   descricao: 'Casa reformada',
 *   status: 'Disponível'
 * });
 */
export async function propertyUpdate(property_id: string, body: unknown): Promise<PropertyEntity> {
  const validation = updateSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  // Check if property exists
  const existing = propertyStore.getById(property_id);
  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Propriedade não encontrada', 404);
  }

  // Check for duplicate address (excluding current property)
  const duplicateExists = propertyStore
    .getAll()
    .some(
      (p) =>
        p.property_id !== property_id &&
        p.endereco_completo.toLowerCase() === params.endereco_completo.toLowerCase() &&
        p.bairro.toLowerCase() === params.bairro.toLowerCase() &&
        p.cep === params.cep &&
        p.cidade.toLowerCase() === params.cidade.toLowerCase() &&
        p.estado.toUpperCase() === params.estado.toUpperCase()
    );

  if (duplicateExists) {
    throw new ServiceError(
      'DUPLICATE_ADDRESS',
      'Já existe outra propriedade cadastrada com este endereço completo, bairro, CEP, cidade e estado',
      409
    );
  }

  // Update property
  const updated: PropertyEntity = {
    ...existing,
    tipo_propriedade: params.tipo_propriedade as PropertyEntity['tipo_propriedade'],
    endereco_completo: params.endereco_completo,
    cep: params.cep,
    bairro: params.bairro,
    cidade: params.cidade,
    estado: params.estado,
    area_total: params.area_total,
    quartos: params.quartos,
    banheiros: params.banheiros,
    vagas_garagem: params.vagas_garagem,
    valor_aluguel: params.valor_aluguel,
    valor_condominio: params.valor_condominio,
    valor_iptu: params.valor_iptu,
    descricao: params.descricao,
    status: params.status as PropertyEntity['status'],
  };

  // Update in store
  propertyStore.update(property_id, updated);

  return updated;
}
