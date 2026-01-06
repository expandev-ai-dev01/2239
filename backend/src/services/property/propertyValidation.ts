/**
 * @summary
 * Validation schemas for Property entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/property/propertyValidation
 */

import { z } from 'zod';
import {
  PROPERTY_LIMITS,
  PROPERTY_TYPES,
  PROPERTY_STATUS,
  VALID_ESTADOS,
  RESIDENTIAL_TYPES,
  COMMERCIAL_TYPES,
} from '@/constants';

/**
 * Schema for CEP validation (XXXXX-XXX format)
 */
export const cepSchema = z
  .string()
  .length(PROPERTY_LIMITS.CEP_LENGTH, 'CEP deve ter 9 caracteres (formato: XXXXX-XXX)')
  .regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato XXXXX-XXX');

/**
 * Schema for estado (UF) validation
 */
export const estadoSchema = z.enum(VALID_ESTADOS as unknown as [string, ...string[]], {
  errorMap: () => ({ message: 'Informe uma UF válida' }),
});

/**
 * Schema for property type validation
 */
export const tipoPropriedadeSchema = z.enum(
  [
    PROPERTY_TYPES.CASA,
    PROPERTY_TYPES.APARTAMENTO,
    PROPERTY_TYPES.KITNET,
    PROPERTY_TYPES.LOJA,
    PROPERTY_TYPES.SALA_COMERCIAL,
    PROPERTY_TYPES.GALPAO,
  ] as [string, ...string[]],
  {
    errorMap: () => ({ message: 'Selecione um tipo válido de propriedade' }),
  }
);

/**
 * Schema for property status validation
 */
export const statusSchema = z.enum([
  PROPERTY_STATUS.DISPONIVEL,
  PROPERTY_STATUS.OCUPADA,
  PROPERTY_STATUS.MANUTENCAO,
  PROPERTY_STATUS.INATIVA,
] as [string, ...string[]]);

/**
 * Schema for create request validation
 */
export const createSchema = z
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
    usuario_cadastro: z.string().min(1, 'Usuário de cadastro é obrigatório'),
  })
  .refine(
    (data) => {
      // BR-004: Commercial properties should not have quartos field filled
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
 * Schema for CEP validation request
 */
export const cepValidationSchema = z.object({
  cep: cepSchema,
});

/**
 * Inferred types from schemas
 */
export type CreateInput = z.infer<typeof createSchema>;
export type CepValidationInput = z.infer<typeof cepValidationSchema>;
