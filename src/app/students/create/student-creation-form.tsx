'use client';
import React, {useState} from 'react';
import {ZodError} from 'zod';
import {useQueryClient} from 'react-query';
import {useRouter} from 'next/navigation';
import {LabeledInput} from '@/components/labeled-input.tsx';
import {Button} from '@/components/button.tsx';
import {decodeForm} from '@/lib/schemas/util.ts';
import {studentRegistrationSchema} from '@/lib/schemas/student.ts';
import createStudent from '@/app/students/create/create-student-action.ts';
import {getCertainTutors} from '@/lib/student.ts';

export default function StudentCreationForm({className}: {readonly className?: string}) {
	const [issues, setIssues] = useState(new Map<string, string>());
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
	const queryClient = useQueryClient();
	const router = useRouter();

	const handleForm = async (formData: FormData) => {
		try {
			await decodeForm(formData, studentRegistrationSchema);
			setIssues(new Map());

			const result = await createStudent(formData);

			if (result.success) {
				setErrorMessage(undefined);
				//   Await queryClient.invalidateQueries('students');
				console.log(result.data);
				// Router.push(`/admin/users/${result.data}`);
			} else {
				setErrorMessage(result.message);
			}
		} catch (error) {
			if (error instanceof ZodError) {
				setIssues(new Map(error.issues.map(issue => [issue.path[0].toString(), issue.message])));
			}
		}
	};

	return (
		<form className={className} action={handleForm}>
			{errorMessage === undefined ? null : <div className='bg-wRed-200 text-wRed-600 rounded p-2 mb-4'>{errorMessage}</div>}
			<LabeledInput required name='registration' label='Matrícula' className='mb-4 w-full' issueText={issues.get('registration')}/>
			<LabeledInput required name='givenName' label='Nombre(s)' className='mb-4' issueText={issues.get('givenName')}/>
			<LabeledInput required name='familyName' label='Apellido(s)' className='mb-4' issueText={issues.get('familyName')}/>
			<h2>
				Nuevo Tutor
			</h2>
			{/* <input
				type='text'
				id='tutor'
				className='bg-stone-700'
				onChange={async event => {
					console.log(await getCertainTutors('Erick'));
				}}
			/> */}
			<LabeledInput required name='tutorGivenName' label='Nombre(s)' className='mb-4 w-full' issueText={issues.get('tutorGivenName')}/>
			<LabeledInput required name='tutorFamilyName' label='Apellido(s)' className='mb-4' issueText={issues.get('tutorFamilyName')}/>
			<LabeledInput required name='tutorEmail' label='Correo' className='mb-4' issueText={issues.get('tutorEmail')}/>
			<LabeledInput required name='tutorPhone' label='Teléfono' className='mb-4' issueText={issues.get('tutorPhone')}/>
			<div className='flex justify-between'>
				<Button variant='secondary' type='submit' size='sm'>Confirmar</Button>
				<Button variant='destructive' type='reset' size='sm'>Cancelar</Button>
			</div>
		</form>
	);
}
