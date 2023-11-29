'use client';
import React, {useState} from 'react';
import {type User} from '@prisma/client';
import Form, {type FormState} from '@/components/form.tsx';
import {type UserInit, userInitSchema} from '@/lib/schemas/user.ts';
import TextField from '@/components/text-field.tsx';
import {formValidators} from '@/lib/schemas/utils.ts';
import SubmitButton from '@/components/submit-button.tsx';

export type AccountFormProps = {
	readonly user: User;
	readonly action: (state: FormState<Partial<UserInit>>, data: FormData) => Promise<FormState<Partial<UserInit>>>;
};

export default function AccountForm(props: AccountFormProps) {
	const {action, user} = props;

	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');

	const validate = formValidators(user ? userInitSchema.partial() : userInitSchema);

	return (
		<Form
			action={action}
			successToast={{
				title: 'Tu información se ha actualizado con éxito',
			}}
			staticValues={{
				password: password.trim() === '' ? undefined : password,
			}}
		>
			<TextField
				isRequired
				name='givenName'
				label='Nombre(s)'
				className='mb-4 w-full'
				validate={validate.givenName}
				defaultValue={user.givenName}
			/>
			<TextField
				isRequired
				name='familyName'
				label='Apellido(s)'
				className='mb-4'
				validate={validate.familyName}
				defaultValue={user.familyName}
			/>
			<TextField
				isRequired
				name='email'
				label='Correo electrónico(s)'
				className='mb-4'
				validate={validate.email}
				defaultValue={user.email}
			/>
			<TextField
				label='Contraseña'
				className='mb-4'
				type='password'
				validate={validate.password}
				value={password}
				onChange={setPassword}
			/>
			<TextField
				label='Repite la contraseña'
				className='mb-4'
				type='password'
				value={passwordConfirmation}
				validate={confirmation => {
					if (confirmation !== password) {
						return 'Confirmación de contraseña incorrecta.';
					}
				}}
				onChange={setPasswordConfirmation}
			/>
			<div className='flex justify-end'>
				<SubmitButton/>
			</div>
		</Form>
	);
}
