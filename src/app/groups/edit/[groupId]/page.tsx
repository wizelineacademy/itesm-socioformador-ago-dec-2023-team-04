import React from 'react';
import {redirect} from 'next/navigation';
import prisma from '@/lib/prisma.ts';

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

	if (group === null) {
		redirect('/groups/edit');
	}

	return (
		<div>
			{group.name}
		</div>
	);
}
