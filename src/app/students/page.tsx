import React from 'react';
import Icon from '@/components/icon.tsx';

export default function StudentPage() {
	return (
		<div className='flex flex-col justify-center text-center items-center w-full h-full text-stone-400'>
			<Icon name='person' className='m-2'/>
			<p>Ningún alumno seleccionado.
				Seleccione a un alumno para mostrar su información
			</p>
		</div>
	);
}

