import {type NextRequest, NextResponse} from 'next/server';
import {AttendanceType} from '@prisma/client';
import {attendanceAbsence, attendanceJustificatedAbsence, attendanceLate, attendanceOnTime} from '@/lib/attendance.ts';
import {CalendarDate, parseDate} from "@internationalized/date";
import {type DateValue} from 'react-aria';

export const GET = async (request: NextRequest, params: {
	groupId: string;
}) => {
	const groupId = Number.parseInt(params.groupId, 10);
	const searchMinDate = request.nextUrl.searchParams.get('minDate');
	const searchMaxDate = request.nextUrl.searchParams.get('maxDate');
	if (groupId === null) {
		return new NextResponse('Missing query search param', {
			status: 400,
		});
	}

	const minDate: DateValue;
	const maxDate: DateValue;
	if (searchMinDate !== null && searchMaxDate !== null) {
		minDate = parseDate(searchMinDate);
		maxDate = parseDate(searchMaxDate);
	}

	const foundData = await attendanceOnTime(groupId, minDate, maxDate);

	return NextResponse.json(foundData);
}
