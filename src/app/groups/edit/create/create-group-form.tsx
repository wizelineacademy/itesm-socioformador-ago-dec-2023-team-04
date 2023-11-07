'use client';

import React, {type Key, useState} from 'react';
import {type Color} from '@prisma/client';
import {useFormik} from 'formik';
import {toFormikValidate} from 'zod-formik-adapter';
import {Time} from '@internationalized/date';
import TextField from '@/components/text-field.tsx';
import TimeField from '@/components/time-field.tsx';
import ColorRadioGroup from '@/components/color-selector.tsx';
import Switch from '@/components/switch.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import {type GroupCreationInput, groupCreationSchema} from '@/app/groups/edit/create/create-group-action.ts';

export type CreateGroupFormProps = {
	readonly colors: Color[];
};

export default function CreateGroupForm(props: CreateGroupFormProps) {
	const {colors} = props;
	const {values, setFieldValue, setFieldTouched, handleSubmit} = useFormik<GroupCreationInput>({
		initialValues: {
			name: '',
			active: false,
			description: '',
			entryHour: new Time(),
			exitHour: new Time(),
			tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
			colorId: colors[0].id,
		},
		validate: toFormikValidate(groupCreationSchema),
		onSubmit(values) {
			console.log(values);
		},
	});

	return (
		<form onSubmit={handleSubmit}>
			<TextField
				label='Nombre' className='mb-4' value={values.name}
				onBlur={async () => setFieldTouched('name')}
				onChange={async value => setFieldValue('name', value, false)}/>
			<TextField
				label='Descripción' className='mb-4' value={values.description}
				onChange={async value => setFieldValue('description', value, false)}/>
			<div className='flex justify-between mb-4'>
				<TimeField
					label='Hora de entrada' value={values.entryHour as Time}
					onBlur={async () => setFieldTouched('entryHour')}
					onChange={async value => setFieldValue('entryHour', value)}/>
				<TimeField
					label='Hora de salida' value={values.exitHour as Time}
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
			<div className='flex justify-between'>
				<Button color='secondary' variant='outlined' size='sm'>
					Cancelar
				</Button>
				<Button color='secondary' size='sm' type='submit'>
					<Icon name='save'/>Guardar
				</Button>
			</div>

		</form>
	);
}
