import {getGroupById} from '@/lib/group.ts';

export default async function GroupsList(id: number) {
	return getGroupById(id);
}
