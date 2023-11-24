import {cache} from 'react';
import prisma from '@/lib/prisma.ts';

export const attendanceOnTime = cache(async (groupId: number, dateArray: Date[]) => prisma.attendance.groupBy({
	by: ['attendanceDate'],
	where: {
		groupId,
		attendanceDate: {
			in: dateArray,
		},
		type: 'ON_TIME',
	},
	_count: {
		type: true,
	},
}));

export const attendanceLate = cache(async (groupId: number, dateArray: Date[]) => prisma.attendance.groupBy({
	by: ['attendanceDate'],
	where: {
		groupId,
		attendanceDate: {
			in: dateArray,
		},
		type: 'LATE',
	},
	_count: {
		type: true,
	},
}));

export const attendanceAbsence = cache(async (groupId: number, dateArray: Date[]) => prisma.attendance.groupBy({
	by: ['attendanceDate'],
	where: {
		groupId,
		attendanceDate: {
			in: dateArray,
		},
		type: undefined,
	},
	_count: {
		type: true,
	},
}));

export const attendanceJustificatedAbsence = cache(async (groupId: number, dateArray: Date[]) => prisma.attendance.groupBy({
	by: ['attendanceDate'],
	where: {
		groupId,
		attendanceDate: {
			in: dateArray,
		},
		type: 'JUSTIFICATED_ABSENCE',
	},
	_count: {
		type: true,
	},
}));

export const entryHours = cache(async (groupId: number, dateArray: Date[]) => prisma.attendance.groupBy({
	by: ['attendanceDate'],
	where: {
		groupId,
		attendanceDate: {
			in: dateArray,
		},
	},
	_count: {
		attendanceEntryHour: true,
	},
}));
