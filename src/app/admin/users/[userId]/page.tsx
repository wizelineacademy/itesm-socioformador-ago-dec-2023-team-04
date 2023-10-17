import React from 'react';
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {notFound} from 'next/navigation';
import {getUser} from '@/lib/user.ts';
import UserUpdateForm from '@/app/admin/users/[userId]/user-update-form.tsx';

export default withPageAuthRequired(async ({params}) => {
	if (params === undefined) {
		notFound();
	}

	const user = await getUser(Number.parseInt(params.userId as string, 10));

	if (user === null) {
		notFound();
	}

	return (
		<div>
			<h1 className='text-2xl mb-4'>
				Edición de usuario
			</h1>
			<h2>
				{`${user.givenName} ${user.familyName}`}
			</h2>
			<UserUpdateForm user={user} className='w-full'/>
		</div>
	);
}, {
	returnTo: '/',
});
