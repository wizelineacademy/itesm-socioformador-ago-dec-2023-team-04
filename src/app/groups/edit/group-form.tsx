'use client';
import React, {type ReactNode} from 'react';
import {type Color, type Group} from '@prisma/client';
import {Time} from '@internationalized/date';
import TextField from '@/components/text-field.tsx';
import TextArea from '@/components/text-area.tsx';
import TimeField from '@/components/time-field.tsx';
import ColorRadioGroup from '@/components/color-selector.tsx';
import Switch from '@/components/switch.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import {groupSchema} from '@/lib/schemas/group.ts';
import {createOrUpdateGroupAction} from '@/lib/actions/group.ts';
import {useEntityForm} from '@/lib/hooks/use-entity-form.ts';

export type GroupFormProps = {
	readonly colors: Color[];
	readonly group?: Group;
};

export default function GroupForm(props: GroupFormProps) {
	const {
		colors,
		group,
	} = props;

	const {
		values,
		changeHandler,
		blurHandler,
		submitHandler,
		status,
		errors,
	} = useEntityForm({
		redirectBasePath: '/groups/edit',
		schema: groupSchema,
		entity: group ?? {
			name: '',
			active: true,
			description: '',
			entryHour: new Time(),
			exitHour: new Time(),
			tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
			colorId: colors[0].id,
		},
		action: createOrUpdateGroupAction,
	});

	return (
		<form onSubmit={submitHandler}>
			{
				status && <div className='rounded bg-red-400 text-stone-50'>
					{status}
				</div>
			}
			<TextField
				label='Nombre' className='mb-4' value={values.name}
				errorMessage={errors.name}
				onBlur={blurHandler.name}
				onChange={changeHandler.name}/>
			<TextArea
				label='Descripción' className='mb-4' value={values.description}
				errorMessage={errors.description}
				onBlur={blurHandler.description}
				onChange={changeHandler.description}/>
			<div className='flex justify-between mb-4'>
				<TimeField
					label='Hora de entrada' value={values.entryHour as Time}
					errorMessage={errors.entryHour as ReactNode}
					onBlur={blurHandler.entryHour}
					onChange={changeHandler.entryHour}/>
				<TimeField
					label='Hora de salida' value={values.exitHour as Time}
					errorMessage={errors.exitHour as ReactNode}
					onBlur={blurHandler.exitHour}
					onChange={changeHandler.exitHour}/>
			</div>
			<ColorRadioGroup
				label='Color del grupo' className='mb-4' colors={colors}
				selectedColor={values.colorId.toString()}
				onSelectedColorChange={value => {
					changeHandler.colorId(Number.parseInt(value as string, 10));
				}}/>
			<Switch
				className='mb-4' isSelected={values.active} onChange={active => {
					changeHandler.active(active);
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
