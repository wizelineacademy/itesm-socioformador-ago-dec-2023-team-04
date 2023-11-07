import React from 'react';
import {redirect} from 'next/navigation';
import {getUserById} from '@/lib/user.ts';
import UserForm from '@/app/admin/users/user-form.tsx';

export type EditUserPageProps = {
	readonly params: {
		readonly userId: string;
	};
};

export default async function EditUserPage(props: EditUserPageProps) {
	const {
		params: {
			userId,
		},
	} = props;

	const user = await getUserById(Number.parseInt(userId, 10));

	if (user === null) {
		redirect('/admin/users');
	}

	return (
		<div>
			<h1 className='text-2xl mb-4'>
				Edición de usuario
			</h1>
			<h2>
				{`${user.givenName} ${user.familyName}`}
			</h2>
			<UserForm user={user}/>
		</div>
	);
}
