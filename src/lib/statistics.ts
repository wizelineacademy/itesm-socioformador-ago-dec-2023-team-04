import z from 'zod';
import {emptyStringToNullSchema, intDateToDate, timeToDate} from '@/lib/schemas/util.ts';

export const dateSchema = z.object({
	description: emptyStringToNullSchema.pipe(z.string()),
	initialDate: intDateToDate,
	finalDate: intDateToDate,
});
