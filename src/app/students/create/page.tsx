import React from 'react';
import StudentForm from '@/app/students/student-form.tsx';

export default function Page() {
	return (
		<>
			<h1 className='text-lg font-semibold'>Registro de estudiante</h1>
			<StudentForm/>
		</>
	);
}
