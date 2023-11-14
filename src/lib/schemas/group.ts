import z from 'zod';
import {boolean, json, timeToDate} from '@/lib/schemas/utils.ts';

const groupUpsertSchema = z.object({
	name: z.string(),
	active: boolean,
	description: z.string(),
	entryHour: timeToDate,
	exitHour: timeToDate,
	tz: z.string(),
	colorId: z.coerce.number(),
	students: json(z.array(z.number())),

	enabledMonday: boolean,
	enabledTuesday: boolean,
	enabledWednesday: boolean,
	enabledThursday: boolean,
	enabledFriday: boolean,
	enabledSaturday: boolean,
	enabledSunday: boolean,
});

export type GroupUpsert = z.infer<typeof groupUpsertSchema>;

export default groupUpsertSchema;
