import React from 'react';
import Icon from '@/components/icon.tsx';

export default function NotificationPage() {
	return (
		<div className='flex flex-col justify-center text-center items-center w-full h-full text-stone-400'>
			<Icon name='notifications' className='m-2'/>
			<p>Ninguna notificación seleccionada.
				Seleccione una notificación para mostrar su información
			</p>
		</div>
	);
}
