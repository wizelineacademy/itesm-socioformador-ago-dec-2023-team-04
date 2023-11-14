import React from 'react';
import Link from 'next/link';
import {getLocalTimeZone, now, Time, toCalendarDateTime, today, toZoned} from '@internationalized/date';
import {getAllGroupsWithColors, type GroupWithColor} from '@/lib/group.ts';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import TopbarPageLayout from '@/components/topbar-page-layout.tsx';
import Spacer from '@/components/spacer.tsx';

type GroupCardProps = {
	readonly group: GroupWithColor;
};

function GroupCard(props: GroupCardProps) {
	const {group} = props;

	const tz = getLocalTimeZone();

	const date = today(tz);
	const currentDateTime = now(tz);

	const entryTime = new Time(group.entryHour.getHours(), group.entryHour.getMinutes());
	const exitTime = new Time(group.exitHour.getHours(), group.exitHour.getMinutes());

	if (date) {
		const entryDateTime = toZoned(toCalendarDateTime(date, entryTime), group.tz);
	}

	const exitDateTime = toZoned(toCalendarDateTime(date, exitTime), group.tz);

	return (
		<div className='border border-stone-700 rounded bg-stone-800'>
			<div
				className='rounded-t pt-16 p-2' style={{
					backgroundColor: `#${group.color.code}`,
				}}
			>
				<h2 className='flex items-baseline text-stone-800 text-2xl font-bold'>
					{group.name}
				</h2>
			</div>
			<div className='p-2 flex'>
				<Icon name='arrow_forward'/>
			</div>
		</div>
	);
}

export default async function GroupsPage() {
	const groups = await getAllGroupsWithColors();
	// Const client = useClient();

	// const [groupName, setGroupName] = useState('');
	// const [groupColor, setGroupColor] = useState('');
	// const [isAddingGroup, setIsAddingGroup] = useState(false);
	//
	// const handleAddGroup = () => {
	// 	setIsAddingGroup(true);
	// };
	//
	// const handleSubmit = (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	// Create a new group object with name and color
	// 	const newGroup = {
	// 		groupName,
	// 		numStudents: 0, // Student Values
	// 		numProfessors: 0, // Professor Values
	// 		groupColor,
	// 	};
	// 	// Update the groups state with the new group
	// 	// Reset the form fields and close the form
	// 	setGroupName('');
	// 	setGroupColor('');
	// 	setIsAddingGroup(false);
	// };

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
			<div className='flex gap-4 flex-wrap'>
				{
					groups.map(group => (
						<GroupCard key={group.id} group={group}/>
					))
				}
			</div>
		</TopbarPageLayout>

	);
}
