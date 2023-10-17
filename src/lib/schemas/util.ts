import type z from 'zod';

export function emptyStringToNull(arg: unknown) {
	if (typeof arg !== 'string') {
		return arg;
	}

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
