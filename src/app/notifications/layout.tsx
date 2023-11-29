import React, {type ReactNode} from 'react';
import {type Metadata} from 'next';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {getAllNotificationsWithStudentsAndTutors, deleteNotifications} from '@/lib/notifications.ts';
import NotificationClientLayout from '@/app/notifications/notification-client-layout.tsx';
import Modal from '@/components/modal.tsx';

export const metadata: Metadata = {
	title: 'Notificaciones | SATS',
	description: 'metaphora. Student Attendance Tracking System',
};

export type NotificationsLayoutProps = {
	readonly children: ReactNode;
};

export default async function NotificationsLayout(props: NotificationsLayoutProps) {
	const {children} = props;
	const notifications = await getAllNotificationsWithStudentsAndTutors();

	const deleteNotificationsAction = async (notifications: number[]) => {
		'use server';
		const count = await deleteNotifications(notifications);
		revalidatePath('/notifications');
		return count;
	};

	return (
		<NotificationClientLayout notifications={notifications} action={deleteNotificationsAction}>
			{children}
		</NotificationClientLayout>
	);
}
