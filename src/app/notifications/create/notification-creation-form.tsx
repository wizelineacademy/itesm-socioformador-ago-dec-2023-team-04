'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useFormik} from 'formik';
import {toFormikValidate} from 'zod-formik-adapter';
import {useQueryClient} from 'react-query';
import {type Student, type Tutor} from '@prisma/client';
import {Item} from 'react-stately';
import {Button} from '@/components/button.tsx';
import {type NotificationCreation, notificationCreationSchema} from '@/lib/schemas/notification.ts';
import createNotification from '@/app/notifications/create/create-notification-action.ts';
import sendMessage from '@/app/notifications/create/send-message-action.ts';
import TextField from '@/components/text-field.tsx';
import Icon from '@/components/icon.tsx';
import Select from '@/components/select.tsx';
import TextArea from '@/components/text-area.tsx';

export default function NotificationCreationForm({student, tutor, className}: {readonly student: Student; readonly tutor: Tutor[]; readonly className?: string}) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [selectedTutor, setSelectedTutor] = useState(-1);

	const formik = useFormik<NotificationCreation>({
		initialValues: {
			message: '',
			id: -1,
		},
		validate: toFormikValidate(notificationCreationSchema),
		async onSubmit(values, formikBag) {
			const tutorSeleccionado = tutor.find(tutores => tutores.id === selectedTutor);
			const result = await sendMessage(values, student, tutor);

			if (result.success) {
				formikBag.setStatus(undefined);
				await queryClient.invalidateQueries('notification');
				console.log(result.data);
				router.push('/notifications');
			} else {
				formikBag.setStatus(result.message);
			}
		},
	});

	return (
		<form className={className} onSubmit={formik.handleSubmit}>

			{formik.status && <div className='bg-wRed-200 text-wRed-600 rounded p-2 mb-4'>{formik.status}</div>}

			<Select
				label='Tutor'
				items={tutor} selectedKey={selectedTutor} onSelectionChange={key => {
					setSelectedTutor(key as number);
					formik.setFieldValue('id', selectedTutor, false);
				}}
			>
				{
					item => (
						<Item key={item.id}>
							{item.givenName} {item.familyName}
						</Item>
					)
				}
			</Select>
			<TextArea
				label='Mensaje'
				className='mb-4'
				value={formik.values.message}
				errorMessage={formik.errors.message}
				//	OnBlur={formik.blurHandler.message}
				onChange={async value => formik.setFieldValue('message', value, false)}/>
			<div className='flex justify-between'>
				<Button
					color='secondary' size='sm'
					variant='outlined'
					onPress={() => {
						router.push('/students');
					}}
				>Cancelar</Button>
				<Button color='secondary' type='submit' size='sm'>Enviar</Button>
			</div>
		</form>
	);
}
