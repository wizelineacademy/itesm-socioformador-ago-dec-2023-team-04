import {type NextRequest} from 'next/server';
import {notFound, redirect} from 'next/navigation';
import {getGroupClassDate} from '@/app/groups/class-dates.ts';
import prisma from '@/lib/prisma.ts';

type GetGroupParameters = {
	readonly groupId: string;
	readonly studentId: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GET = async (request: NextRequest, {params}: {params: GetGroupParameters}) => {
	const groupId = Number.parseInt(params.groupId, 10);
	const studentId = Number.parseInt(params.studentId, 10);

	const group = await prisma.group.findUnique({
		where: {
			id: groupId,
			students: {
				some: {
					studentId,
				},
			},
		},
	});

	if (group === null) {
		notFound();
	}

	const groupClassDate = getGroupClassDate(group);

	if (groupClassDate === undefined) {
		notFound();
	}

	redirect(`/groups/${groupId}/student/${studentId}/${groupClassDate.year}-${groupClassDate.month}`);
};
