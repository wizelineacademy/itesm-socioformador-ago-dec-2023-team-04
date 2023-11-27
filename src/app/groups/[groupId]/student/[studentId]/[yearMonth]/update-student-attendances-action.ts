'use server';

import {type Attendance} from '@prisma/client';
import {revalidatePath} from 'next/cache';
import prisma from '@/lib/prisma.ts';

export default async function updateStudentAttendancesAction(studentId: number, groupId: number, attendances: Array<Pick<Attendance, 'attendanceDate' | 'type'>>) {
	await prisma.$transaction(async tx => {
		await tx.attendance.deleteMany({
			where: {
				studentId,
				groupId,
			},
		});

		await tx.attendance.createMany({
			data: attendances.map(attendance => ({
				attendanceDate: attendance.attendanceDate,
				type: attendance.type,
				groupId,
				studentId,
			})),
		});
	});

	revalidatePath(`/groups/${groupId}/student/${studentId}`);
}
