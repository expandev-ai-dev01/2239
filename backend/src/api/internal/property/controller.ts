/**
 * @summary
 * API controller for Property entity.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/property/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  propertyCreate,
  propertyList,
  propertyGet,
  propertyUpdate,
  validateCep,
} from '@/services/property';

/**
 * @api {get} /api/internal/property List Properties
 * @apiName ListProperties
 * @apiGroup Property
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object[]} data List of properties
 * @apiSuccess {String} data.property_id Unique identifier (UUID)
 * @apiSuccess {String} data.codigo_propriedade Property code (PROP-YYYYMMDD-XXX)
 * @apiSuccess {String} data.tipo_propriedade Property type (Casa | Apartamento | Kitnet | Loja | Sala Comercial | Galpão)
 * @apiSuccess {String} data.endereco_completo Complete address
 * @apiSuccess {String} data.bairro Neighborhood
 * @apiSuccess {String} data.cidade City
 * @apiSuccess {String} data.estado State (UF)
 * @apiSuccess {Number} data.valor_aluguel Monthly rent value
 * @apiSuccess {String} data.status Current status (Disponível | Ocupada | Manutenção | Inativa)
 * @apiSuccess {String} data.data_cadastro ISO 8601 timestamp
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await propertyList();
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/property Create Property
 * @apiName CreateProperty
 * @apiGroup Property
 *
 * @apiBody {String} tipo_propriedade Property type (Casa | Apartamento | Kitnet | Loja | Sala Comercial | Galpão)
 * @apiBody {String} endereco_completo Complete address (max 200 chars, format: Tipo Logradouro Nome, Número, Complemento)
 * @apiBody {String} cep Postal code (format: XXXXX-XXX)
 * @apiBody {String} bairro Neighborhood (max 100 chars)
 * @apiBody {String} cidade City (max 100 chars)
 * @apiBody {String} estado State code (2 chars, valid UF)
 * @apiBody {Number} area_total Total area in square meters (0.01 to 10000)
 * @apiBody {Number|null} quartos Number of bedrooms (0-20, null for commercial properties)
 * @apiBody {Number|null} banheiros Number of bathrooms (0-10)
 * @apiBody {Number} vagas_garagem Number of garage spaces (0-20)
 * @apiBody {Number} valor_aluguel Monthly rent value (must be > 0)
 * @apiBody {Number|null} valor_condominio Monthly condominium fee (>= 0)
 * @apiBody {Number|null} valor_iptu Annual property tax (>= 0)
 * @apiBody {String|null} descricao Property description (max 1000 chars)
 * @apiBody {String} usuario_cadastro User registering the property
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.property_id Unique identifier (UUID)
 * @apiSuccess {String} data.codigo_propriedade Generated property code
 * @apiSuccess {String} data.tipo_propriedade Property type
 * @apiSuccess {String} data.endereco_completo Complete address
 * @apiSuccess {String} data.cep Postal code
 * @apiSuccess {String} data.bairro Neighborhood
 * @apiSuccess {String} data.cidade City
 * @apiSuccess {String} data.estado State
 * @apiSuccess {Number} data.area_total Total area
 * @apiSuccess {Number|null} data.quartos Number of bedrooms
 * @apiSuccess {Number|null} data.banheiros Number of bathrooms
 * @apiSuccess {Number} data.vagas_garagem Garage spaces
 * @apiSuccess {Number} data.valor_aluguel Monthly rent
 * @apiSuccess {Number|null} data.valor_condominio Condominium fee
 * @apiSuccess {Number|null} data.valor_iptu Property tax
 * @apiSuccess {String|null} data.descricao Description
 * @apiSuccess {String} data.status Status (always 'Disponível' for new properties)
 * @apiSuccess {String} data.data_cadastro ISO 8601 timestamp
 * @apiSuccess {String} data.usuario_cadastro User who registered
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | DUPLICATE_ADDRESS | MAX_RECORDS_REACHED)
 * @apiError {String} error.message Error message
 * @apiError {Object} error.details Validation error details (if applicable)
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await propertyCreate(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/property/:id Get Property
 * @apiName GetProperty
 * @apiGroup Property
 *
 * @apiParam {String} id Property UUID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.property_id Unique identifier (UUID)
 * @apiSuccess {String} data.codigo_propriedade Property code
 * @apiSuccess {String} data.tipo_propriedade Property type
 * @apiSuccess {String} data.endereco_completo Complete address
 * @apiSuccess {String} data.cep Postal code
 * @apiSuccess {String} data.bairro Neighborhood
 * @apiSuccess {String} data.cidade City
 * @apiSuccess {String} data.estado State
 * @apiSuccess {Number} data.area_total Total area
 * @apiSuccess {Number|null} data.quartos Number of bedrooms
 * @apiSuccess {Number|null} data.banheiros Number of bathrooms
 * @apiSuccess {Number} data.vagas_garagem Garage spaces
 * @apiSuccess {Number} data.valor_aluguel Monthly rent
 * @apiSuccess {Number|null} data.valor_condominio Condominium fee
 * @apiSuccess {Number|null} data.valor_iptu Property tax
 * @apiSuccess {String|null} data.descricao Description
 * @apiSuccess {String} data.status Current status
 * @apiSuccess {String} data.data_cadastro ISO 8601 timestamp
 * @apiSuccess {String} data.usuario_cadastro User who registered
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await propertyGet(req.params.id);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/internal/property/:id Update Property
 * @apiName UpdateProperty
 * @apiGroup Property
 *
 * @apiParam {String} id Property UUID
 *
 * @apiBody {String} tipo_propriedade Property type (Casa | Apartamento | Kitnet | Loja | Sala Comercial | Galpão)
 * @apiBody {String} endereco_completo Complete address (max 200 chars)
 * @apiBody {String} cep Postal code (format: XXXXX-XXX)
 * @apiBody {String} bairro Neighborhood (max 100 chars)
 * @apiBody {String} cidade City (max 100 chars)
 * @apiBody {String} estado State code (2 chars, valid UF)
 * @apiBody {Number} area_total Total area in square meters (0.01 to 10000)
 * @apiBody {Number|null} quartos Number of bedrooms (0-20, null for commercial)
 * @apiBody {Number|null} banheiros Number of bathrooms (0-10)
 * @apiBody {Number} vagas_garagem Number of garage spaces (0-20)
 * @apiBody {Number} valor_aluguel Monthly rent value (must be > 0)
 * @apiBody {Number|null} valor_condominio Monthly condominium fee (>= 0)
 * @apiBody {Number|null} valor_iptu Annual property tax (>= 0)
 * @apiBody {String|null} descricao Property description (max 1000 chars)
 * @apiBody {String} status Property status (Disponível | Ocupada | Manutenção | Inativa)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.property_id Unique identifier (UUID)
 * @apiSuccess {String} data.codigo_propriedade Property code
 * @apiSuccess {String} data.tipo_propriedade Property type
 * @apiSuccess {String} data.endereco_completo Complete address
 * @apiSuccess {String} data.cep Postal code
 * @apiSuccess {String} data.bairro Neighborhood
 * @apiSuccess {String} data.cidade City
 * @apiSuccess {String} data.estado State
 * @apiSuccess {Number} data.area_total Total area
 * @apiSuccess {Number|null} data.quartos Number of bedrooms
 * @apiSuccess {Number|null} data.banheiros Number of bathrooms
 * @apiSuccess {Number} data.vagas_garagem Garage spaces
 * @apiSuccess {Number} data.valor_aluguel Monthly rent
 * @apiSuccess {Number|null} data.valor_condominio Condominium fee
 * @apiSuccess {Number|null} data.valor_iptu Property tax
 * @apiSuccess {String|null} data.descricao Description
 * @apiSuccess {String} data.status Current status
 * @apiSuccess {String} data.data_cadastro ISO 8601 timestamp
 * @apiSuccess {String} data.usuario_cadastro User who registered
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR | DUPLICATE_ADDRESS)
 * @apiError {String} error.message Error message
 * @apiError {Object} error.details Validation error details (if applicable)
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await propertyUpdate(req.params.id, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/property/validate-cep Validate CEP
 * @apiName ValidateCep
 * @apiGroup Property
 *
 * @apiBody {String} cep Postal code to validate (format: XXXXX-XXX)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.cep Postal code
 * @apiSuccess {String} data.logradouro Street name
 * @apiSuccess {String} data.complemento Additional address info
 * @apiSuccess {String} data.bairro Neighborhood
 * @apiSuccess {String} data.localidade City
 * @apiSuccess {String} data.uf State code
 * @apiSuccess {Boolean|null} data.apiAvailable API availability status (null if available, false if unavailable)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND | API_UNAVAILABLE)
 * @apiError {String} error.message Error message
 */
export async function validateCepHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { cep } = req.body;
    const data = await validateCep(cep);

    if (data === null) {
      // API unavailable - return specific response
      res.json(
        successResponse({
          apiAvailable: false,
          message:
            'Serviço de validação de CEP temporariamente indisponível. Preencha os campos de endereço manualmente.',
        })
      );
      return;
    }

    res.json(successResponse({ ...data, apiAvailable: true }));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
