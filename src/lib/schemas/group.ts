import z from 'zod';
import {boolean, json, timeToDate} from '@/lib/schemas/utils.ts';

const groupInitSchema = z.object({
	name: z.string(),
	active: boolean,
	description: z.string(),
	entryHour: timeToDate,
	duration: z.coerce.number().int().positive(),
	tz: z.string(),
	colorId: z.coerce.number(),

	students: json(z.array(z.number())),
	users: json(z.array(z.number())),

	enabledMonday: boolean,
	enabledTuesday: boolean,
	enabledWednesday: boolean,
	enabledThursday: boolean,
	enabledFriday: boolean,
	enabledSaturday: boolean,
	enabledSunday: boolean,
});

export type GroupInit = z.infer<typeof groupInitSchema>;

export default groupInitSchema;
