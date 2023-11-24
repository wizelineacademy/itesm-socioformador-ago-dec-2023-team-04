import React from 'react';
import clsx from 'clsx';
import Icon from '@/components/icon.tsx';

export default function TutorPage() {
	return (
		<div className='flex flex-col justify-center text-center items-center w-full h-full text-stone-400'>
			<Icon name='person' className='m-2'/>
			<p>Ningún tutor seleccionado.
				Seleccione a un tutor para mostrar su información
			</p>
		</div>
	);
}

