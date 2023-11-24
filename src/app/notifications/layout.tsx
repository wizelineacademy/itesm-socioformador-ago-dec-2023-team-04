import React from 'react';
import {getAllNotifications} from '@/lib/notification.ts';
import NotificationClientLayout from '@/app/notifications/notification-client-layout.tsx';

export default async function NotificationsLayout({children}: {children: React.ReactNode}) {
	const notifications = await getAllNotifications();
	return (
		<NotificationClientLayout notifications={notifications}>
			{children}
		</NotificationClientLayout>
	);
}
