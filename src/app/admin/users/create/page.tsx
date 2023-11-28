import React from 'react';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import UserForm from '@/app/admin/users/user-form.tsx';
import {type FormState} from '@/components/form.tsx';
import {type UserInit, userInitSchema} from '@/lib/schemas/user.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {createUser} from '@/lib/users.ts';
import {handleActionError} from '@/lib/action-utils.ts';

export default function UsersPage() {
	const createUserAction = async (state: FormState<UserInit>, data: FormData) => {
		'use server';
		let userId: number;
		try {
			const parsedData = await decodeForm(data, userInitSchema);
			const user = await createUser(parsedData);
			userId = user.id;
		} catch (error) {
			return handleActionError(state, error);
		}

		revalidatePath('/admin/users');
		redirect(`/admin/users/${userId}`);
	};

	return (
		<div className='w-full'>
			<h2 className='text-2xl mb-4'>
				Creación de usuario
			</h2>
			<UserForm action={createUserAction}/>
		</div>

	);
}
