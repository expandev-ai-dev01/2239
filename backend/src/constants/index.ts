/**
 * @summary
 * Centralized constants exports.
 * Provides single import point for all application constants.
 *
 * @module constants
 */

/**
 * Property constants
 */
export {
  PROPERTY_DEFAULTS,
  PROPERTY_STATUS,
  PROPERTY_TYPES,
  PROPERTY_LIMITS,
  RESIDENTIAL_TYPES,
  COMMERCIAL_TYPES,
  VALID_ESTADOS,
  type PropertyDefaultsType,
  type PropertyStatusType,
  type PropertyStatus,
  type PropertyTypesType,
  type PropertyType,
  type PropertyLimitsType,
  type ValidEstado,
} from './property';

/**
 * Property History constants
 */
export {
  PROPERTY_HISTORY_DEFAULTS,
  PROPERTY_CHANGE_TYPES,
  PROPERTY_LIFECYCLE_EVENTS,
  PROPERTY_EXPORT_FORMATS,
  PROPERTY_HISTORY_LIMITS,
  type PropertyHistoryDefaultsType,
  type PropertyChangeTypesType,
  type PropertyChangeType,
  type PropertyLifecycleEventsType,
  type PropertyLifecycleEvent,
  type PropertyExportFormatsType,
  type PropertyExportFormat,
  type PropertyHistoryLimitsType,
} from './propertyHistory';
