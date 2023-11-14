'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {type TutorNotification} from '@prisma/client';
import * as Popover from '@radix-ui/react-popover';
import {useQueryClient} from 'react-query';
import Spacer from '@/components/spacer.tsx';
import {type Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import NotificationsTable from '@/app/notifications/notifications-table.tsx';
import SearchField from '@/components/search-field.tsx';
import TopbarPageLayout from '@/components/topbar-page-layout.tsx';

function DeleteButton({confirmationMessage, onClick, ...props}: {
	readonly onClick: () => void;
	readonly confirmationMessage: string;
} & Omit<React.ComponentProps<typeof Button>, 'variant'>) {
	return (
		<Popover.Root>
			<Popover.Trigger asChild/>
			<Popover.Portal>
				<Popover.Content align='end'>
					<Popover.Arrow className='fill-stone-700'/>
					<div className='bg-stone-700 p-4 w-48 rounded'>
						<p className='text-stone-200 mb-2 text-sm'>
							{confirmationMessage}
						</p>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}

export default function NotificationClientLayout({children, initialNotifications}: {
	readonly initialNotifications: TutorNotification[];
	readonly children: React.ReactNode;
}) {
	const [notificationSelection, setNotificationSelection] = useState<Record<string, boolean>>({});
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const queryClient = useQueryClient();

	return (
		<TopbarPageLayout
			title='Notificaciones' topbarItems={
				<>
					<Spacer/>
					<SearchField value={globalFilter} className='w-72 justify-between' onChange={setGlobalFilter}/>
				</>
			}
		>
			<div className='flex gap-4'>
				<div className='bg-stone-800 grow rounded'>
					<NotificationsTable
						globalFilter={globalFilter}
						initialNotifications={initialNotifications} className='w-full'
						notificationSelection={notificationSelection}
						onNotificationSelectionChange={setNotificationSelection}/>
				</div>
				<div className='w-72 bg-stone-800 h-full rounded p-4'>
					{children}
				</div>
			</div>
		</TopbarPageLayout>
	);
}
