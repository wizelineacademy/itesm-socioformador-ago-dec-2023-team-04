'use client';
import React, {useState} from 'react';
import {ZodError} from 'zod';
import {useQueryClient} from 'react-query';
import {useRouter} from 'next/navigation';
import {LabeledInput} from '@/components/labeled-input.tsx';
import {Button} from '@/components/button.tsx';
import {decodeForm} from '@/lib/schemas/util.ts';
import {userRegistrationSchema} from '@/lib/schemas/user-registration.ts';
import LabeledCheckbox from '@/components/labeled-checkbox.tsx';
import createUser from '@/app/admin/users/create/create-user-action.ts';

export default function UserCreationForm({className}: {readonly className?: string}) {
	const [issues, setIssues] = useState(new Map<string, string>());
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
	const queryClient = useQueryClient();
	const router = useRouter();

	const handleForm = async (formData: FormData) => {
		try {
			await decodeForm(formData, userRegistrationSchema);
			setIssues(new Map());

			const result = await createUser(formData);

			if (result.success) {
				setErrorMessage(undefined);
				await queryClient.invalidateQueries('users');
				console.log(result.data);
				router.push(`/admin/users/${result.data}`);
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
			<LabeledInput required name='givenName' label='Nombre(s)' className='mb-4 w-full' issueText={issues.get('givenName')}/>
			<LabeledInput required name='familyName' label='Apellido(s)' className='mb-4' issueText={issues.get('familyName')}/>
			<LabeledInput required name='email' label='Correo electrónico(s)' className='mb-4' issueText={issues.get('email')}/>
			<LabeledInput required name='password' label='Contraseña' className='mb-4' type='password' issueText={issues.get('password')}/>
			<LabeledInput required name='passwordConfirmation' label='Repite la contraseña' className='mb-4' type='password' issueText={issues.get('passwordConfirmation')}/>
			<LabeledCheckbox name='admin' label='Es administrador' className='mb-4'/>
			<Button variant='secondary' type='submit' size='sm'>Confirmar</Button>
		</form>
	);
}
