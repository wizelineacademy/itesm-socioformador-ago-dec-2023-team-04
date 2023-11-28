import {type NextRequest} from 'next/server';
import {notFound, redirect} from 'next/navigation';
import {NextURL} from 'next/dist/server/web/next-url';
import {getGroupClassDate} from '@/app/groups/class-dates.ts';
import {getGroupById} from '@/lib/groups.ts';

type GetGroupParameters = {
	readonly groupId: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GET = async (request: NextRequest, {params}: {params: GetGroupParameters}) => {
	const id = Number.parseInt(params.groupId, 10);
	const group = await getGroupById(id);

	if (group === null) {
		notFound();
	}

	const groupClassDate = getGroupClassDate(group);

	if (groupClassDate === undefined) {
		notFound();
	}

	redirect(`/groups/${id}/${groupClassDate.toString()}`);
};
