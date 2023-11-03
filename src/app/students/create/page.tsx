import React from 'react';
import StudentCreationForm from '@/app/students/create/student-creation-form.tsx';

export default function Page() {
	return (
		<>
			<h1 className='text-lg font-semibold'>Creación de estudiante</h1>
			<StudentCreationForm/>
		</>
	);
}
