'use server';
import {AttendanceType} from '@prisma/client';
import {attendanceAbsence, attendanceJustificatedAbsence, attendanceLate, attendanceOnTime} from '@/lib/attendance.ts';

function formatDataForChart(data: Array<{attendanceDate: Date; _count: {type: number}}>) {
	return data.map(entry => ({
		date: entry.attendanceDate,
		count: entry._count.type,
	}));
}

export default async function getData(infoType: string, groupId: number, dateRange: Date[]) {
	switch (infoType) {
		case AttendanceType.ON_TIME: {
			return formatDataForChart(await attendanceOnTime(groupId, dateRange));
		}

		case AttendanceType.LATE: {
			return formatDataForChart(await attendanceLate(groupId, dateRange));
		}

		case 'absence': {
			return formatDataForChart(await attendanceAbsence(groupId, dateRange));
		}

		case AttendanceType.JUSTIFICATED_ABSENCE: {
			return formatDataForChart(await attendanceJustificatedAbsence(groupId, dateRange));
		}

		default: {
			break;
		}
	}
}
