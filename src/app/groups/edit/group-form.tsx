'use client';
import React, {useState} from 'react';
import {type Color} from '@prisma/client';
import {Time} from '@internationalized/date';
import {useListData} from 'react-stately';
import TextField from '@/components/text-field.tsx';
import TextArea from '@/components/text-area.tsx';
import TimeField from '@/components/time-field.tsx';
import ColorRadioGroup from '@/components/color-selector.tsx';
import Switch from '@/components/switch.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import groupUpsertSchema from '@/lib/schemas/group.ts';
import Form from '@/components/form.tsx';
import {upsertGroupAction} from '@/lib/actions/group.ts';
import {formValidators} from '@/lib/schemas/utils.ts';
import {type GroupByIdWithStudents} from '@/lib/group.ts';
import {type StudentSearchResult} from '@/lib/user.ts';
import SelectStudentsDialog from '@/app/groups/edit/select-students-dialog.tsx';

export type GroupFormProps = {
	readonly colors: Color[];
	readonly group?: GroupByIdWithStudents;
};

export default function GroupForm(props: GroupFormProps) {
	const {
		colors,
		group,
	} = props;

	const validate = formValidators(groupUpsertSchema);

	const [active, setActive] = useState(group?.active ?? true);

	const groupStudents = useListData<StudentSearchResult>({
		initialItems: group?.students ?? [],
	});

	return (
		<Form
			id={group?.id}
			action={upsertGroupAction} staticValues={{
				tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
				active: active ? undefined : false,
				students: JSON.stringify(groupStudents.items.map(student => student.id)),
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
			<p className='mb-2'>
				Hay {groupStudents.items.length} estudiante(s) en el grupo.
			</p>
			<SelectStudentsDialog students={groupStudents}/>
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
