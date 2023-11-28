'use client';
import React, {useState} from 'react';
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
import groupInitSchema, {type GroupInit} from '@/lib/schemas/group.ts';
import Form, {type FormState} from '@/components/form.tsx';
import {formValidators} from '@/lib/schemas/utils.ts';
import {type GroupByIdWithStudents} from '@/lib/groups.ts';
import SelectTutorsDialog from '@/app/students/select-tutors-dialog.tsx';
import ButtonGroup, {GroupedButton} from '@/components/button-group.tsx';
import {NumberField} from '@/components/number-field.tsx';
import {type StudentSearchResult} from '@/lib/students.ts';
import SubmitButton from '@/components/submit-button.tsx';
import {type UsersSearchResult} from '@/lib/users.ts';
import SelectUsersDialog from '@/app/groups/edit/select-users-dialog.tsx';
import SelectStudentsDialog from '@/app/groups/select-students-dialog.tsx';

export type GroupFormProps = {
	readonly colors: Color[];
} & ({
	readonly action: (state: FormState<GroupInit>, data: FormData) => Promise<FormState<GroupInit>>;

} | {
	readonly action: (state: FormState<Partial<GroupInit>>, data: FormData) => Promise<FormState<Partial<GroupInit>>>;
	readonly group: GroupByIdWithStudents;
}
);

export default function GroupForm(props: GroupFormProps) {
	const {
		colors,
		action,
	} = props;

	const validate = formValidators(groupInitSchema);

	const group = 'group' in props ? props.group : undefined;

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

	const [duration, setDuration] = useState(group?.duration ?? 0);

	const groupStudents = useListData<StudentSearchResult>({
		initialItems: group?.students?.map(student => student.student) ?? [],
	});

	const groupUsers = useListData<UsersSearchResult>({
		initialItems: group?.users?.map(user => user) ?? [],
	});

	return (
		<Form
			successToast={{
				title: 'Grupo modificado con éxito.',
			}}
			action={action} staticValues={{
				tz: getLocalTimeZone(),
				active: active ? undefined : false,
				students: groupStudents.items.map(student => student.id),
				users: groupUsers.items.map(user => user.id),
				enabledMonday: daysActive.includes('monday'),
				enabledTuesday: daysActive.includes('tuesday'),
				enabledWednesday: daysActive.includes('wednesday'),
				enabledThursday: daysActive.includes('thursday'),
				enabledFriday: daysActive.includes('friday'),
				enabledSaturday: daysActive.includes('saturday'),
				enabledSunday: daysActive.includes('sunday'),
				duration,
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
			<TimeField
				isRequired
				name='entryHour'
				label='Hora de entrada'
				validate={validate.entryHour}
				defaultValue={group?.entryHour ? new Time(group.entryHour.getHours(), group.entryHour.getSeconds()) : undefined}
				className='mb-4'
			/>
			<h4 className='text-stone-400 text-sm'>
				Duración
			</h4>
			<div className='flex gap-4 mb-4'>
				<NumberField
					isRequired
					label='Horas'
					name='durationHours'
					minValue={0}
					value={Math.floor(duration / 60)}
					onChange={value => {
						if (Number.isNaN(value)) {
							return;
						}

						setDuration(previous => Number.isNaN(previous) ? value * 60 : (previous % 60) + (value * 60));
					}}
				/>
				<NumberField
					isRequired
					label='Minutos'
					name='durationMinutes'
					maxValue={59}
					minValue={0}
					value={duration % 60}
					onChange={value => {
						if (Number.isNaN(value)) {
							return;
						}

						setDuration(previous => Number.isNaN(previous) ? value : (Math.floor(previous / 60) * 60) + value);
					}}
				/>

			</div>
			<ButtonGroup label='Días de asistencia' className='mb-4' value={daysActive} onChange={setDaysActive}>
				<GroupedButton value='monday'>
					Lunes
				</GroupedButton>
				<GroupedButton value='tuesday'>
					Martes
				</GroupedButton>
				<GroupedButton value='wednesday'>
					Miercoles
				</GroupedButton>
				<GroupedButton value='thursday'>
					Jueves
				</GroupedButton>
				<GroupedButton value='friday'>
					Viernes
				</GroupedButton>
				<GroupedButton value='saturday'>
					Sabado
				</GroupedButton>
				<GroupedButton value='sunday'>
					Domingo
				</GroupedButton>
			</ButtonGroup>
			<p className='mb-2'>
				Hay {groupStudents.items.length} estudiante(s) en el grupo.
			</p>
			<SelectStudentsDialog students={groupStudents}/>
			<p className='mb-2'>
				{groupUsers.items.length} usuario(s) con acceso al grupo.
			</p>
			<SelectUsersDialog users={groupUsers}/>
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
				<SubmitButton/>
			</div>

		</Form>
	);
}
