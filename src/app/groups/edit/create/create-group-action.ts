import z from 'zod';
import {Time} from '@internationalized/date';
import {emptyStringToNull, nonEmptyString} from '@/lib/schemas/util.ts';

const timeToDate = z.instanceof(Time).transform(time => {
	const date = new Date();
	date.setHours(time.hour);
	date.setMinutes(time.minute);
	return date;
}).or(z.date());

export const groupCreationSchema = z.object({
	name: nonEmptyString,
	active: z.boolean(),
	description: nonEmptyString,
	entryHour: timeToDate,
	exitHour: timeToDate,
	tz: nonEmptyString,
	colorId: z.number(),
});

export type GroupCreationInput = z.input<typeof groupCreationSchema>;
export type GroupCreation = z.infer<typeof groupCreationSchema>;
