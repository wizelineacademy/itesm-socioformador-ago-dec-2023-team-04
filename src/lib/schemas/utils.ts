import z from 'zod';
import {parseTime, Time} from '@internationalized/date';

/**
 * Preprocesses a form value, changing empty strings into null values.
 *
 * @param {unknown} value - The value to preprocess.
 * @return {unknown} - The preprocessed value.
 */
export function preprocessFormValue(value: unknown): unknown {
	if (Number.isNaN(value)) {
		return undefined;
	}

	if (typeof value !== 'string') {
		return value;
	}

	return value.trim() === '' ? undefined : value;
}

/**
 * Decodes form data or request body using a given schema.
 *
 * @param {FormData | Request} formDataOrRequest - The form data or request object to decode.
 * @param {Schema} schema - The schema to decode the form data or request body against.
 * @returns {Promise<z.infer<Schema>>} The decoded form data or request body.
 */
export const decodeForm = async <Schema extends z.ZodTypeAny>(
	formDataOrRequest: FormData | Request,
	schema: Schema,
): Promise<z.infer<Schema>> => {
	const formData
			= formDataOrRequest instanceof FormData
				? formDataOrRequest
		// @ts-ignore
		: await formDataOrRequest.clone().formData();

	const data = Object.fromEntries(
		[...formData].map(([key, value]) => [key, preprocessFormValue(value)]));

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return schema.parse(data) as z.infer<Schema>;
};

/**
 * Returns a set of form validators for a given schema.
 *
 * @param {Schema} schema - The schema object to generate validators for.
 * @returns An object containing validators for each property in the schema.
 */
export function formValidators<Schema extends z.AnyZodObject>(schema: Schema) {
	const schemas = schema.shape as {
		[K in keyof Schema['shape']]: z.ZodSchema;
	};

	return Object.fromEntries(Object.entries(schemas).map(
		([key, validator]) =>
			[
				key,
				(value: unknown) => {
					const result = validator.safeParse(preprocessFormValue(value));
					// If (key === 'entryHour' || key === 'exitHour') {
					// 	console.log(result);
					// }

					return result.success ? null : result.error.issues.map(issue => issue.message).join(' ');
				},
			])) as {
		[K in keyof Schema['shape']]: (value: unknown) => null | string;
	};
}

/**
 * Parse a JSON string into an object of a given schema.
 * If the schema is matched, return the parsed object. Otherwise, return the original schema.
 *
 * @template Schema - The Zod schema type
 *
 * @param {Schema} schema - The Zod schema to validate the parsed object against
 *
 * @returns {Schema} - The parsed object if it matches the schema, otherwise the original schema
 */
export function json<Schema extends z.ZodTypeAny>(schema: Schema) {
	return z.string().transform((value, ctx) => {
		try {
			return JSON.parse(value) as unknown;
		} catch {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
			});
			return z.NEVER;
		}
	}).pipe(schema).or(schema);
}

/**
 * Validates and transforms phone numbers.
 *
 * @param {object} parameters - The parameters for phone schema.
 * @param {object} parameters.errorMap - The map to customize error messages. (optional)
 * @param {string} parameters.invalid_type_error - The error message for invalid type. (optional)
 * @param {string} parameters.required_error - The error message for required field. (optional)
 * @param {string} parameters.description - The description of the phone schema. (optional)
 * @param {boolean} parameters.coerce - Whether to coerce the input value. (optional)
 * @returns {z} - The Zod schema for phone numbers.
 */
export const phoneSchema = (parameters: ({errorMap?: z.ZodErrorMap | undefined; invalid_type_error?: string | undefined; required_error?: string | undefined; description?: string | undefined} & {coerce?: true | undefined}) | undefined) => z
	.string(parameters)
	.regex(/\+?[()+\d ]+(x\d+)?/g, 'Ingresa un numero valido')
	.transform(value => value.replaceAll(/[^+\dx]/g, ''));

/**
 * Converts a time value to a JavaScript Date object.
 *
 * @param {string|Time} value - The time value to convert. Can be either a string representation of time or a Time object.
 * @returns {Date} The converted JavaScript Date object.
 */
export const timeToDate = z.string().transform(value => parseTime(value)).or(z.instanceof(Time)).transform(time => {
	const date = new Date();
	date.setHours(time.hour);
	date.setMinutes(time.minute);
	date.setSeconds(time.second);
	return date;
});

export const boolean = z.literal('false')
	.transform(value => false).or(z.coerce.boolean());
