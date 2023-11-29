import React from 'react';
import {List} from 'immutable';
import GroupStatisticsCard from '@/app/statistics/group-statistics-card.tsx';
import {getAllGroupsWithColors} from '@/lib/groups.ts';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import {getUserFromSession} from '@/lib/users.ts';

export default async function Page() {
	const groups = await getAllGroupsWithColors();

	const user = await getUserFromSession();
	if (user === null) {
		throw new Error('User not found');
	}

	const groupsList = List(groups);
	return (
		<TopBarPageTemplate title='Estadísticas'>
			<div className='flex flex-col h-full text-stone-400'>
				<div>
					{
						groupsList.size > 0 && (
							<div className='flex gap-4 flex-wrap'>
								{
									groupsList.map(group => (
										<GroupStatisticsCard
											key={group.id} id={group.id} name={group.name}
											color={group.color.code} studentCount={group._count.students}/>
									)).toArray()
								}
							</div>
						)
					}
				</div>
			</div>
		</TopBarPageTemplate>
	);
}
