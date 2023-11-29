import React from 'react';
import {revalidatePath} from 'next/cache';
import {type Metadata} from 'next';
import {deleteStudents, getAllStudents} from '@/lib/students.ts';
import StudentClientLayout from '@/app/students/student-client-layout.tsx';

export const metadata: Metadata = {
	title: 'Estudiantes | SATS',
	description: 'metaphora. Student Attendance Tracking System',
};

export default async function StudentsLayout({children}: {children: React.ReactNode}) {
	const students = await getAllStudents();

	const deleteStudentsAction = async (students: number[]) => {
		'use server';
		const count = await deleteStudents(students);
		revalidatePath('/students');
		return count;
	};

	return (
		<StudentClientLayout students={students} action={deleteStudentsAction}>
			{children}
		</StudentClientLayout>
	);
}
