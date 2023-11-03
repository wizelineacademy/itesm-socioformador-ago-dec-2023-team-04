import React from 'react';
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {notFound} from 'next/navigation';
import {getNotificationById} from '@/lib/notification.ts';
import {getStudentById} from '@/lib/student.ts';
import TutorContactInfo from '@/components/contact-display.tsx';
import Icon from '@/components/icon.tsx';

export default withPageAuthRequired(async ({params}: {
	readonly params?: {
		notificationId?: string;
	};
}) => {
	const notificationId = params!.notificationId!;
	const notification = await getNotificationById(Number.parseInt(notificationId, 10));

	if (notification === null) {
		notFound();
	}

	const student = await getStudentById(notification.studentId);

	if (student === null) {
		notFound();
	}

	return (
		<div className='flex flex-col h-full'>
			<div className='flex justify-between w-full'>
				<h1 className='text-2xl text-stone-50'>
					{`${student.givenName} ${student.familyName}`}
				</h1>
			</div>
			<TutorContactInfo infoId={notification.tutorId} className='mb-4'/>
			<h3 className='text-stone-200'>Fecha de envío:</h3>
			<p
				className='text-base text-stone-300 mb-4'
			>{`${notification.sentTime.toLocaleString('es-MX', {timeZone: 'UTC'})}`}</p>
			<h3 className='text-stone-200'>Mensaje:</h3>
			<p className='flex bg-stone-700 justify-between w-full grow rounded text-xs'>
				{`${notification.message}`}
			</p>
		</div>
	);
}, {
	returnTo: '/',
});

