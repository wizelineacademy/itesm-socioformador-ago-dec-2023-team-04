import {cache} from 'react';
import prisma from '@/lib/prisma.ts';

export const getAllGroupsWithColors = cache(async () => prisma.group.findMany({
	include: {
		color: true,
		_count: {
			select: {
				students: true,
			},
		},
	},
}));

export type GroupWithColor = Awaited<ReturnType<typeof getAllGroupsWithColors>>[number];

export const getAllGroups = cache(async () => prisma.group.findMany());

export const getAllGroupsWithStudentCount = cache(async () => prisma.group.findMany({
	include: {
		_count: {
			select: {
				students: true,
			},
		},
	},
}));

export type GroupWithStudentCount = Awaited<ReturnType<typeof getAllGroupsWithStudentCount>>[number];

export const getGroupById = cache(async (id: number) => prisma.group.findUnique({
	where: {
		id,
	},
}));

/**
 * Retrieves a group by its unique id and includes the count of students in the group.
 *
 * @param {number} id - The id of the group to retrieve.
 * @returns {Promise<Object>} - A Promise that resolves to an object containing the group and its student count.
 */
export const getGroupByIdWithStudentIds = cache(async (id: number) => prisma.group.findUnique({
	where: {
		id,
	},
	include: {
		_count: {
			select: {
				students: true,
			},
		},
		students: {
			select: {
				id: true,
				givenName: true,
				familyName: true,
			},
		},
	},
}));

export type GroupByIdWithStudents = Awaited<ReturnType<typeof getGroupByIdWithStudentIds>>;

