import React, {type ReactNode} from 'react';
import {type Tutor} from '@prisma/client';
import Icon from '@/components/icon.tsx';
import Dialog from '@/components/dialog.tsx';
import {Button} from '@/components/button.tsx';
import ButtonModalTrigger from '@/components/button-modal-trigger.tsx';
import NotificationCreationPage from '@/app/notifications/create/page.tsx';

export type SendNotificationsDialogProps = {
	readonly studentId: number;
	readonly givenName: string;
	readonly familyName: string;
	readonly tutors: Tutor[];
};

export default function SendNotificationsDialog(props: SendNotificationsDialogProps) {
	const {
		studentId,
		givenName,
		familyName,
		tutors,
	} = props;

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
						<NotificationCreationPage studentId={studentId} givenName={givenName} familyName={familyName} tutors={tutors}/>
						<Button className='mt-2' variant='outlined' color='secondary' onPress={close}>
							Cerrar
						</Button>
					</Dialog>
				)
			}
		</ButtonModalTrigger>
	);
}
