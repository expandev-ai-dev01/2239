/**
 * @summary
 * Default values and constants for Property History entity.
 * Provides centralized configuration for history tracking, change types,
 * and event definitions.
 *
 * @module constants/propertyHistory/propertyHistoryDefaults
 */

/**
 * @interface PropertyHistoryDefaultsType
 * @description Default configuration values for property history tracking.
 *
 * @property {number} MAX_RECORDS - Maximum allowed history records per property (unlimited)
 * @property {number} EXPORT_PAGE_SIZE - Default page size for exports (50)
 * @property {number} QUERY_TIMEOUT_MS - Query timeout in milliseconds (30000)
 */
export const PROPERTY_HISTORY_DEFAULTS = {
  /** Maximum allowed history records per property (unlimited for permanent storage) */
  MAX_RECORDS: Number.MAX_SAFE_INTEGER,
  /** Default page size for exports */
  EXPORT_PAGE_SIZE: 50,
  /** Query timeout in milliseconds */
  QUERY_TIMEOUT_MS: 30000,
} as const;

/** Type representing the PROPERTY_HISTORY_DEFAULTS constant */
export type PropertyHistoryDefaultsType = typeof PROPERTY_HISTORY_DEFAULTS;

/**
 * @interface PropertyChangeTypesType
 * @description Available change types for property history filtering.
 *
 * @property {string} MUDANCAS_VALOR_ALUGUEL - Rent value changes
 * @property {string} ALTERACOES_STATUS_PROPRIEDADE - Property status changes
 * @property {string} MODIFICACOES_DESCRICAO_PROPRIEDADE - Description modifications
 * @property {string} ATUALIZACOES_CARACTERISTICAS - Characteristics updates
 * @property {string} MUDANCAS_DADOS_CONTATO_PROPRIETARIO - Owner contact changes
 * @property {string} TODOS - All change types
 */
export const PROPERTY_CHANGE_TYPES = {
  MUDANCAS_VALOR_ALUGUEL: 'mudancas_valor_aluguel',
  ALTERACOES_STATUS_PROPRIEDADE: 'alteracoes_status_propriedade',
  MODIFICACOES_DESCRICAO_PROPRIEDADE: 'modificacoes_descricao_propriedade',
  ATUALIZACOES_CARACTERISTICAS: 'atualizacoes_caracteristicas',
  MUDANCAS_DADOS_CONTATO_PROPRIETARIO: 'mudancas_dados_contato_proprietario',
  TODOS: 'todos',
} as const;

/** Type representing the PROPERTY_CHANGE_TYPES constant */
export type PropertyChangeTypesType = typeof PROPERTY_CHANGE_TYPES;

/** Union type of all valid change types */
export type PropertyChangeType = (typeof PROPERTY_CHANGE_TYPES)[keyof typeof PROPERTY_CHANGE_TYPES];

/**
 * @interface PropertyLifecycleEventsType
 * @description Available lifecycle events for property history.
 *
 * @property {string} CRIACAO_PROPRIEDADE_SISTEMA - Property creation in system
 * @property {string} VINCULACAO_CONTRATO - Contract association
 * @property {string} DESVINCULACAO_CONTRATO - Contract disassociation
 * @property {string} ENTRADA_INQUILINO - Tenant move-in
 * @property {string} SAIDA_INQUILINO - Tenant move-out
 * @property {string} EXCLUSAO_PROPRIEDADE - Property deletion
 */
export const PROPERTY_LIFECYCLE_EVENTS = {
  CRIACAO_PROPRIEDADE_SISTEMA: 'criacao_propriedade_sistema',
  VINCULACAO_CONTRATO: 'vinculacao_contrato',
  DESVINCULACAO_CONTRATO: 'desvinculacao_contrato',
  ENTRADA_INQUILINO: 'entrada_inquilino',
  SAIDA_INQUILINO: 'saida_inquilino',
  EXCLUSAO_PROPRIEDADE: 'exclusao_propriedade',
} as const;

/** Type representing the PROPERTY_LIFECYCLE_EVENTS constant */
export type PropertyLifecycleEventsType = typeof PROPERTY_LIFECYCLE_EVENTS;

/** Union type of all valid lifecycle events */
export type PropertyLifecycleEvent =
  (typeof PROPERTY_LIFECYCLE_EVENTS)[keyof typeof PROPERTY_LIFECYCLE_EVENTS];

/**
 * @interface PropertyExportFormatsType
 * @description Available export formats for property history.
 *
 * @property {string} PDF_ESTRUTURADO - Structured PDF with sections and charts
 * @property {string} EXCEL_TABULAR - Tabular Excel format
 * @property {string} CSV_TABULAR - Tabular CSV format
 * @property {string} PDF_RESUMIDO - Condensed PDF summary
 */
export const PROPERTY_EXPORT_FORMATS = {
  PDF_ESTRUTURADO: 'PDF_Estruturado',
  EXCEL_TABULAR: 'Excel_Tabular',
  CSV_TABULAR: 'CSV_Tabular',
  PDF_RESUMIDO: 'PDF_Resumido',
} as const;

/** Type representing the PROPERTY_EXPORT_FORMATS constant */
export type PropertyExportFormatsType = typeof PROPERTY_EXPORT_FORMATS;

/** Union type of all valid export formats */
export type PropertyExportFormat =
  (typeof PROPERTY_EXPORT_FORMATS)[keyof typeof PROPERTY_EXPORT_FORMATS];

/**
 * @interface PropertyHistoryLimitsType
 * @description Validation constraints for property history fields.
 *
 * @property {number} CHANGE_REASON_MAX_LENGTH - Maximum characters for change reason (500)
 * @property {number} EVENT_DESCRIPTION_MAX_LENGTH - Maximum characters for event description (1000)
 * @property {number} FIELD_NAME_MAX_LENGTH - Maximum characters for field name (100)
 */
export const PROPERTY_HISTORY_LIMITS = {
  CHANGE_REASON_MAX_LENGTH: 500,
  EVENT_DESCRIPTION_MAX_LENGTH: 1000,
  FIELD_NAME_MAX_LENGTH: 100,
} as const;

/** Type representing the PROPERTY_HISTORY_LIMITS constant */
export type PropertyHistoryLimitsType = typeof PROPERTY_HISTORY_LIMITS;
