/**
 * Property form type definitions
 * @module domain/property/types/forms
 */

import { z } from 'zod';
import { propertySchema } from '../validations/property';

export type PropertyFormInput = z.input<typeof propertySchema>;
export type PropertyFormOutput = z.output<typeof propertySchema>;
