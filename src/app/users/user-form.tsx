'use client';
import React, {useState} from 'react';
import {type User} from '@prisma/client';
import Form, {type FormState} from '@/components/form.tsx';
import {formValidators} from '@/lib/schemas/utils.ts';
import {type UserInit, userInitSchema} from '@/lib/schemas/user.ts';
import TextField from '@/components/text-field.tsx';
import Checkbox from '@/components/checkbox.tsx';
import SubmitButton from '@/components/submit-button.tsx';

export type UserUpdateFormProps = {
	readonly user: User;
	readonly action: (state: FormState<Partial<UserInit>>, data: FormData) => Promise<FormState<Partial<UserInit>>>;
} | {
	readonly action: (state: FormState<UserInit>, data: FormData) => Promise<FormState<Partial<UserInit>>>;
};

export default function UserForm(props: UserUpdateFormProps) {
	const {action} = props;
	const user = 'user' in props ? props.user : undefined;

	const validate = formValidators(user ? userInitSchema.partial() : userInitSchema);

	const [admin, setAdmin] = useState(user?.admin ?? false);

	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');

	return (
		<Form
			action={action}
			successToast={{
				title: 'Usuario modificado con éxito',
			}}
			staticValues={{
				admin: admin ? undefined : false,
				password: password.trim() === '' ? undefined : password,
			}}
		>
			<TextField
				isRequired
				name='givenName'
				label='Nombre(s)'
				className='mb-4 w-full'
				validate={validate.givenName}
				defaultValue={user?.givenName}
			/>
			<TextField
				isRequired
				name='familyName'
				label='Apellido(s)'
				className='mb-4'
				validate={validate.familyName}
				defaultValue={user?.familyName}
			/>
			<TextField
				isRequired
				name='email'
				label='Correo electrónico(s)'
				className='mb-4'
				validate={validate.email}
				defaultValue={user?.email}
			/>
			<TextField
				isRequired={user === undefined}
				label='Contraseña'
				className='mb-4'
				type='password'
				validate={validate.password}
				value={password}
				onChange={setPassword}
			/>
			<TextField
				isRequired={user === undefined}
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
			<Checkbox name='admin' className='mb-4' isSelected={admin} onChange={setAdmin}>
				Es administrador
			</Checkbox>
			<div className='flex justify-end'>
				<SubmitButton/>
			</div>
		</Form>
	);
}
