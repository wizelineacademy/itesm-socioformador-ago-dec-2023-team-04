import z from 'zod';
import {timeToDate} from '@/lib/schemas/utils.ts';

const groupSchema = z.object({
	name: z.string(),
	active: z.coerce.boolean(),
	description: z.string(),
	entryHour: timeToDate,
	exitHour: timeToDate,
	tz: z.string(),
	colorId: z.coerce.number(),
});

export default groupSchema;
