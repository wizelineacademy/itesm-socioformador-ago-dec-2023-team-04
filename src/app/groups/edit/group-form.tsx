'use client';
import React, {useState} from 'react';
import {type Color, type Group} from '@prisma/client';
import {fromDate, Time} from '@internationalized/date';
import TextField from '@/components/text-field.tsx';
import TextArea from '@/components/text-area.tsx';
import TimeField from '@/components/time-field.tsx';
import ColorRadioGroup from '@/components/color-selector.tsx';
import Switch from '@/components/switch.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import groupSchema from '@/lib/schemas/group.ts';
import Form from '@/components/form.tsx';
import {upsertGroupAction} from '@/lib/actions/group.ts';
import {formValidators} from '@/lib/schemas/utils.ts';

export type GroupFormProps = {
	readonly colors: Color[];
	readonly group?: Group;
};

export default function GroupForm(props: GroupFormProps) {
	const {
		colors,
		group,
	} = props;

	const validate = formValidators(groupSchema);

	const [active, setActive] = useState(group?.active ?? true);

	return (
		<Form
			id={group?.id}
			action={upsertGroupAction} staticValues={{
				tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
				active: active ? undefined : false,
			}}
		>
			<TextField
				isRequired
				label='Nombre'
				name='name'
				className='mb-4'
				defaultValue={group?.name}
				validate={validate.name}/>
			<TextArea
				isRequired
				name='description'
				label='Descripción' className='mb-4'
				defaultValue={group?.description}
				validate={validate.description}
			/>
			<div className='flex justify-between mb-4'>
				<TimeField
					isRequired
					name='entryHour'
					label='Hora de entrada'
					validate={validate.entryHour}
					defaultValue={group?.entryHour ? new Time(group.entryHour.getHours(), group.entryHour.getSeconds()) : undefined}
				/>
				<TimeField
					isRequired
					name='exitHour'
					label='Hora de salida'
					defaultValue={group?.exitHour ? new Time(group.exitHour.getHours(), group.exitHour.getSeconds()) : undefined}
					validate={validate.exitHour}
				/>
			</div>
			<ColorRadioGroup
				isRequired
				name='colorId'
				validate={validate.colorId}
				defaultValue={group?.colorId?.toString()}
				label='Color del grupo' className='mb-4' colors={colors}/>
			<Switch
				name='active'
				className='mb-4'
				isSelected={active}
				onChange={setActive}
			>
				Grupo activo
			</Switch>
			<div className='flex justify-end'>
				<Button color='secondary' size='sm' type='submit'>
					<Icon name='save'/>Guardar
				</Button>
			</div>
		</Form>
	);
}
