import prisma from '@/lib/prisma.ts';

export async function getLastMonthAttendanceOnTime(groupId: number) {
	const currentDate = new Date();
	const lastMonthStartDate = new Date();
	lastMonthStartDate.setMonth(currentDate.getMonth() - 1);

	return prisma.attendance.count({
		where: {
			groupId,
			attendanceDate: {
				gte: lastMonthStartDate,
				lte: currentDate,
			},
			type: 'ON_TIME',
		},
	});
}

export async function getLastMonthAttendanceLate(groupId: number) {
	const currentDate = new Date();
	const lastMonthStartDate = new Date();
	lastMonthStartDate.setMonth(currentDate.getMonth() - 1);

	return prisma.attendance.count({
		where: {
			groupId,
			attendanceDate: {
				gte: lastMonthStartDate,
				lte: currentDate,
			},
			type: 'LATE',
		},
	});
}
