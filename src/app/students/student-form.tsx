'use client';
import React, {useState} from 'react';
import {type Student} from '@prisma/client';
import Link from 'next/link';
import BiometricDataDialog from './biometric-data-dialog.tsx';
import {Button} from '@/components/button.tsx';
import ButtonModalTrigger from '@/components/button-modal-trigger.tsx';
import TextField from '@/components/text-field.tsx';
import Icon from '@/components/icon.tsx';
import Form from '@/components/form.tsx';
import {upsertStudentAction} from '@/lib/actions/student.ts';
import {formValidators} from '@/lib/schemas/utils.ts';
import {studentSchema} from '@/lib/schemas/student.ts';

export type StudentCreationFormProps = {
	readonly student?: Student;
};

export default function StudentForm(props: StudentCreationFormProps) {
	const {student} = props;
	const [biometricData, setBiometricData] = useState<number[] | undefined>(student?.biometricData);

	const validate = formValidators(studentSchema);

	return (
		<Form
			id={student?.id}
			action={upsertStudentAction} staticValues={{
				biometricData: biometricData ? JSON.stringify(biometricData) : undefined,
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

			<div className='flex justify-between'>
				<Link href='/students'>
					<Button
						color='secondary' size='sm'
						variant='outlined'
					>Cancelar</Button>
				</Link>
				<Button color='secondary' type='submit' size='sm'>Confirmar</Button>
			</div>
		</Form>
	);
}
