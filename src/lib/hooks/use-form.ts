import {type FormikErrors, useFormik} from 'formik';
import {toFormikValidate} from 'zod-formik-adapter';
import type z from 'zod';
import {type ServerActionResult} from '@/lib/server-action-result.ts';

export function blurHandlers<T extends object>(values: T, onFieldBlur: (field: string) => Promise<void> | Promise<FormikErrors<T>>) {
	const keys = Object.keys(values);
	return Object.fromEntries(
		keys.map(
			key => [
				key,
				() => {
					void onFieldBlur(key);
				},
			],
		),
	) as Record<keyof T, () => void>;
}

export function changeHandlers<T extends object>(values: T, onFieldChange: (field: string, value: unknown, revalidate?: boolean) => Promise<void> | Promise<FormikErrors<T>>) {
	return Object.fromEntries(
		(Object.keys(values) as Array<keyof T>).map(
			key => [
				key,
				(value: T[typeof key]) => {
					void onFieldChange(key as string, value, false);
				},
			],
		),
	) as unknown as {
		[K in keyof T]: (value: T[K]) => void;
	};
}

export type EntityFormOptions<Schema extends z.ZodTypeAny> = {
	readonly schema: Schema;
	readonly entity: z.input<Schema>;
	readonly onSubmit: (validatedValues: z.output<Schema>) => Promise<ServerActionResult<number>>;
};

export function useForm<Schema extends z.ZodTypeAny>(options: EntityFormOptions<Schema>) {
	const {schema, entity, onSubmit} = options;

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const {values, setFieldValue, setFieldTouched, handleSubmit, status, setStatus, errors} = useFormik({
		initialValues: entity,
		validate: toFormikValidate(schema),
		async onSubmit(values) {
			try {
				const validatedValues = schema.parse(values) as z.output<Schema>;
				const result = await onSubmit(validatedValues);
				if (result.success) {
					setStatus(undefined);
				} else {
					setStatus(result.message);
				}
			} catch (error) {
				if (error instanceof Error) {
					setStatus(error.message);
				} else {
					setStatus('Ha ocurrido un error interno.');
				}
			}
		},
	});

	return {
		values,
		changeHandler: changeHandlers(values, setFieldValue),
		blurHandler: blurHandlers(values, setFieldTouched),
		submitHandler: handleSubmit,
		status: (status as string),
		errors,
	};
}
