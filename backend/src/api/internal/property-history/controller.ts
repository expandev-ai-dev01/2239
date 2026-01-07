/**
 * @summary
 * API controller for Property History entity.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/property-history/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { propertyHistoryQuery } from '@/services/propertyHistory';

/**
 * @api {get} /api/internal/property-history/:property_id Query Property History
 * @apiName QueryPropertyHistory
 * @apiGroup PropertyHistory
 *
 * @apiParam {String} property_id Property UUID
 *
 * @apiQuery {String} [start_date] Start date filter (YYYY-MM-DD)
 * @apiQuery {String} [end_date] End date filter (YYYY-MM-DD)
 * @apiQuery {String} [change_type] Change type filter (mudancas_valor_aluguel | alteracoes_status_propriedade | modificacoes_descricao_propriedade | atualizacoes_caracteristicas | mudancas_dados_contato_proprietario | todos)
 * @apiQuery {String} [responsible_user] User filter
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object[]} data.changes List of change records
 * @apiSuccess {String} data.changes.change_id Unique change identifier (UUID)
 * @apiSuccess {String} data.changes.property_id Property identifier (UUID)
 * @apiSuccess {String} data.changes.change_date Date and time of change (ISO 8601)
 * @apiSuccess {String} data.changes.user_responsible User who made the change
 * @apiSuccess {String} data.changes.field_modified Field that was modified
 * @apiSuccess {String|null} data.changes.previous_value Previous value
 * @apiSuccess {String} data.changes.new_value New value
 * @apiSuccess {String} data.changes.change_reason Reason for the change
 * @apiSuccess {String} data.changes.property_status Property status at time of change
 * @apiSuccess {String} data.changes.change_type Type of change
 * @apiSuccess {Object[]} data.lifecycle_events List of lifecycle events
 * @apiSuccess {String} data.lifecycle_events.event_id Unique event identifier (UUID)
 * @apiSuccess {String} data.lifecycle_events.property_id Property identifier (UUID)
 * @apiSuccess {String} data.lifecycle_events.event_type Type of lifecycle event
 * @apiSuccess {String} data.lifecycle_events.event_date Date and time of event (ISO 8601)
 * @apiSuccess {String} data.lifecycle_events.event_description Detailed event description
 * @apiSuccess {String|null} data.lifecycle_events.related_contract_id Related contract ID
 * @apiSuccess {String|null} data.lifecycle_events.related_tenant_id Related tenant ID
 * @apiSuccess {String} data.lifecycle_events.event_impact Impact description on property
 * @apiSuccess {Object} data.summary History summary
 * @apiSuccess {Number} data.summary.total_changes Total number of changes
 * @apiSuccess {Number} data.summary.total_events Total number of events
 * @apiSuccess {String|null} data.summary.first_change_date Date of first change
 * @apiSuccess {String|null} data.summary.last_change_date Date of last change
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR | ACCESS_DENIED)
 * @apiError {String} error.message Error message
 * @apiError {Object} error.details Validation error details (if applicable)
 */
export async function queryHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = {
      property_id: req.params.property_id,
      start_date: req.query.start_date as string | undefined,
      end_date: req.query.end_date as string | undefined,
      change_type: req.query.change_type as string | undefined,
      responsible_user: req.query.responsible_user as string | undefined,
    };

    const data = await propertyHistoryQuery(params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
