'use client';
import React from 'react';
import Link from 'next/link';
import {useListData} from 'react-stately';
import {Button} from '@/components/button.tsx';
import TextField from '@/components/text-field.tsx';
import Form, {type FormState} from '@/components/form.tsx';
import {formValidators} from '@/lib/schemas/utils.ts';
import {type TutorInit, tutorInitSchema} from '@/lib/schemas/tutor.ts';
import {type TutorByIdWithStudents} from '@/lib/tutors.ts';
import SelectStudentsDialog from '@/app/groups/edit/select-students-dialog.tsx';
import {type StudentSearchResult} from '@/lib/students.ts';

export type TutorCreationFormProps = {
	readonly tutor: TutorByIdWithStudents;
	readonly action: (state: FormState<Partial<TutorInit>>, data: FormData) => Promise<FormState<Partial<TutorInit>>>;
} | {
	readonly action: (state: FormState<TutorInit>, data: FormData) => Promise<FormState<TutorInit>>;
};

export default function TutorForm(props: TutorCreationFormProps) {
	const {
		action,
	} = props;

	const tutor = 'tutor' in props ? props.tutor : undefined;

	const validate = formValidators(tutorInitSchema);

	const tutorStudents = useListData<StudentSearchResult>({
		initialItems: tutor?.students?.map(student => student) ?? [],
	});

	return (
		<Form
			action={action}
			staticValues={{students: tutorStudents.items.map(student => student.id)}}
		>
			<TextField
				isRequired name='givenName'
				label='Nombre(s)'
				className='mb-4'
				validate={validate.givenName}
				defaultValue={tutor?.givenName}
			/>
			<TextField
				isRequired name='familyName'
				label='Apellido(s)'
				className='mb-4'
				validate={validate.familyName}
				defaultValue={tutor?.familyName}
			/>
			<TextField
				isRequired name='phoneNumber'
				label='Número'
				className='mb-4 w-full'
				validate={validate.phoneNumber}
				defaultValue={tutor?.phoneNumber}
			/>
			<TextField
				isRequired name='email'
				label='Correo'
				className='mb-4 w-full'
				validate={validate.email}
				defaultValue={tutor?.email}
			/>
			<p className='mb-2'>
				Tutor de: {tutorStudents.items.length} estudiante(s)
			</p>
			<SelectStudentsDialog students={tutorStudents}/>
			<div className='flex justify-between'>
				<Link href='/tutors'>
					<Button
						color='secondary' size='sm'
						variant='outlined'
					>Cancelar</Button>
				</Link>
				<Button color='secondary' type='submit' size='sm'>Confirmar</Button>
			</div>
		</Form>
	);
}
