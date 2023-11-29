import React, {type ReactNode} from 'react';
import {revalidatePath} from 'next/cache';
import {type Metadata} from 'next';
import {deleteStudents, getAllStudents} from '@/lib/students.ts';
import StudentClientLayout from '@/app/students/student-client-layout.tsx';

export const metadata: Metadata = {
	title: 'Estudiantes | SATS',
	description: 'metaphora. Student Attendance Tracking System',
};

export type StudentsLayoutProps = {
	readonly children: ReactNode;
};

export default async function StudentsLayout(props: StudentsLayoutProps) {
	const {children} = props;

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
