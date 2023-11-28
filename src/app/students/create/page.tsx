import React from 'react';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import StudentForm from '@/app/students/student-form.tsx';
import {type FormState} from '@/components/form.tsx';
import {type StudentInit, studentInitSchema} from '@/lib/schemas/student.ts';
import {handleActionError} from '@/lib/action-utils.ts';
import {createStudent} from '@/lib/students.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';

export default function Page() {
	const createStudentAction = async (state: FormState<StudentInit>, data: FormData): Promise<FormState<StudentInit>> => {
		'use server';
		let studentId: number;
		try {
			const parsedData = await decodeForm(data, studentInitSchema);
			const student = await createStudent(parsedData);
			studentId = student.id;
		} catch (error) {
			return handleActionError(state, error);
		}

		revalidatePath('/students');
		redirect(`/students/${studentId}`);
	};

	return (
		<>
			<h1 className='text-lg font-semibold'>Registro de estudiante</h1>
			<StudentForm action={createStudentAction}/>
		</>
	);
}
