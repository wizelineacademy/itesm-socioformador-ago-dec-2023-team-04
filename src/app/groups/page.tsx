import React from 'react';
import Link from 'next/link';
import {getDayOfWeek, getLocalTimeZone, isSameDay, Time, toCalendarDateTime, today} from '@internationalized/date';
import {List} from 'immutable';
import {getAllGroupsWithColors, type GroupWithColor} from '@/lib/group.ts';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import TopbarPageLayout from '@/components/topbar-page-layout.tsx';
import Spacer from '@/components/spacer.tsx';
import Separator from '@/components/separator.tsx';
import {GroupCard} from '@/components/groupCard.tsx';

const dayAccesor = ['enabledSunday', 'enabledMonday', 'enabledTuesday', 'enabledWednesday', 'enabledThursday', 'enabledFriday', 'enabledSaturday'] as const;

export default async function GroupsPage() {
	const groups = await getAllGroupsWithColors();

	const currentDate = today(getLocalTimeZone());
	const dayOfTheWeek = getDayOfWeek(currentDate, 'en-US');

	const groupHasClassToday = (group: GroupWithColor) => {
		let daysUntilClass: number | undefined;

		for (let day = 0; day < 7; day++) {
			let relativeDay = dayOfTheWeek + day;
			relativeDay = relativeDay > 6 ? relativeDay - 7 : relativeDay;
			const dayIsEnabled = group[dayAccesor[relativeDay]];
			if (dayIsEnabled) {
				daysUntilClass = day;
				break;
			}
		}

		const entryTime = new Time(group.entryHour.getHours(), group.entryHour.getMinutes());

		const entryDateTime = daysUntilClass === undefined ? undefined : toCalendarDateTime(currentDate, entryTime).add({
			days: daysUntilClass,
		});

		return entryDateTime !== undefined && isSameDay(entryDateTime, currentDate);
	};

	const [groupsWithClassToday, groupsWithoutClassToday] = List(groups).partition(element => groupHasClassToday(element));

	return (
		<TopbarPageLayout
			title='Grupos' topbarItems={
				<>
					<Spacer/>
					<Link href='/groups/edit'>
						<Button color='secondary'>
							<Icon name='edit'/>
						</Button>
					</Link>
				</>

			}
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
									<GroupCard key={group.id} group={group}/>
								))
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
						<GroupCard key={group.id} group={group}/>
					))
				}
			</div>
		</TopbarPageLayout>

	);
}
