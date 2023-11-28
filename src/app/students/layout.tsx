import React from 'react';
import {revalidatePath} from 'next/cache';
import {deleteStudents, getAllStudents} from '@/lib/students.ts';
import StudentClientLayout from '@/app/students/student-client-layout.tsx';

export default async function StudentsLayout({children}: {children: React.ReactNode}) {
	const students = await getAllStudents();

	const deleteStudentsAction = async (students: number[]) => {
		'use server';
		await deleteStudents(students);
		revalidatePath('/students');
	};

	return (
		<StudentClientLayout students={students} action={deleteStudentsAction}>
			{children}
		</StudentClientLayout>
	);
}
