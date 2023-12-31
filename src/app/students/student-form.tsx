'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {useListData} from 'react-stately';
import BiometricDataDialog from './biometric-data-dialog.tsx';
import {Button} from '@/components/button.tsx';
import ButtonModalTrigger from '@/components/button-modal-trigger.tsx';
import TextField from '@/components/text-field.tsx';
import Icon from '@/components/icon.tsx';
import Form, {type FormState} from '@/components/form.tsx';
import {formValidators} from '@/lib/schemas/utils.ts';
import {type StudentInit, studentInitSchema} from '@/lib/schemas/student.ts';
import SubmitButton from '@/components/submit-button.tsx';
import SelectTutorsDialog from '@/app/students/select-tutors-dialog.tsx';
import {type StudentWithTutors} from '@/lib/students.ts';
import {type TutorsSearchResult} from '@/lib/tutors.ts';

export type StudentCreationFormProps = {
	readonly student: StudentWithTutors;
	readonly action: (state: FormState<Partial<StudentInit>>, data: FormData) => Promise<FormState<Partial<StudentInit>>>;
} | {
	readonly action: (state: FormState<StudentInit>, data: FormData) => Promise<FormState<StudentInit>>;
};

export default function StudentForm(props: StudentCreationFormProps) {
	const {action} = props;
	const student = 'student' in props ? props.student : undefined;
	const [biometricData, setBiometricData] = useState<number[] | undefined>(student?.biometricData);

	const tutors = useListData<TutorsSearchResult>({
		initialItems: student?.tutors ?? [],
	});

	const validate = formValidators(studentInitSchema);

	return (
		<Form
			successToast={{
				title: 'Estudiante modificado con éxito.',
			}}
			action={action} staticValues={{
				biometricData: biometricData ?? undefined,
				tutors: tutors.items.map(tutor => tutor.id),
			}}
		>
			<TextField
				isRequired name='registration'
				label='Matrícula'
				className='mb-4 w-full'
				validate={validate.registration}
				defaultValue={student?.registration}
			/>
			<TextField
				isRequired name='givenName'
				label='Nombre(s)'
				className='mb-4'
				validate={validate.givenName}
				defaultValue={student?.givenName}
			/>
			<TextField
				isRequired name='familyName'
				label='Apellido(s)'
				className='mb-4'
				validate={validate.familyName}
				defaultValue={student?.familyName}
			/>
			<p className='text-sm mb-2'>
				{
					biometricData === undefined
						? 'No se ha agregado información biometrica.'
						: 'Información biometrica agregada correctamente.'
				}
			</p>

			<ButtonModalTrigger
				label={
					<>
						<Icon name='add' className='me-1' size='sm'/>
						{
							biometricData === undefined
								? 'Agregar datos biometricos'
								: 'Cambiar datos biometricos'
						}
					</>
				} color='secondary' size='sm'
				variant='text'
				className='w-full mb-4'
			>
				{
					close => (
						<BiometricDataDialog
							close={close}
							onBiometricDataSubmission={setBiometricData}/>
					)
				}
			</ButtonModalTrigger>

			<p className='mb-2'>
				Hay {tutors.items.length} tutor(es) asignado(s) a este estudiante.
			</p>
			<SelectTutorsDialog tutors={tutors}/>

			<div className='flex justify-between'>
				<Link href='/students'>
					<Button
						color='secondary'
						variant='outlined'
					>Cancelar</Button>
				</Link>
				<SubmitButton/>
			</div>
		</Form>
	);
}
