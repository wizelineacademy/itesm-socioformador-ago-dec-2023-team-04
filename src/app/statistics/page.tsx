import React from 'react';
import {List} from 'immutable';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import {getAllGroupsWithColors} from '@/lib/groups.ts';
import StatisticsGroupCard from '@/components/statistics-group-card.tsx';

export default async function Home() {
	const groups = await getAllGroupsWithColors();

	const groupsList = List(groups);

	return (
		<TopBarPageTemplate
			title='Estadísticas'
		>
			{
				groupsList.size > 0 && (
					<div className='flex gap-4 flex-wrap'>
						{
							groupsList.map(group => (
								<StatisticsGroupCard
									key={group.id} name={group.name} id={group.id}
									color={group.color.code}
									studentCount={group._count.students}/>
							)).toArray()
						}
					</div>
				)
			}
		</TopBarPageTemplate>
	);
}
