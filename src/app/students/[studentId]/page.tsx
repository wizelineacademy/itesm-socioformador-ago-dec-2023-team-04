import React from 'react';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {getStudentById, updateStudent} from '@/lib/students.ts';
import StudentForm from '@/app/students/student-form.tsx';
import {type FormState} from '@/components/form.tsx';
import {type StudentInit, studentInitSchema} from '@/lib/schemas/student.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {handleActionError} from '@/lib/action-utils.ts';

export type StudentEditPageProps = {
	readonly params: {
		readonly studentId: string;
	};
};

export default async function StudentEditPage(props: StudentEditPageProps) {
	const {params} = props;
	const studentId = Number.parseInt(params.studentId, 10);
	const student = await getStudentById(studentId);

	if (student === null) {
		redirect('/students');
	}

	const updateStudentAction = async (state: FormState<Partial<StudentInit>>, data: FormData): Promise<FormState<Partial<StudentInit>>> => {
		'use server';
		try {
			const parsedData = await decodeForm(data, studentInitSchema.partial());
			await updateStudent(studentId, parsedData);
		} catch (error) {
			return handleActionError(state, error);
		}

		revalidatePath('/students');
		return {
			...state,
			success: true,
			formErrors: [],
			fieldErrors: {},
		};
	};

	return (
		<div>
			<div className='flex justify-between w-full'>
				<h1 className='text-2xl'>
					{`${student.givenName} ${student.familyName}`}
				</h1>
			</div>
			<StudentForm student={student} action={updateStudentAction}/>
		</div>
	);
}
