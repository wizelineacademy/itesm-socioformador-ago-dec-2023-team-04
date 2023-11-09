import z from 'zod';
import {emptyStringToNullSchema, timeToDate} from '@/lib/schemas/util.ts';

export const groupCreationSchema = z.object({
	name: emptyStringToNullSchema.pipe(z.string()),
	active: z.boolean(),
	description: emptyStringToNullSchema.pipe(z.string()),
	entryHour: timeToDate,
	exitHour: timeToDate,
	tz: emptyStringToNullSchema.pipe(z.string()),
	colorId: z.number(),
});
export type GroupCreationInput = z.input<typeof groupCreationSchema>;
export type GroupCreation = z.infer<typeof groupCreationSchema>;

export const groupUpdateSchema = groupCreationSchema.partial();

export type GroupUpdateInput = z.input<typeof groupUpdateSchema>;
export type GroupUpdate = z.infer<typeof groupUpdateSchema>;
