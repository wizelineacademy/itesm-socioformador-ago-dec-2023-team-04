'use client';
import React from 'react';
import Link from 'next/link';
import {useListData} from 'react-stately';
import {Button} from '@/components/button.tsx';
import TextField from '@/components/text-field.tsx';
import Form from '@/components/form.tsx';
import {formValidators} from '@/lib/schemas/utils.ts';
import {tutorSchema} from '@/lib/schemas/tutor.ts';
import {type TutorByIdWithStudents, upsertTutorAction} from '@/lib/actions/tutor.ts';
import SelectStudentsDialog from '@/app/groups/edit/select-students-dialog.tsx';
import {type StudentSearchResult} from '@/lib/user.ts';

export type TutorCreationFormProps = {
	readonly tutor?: TutorByIdWithStudents;
};

export default function TutorForm(props: TutorCreationFormProps) {
	const {
		tutor,
	} = props;

	const validate = formValidators(tutorSchema);

	const tutorStudents = useListData<StudentSearchResult>({
		initialItems: tutor?.students?.map(student => student) ?? [],
	});

	return (
		<Form
			id={tutor?.id}
			action={upsertTutorAction}
			staticValues={{students: JSON.stringify(tutorStudents.items.map(student => student.id))}}
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
