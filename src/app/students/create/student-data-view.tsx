import React from 'react';
import clsx from 'clsx';
import Icon from '@/components/icon.tsx';

export default function StudentDataView({className}: {readonly className?: string}) {
	return (
		<div className={clsx(className)}>
			<Icon name='person' className='m-2'/>
			<p>Ningún alumno seleccionado.
				Seleccione a un alumno para mostrar su información
			</p>
		</div>
	);
}
