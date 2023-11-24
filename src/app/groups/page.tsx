import React from 'react';
import {List} from 'immutable';
import {getAllGroupsWithColors} from '@/lib/group.ts';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import {GroupCard} from '@/components/group-card.tsx';
import {groupHasClass} from '@/app/groups/class-dates.ts';
import GroupsTopbarItems from '@/app/groups/groups-topbar-items.tsx';
import Separator from '@/components/separator.tsx';
import {getUserFromSession} from '@/lib/user.ts';

export default async function GroupsPage() {
	const groups = await getAllGroupsWithColors();

	const [
		groupsWithoutClassToday,
		groupsWithClassToday,
	] = List(groups)
		.partition(element => groupHasClass(element));

	const user = await getUserFromSession();
	if (user === null) {
		throw new Error('User not found');
	}

	return (
		<TopBarPageTemplate
			title='Grupos' topBarItems={<GroupsTopbarItems user={user}/>}
		>
			{
				groupsWithClassToday.size > 0 && (
					<>
						<h2 className='text-2xl text-stone-300 mb-2'>
							Tus clases de hoy
						</h2>
						<div className='flex gap-4 flex-wrap'>
							{
								groupsWithClassToday.map(group => (
									<GroupCard key={group.id} name={group.name} id={group.id} color={group.color.code} studentCount={group._count.students}/>
								)).toArray()
							}
						</div>
						<Separator/>
						<h2 className='text-2xl text-stone-300 mb-2'>
							Otros grupos
						</h2>

					</>
				)
			}
			<div className='flex gap-4 flex-wrap'>
				{
					groupsWithoutClassToday.map(group => (
						<GroupCard key={group.id} name={group.name} id={group.id} color={group.color.code} studentCount={group._count.students}/>
					)).toArray()
				}
			</div>
		</TopBarPageTemplate>

	);
}
