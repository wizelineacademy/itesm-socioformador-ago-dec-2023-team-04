import React from 'react';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {getUserById, updateUser} from '@/lib/users.ts';
import UserForm from '@/app/users/user-form.tsx';
import {type FormState} from '@/components/form.tsx';
import {type UserInit, userInitSchema} from '@/lib/schemas/user.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {handleActionError} from '@/lib/action-utils.ts';

export type EditUserPageProps = {
	readonly params: {
		readonly userId: string;
	};
};

export default async function EditUserPage(props: EditUserPageProps) {
	const {
		params,
	} = props;

	const userId = Number.parseInt(params.userId, 10);

	const user = await getUserById(userId);

	if (user === null) {
		redirect('/admin/users');
	}

	const updateUserAction = async (state: FormState<Partial<UserInit>>, data: FormData) => {
		'use server';
		try {
			const parsedData = await decodeForm(data, userInitSchema.partial());
			await updateUser(userId, parsedData);
		} catch (error) {
			console.log(error);
			return handleActionError(state, error);
		}

		revalidatePath('/users');
		return {
			...state,
			formErrors: [],
			fieldErrors: {},
		};
	};

	return (
		<div>
			<h1 className='text-2xl mb-4'>
				Edición de usuario
			</h1>
			<h2>
				{`${user.givenName} ${user.familyName}`}
			</h2>
			<UserForm user={user} action={updateUserAction}/>
		</div>
	);
}
