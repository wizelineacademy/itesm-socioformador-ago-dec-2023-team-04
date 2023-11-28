import React from 'react';
import {getAllNotifications} from '@/lib/notification.ts';
import NotificationClientLayout from '@/app/notifications/notification-client-layout.tsx';
import {deleteNotifications} from '@/lib/notifications.ts';

export default async function NotificationsLayout({children}: {children: React.ReactNode}) {
	const notifications = await getAllNotifications();

	const deleteNotificationsAction = async (notifications: number[]) => {
		'use server';
		await deleteNotifications(notifications);
	};

	return (
		<NotificationClientLayout notifications={notifications} action={deleteNotificationsAction}>
			{children}
		</NotificationClientLayout>
	);
}
