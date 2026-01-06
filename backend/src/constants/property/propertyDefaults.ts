/**
 * @summary
 * Default values and constants for Property entity.
 * Provides centralized configuration for property creation, validation limits,
 * and status definitions.
 *
 * @module constants/property/propertyDefaults
 */

/**
 * @interface PropertyDefaultsType
 * @description Default configuration values applied when creating new Property entities.
 *
 * @property {string} STATUS - Default status for new properties ('Disponível')
 * @property {number} VAGAS_GARAGEM - Default garage spaces (0)
 * @property {number} MAX_RECORDS - Maximum allowed records in memory (10000)
 */
export const PROPERTY_DEFAULTS = {
  /** Default status for new properties */
  STATUS: 'Disponível' as const,
  /** Default garage spaces */
  VAGAS_GARAGEM: 0,
  /** Maximum allowed records in memory */
  MAX_RECORDS: 10000,
} as const;

/** Type representing the PROPERTY_DEFAULTS constant */
export type PropertyDefaultsType = typeof PROPERTY_DEFAULTS;

/**
 * @interface PropertyStatusType
 * @description Available status values for Property entities.
 *
 * @property {string} DISPONIVEL - Available status ('Disponível')
 * @property {string} OCUPADA - Occupied status ('Ocupada')
 * @property {string} MANUTENCAO - Maintenance status ('Manutenção')
 * @property {string} INATIVA - Inactive status ('Inativa')
 */
export const PROPERTY_STATUS = {
  DISPONIVEL: 'Disponível',
  OCUPADA: 'Ocupada',
  MANUTENCAO: 'Manutenção',
  INATIVA: 'Inativa',
} as const;

/** Type representing the PROPERTY_STATUS constant */
export type PropertyStatusType = typeof PROPERTY_STATUS;

/** Union type of all valid status values */
export type PropertyStatus = (typeof PROPERTY_STATUS)[keyof typeof PROPERTY_STATUS];

/**
 * @interface PropertyTypesType
 * @description Available property types.
 *
 * @property {string} CASA - House type ('Casa')
 * @property {string} APARTAMENTO - Apartment type ('Apartamento')
 * @property {string} KITNET - Studio type ('Kitnet')
 * @property {string} LOJA - Store type ('Loja')
 * @property {string} SALA_COMERCIAL - Commercial room type ('Sala Comercial')
 * @property {string} GALPAO - Warehouse type ('Galpão')
 */
export const PROPERTY_TYPES = {
  CASA: 'Casa',
  APARTAMENTO: 'Apartamento',
  KITNET: 'Kitnet',
  LOJA: 'Loja',
  SALA_COMERCIAL: 'Sala Comercial',
  GALPAO: 'Galpão',
} as const;

/** Type representing the PROPERTY_TYPES constant */
export type PropertyTypesType = typeof PROPERTY_TYPES;

/** Union type of all valid property types */
export type PropertyType = (typeof PROPERTY_TYPES)[keyof typeof PROPERTY_TYPES];

/** Residential property types (allow quartos field) */
export const RESIDENTIAL_TYPES = [
  PROPERTY_TYPES.CASA,
  PROPERTY_TYPES.APARTAMENTO,
  PROPERTY_TYPES.KITNET,
] as const;

/** Commercial property types (quartos field not applicable) */
export const COMMERCIAL_TYPES = [
  PROPERTY_TYPES.LOJA,
  PROPERTY_TYPES.SALA_COMERCIAL,
  PROPERTY_TYPES.GALPAO,
] as const;

/**
 * @interface PropertyLimitsType
 * @description Validation constraints for Property entity fields.
 *
 * @property {number} ENDERECO_MAX_LENGTH - Maximum characters for address field (200)
 * @property {number} CEP_LENGTH - Exact length for CEP field (9 with hyphen)
 * @property {number} BAIRRO_MAX_LENGTH - Maximum characters for neighborhood field (100)
 * @property {number} CIDADE_MAX_LENGTH - Maximum characters for city field (100)
 * @property {number} ESTADO_LENGTH - Exact length for state field (2)
 * @property {number} AREA_MIN - Minimum area in square meters (0.01)
 * @property {number} AREA_MAX - Maximum area in square meters (10000)
 * @property {number} QUARTOS_MIN - Minimum number of bedrooms (0)
 * @property {number} QUARTOS_MAX - Maximum number of bedrooms (20)
 * @property {number} BANHEIROS_MIN - Minimum number of bathrooms (0)
 * @property {number} BANHEIROS_MAX - Maximum number of bathrooms (10)
 * @property {number} VAGAS_MIN - Minimum garage spaces (0)
 * @property {number} VAGAS_MAX - Maximum garage spaces (20)
 * @property {number} DESCRICAO_MAX_LENGTH - Maximum characters for description field (1000)
 * @property {number} CODIGO_MAX_LENGTH - Maximum characters for property code (20)
 */
export const PROPERTY_LIMITS = {
  ENDERECO_MAX_LENGTH: 200,
  CEP_LENGTH: 9,
  BAIRRO_MAX_LENGTH: 100,
  CIDADE_MAX_LENGTH: 100,
  ESTADO_LENGTH: 2,
  AREA_MIN: 0.01,
  AREA_MAX: 10000,
  QUARTOS_MIN: 0,
  QUARTOS_MAX: 20,
  BANHEIROS_MIN: 0,
  BANHEIROS_MAX: 10,
  VAGAS_MIN: 0,
  VAGAS_MAX: 20,
  DESCRICAO_MAX_LENGTH: 1000,
  CODIGO_MAX_LENGTH: 20,
} as const;

/** Type representing the PROPERTY_LIMITS constant */
export type PropertyLimitsType = typeof PROPERTY_LIMITS;

/**
 * Valid Brazilian state codes (UF)
 */
export const VALID_ESTADOS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

/** Type for valid state codes */
export type ValidEstado = (typeof VALID_ESTADOS)[number];
