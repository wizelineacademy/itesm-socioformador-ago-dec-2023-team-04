import {attendanceJustificatedAbsence} from '@/lib/attendance.ts';

export default async function JustificatedAbsenceGraph(groupId: number, dateArray: Date[]) {
	return attendanceJustificatedAbsence(groupId, dateArray);
}
