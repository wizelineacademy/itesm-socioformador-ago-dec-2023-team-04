import React, {type FormEvent} from 'react';
import {type Color, type Group, Prisma} from '@prisma/client';
import {type Time} from '@internationalized/date';
import {useRouter} from 'next/navigation';
import {type FormikErrors, useFormik} from 'formik';
import {toFormikValidate} from 'zod-formik-adapter';
import type z from 'zod';
import TextField from '@/components/text-field.tsx';
import TextArea from '@/components/text-area.tsx';
import TimeField from '@/components/time-field.tsx';
import ColorRadioGroup from '@/components/color-selector.tsx';
import Switch from '@/components/switch.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import {type GroupCreationInput, groupCreationSchema} from '@/lib/schemas/group.ts';
import {createGroupAction} from '@/lib/actions/group.ts';
import {type ServerActionResult} from '@/lib/server-action-result.ts';

export type FormProps<T extends object> = {
	readonly values: T;
	readonly errors: Record<keyof T, string>;
	readonly onFieldChange: <Field extends keyof T>(field: Field, value: T[Field], validate?: boolean) => Promise<void>;
	readonly onBlur: (field: keyof T) => Promise<void>;
	readonly onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
	readonly status: string;
};

export function blurHandlers<T extends object>(values: T, onFieldBlur: (field: string) => Promise<void> | Promise<FormikErrors<T>>) {
	const keys = Object.keys(values);
	return Object.fromEntries(
		keys.map(
			key => [
				key,
				() => {
					void onFieldBlur(key as keyof T);
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

export type GroupFormProps = {
	readonly colors: Color[];
} & FormProps<GroupCreationInput>;

export type EntityIdOptions<T> = {
	readonly schema: z.ZodSchema<T>;
	readonly initialValues: z.input<z.ZodSchema<T>>;
	readonly redirectBasePath: string;
} & (
	{
		readonly entityId: number;
		readonly updateAction: (id: number, values: z.output<z.ZodSchema<T>>) => Promise<ServerActionResult<number>>;
	} | {
		readonly createAction: (values: z.output<z.ZodSchema<T>>) => Promise<ServerActionResult<number>>;
	}
);

export function useEntityForm<T extends object>(options: EntityIdOptions<T>) {
	const {schema, initialValues, redirectBasePath} = options;
	const router = useRouter();
	const {values, setFieldValue, setFieldTouched, handleSubmit, status, setStatus, errors} = useFormik({
		initialValues,
		validate: toFormikValidate(schema),
		async onSubmit(values) {
			if ('entityId' in options) {
				const result = await options.updateAction(options.entityId, schema.parse(values));
				if (result.success) {
					setStatus(undefined);
				} else {
					setStatus(result.message);
				}
			} else {
				const result = await options.createAction(schema.parse(values));
				if (result.success) {
					setStatus(undefined);
					router.push(`${redirectBasePath}/${result.data}`);
				} else {
					setStatus(result.message);
				}
			}
		},
	});

	const onChange = changeHandlers(values, setFieldValue);
	const onBlur = blurHandlers(values, setFieldTouched);

	return {values, onChange, onBlur, handleSubmit, status: (status as string), errors};
}

export default function GroupForm(props: GroupFormProps) {
	const {
		colors,
		values,
		errors,
		onFieldChange,
		onBlur: onFieldBlur,
		onSubmit,
		status,
	} = props;

	const {} = useEntityForm({
		schema: groupCreationSchema,
	});

	const onChange = changeHandlers(values, onFieldChange);
	const onBlur = blurHandlers(values, onFieldBlur);

	return (
		<form onSubmit={onSubmit}>
			{
				status && <div className='rounded bg-red-400 text-stone-50'>
					{status}
				</div>
			}
			<TextField
				label='Nombre' className='mb-4' value={values.name}
				errorMessage={errors.name}
				onBlur={onBlur.name}
				onChange={onChange.name}/>
			<TextArea
				label='Descripción' className='mb-4' value={values.description}
				errorMessage={errors.description}
				onBlur={onBlur.description}
				onChange={onChange.description}/>
			<div className='flex justify-between mb-4'>
				<TimeField
					label='Hora de entrada' value={values.entryHour as Time}
					errorMessage={errors.entryHour}
					onBlur={onBlur.entryHour}
					onChange={onChange.entryHour}/>
				<TimeField
					label='Hora de salida' value={values.exitHour as Time}
					errorMessage={errors.exitHour}
					onBlur={onBlur.exitHour}
					onChange={onChange.exitHour}/>
			</div>
			<ColorRadioGroup
				label='Color del grupo' className='mb-4' colors={colors}
				selectedColor={values.colorId.toString()}
				onSelectedColorChange={value => {
					onChange.colorId(Number.parseInt(value as string, 10));
				}}/>
			<Switch
				className='mb-4' onChange={() => {
					onChange.active(!values.active);
				}}
			>
				Grupo activo
			</Switch>
			<div className='flex justify-end'>
				<Button color='secondary' size='sm' type='submit'>
					<Icon name='save'/>Guardar
				</Button>
			</div>

		</form>
	);
}
