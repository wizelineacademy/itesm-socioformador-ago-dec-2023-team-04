import {type NextRequest, NextResponse} from 'next/server';
import {
	getDayOfWeek,
	now,
	Time,
	today, toTimeZone,

} from '@internationalized/date';
import {AttendanceType} from '@prisma/client';
import prisma from '@/lib/prisma.ts';

const daysOfTheWeek = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
] as const;

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function POST(request: NextRequest, {params: {studentId}}: {
	params: {
		studentId: string;
	};
}) {
	const id = Number.parseInt(studentId, 10);

	const groups = await prisma.group.findMany({
		where: {
			active: true,
			students: {
				some: {
					studentId: id,
				},
			},
		},
	});

	const filteredGroups = groups.filter(group => {
		const groupDayOfTheWeek = getDayOfWeek(today(group.tz), 'en-US');
		return group[`enabled${daysOfTheWeek[groupDayOfTheWeek]}`];
	});

	console.log(filteredGroups);

	if (groups.length === 0) {
		return NextResponse.json('No tienes clases hoy.', {
			status: 404,
		});
	}

	await prisma.$transaction(async tx => {
		await Promise.all(filteredGroups.map(async group => {
			const entryTime = new Time(group.entryHour.getUTCHours(), group.entryHour.getUTCMinutes());
			const entryDateTime = toTimeZone(now('Etc/UTC').set(entryTime), group.tz);

			const currentHour = now(group.tz);

			const existingAttendance = await tx.attendance.findUnique({
				where: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					groupId_studentId_attendanceDate: {
						attendanceDate: new Date(),
						groupId: group.id,
						studentId: id,
					},
				},
			});

			if (existingAttendance !== null) {
				return;
			}

			if (currentHour < entryDateTime.add({
				minutes: group.duration,
			}) && currentHour > entryDateTime.subtract({
				minutes: 30,
			})) {
				return tx.attendance.create({
					data: {
						attendanceDate: currentHour.toDate(),
						groupId: group.id,
						studentId: id,
						attendanceEntryHour: currentHour.toDate(),
						type: currentHour < entryDateTime ? AttendanceType.ON_TIME : AttendanceType.LATE,
					},
				});
			}
		}));
	});

	return new NextResponse();
}
