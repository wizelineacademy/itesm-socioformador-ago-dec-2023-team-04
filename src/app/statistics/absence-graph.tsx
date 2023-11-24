import {attendanceAbsence} from '@/lib/attendance.ts';

export default async function AbsenceGraph(groupId: number, dateArray: Date[]) {
	return attendanceAbsence(groupId, dateArray);
}
