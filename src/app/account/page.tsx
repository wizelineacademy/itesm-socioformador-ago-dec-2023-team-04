import React from 'react';
import {type Metadata} from 'next';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import AccountForm from '@/app/account/account-form.tsx';
import {getUserFromSession, updateUser} from '@/lib/users.ts';
import {type FormState} from '@/components/form.tsx';
import {type UserInit, userInitSchema} from '@/lib/schemas/user.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {handleActionError} from '@/lib/action-utils.ts';
import {AuthenticationError} from '@/lib/errors.ts';

export const metadata: Metadata = {
	title: 'Mi cuenta | SATS',
	description: 'metaphora. Student Attendance Tracking System',
};

export default async function Home() {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	const updateUserAction = async (state: FormState<Partial<UserInit>>, data: FormData): Promise<FormState<Partial<UserInit>>> => {
		'use server';
		try {
			const parsedData = await decodeForm(data, userInitSchema.partial());
			await updateUser(user.id, parsedData);
		} catch (error) {
			return handleActionError(state, error);
		}

		return {
			...state,
			success: true,
			formErrors: [],
			fieldErrors: {},
		};
	};

	return (
		<TopBarPageTemplate title='Tu cuenta'>
			<div className='bg-stone-800 rounded p-4 max-w-md mx-auto'>
				<AccountForm user={user} action={updateUserAction}/>
			</div>
		</TopBarPageTemplate>
	);
}
