import {attendanceLate} from '@/lib/attendance.ts';

export default async function LateGraph(groupId: number, dateArray: Date[]) {
	return attendanceLate(groupId, dateArray);
}
