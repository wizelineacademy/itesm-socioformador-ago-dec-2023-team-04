import React from 'react';
import {notFound} from 'next/navigation';
import {CalendarDate, endOfMonth, getLocalTimeZone, startOfMonth, today} from '@internationalized/date';
import {getStudentWithGroupAttendances} from '@/lib/students.ts';
import GroupStudentClientPage
	from '@/app/groups/[groupId]/student/[studentId]/[yearMonth]/group-student-client-page.tsx';

export type GroupStudentAttendancePageProps = {
	readonly params: {
		readonly groupId: string;
		readonly studentId: string;
		readonly yearMonth: string;
	};
};

export default async function GroupStudentAttendancePage(props: GroupStudentAttendancePageProps) {
	const {params} = props;

	const groupId = Number.parseInt(params.groupId, 10);
	const studentId = Number.parseInt(params.studentId, 10);

	if (Number.isNaN(groupId) || Number.isNaN(studentId)) {
		notFound();
	}

	const parsedYearMonth = params.yearMonth.split('-');
	if (parsedYearMonth.length !== 2) {
		notFound();
	}

	const year = Number.parseInt(parsedYearMonth[0], 10);
	const month = Number.parseInt(parsedYearMonth[1], 10);

	if (Number.isNaN(year) || Number.isNaN(month)) {
		notFound();
	}

	const student = await getStudentWithGroupAttendances(studentId, groupId);

	if (!student) {
		notFound();
	}

	if (startOfMonth(new CalendarDate(year, month, 1)).compare(today(getLocalTimeZone())) >= 0) {
		notFound();
	}

	return (
		<GroupStudentClientPage student={student} year={year} month={month} serverTz={getLocalTimeZone()}/>
	);
}
