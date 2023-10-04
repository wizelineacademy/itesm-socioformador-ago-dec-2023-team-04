import React from 'react';
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {notFound} from 'next/navigation';
import {getUser} from '@/lib/user.ts';

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
			<h1>
				{`${user.givenName} ${user.familyName}`}
			</h1>
		</div>
	);
}, {
	returnTo: '/',
});
