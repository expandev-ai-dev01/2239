/**
 * @summary
 * Validation schemas for Property History entity.
 * Centralizes all Zod validation logic for history queries and exports.
 *
 * @module services/propertyHistory/propertyHistoryValidation
 */

import { z } from 'zod';
import {
  PROPERTY_CHANGE_TYPES,
  PROPERTY_EXPORT_FORMATS,
  PROPERTY_HISTORY_LIMITS,
} from '@/constants';

/**
 * Schema for property_id parameter validation
 */
export const propertyIdSchema = z.object({
  property_id: z.string().uuid('ID da propriedade deve ser um UUID válido'),
});

/**
 * Schema for date validation (YYYY-MM-DD format)
 */
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
  .refine(
    (date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed <= new Date();
    },
    { message: 'Data não pode ser posterior à data atual' }
  );

/**
 * Schema for change type validation
 */
export const changeTypeSchema = z.enum(
  [
    PROPERTY_CHANGE_TYPES.MUDANCAS_VALOR_ALUGUEL,
    PROPERTY_CHANGE_TYPES.ALTERACOES_STATUS_PROPRIEDADE,
    PROPERTY_CHANGE_TYPES.MODIFICACOES_DESCRICAO_PROPRIEDADE,
    PROPERTY_CHANGE_TYPES.ATUALIZACOES_CARACTERISTICAS,
    PROPERTY_CHANGE_TYPES.MUDANCAS_DADOS_CONTATO_PROPRIETARIO,
    PROPERTY_CHANGE_TYPES.TODOS,
  ] as [string, ...string[]],
  {
    errorMap: () => ({ message: 'Tipo de alteração não reconhecido' }),
  }
);

/**
 * Schema for export format validation
 */
export const exportFormatSchema = z.enum(
  [
    PROPERTY_EXPORT_FORMATS.PDF_ESTRUTURADO,
    PROPERTY_EXPORT_FORMATS.EXCEL_TABULAR,
    PROPERTY_EXPORT_FORMATS.CSV_TABULAR,
    PROPERTY_EXPORT_FORMATS.PDF_RESUMIDO,
  ] as [string, ...string[]],
  {
    errorMap: () => ({ message: 'Formato de exportação não suportado' }),
  }
);

/**
 * Schema for history query validation
 */
export const historyQuerySchema = z
  .object({
    property_id: z.string().uuid('ID da propriedade deve ser um UUID válido'),
    start_date: dateSchema.optional(),
    end_date: dateSchema.optional(),
    change_type: changeTypeSchema.optional(),
    responsible_user: z.string().min(1).optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.start_date) <= new Date(data.end_date);
      }
      return true;
    },
    {
      message: 'Data final deve ser posterior ou igual à data inicial',
      path: ['end_date'],
    }
  );

/**
 * Schema for export request validation
 */
export const exportRequestSchema = z.object({
  property_id: z.string().uuid('ID da propriedade deve ser um UUID válido'),
  export_format: exportFormatSchema,
  include_details: z.boolean().optional().default(true),
  structured_sections: z.array(z.string()).optional(),
  tabular_columns: z.array(z.string()).optional(),
  condensed_criteria: z
    .object({
      apenas_alteracoes_principais: z.boolean().optional(),
      eventos_criticos_apenas: z.boolean().optional(),
      periodo_resumido: z.boolean().optional(),
    })
    .optional(),
});

/**
 * Inferred types from schemas
 */
export type PropertyIdInput = z.infer<typeof propertyIdSchema>;
export type HistoryQueryInput = z.infer<typeof historyQuerySchema>;
export type ExportRequestInput = z.infer<typeof exportRequestSchema>;
