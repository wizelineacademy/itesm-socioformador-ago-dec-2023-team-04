import React from 'react';
import {redirect} from 'next/navigation';
import prisma from '@/lib/prisma.ts';
import {getAllColors} from '@/lib/color.ts';
import GroupForm from '@/app/groups/edit/group-form.tsx';

export type EditGroupDetailPageProps = {
	readonly params: {
		readonly groupId: string;
	};
};

export default async function EditGroupDetailPage(props: EditGroupDetailPageProps) {
	const {params} = props;
	const id = Number.parseInt(params.groupId, 10);

	const group = await prisma.group.findUnique({
		where: {
			id,
		},
	});

	const colors = await getAllColors();

	if (group === null) {
		redirect('/groups/edit');
	}

	return (
		<div>
			<h1 className='text-stone-200 text-lg'>
				Editando grupo
			</h1>
			<GroupForm group={group} colors={colors}/>
		</div>
	);
}
