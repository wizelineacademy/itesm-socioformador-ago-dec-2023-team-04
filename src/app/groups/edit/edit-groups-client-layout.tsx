'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {type Group, type TutorNotification} from '@prisma/client';
import * as Popover from '@radix-ui/react-popover';
import {useQuery, useQueryClient} from 'react-query';
import axios from 'axios';
import Spacer from '@/components/spacer.tsx';
import {type Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import NotificationsTable from '@/app/notifications/notifications-table.tsx';
import SearchBar from '@/components/search-bar.tsx';

function DeleteButton({confirmationMessage, onClick, ...props}: {readonly onClick: () => void; readonly confirmationMessage: string} & Omit<React.ComponentProps<typeof Button>, 'variant'>) {
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

	const {data} = useQuery('groups', async () => {
		const result = await axios.get<Group[]>('/api/groups');
		console.log(result);
		return result.data;
	}, {
		initialData: initialGroups,
		staleTime: 5000,
	});

	return (
		<div className='flex flex-col h-full text-stone-400'>
			<div className='flex items-top mb-4 gap-4'>
				<h1 className='text-4xl text-stone-50'>
					Notificaciones
				</h1>
				<Spacer/>
				<SearchBar value={globalFilter} onChange={setGlobalFilter}/>
				<div className='w-72'/>
			</div>

			<div className='flex gap-4 h-full'>
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
		</div>
	);
}
