import React from 'react';
import {getAllStudents} from '@/lib/students.ts';
import StudentClientLayout from '@/app/students/student-client-layout.tsx';

export default async function StudentsLayout({children}: {children: React.ReactNode}) {
	const students = await getAllStudents();
	return (
		<StudentClientLayout students={students}>
			{children}
		</StudentClientLayout>
	);
}
