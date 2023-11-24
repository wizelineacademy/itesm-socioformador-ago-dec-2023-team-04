import {getUserFromSession} from '@/lib/user.ts';

export default async function UserId() {
	const userId = await getUserFromSession();
	return userId.id;
}
