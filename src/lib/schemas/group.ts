import z from 'zod';
import {boolean, timeToDate} from '@/lib/schemas/utils.ts';

const groupSchema = z.object({
	name: z.string(),
	active: boolean,
	description: z.string(),
	entryHour: timeToDate,
	exitHour: timeToDate,
	tz: z.string(),
	colorId: z.coerce.number(),
});

export default groupSchema;
