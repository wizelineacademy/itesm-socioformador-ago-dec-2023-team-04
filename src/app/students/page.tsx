import React from 'react';
import clsx from 'clsx';
import Icon from '@/components/icon.tsx';
import StudentCreationForm from '@/app/students/create/student-creation-form.tsx';

export default function StudentPage() {
	return (
		<div className='flex flex-col justify-center items-center w-full h-full text-stone-400'>
			{/* <Icon name='person' className='m-2'/>
			<p>Ningún alumno seleccionado.
				Seleccione a un alumno para mostrar su información
			</p> */}
			<h2 className='mb-2'>
				Registro de Alumnos
			</h2>
			<StudentCreationForm className='w-full'/>
		</div>
	);
}

