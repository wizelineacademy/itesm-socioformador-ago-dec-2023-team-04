import {type NextRequest, NextResponse} from 'next/server';
import {fromDate, getDayOfWeek, getLocalTimeZone, now, today} from '@internationalized/date';
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
];

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function POST(request: NextRequest, {params: {studentId}}: {
	params: {
		studentId: string;
	};
}) {
	const id = Number.parseInt(studentId, 10);

	const dayOfTheWeek = getDayOfWeek(today(getLocalTimeZone()), 'en-US');

	const groups = await prisma.group.findMany({
		where: {
			active: true,
			students: {
				some: {
					studentId: id,
				},
			},
			[`enabled${daysOfTheWeek[dayOfTheWeek]}`]: true,
		},
	});

	const addedAttendances = 0;

	if (groups.length === 0) {
		return NextResponse.json('No tienes clases hoy.', {
			status: 404,
		});
	}

	console.log(groups);

	await prisma.$transaction(async tx => {
		await Promise.all(groups.map(async group => {
			const entryHour = fromDate(group.entryHour, group.tz).set(today(group.tz));

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

			console.log(existingAttendance);

			if (existingAttendance !== null) {
				return;
			}

			console.log(currentHour);
			console.log(entryHour);

			if (currentHour < entryHour.add({
				minutes: group.duration,
			}) && currentHour > entryHour.subtract({
				minutes: 30,
			})) {
				return tx.attendance.create({
					data: {
						attendanceDate: new Date(),
						groupId: group.id,
						studentId: id,
						attendanceEntryHour: new Date(),
						attendanceExitHour: new Date(),
						type: currentHour < entryHour ? AttendanceType.ON_TIME : AttendanceType.LATE,
					},
				});
			}
		}));
	});

	return new NextResponse();
}
