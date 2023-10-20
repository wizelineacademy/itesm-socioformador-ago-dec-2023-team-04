import React from 'react';
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {notFound} from 'next/navigation';
import {getNotification} from '@/lib/notification.ts';
import {getStudentName} from '@/lib/student.ts';
import TutorContactInfo from '@/components/contact-display.tsx';
import Icon from '@/components/icon.tsx';

export default withPageAuthRequired(async ({params}) => {
	const notification = await getNotification(Number.parseInt(params.notificationId as string, 10));
	const student = await getStudentName(notification.studentId);

	if (notification === null) {
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

