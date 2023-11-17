import React from 'react';
import Link from 'next/link';
import {type CalendarDate, getLocalTimeZone, today} from '@internationalized/date';
import {type Group} from '@prisma/client';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import {getGroupClassDate} from '@/app/groups/class-dates.ts';
import LinkButton from '@/components/link-button.tsx';

export type GroupTopBarItemsProps = {
	readonly date: CalendarDate;
	readonly group: Group;
};

export default function GroupTopBarItems(props: GroupTopBarItemsProps) {
	const {date, group} = props;

	const previousDate = getGroupClassDate(group, -1, date);
	const nextDate = getGroupClassDate(group, 1, date);
	return (
		<>
			<LinkButton href={`/groups/${group.id}/${previousDate?.toString()}`} color='secondary'>
				<Icon name='arrow_left'/>
			</LinkButton>
			<LinkButton href={`/groups/${group.id}/${nextDate?.toString()}`} color='secondary' isDisabled={nextDate && today(getLocalTimeZone()) < nextDate}>
				<Icon name='arrow_right'/>
			</LinkButton>
			<LinkButton href={`/groups/edit/${group.id}`} color='secondary'>
				<Icon name='edit'/>
			</LinkButton>
		</>
	);
}
