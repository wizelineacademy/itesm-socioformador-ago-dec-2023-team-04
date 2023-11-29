import React from 'react';
import {type Metadata} from 'next';
import {revalidatePath} from 'next/cache';
import {getAllNotifications} from '@/lib/notification.ts';
import NotificationClientLayout from '@/app/notifications/notification-client-layout.tsx';
import {deleteNotifications} from '@/lib/notifications.ts';

export const metadata: Metadata = {
	title: 'Notificaciones | SATS',
	description: 'metaphora. Student Attendance Tracking System',
};

export default async function NotificationsLayout({children}: {children: React.ReactNode}) {
	const notifications = await getAllNotifications();

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
