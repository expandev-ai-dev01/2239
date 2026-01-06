/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as propertyController from '@/api/internal/property/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Property routes - /api/internal/property
 */
router.get('/property', propertyController.listHandler);
router.post('/property', propertyController.createHandler);
router.get('/property/:id', propertyController.getHandler);
router.put('/property/:id', propertyController.updateHandler);
router.post('/property/validate-cep', propertyController.validateCepHandler);

export default router;
