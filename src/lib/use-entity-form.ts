import {useRouter} from 'next/navigation';
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

export type EntityFormOptions<Output extends Input, Shape extends z.ZodRawShape, Input extends object> = {
	readonly schema: z.ZodObject<Shape, any, any, Output, Input>;
	readonly redirectBasePath: string;
	readonly entity: Input | Input & Entity;
	readonly action: (values: Output, id?: number) => Promise<ServerActionResult<number>>;
};

export function useEntityForm<Output extends Input, Shape extends z.ZodRawShape, Input extends object>(options: EntityFormOptions<Output, Shape, Input>) {
	const {schema, redirectBasePath, entity} = options;

	const router = useRouter();
	const {values, setFieldValue, setFieldTouched, handleSubmit, status, setStatus, errors} = useFormik({
		initialValues: entity,
		validate: toFormikValidate(schema),
		async onSubmit(values) {
			console.log('submitted');
			console.log(values);
			if ('id' in entity) {
				const result = await options.action(schema.parse(values), entity.id);
				if (result.success) {
					setStatus(undefined);
				} else {
					setStatus(result.message);
				}
			} else {
				const result = await options.action(schema.partial().parse(values) as Output);
				if (result.success) {
					setStatus(undefined);
					router.push(`${redirectBasePath}/${result.data}`);
				} else {
					setStatus(result.message);
				}
			}
		},
	});

	const changeHandler = changeHandlers(values, setFieldValue);
	const blurHandler = blurHandlers(values, setFieldTouched);

	return {values, changeHandler, blurHandler, submitHandler: handleSubmit, status: (status as string), errors};
}

export type Entity = {
	readonly id: number;
};
