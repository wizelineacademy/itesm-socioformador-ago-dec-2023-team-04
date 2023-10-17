import React from 'react';
import Icon from '@/components/icon.tsx';

export default function TutorContactInfo() {
	return (
		<div className='flex rounded bg-stone-700 w-full justify-items-stretch p-6'>
			<div className='grid grid-rows-3 grid-cols-2 w-full text-base text-stone-300 content-center items-center'>
				<div className='col-span-2 text-xl text-stone-100'>Tutor</div>
				<div>Nombre</div>
				<div className='text-right'>
					<Icon name='phone'/>
					Telefono</div>
				<div>Apellido</div>
				<div className='text-right'>
					<Icon name='mail'/>
					Correo</div>
			</div>
		</div>
	);
}
