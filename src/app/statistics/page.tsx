import React, {Suspense, useMemo} from 'react';
import {List} from 'immutable';
import dynamic from 'next/dynamic';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import {getAllGroupsWithColors} from '@/lib/groups.ts';

const StatisticsGroupCard = dynamic(async () => import('@/components/statistics-group-card.tsx')
	, {
		ssr: false,
		loading: () => <div className='bg-stone-800 animate-pulse w-64 h-96'/>,
	});

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
