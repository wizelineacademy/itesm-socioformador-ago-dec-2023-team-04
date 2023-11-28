'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {type Student, type Tutor} from '@prisma/client';
import {Item} from 'react-stately';
import {Button} from '@/components/button.tsx';
import {type NotificationInit, notificationInit} from '@/lib/schemas/notification.ts';
import Select from '@/components/select.tsx';
import TextArea from '@/components/text-area.tsx';
import {formValidators} from '@/lib/schemas/utils.ts';
import Form, {type FormState} from '@/components/form.tsx';

export type NotificationFormProps = {
	readonly tutor: Tutor[];
	readonly student: Student;
	readonly action: (state: FormState<NotificationInit>, data: FormData) => Promise<FormState<NotificationInit>>;
};

export default function NotificationForm(props: NotificationFormProps) {
	const {
		tutor,
		student,
		action,
	} = props;

	const [selectedTutor, setSelectedTutor] = useState<number | undefined>(undefined);
	const validate = formValidators(notificationInit);

	const router = useRouter();

	return (
		<Form
			action={action}
			staticValues={{
				studentId: student.id,
			}}
		>
			<Select
				name='tutorId'
				label='Tutor'
				items={tutor} selectedKey={selectedTutor}
				onSelectionChange={key => {
					setSelectedTutor(key as number);
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
				isRequired
				name='message'
				label='Mensaje'
				className='mb-4'
				validate={validate.message}
			/>
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
		</Form>
	);
}
