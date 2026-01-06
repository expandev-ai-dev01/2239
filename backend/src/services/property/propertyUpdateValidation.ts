/**
 * @summary
 * Validation schemas for Property update operations.
 * Centralizes all Zod validation logic for property updates.
 *
 * @module services/property/propertyUpdateValidation
 */

import { z } from 'zod';
import { PROPERTY_LIMITS, PROPERTY_TYPES, PROPERTY_STATUS, COMMERCIAL_TYPES } from '@/constants';
import { cepSchema, estadoSchema, tipoPropriedadeSchema, statusSchema } from './propertyValidation';

/**
 * Schema for update request validation
 */
export const updateSchema = z
  .object({
    tipo_propriedade: tipoPropriedadeSchema,
    endereco_completo: z
      .string()
      .min(1, 'Endereço completo é obrigatório')
      .max(
        PROPERTY_LIMITS.ENDERECO_MAX_LENGTH,
        `Endereço deve ter no máximo ${PROPERTY_LIMITS.ENDERECO_MAX_LENGTH} caracteres`
      )
      .regex(
        /^[A-Za-zÀ-ÿ\s]+\s+[A-Za-zÀ-ÿ\s]+,\s*\d+/,
        'Endereço deve conter logradouro, número e seguir formato padrão'
      ),
    cep: cepSchema,
    bairro: z
      .string()
      .min(1, 'Bairro é obrigatório')
      .max(
        PROPERTY_LIMITS.BAIRRO_MAX_LENGTH,
        `Bairro deve ter no máximo ${PROPERTY_LIMITS.BAIRRO_MAX_LENGTH} caracteres`
      ),
    cidade: z
      .string()
      .min(1, 'Cidade é obrigatória')
      .max(
        PROPERTY_LIMITS.CIDADE_MAX_LENGTH,
        `Cidade deve ter no máximo ${PROPERTY_LIMITS.CIDADE_MAX_LENGTH} caracteres`
      ),
    estado: estadoSchema,
    area_total: z
      .number()
      .min(PROPERTY_LIMITS.AREA_MIN, `Área deve ser maior que ${PROPERTY_LIMITS.AREA_MIN} m²`)
      .max(PROPERTY_LIMITS.AREA_MAX, `Área deve ser menor que ${PROPERTY_LIMITS.AREA_MAX} m²`),
    quartos: z
      .number()
      .int()
      .min(
        PROPERTY_LIMITS.QUARTOS_MIN,
        `Número de quartos deve estar entre ${PROPERTY_LIMITS.QUARTOS_MIN} e ${PROPERTY_LIMITS.QUARTOS_MAX}`
      )
      .max(
        PROPERTY_LIMITS.QUARTOS_MAX,
        `Número de quartos deve estar entre ${PROPERTY_LIMITS.QUARTOS_MIN} e ${PROPERTY_LIMITS.QUARTOS_MAX}`
      )
      .nullable(),
    banheiros: z
      .number()
      .int()
      .min(
        PROPERTY_LIMITS.BANHEIROS_MIN,
        `Número de banheiros deve estar entre ${PROPERTY_LIMITS.BANHEIROS_MIN} e ${PROPERTY_LIMITS.BANHEIROS_MAX}`
      )
      .max(
        PROPERTY_LIMITS.BANHEIROS_MAX,
        `Número de banheiros deve estar entre ${PROPERTY_LIMITS.BANHEIROS_MIN} e ${PROPERTY_LIMITS.BANHEIROS_MAX}`
      )
      .nullable(),
    vagas_garagem: z
      .number()
      .int()
      .min(
        PROPERTY_LIMITS.VAGAS_MIN,
        `Número de vagas deve estar entre ${PROPERTY_LIMITS.VAGAS_MIN} e ${PROPERTY_LIMITS.VAGAS_MAX}`
      )
      .max(
        PROPERTY_LIMITS.VAGAS_MAX,
        `Número de vagas deve estar entre ${PROPERTY_LIMITS.VAGAS_MIN} e ${PROPERTY_LIMITS.VAGAS_MAX}`
      ),
    valor_aluguel: z.number().positive('Valor do aluguel deve ser maior que zero'),
    valor_condominio: z
      .number()
      .nonnegative('Valor do condomínio deve ser maior ou igual a zero')
      .nullable(),
    valor_iptu: z.number().nonnegative('Valor do IPTU deve ser maior ou igual a zero').nullable(),
    descricao: z
      .string()
      .max(
        PROPERTY_LIMITS.DESCRICAO_MAX_LENGTH,
        `Descrição deve ter no máximo ${PROPERTY_LIMITS.DESCRICAO_MAX_LENGTH} caracteres`
      )
      .nullable(),
    status: statusSchema,
  })
  .refine(
    (data) => {
      // Commercial properties should not have quartos field filled
      const isCommercial = COMMERCIAL_TYPES.includes(data.tipo_propriedade as any);
      if (isCommercial && data.quartos !== null && data.quartos !== undefined) {
        return false;
      }
      return true;
    },
    {
      message: 'Propriedades comerciais não devem ter número de quartos informado',
      path: ['quartos'],
    }
  );

/**
 * Inferred types from schemas
 */
export type UpdateInput = z.infer<typeof updateSchema>;
