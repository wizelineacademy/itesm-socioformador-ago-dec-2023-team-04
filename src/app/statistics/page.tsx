import React from 'react';
import StatisticsClient from '@/app/statistics/statistics-client.tsx';
import {getUserFromSession, getGroupsWithUserId} from '@/lib/user.ts';

export default async function Page() {
	const userId = await getUserFromSession();

	if (userId === null) {
		throw new Error('User not found');
	}

	const groupList = await getGroupsWithUserId(userId.id);

	if (groupList === null) {
		throw new Error('Groups not found');
	}

	return (
		<main className='flex flex-col h-full text-stone-400'>
			<div className='flex items-top mb-4 gap-4'>
				<h1 className='text-4xl text-stone-50'>
					Estadísticas
				</h1>
			</div>
			<div>
				<div>
					<StatisticsClient groups={groupList.groups}/>
				</div>
			</div>
		</main>
	);
}
