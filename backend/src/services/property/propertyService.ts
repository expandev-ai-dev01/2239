/**
 * @summary
 * Business logic for Property entity.
 * Handles CRUD operations using in-memory storage.
 * All validation and business logic is centralized here.
 *
 * @module services/property/propertyService
 */

import { v4 as uuidv4 } from 'uuid';
import { PROPERTY_DEFAULTS } from '@/constants';
import { propertyStore, codigoSequencialStore } from '@/instances';
import { ServiceError } from '@/utils';
import { PropertyEntity, PropertyListResponse, ViaCepResponse } from './propertyTypes';
import { createSchema, cepValidationSchema } from './propertyValidation';

/**
 * @summary
 * Validates CEP through ViaCEP API and returns address data.
 *
 * @function validateCep
 * @module services/property
 *
 * @param {string} cep - CEP to validate (format: XXXXX-XXX)
 * @returns {Promise<ViaCepResponse | null>} Address data or null if API unavailable
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When CEP format is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When CEP is not found
 *
 * @example
 * const addressData = await validateCep('01310-100');
 * // Returns: { cep: '01310-100', logradouro: 'Avenida Paulista', bairro: 'Bela Vista', localidade: 'São Paulo', uf: 'SP', ... }
 */
export async function validateCep(cep: string): Promise<ViaCepResponse | null> {
  const validation = cepValidationSchema.safeParse({ cep });

  if (!validation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'CEP informado não é válido',
      400,
      validation.error.errors
    );
  }

  try {
    // Remove hyphen for API call
    const cepClean = cep.replace('-', '');
    const response = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`, {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      return null; // API unavailable
    }

    const data = (await response.json()) as ViaCepResponse;

    if (data.erro) {
      throw new ServiceError('NOT_FOUND', 'CEP não encontrado', 404);
    }

    return data;
  } catch (error: any) {
    // If it's already a ServiceError, rethrow it
    if (error instanceof ServiceError) {
      throw error;
    }

    // For network errors or timeouts, return null (API unavailable)
    console.warn('ViaCEP API unavailable:', error.message);
    return null;
  }
}

/**
 * @summary
 * Generates next property code with format PROP-YYYYMMDD-XXX.
 * Implements concurrency control using sequential store.
 *
 * @function generatePropertyCode
 * @module services/property
 *
 * @returns {Promise<string>} Generated property code
 *
 * @example
 * const code = await generatePropertyCode();
 * // Returns: 'PROP-20250128-001'
 */
async function generatePropertyCode(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD

  // Get next sequential number for today (with concurrency control)
  const sequential = codigoSequencialStore.getNextSequential(dateStr);

  // Format: PROP-YYYYMMDD-XXX
  const code = `PROP-${dateStr}-${String(sequential).padStart(3, '0')}`;

  return code;
}

/**
 * @summary
 * Checks if property with same address already exists.
 * Validates unique combination of endereco_completo + bairro + cep + cidade + estado.
 *
 * @function checkDuplicateAddress
 * @module services/property
 *
 * @param {string} endereco_completo - Complete address
 * @param {string} bairro - Neighborhood
 * @param {string} cep - Postal code
 * @param {string} cidade - City
 * @param {string} estado - State
 *
 * @returns {boolean} True if duplicate exists
 */
function checkDuplicateAddress(
  endereco_completo: string,
  bairro: string,
  cep: string,
  cidade: string,
  estado: string
): boolean {
  return propertyStore.existsByAddress(endereco_completo, bairro, cep, cidade, estado);
}

/**
 * @summary
 * Lists all properties from the in-memory store.
 *
 * @function propertyList
 * @module services/property
 *
 * @returns {Promise<PropertyListResponse[]>} List of property entities
 *
 * @example
 * const properties = await propertyList();
 * // Returns: [{ property_id: '...', codigo_propriedade: 'PROP-20250128-001', ... }]
 */
export async function propertyList(): Promise<PropertyListResponse[]> {
  const records = propertyStore.getAll();
  return records.map((p) => ({
    property_id: p.property_id,
    codigo_propriedade: p.codigo_propriedade,
    tipo_propriedade: p.tipo_propriedade,
    endereco_completo: p.endereco_completo,
    bairro: p.bairro,
    cidade: p.cidade,
    estado: p.estado,
    valor_aluguel: p.valor_aluguel,
    status: p.status,
    data_cadastro: p.data_cadastro,
  }));
}

/**
 * @summary
 * Creates a new property entity with validated data.
 *
 * @function propertyCreate
 * @module services/property
 *
 * @param {unknown} body - Raw request body to validate against createSchema
 * @returns {Promise<PropertyEntity>} The newly created property entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} DUPLICATE_ADDRESS (409) - When address already exists
 * @throws {ServiceError} MAX_RECORDS_REACHED (507) - When storage limit reached
 *
 * @example
 * const newProperty = await propertyCreate({
 *   tipo_propriedade: 'Casa',
 *   endereco_completo: 'Rua das Flores, 123',
 *   cep: '01310-100',
 *   bairro: 'Centro',
 *   cidade: 'São Paulo',
 *   estado: 'SP',
 *   area_total: 150.5,
 *   quartos: 3,
 *   banheiros: 2,
 *   vagas_garagem: 2,
 *   valor_aluguel: 2500.00,
 *   valor_condominio: 350.00,
 *   valor_iptu: 1200.00,
 *   descricao: 'Casa ampla com quintal',
 *   usuario_cadastro: 'user123'
 * });
 */
export async function propertyCreate(body: unknown): Promise<PropertyEntity> {
  const validation = createSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  // BR-001: Check for duplicate address
  if (
    checkDuplicateAddress(
      params.endereco_completo,
      params.bairro,
      params.cep,
      params.cidade,
      params.estado
    )
  ) {
    throw new ServiceError(
      'DUPLICATE_ADDRESS',
      'Já existe uma propriedade cadastrada com este endereço completo, bairro, CEP, cidade e estado',
      409
    );
  }

  // Check storage limit
  if (propertyStore.count() >= PROPERTY_DEFAULTS.MAX_RECORDS) {
    throw new ServiceError('MAX_RECORDS_REACHED', 'Limite máximo de propriedades atingido', 507);
  }

  const now = new Date().toISOString();
  const property_id = uuidv4();
  const codigo_propriedade = await generatePropertyCode();

  const newProperty: PropertyEntity = {
    property_id,
    codigo_propriedade,
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
    status: PROPERTY_DEFAULTS.STATUS,
    data_cadastro: now,
    usuario_cadastro: params.usuario_cadastro,
  };

  propertyStore.add(newProperty);
  return newProperty;
}

/**
 * @summary
 * Retrieves a specific property by its unique identifier.
 *
 * @function propertyGet
 * @module services/property
 *
 * @param {string} property_id - Property UUID
 * @returns {Promise<PropertyEntity>} The found property entity
 *
 * @throws {ServiceError} NOT_FOUND (404) - When property with given ID does not exist
 *
 * @example
 * const property = await propertyGet('550e8400-e29b-41d4-a716-446655440000');
 */
export async function propertyGet(property_id: string): Promise<PropertyEntity> {
  const record = propertyStore.getById(property_id);

  if (!record) {
    throw new ServiceError('NOT_FOUND', 'Propriedade não encontrada', 404);
  }

  return record;
}
