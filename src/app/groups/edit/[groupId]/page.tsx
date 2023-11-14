import React from 'react';
import {redirect} from 'next/navigation';
import prisma from '@/lib/prisma.ts';
import UpdateGroupForm from '@/app/groups/edit/[groupId]/update-group-form.tsx';
import {getAllColors} from '@/lib/color.ts';

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
			<UpdateGroupForm group={group} colors={colors}/>
		</div>
	);
}
