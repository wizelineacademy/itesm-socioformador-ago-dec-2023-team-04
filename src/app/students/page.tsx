import React from 'react';
import StudentsTable from '@/components/students-table.tsx';
import StudentDataView from '@/components/student-data-view.tsx';
import {getAllStudents} from '@/lib/student.ts';

export default async function Students() {
	const students = await getAllStudents();
	return (
		<main className='w-full gb-stone-900'>
			<div className='p-16 text-stone-300 min-h-screen flex flex-col'>
				<h1 className='text-4xl'>Alumnos</h1>

				<div className='pt-8 flex gap-4 grow'>
					<div className='p-6 w-auto rounded-lg bg-stone-800 flex-1'>
						<StudentsTable students={students} className='w-full'/>
					</div>
					<StudentDataView className='p-12 w-96 h rounded-lg bg-stone-800 text-center text-base flex justify-center flex-col items-center'/>
				</div>
			</div>
		</main>
	);
}
