'use client';

import React from 'react';
import {type Color, type Group} from '@prisma/client';
import {useFormik} from 'formik';
import {toFormikValidate} from 'zod-formik-adapter';
import {type Time} from '@internationalized/date';
import {useRouter} from 'next/navigation';
import TextField from '@/components/text-field.tsx';
import TimeField from '@/components/time-field.tsx';
import ColorRadioGroup from '@/components/color-selector.tsx';
import Switch from '@/components/switch.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import {type GroupCreationInput, groupCreationSchema} from '@/lib/schemas/group.ts';
import TextArea from '@/components/text-area.tsx';
import {updateGroupAction} from '@/lib/actions/group.ts';

export type CreateGroupFormProps = {
	readonly group: Group;
	readonly colors: Color[];
};

export default function UpdateGroupForm(props: CreateGroupFormProps) {
	const {colors, group} = props;
	const router = useRouter();
	const {values, setFieldValue, setFieldTouched, handleSubmit, status, setStatus, errors} = useFormik<GroupCreationInput>({
		initialValues: group,
		validate: toFormikValidate(groupCreationSchema),
		async onSubmit(values) {
			const result = await updateGroupAction(group.id, groupCreationSchema.parse(values));
			if (result.success) {
				setStatus(undefined);
				router.push(`/groups/edit/${result.data}`);
			} else {
				setStatus(result.message);
			}
		},
	});

	return (
		<form onSubmit={handleSubmit}>
			{
				status && <div className='rounded bg-red-400 text-stone-50'>
					{status}
				</div>
			}
			<TextField
				label='Nombre' className='mb-4' value={values.name}
				errorMessage={errors.name}
				onBlur={async () => setFieldTouched('name')}
				onChange={async value => setFieldValue('name', value, false)}/>
			<TextArea
				label='Descripción' className='mb-4' value={values.description}
				errorMessage={errors.description}
				onBlur={async () => setFieldTouched('description', true)}
				onChange={async value => setFieldValue('description', value, false)}/>
			<div className='flex justify-between mb-4'>
				<TimeField
					label='Hora de entrada' value={values.entryHour as Time}
					errorMessage={errors.entryHour as string}
					onBlur={async () => setFieldTouched('entryHour')}
					onChange={async value => setFieldValue('entryHour', value)}/>
				<TimeField
					label='Hora de salida' value={values.exitHour as Time}
					errorMessage={errors.exitHour as string}
					onBlur={async () => setFieldTouched('exitHour')}
					onChange={async value => setFieldValue('exitHour', value)}/>
			</div>
			<ColorRadioGroup
				label='Color del grupo' className='mb-4' colors={colors}
				selectedColor={values.colorId.toString()}
				onSelectedColorChange={async value => setFieldValue('colorId', Number.parseInt(value as string, 10))}/>
			<Switch className='mb-4' onChange={async () => setFieldValue('active', !values.active)}>
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
