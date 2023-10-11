import React from 'react';
import {notFound} from 'next/navigation';
import {getStudent} from '@/lib/student.ts';

export default function StudentInfoPage(async ({info}, {info: int}) => {
	const student = await getStudent(Number.parseInt(info.registration as string, 10));

	if (student === null) {
		notFound();
	}

	return (
		<div>
			<h1>
				{`${student.givenName} ${student.familyName}`}
			</h1>
		</div>
	);
}, {
	returnTo: '/',
});
