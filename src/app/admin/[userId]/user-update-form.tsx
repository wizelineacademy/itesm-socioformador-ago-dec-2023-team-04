'use client';
import React, {useState} from 'react';
import {ZodError} from 'zod';
import {useQueryClient} from 'react-query';
import {type User} from '@prisma/client';
import {LabeledInput} from '@/components/labeled-input.tsx';
import {Button} from '@/components/button.tsx';
import {decodeForm} from '@/lib/schemas/util.ts';
import {userUpdateSchema} from '@/lib/schemas/user.ts';
import updateUser from '@/app/admin/[userId]/user-update-action.ts';
import LabeledCheckbox from '@/components/labeled-checkbox.tsx';

export default function UserUpdateForm({user, className}: {readonly user: User; readonly className?: string}) {
	const [issues, setIssues] = useState(new Map<string, string>());
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
	const queryClient = useQueryClient();

	const handleForm = async (formData: FormData) => {
		try {
			await decodeForm(formData, userUpdateSchema);
			setIssues(new Map());
			const [result] = await Promise.all([updateUser(formData, user.id, user.authId)]);

			if (result.success) {
				setErrorMessage(undefined);
				await queryClient.invalidateQueries('users');
				console.log('User update successful');
				// Router.push(`/admin/users/${user.id}`);
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
		<form
			className={className}
			action={handleForm}
		>
			{errorMessage === undefined ? null : (
				<div className='bg-wRed-200 text-wRed-600 rounded p-2 mb-4'>{errorMessage}</div>
			)}
			<LabeledInput
				required
				name='givenName'
				label='Nombre(s)'
				className='mb-4 w-full'
				issueText={issues.get('givenName')}
				defaultValue={user.givenName}
			/>
			<LabeledInput
				required
				name='familyName'
				label='Apellido(s)'
				className='mb-4'
				issueText={issues.get('familyName')}
				defaultValue={user.familyName}
			/>
			<LabeledInput
				required
				name='email'
				label='Correo electrónico(s)'
				className='mb-4'
				issueText={issues.get('email')}
				defaultValue={user.email}
			/>
			<LabeledInput
				required
				name='password'
				label='Contraseña'
				className='mb-4'
				type='password'
				issueText={issues.get('password')}
				defaultValue=''
			/>
			<LabeledInput
				required
				name='passwordConfirmation'
				label='Repite la contraseña'
				className='mb-4'
				type='password'
				issueText={issues.get('passwordConfirmation')}
				defaultValue=''
			/>
			<LabeledCheckbox name='admin' label='Es administrador' className='mb-4'/>
			<Button color='secondary' type='submit' size='sm'>
				Actualizar
			</Button>
		</form>
	);
}
