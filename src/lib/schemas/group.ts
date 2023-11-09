import z from 'zod';
import {emptyStringToNullSchema, timeToDate} from '@/lib/schemas/util.ts';

export const groupSchema = z.object({
	name: emptyStringToNullSchema.pipe(z.string()),
	active: z.boolean(),
	description: emptyStringToNullSchema.pipe(z.string()),
	entryHour: timeToDate,
	exitHour: timeToDate,
	tz: emptyStringToNullSchema.pipe(z.string()),
	colorId: z.number(),
});
