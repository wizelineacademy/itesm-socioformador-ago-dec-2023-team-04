import React from 'react';
import {notFound} from 'next/navigation';
import {getNotification} from '@/lib/notification.ts';
import TutorContactInfo from '@/components/contact-display.tsx';

export default async function NotificationInfo() {
	const notification = await getNotification(1);

	if (notification === null) {
		notFound();
	}

	return (
		<div>
			<div className='text-2xl'>
				Nombre
				Apellido
			</div>
			<div>
				<TutorContactInfo infoId={notification.tutorId}/>
			</div>
			<div>Envío del mensaje:
				SMS
				Correo
			</div>
			<div>Fecha de envío:</div>
			<div>Mensaje:</div>
			<div className='flex bg-stone-700 justify-between w-full text-xs'>
				{`${notification.message}`}
			</div>
		</div>
	);
}
