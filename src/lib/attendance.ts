import {cache} from 'react';
import prisma from '@/lib/prisma.ts';

export const attendanceOnTime = cache(async (groupId: number, initialDate: Date, endDate: Date) => prisma.attendance.groupBy({
	by: ['attendanceDate'],
	where: {
		groupId,
		attendanceDate: {
			gte: initialDate,
			lte: endDate,
		},
		type: 'ON_TIME',
	},
	_count: {
		type: true,
	},
}));

export const attendanceLate = cache(async (groupId: number, initialDate: Date, endDate: Date) => prisma.attendance.groupBy({
	by: ['attendanceDate'],
	where: {
		groupId,
		attendanceDate: {
			gte: initialDate,
			lte: endDate,
		},
		type: 'LATE',
	},
	_count: {
		type: true,
	},
}));

export const attendanceAbsence = cache(async (groupId: number, initialDate: Date, endDate: Date) => prisma.attendance.groupBy({
	by: ['attendanceDate'],
	where: {
		groupId,
		attendanceDate: {
			gte: initialDate,
			lte: endDate,
		},
		type: undefined,
	},
	_count: {
		type: true,
	},
}));

export const attendanceJustificatedAbsence = cache(async (groupId: number, initialDate: Date, endDate: Date) => prisma.attendance.groupBy({
	by: ['attendanceDate'],
	where: {
		groupId,
		attendanceDate: {
			gte: initialDate,
			lte: endDate,
		},
		type: 'JUSTIFICATED_ABSENCE',
	},
	_count: {
		type: true,
	},
}));
