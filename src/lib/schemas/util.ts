import z from 'zod';
import {Time} from '@internationalized/date';

export function emptyStringToNull(arg: string) {
	if (arg.trim() === '') {
		return null;
	}

	return arg;
}

export function emptyStringToUndifined(arg: unknown) {
	if (typeof arg !== 'string') {
		return arg;
	}

	if (arg.trim() === '') {
		return undefined;
	}

	return arg;
}

export async function decodeForm<Schema extends z.ZodTypeAny>(
	formDataOrRequest: FormData | Request,
	schema: Schema,
) {
	const formData = formDataOrRequest instanceof FormData ? formDataOrRequest : await formDataOrRequest.clone().formData();

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return schema.parse(Object.fromEntries(formData)) as z.infer<Schema>;
}

export const phoneSchema = (parameters: ({errorMap?: z.ZodErrorMap | undefined; invalid_type_error?: string | undefined; required_error?: string | undefined; description?: string | undefined} & {coerce?: true | undefined}) | undefined) => z
	.string(parameters)
	.regex(/\+?[()+\d ]+(x\d+)?/g, 'Ingresa un numero valido')
	.transform(value => value.replaceAll(/[^+\dx]/g, ''));

export const emptyStringToNullSchema = z.string().transform(emptyStringToNull);

export const timeToDate = z.instanceof(Time).transform(time => {
	const date = new Date();
	date.setHours(time.hour);
	date.setMinutes(time.minute);
	return date;
}).pipe(z.date()).or(z.date());
