'use client';
import React, {useState} from 'react';
import {type User} from '@prisma/client';
import {Button} from '@/components/button.tsx';
import LabeledCheckbox from '@/components/labeled-checkbox.tsx';
import {upsertUserAction} from '@/lib/actions/user.ts';
import Form from '@/components/form.tsx';
import {formValidators} from '@/lib/schemas/utils.ts';
import {userSchema} from '@/lib/schemas/user.ts';
import TextField from '@/components/text-field.tsx';
import Checkbox from '@/components/checkbox.tsx';

export type UserUpdateFormProps = {
	readonly user?: User;
};

export default function UserForm(props: UserUpdateFormProps) {
	const {user} = props;

	const validate = formValidators(user ? userSchema.partial() : userSchema);

	const [admin, setAdmin] = useState(user?.admin ?? false);

	const [password, setPassword] = useState('');

	return (
		<Form
			action={upsertUserAction}
			staticValues={{
				admin: admin ? undefined : false,
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
				name='password'
				label='Contraseña'
				className='mb-4'
				type='password'
				validate={validate.password}
				value={password}
				defaultValue=''
				onChange={setPassword}
			/>
			<TextField
				isRequired={user === undefined}
				name='passwordConfirmation'
				label='Repite la contraseña'
				className='mb-4'
				type='password'
				validate={confirmation => {
					if (confirmation !== password) {
						return 'Confirmación de contraseña incorrecta.';
					}
				}}
				defaultValue=''
			/>
			<Checkbox name='admin' className='mb-4' isSelected={admin} onChange={setAdmin}>
				Es administrador
			</Checkbox>
			<Button color='secondary' type='submit' size='sm'>
				Actualizar
			</Button>
		</Form>
	);
}
