/**
 * @summary
 * Type definitions for Property entity.
 *
 * @module services/property/propertyTypes
 */

import { PropertyStatus, PropertyType } from '@/constants';

/**
 * @interface PropertyEntity
 * @description Represents a property entity in the system
 *
 * @property {string} property_id - Unique property identifier (UUID)
 * @property {string} codigo_propriedade - Property code (PROP-YYYYMMDD-XXX)
 * @property {PropertyType} tipo_propriedade - Property type
 * @property {string} endereco_completo - Complete address
 * @property {string} cep - Postal code (XXXXX-XXX)
 * @property {string} bairro - Neighborhood
 * @property {string} cidade - City
 * @property {string} estado - State (UF)
 * @property {number} area_total - Total area in square meters
 * @property {number | null} quartos - Number of bedrooms (residential only)
 * @property {number | null} banheiros - Number of bathrooms
 * @property {number} vagas_garagem - Number of garage spaces
 * @property {number} valor_aluguel - Monthly rent value
 * @property {number | null} valor_condominio - Monthly condominium fee
 * @property {number | null} valor_iptu - Annual property tax
 * @property {string | null} descricao - Property description
 * @property {PropertyStatus} status - Current property status
 * @property {string} data_cadastro - Registration date (ISO 8601)
 * @property {string} usuario_cadastro - User who registered the property
 */
export interface PropertyEntity {
  property_id: string;
  codigo_propriedade: string;
  tipo_propriedade: PropertyType;
  endereco_completo: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  area_total: number;
  quartos: number | null;
  banheiros: number | null;
  vagas_garagem: number;
  valor_aluguel: number;
  valor_condominio: number | null;
  valor_iptu: number | null;
  descricao: string | null;
  status: PropertyStatus;
  data_cadastro: string;
  usuario_cadastro: string;
}

/**
 * @interface PropertyCreateRequest
 * @description Request payload for creating a property
 *
 * @property {PropertyType} tipo_propriedade - Property type
 * @property {string} endereco_completo - Complete address
 * @property {string} cep - Postal code
 * @property {string} bairro - Neighborhood
 * @property {string} cidade - City
 * @property {string} estado - State (UF)
 * @property {number} area_total - Total area in square meters
 * @property {number | null} quartos - Number of bedrooms (optional)
 * @property {number | null} banheiros - Number of bathrooms (optional)
 * @property {number} vagas_garagem - Number of garage spaces
 * @property {number} valor_aluguel - Monthly rent value
 * @property {number | null} valor_condominio - Monthly condominium fee (optional)
 * @property {number | null} valor_iptu - Annual property tax (optional)
 * @property {string | null} descricao - Property description (optional)
 * @property {string} usuario_cadastro - User registering the property
 */
export interface PropertyCreateRequest {
  tipo_propriedade: PropertyType;
  endereco_completo: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  area_total: number;
  quartos: number | null;
  banheiros: number | null;
  vagas_garagem: number;
  valor_aluguel: number;
  valor_condominio: number | null;
  valor_iptu: number | null;
  descricao: string | null;
  usuario_cadastro: string;
}

/**
 * @interface PropertyListResponse
 * @description Response structure for listing properties
 *
 * @property {string} property_id - Unique property identifier
 * @property {string} codigo_propriedade - Property code
 * @property {PropertyType} tipo_propriedade - Property type
 * @property {string} endereco_completo - Complete address
 * @property {string} bairro - Neighborhood
 * @property {string} cidade - City
 * @property {string} estado - State
 * @property {number} valor_aluguel - Monthly rent value
 * @property {PropertyStatus} status - Current status
 * @property {string} data_cadastro - Registration date
 */
export interface PropertyListResponse {
  property_id: string;
  codigo_propriedade: string;
  tipo_propriedade: PropertyType;
  endereco_completo: string;
  bairro: string;
  cidade: string;
  estado: string;
  valor_aluguel: number;
  status: PropertyStatus;
  data_cadastro: string;
}

/**
 * @interface ViaCepResponse
 * @description Response structure from ViaCEP API
 *
 * @property {string} cep - Postal code
 * @property {string} logradouro - Street name
 * @property {string} complemento - Additional address info
 * @property {string} bairro - Neighborhood
 * @property {string} localidade - City
 * @property {string} uf - State code
 * @property {boolean} erro - Error flag (true if CEP not found)
 */
export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
