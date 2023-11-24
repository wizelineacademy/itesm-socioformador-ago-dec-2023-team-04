import {attendanceOnTime} from '@/lib/attendance.ts';

export default async function OntimeGraph(groupId: number, dateArray: Date[]) {
	return attendanceOnTime(groupId, dateArray);
}
