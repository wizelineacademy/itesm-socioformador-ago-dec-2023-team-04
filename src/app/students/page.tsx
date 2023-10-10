import React from 'react';
import Icon from '@/components/icon.tsx';

export default function StudentPage() {
	return (
		<div className='flex flex-col justify-center items-center w-full h-full text-stone-400'>
			<Icon name='person'/>
			<h2 className='text-center w-32'>Ningún alumno seleccionado.
				Seleccione a un alumno para mostrar su información
			</h2>
		</div>
	);
}
