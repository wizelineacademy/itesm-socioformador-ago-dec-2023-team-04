'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useFormik} from 'formik';
import {toFormikValidate} from 'zod-formik-adapter';
import {useQueryClient} from 'react-query';
import BiometricDataDialog from './biometric-data-dialog.tsx';
import {Button} from '@/components/button.tsx';
import {type StudentRegistration, studentRegistrationSchema} from '@/lib/schemas/student.ts';
import createStudent from '@/app/students/create/create-student-action.ts';
import ButtonModalTrigger from '@/components/button-modal-trigger.tsx';
import TextField from '@/components/text-field.tsx';
import Icon from '@/components/icon.tsx';

export default function StudentCreationForm({className}: {readonly className?: string}) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const formik = useFormik<StudentRegistration>({
		initialValues: {
			registration: '',
			givenName: '',
			familyName: '',
			biometricData: [],
		},
		validate: toFormikValidate(studentRegistrationSchema),
		async onSubmit(values, formikBag) {
			const result = await createStudent(values);
			if (result.success) {
				formikBag.setStatus(undefined);
				await queryClient.invalidateQueries('students');
				console.log(result.data);
				router.push(`/students/${result.data}`);
			} else {
				formikBag.setStatus(result.message);
			}
		},
	});

	return (
		<form className={className} onSubmit={formik.handleSubmit}>

			{formik.status && <div className='bg-wRed-200 text-wRed-600 rounded p-2 mb-4'>{formik.status}</div>}

			<TextField
				isRequired id='registration'
				label='Matrícula'
				className='mb-4 w-full'
				value={formik.values.registration}
				errorMessage={formik.errors.registration}
				onChange={async value => formik.setFieldValue('registration', value, false)}/>
			<TextField
				isRequired label='Nombre(s)'
				className='mb-4'
				value={formik.values.givenName}
				errorMessage={formik.errors.givenName}
				onChange={async value => formik.setFieldValue('givenName', value, false)}
			/>
			<TextField
				isRequired label='Apellido(s)'
				className='mb-4'
				value={formik.values.familyName}
				errorMessage={formik.errors.givenName}
				onChange={async value => formik.setFieldValue('familyName', value, false)}
			/>
			<p className='text-sm mb-2'>
				{
					formik.values.biometricData === undefined
						? 'No se ha agregado información biometrica.'
						: 'Información biometrica agregada correctamente.'
				}
			</p>

			{formik.errors.biometricData && (
				<div className='text-red-400 text-xs mb-2'>
					{formik.errors.biometricData}
				</div>
			)}

			<ButtonModalTrigger
				label={
					<>
						<Icon name='add' className='me-1' size='sm'/>
						{
							formik.values.biometricData === undefined
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
							onBiometricDataSubmission={biometricData => {
								void formik.setFieldValue('biometricData', biometricData);
							}}/>
					)
				}
			</ButtonModalTrigger>

			<div className='flex justify-between'>
				<Button
					color='secondary' size='sm'
					variant='outlined'
					onPress={() => {
						router.push('/students');
					}}
				>Cancelar</Button>
				<Button color='secondary' type='submit' size='sm'>Confirmar</Button>
			</div>
		</form>
	);
}
