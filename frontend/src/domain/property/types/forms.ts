/**
 * Property form type definitions
 * @module domain/property/types/forms
 */

import { z } from 'zod';
import { propertySchema } from '../validations/property';
import { propertyUpdateSchema } from '../validations/propertyUpdate';

export type PropertyFormInput = z.input<typeof propertySchema>;
export type PropertyFormOutput = z.output<typeof propertySchema>;

export type PropertyUpdateFormInput = z.input<typeof propertyUpdateSchema>;
export type PropertyUpdateFormOutput = z.output<typeof propertyUpdateSchema>;
