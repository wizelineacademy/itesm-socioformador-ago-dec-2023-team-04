'use server';
import {getLocalTimeZone, parseDate} from '@internationalized/date';
import {revalidatePath} from 'next/cache';
import {type Attendance} from '@prisma/client';
import prisma from '@/lib/prisma.ts';

export type StudentWithCurrentAttendance = {
	id: number;
	givenName: string;
	familyName: string;
	attendance: Attendance | null;
};

export default async function submitAttendancesAction(students: StudentWithCurrentAttendance[], date: string, groupId: number) {
	const calDate = parseDate(date);

	await prisma.$transaction(async tx => {
		const deletePromises: Array<Promise<unknown>> = [];

		for (const student of students) {
			deletePromises.push(
				tx.attendance.deleteMany({
					where: {
						studentId: student.id,
						attendanceDate: calDate.toDate(getLocalTimeZone()),
					},
				}),
			);
		}

		await Promise.all(deletePromises);

		await tx.attendance.createMany({
			data: students.filter(student => student.attendance !== null).map(student => ({
				...student.attendance!,
				attendanceDate: calDate.toDate(getLocalTimeZone()),
			})),
		});
	});

	revalidatePath(`/groups/${groupId}/${date}`);
}
