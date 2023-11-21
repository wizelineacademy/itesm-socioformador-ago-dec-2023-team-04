import React from 'react';
import Link from 'next/link';
import Icon from '@/components/icon.tsx';

type GroupCardProps = {
	readonly id: number;
	readonly studentCount: number;
	readonly name: string;
	readonly color: string;
};

export function GroupCard(props: GroupCardProps) {
	const {studentCount, name, color, id} = props;

	return (
		<Link href={`/groups/${id}`} className='border border-stone-700 rounded bg-stone-800 w-64 flex flex-col hover:brightness-110 cursor-pointer'>
			<div
				className='rounded-t pt-24 px-2 grow flex flex-col justify-end' style={{
					backgroundColor: `#${color}`,
				}}
			>
				<h2 className='flex items-end text-stone-800 text-4xl font-bold'>
					{name}
				</h2>
			</div>
			<div className='flex p-2'>
				<Icon name='person' className='me-1'/>
				{studentCount} estudiante{studentCount === 1 ? '' : 's'}
				<span className='grow'/>
				<Icon name='arrow_forward'/>
			</div>
		</Link>
	);
}
