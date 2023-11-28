import {type NextRequest, NextResponse} from 'next/server';
import {AttendanceType} from '@prisma/client';
import {type CalendarDate, parseDate} from '@internationalized/date';
import {attendanceAbsence, attendanceJustificatedAbsence, attendanceLate, attendanceOnTime} from '@/lib/attendance.ts';

function formatDataForChart(data: Array<{attendanceDate: Date; _count: {type: number}}>) {
	return data.map(entry => ({
		date: entry.attendanceDate,
		count: entry._count.type,
	}));
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GET = async (request: NextRequest, parameters: {
	groupId: string;
}) => {
	const groupId = Number.parseInt(parameters.groupId, 10);
	const graphInfoType = request.nextUrl.searchParams.get('graphInfoType');
	const searchMinDate = request.nextUrl.searchParams.get('minDate');
	const searchMaxDate = request.nextUrl.searchParams.get('maxDate');
	if (groupId === null) {
		return new NextResponse('Missing query search param', {
			status: 400,
		});
	}

	let minDate: CalendarDate;
	let maxDate: CalendarDate;
	if (searchMinDate !== null && searchMaxDate !== null) {
		minDate = parseDate(searchMinDate);
		maxDate = parseDate(searchMaxDate);
	}

	let foundData;
	switch (graphInfoType) {
		case AttendanceType.ON_TIME: {
			foundData = formatDataForChart(await attendanceOnTime(groupId, minDate, maxDate));
			break;
		}

		case AttendanceType.LATE: {
			foundData = formatDataForChart(await attendanceLate(groupId, minDate, maxDate));
			break;
		}

		case 'absence': {
			foundData = formatDataForChart(await attendanceAbsence(groupId, minDate, maxDate));
			break;
		}

		case AttendanceType.JUSTIFICATED_ABSENCE: {
			foundData = formatDataForChart(await attendanceJustificatedAbsence(groupId, minDate, maxDate));
			break;
		}

		default: {
			break;
		}
	}

	return NextResponse.json(foundData);
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const POST = async (request: NextRequest, parameters: {
	groupId: string;
}) => {
	return NextResponse;
};