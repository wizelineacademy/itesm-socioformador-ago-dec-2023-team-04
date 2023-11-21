'use client';
import React, {useMemo, useState} from 'react';
import {type Color} from '@prisma/client';
import {getLocalTimeZone, Time} from '@internationalized/date';
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
import ButtonGroup, {GroupedButton} from '@/components/button-group.tsx';

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

	const [daysActive, setDaysActive] = useState(() => {
		const days: string[] = [];
		if (group?.enabledMonday) {
			days.push('monday');
		}

		if (group?.enabledTuesday) {
			days.push('tuesday');
		}

		if (group?.enabledWednesday) {
			days.push('wednesday');
		}

		if (group?.enabledThursday) {
			days.push('thursday');
		}

		if (group?.enabledFriday) {
			days.push('friday');
		}

		if (group?.enabledSaturday) {
			days.push('saturday');
		}

		if (group?.enabledSunday) {
			days.push('sunday');
		}

		return days;
	});

	const groupStudents = useListData<StudentSearchResult>({
		initialItems: group?.students?.map(student => student.student) ?? [],
	});

	return (
		<Form
			id={group?.id}
			action={upsertGroupAction} staticValues={{
				tz: getLocalTimeZone(),
				active: active ? undefined : false,
				students: JSON.stringify(groupStudents.items.map(student => student.id)),
				enabledMonday: daysActive.includes('monday') ? undefined : false,
				enabledTuesday: daysActive.includes('tuesday') ? undefined : false,
				enabledWednesday: daysActive.includes('wednesday') ? undefined : false,
				enabledThursday: daysActive.includes('thursday') ? undefined : false,
				enabledFriday: daysActive.includes('friday') ? undefined : false,
				enabledSaturday: daysActive.includes('saturday') ? undefined : false,
				enabledSunday: daysActive.includes('sunday') ? undefined : false,
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
			<ButtonGroup label='Días de asistencia' className='mb-4' value={daysActive} onChange={setDaysActive}>
				<GroupedButton name='enabledMonday' value='monday'>
					Lunes
				</GroupedButton>
				<GroupedButton name='enabledTuesday' value='tuesday'>
					Martes
				</GroupedButton>
				<GroupedButton name='enabledWednesday' value='wednesday'>
					Miercoles
				</GroupedButton>
				<GroupedButton name='enabledThursday' value='thursday'>
					Jueves
				</GroupedButton>
				<GroupedButton
					name='enabledFriday' value='friday'
				>
					Viernes
				</GroupedButton>
				<GroupedButton name='enabledSaturday' value='saturday'>
					Sabado
				</GroupedButton>
				<GroupedButton name='enabledSunday' value='sunday'>
					Domingo
				</GroupedButton>
			</ButtonGroup>
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
