import React, {useState} from 'react';
import {type Tutor} from '@prisma/client';
import {Item} from 'react-stately';
import Icon from '@/components/icon.tsx';
import Dialog from '@/components/dialog.tsx';
import {Button} from '@/components/button.tsx';
import ButtonModalTrigger from '@/components/button-modal-trigger.tsx';
import Form, {type FormState} from '@/components/form.tsx';
import {notificationInit, type NotificationInit} from '@/lib/schemas/notification.ts';
import Select from '@/components/select.tsx';
import TextArea from '@/components/text-area.tsx';
import SubmitButton from '@/components/submit-button.tsx';
import {formValidators} from '@/lib/schemas/utils.ts';

export type SendNotificationsDialogProps = {
	readonly studentId: number;
	readonly givenName: string;
	readonly familyName: string;
	readonly tutors: Tutor[];
	readonly action: (state: FormState<NotificationInit>, data: FormData) => Promise<FormState<NotificationInit>>;
};

export default function SendNotificationDialog(props: SendNotificationsDialogProps) {
	const {
		studentId,
		givenName,
		familyName,
		tutors,
		action,
	} = props;

	const [selectedTutor, setSelectedTutor] = useState<number | undefined>(undefined);
	const validate = formValidators(notificationInit);

	return (
		<ButtonModalTrigger
			label={
				<>
					<Icon className='mr-1' name='sms'/> Enviar
				</>
			} size='md'
			color='tertiary' variant='outlined' className='mb-4'
		>
			{
				close => (
					<Dialog>
						<h3 className='text-stone-200 text-2xl mb-4'> {givenName} {familyName} </h3>
						<Form
							action={action}
							successToast={{
								title: 'Notificación creada con éxito',
							}}
							staticValues={{
								studentId,
							}}
						>
							<Select
								className='mb-4'
								name='tutorId'
								label='Tutor'
								items={tutors} selectedKey={selectedTutor}
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
								name='message'
								label='Mensaje'
								className='mb-4'
								validate={validate.message}
							/>
							<SubmitButton/>
						</Form>
						<Button className='mt-2' variant='outlined' color='secondary' onPress={close}>
							Cerrar
						</Button>
					</Dialog>
				)
			}
		</ButtonModalTrigger>
	);
}
