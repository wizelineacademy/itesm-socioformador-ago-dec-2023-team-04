import {cache} from 'react';
import prisma from '@/lib/prisma.ts';
import {type GroupInit} from '@/lib/schemas/group.ts';
import {getUserFromSession} from '@/lib/users.ts';
import {AuthenticationError, AuthorizationError} from '@/lib/errors.ts';

/**
 * Creates a new group with the given data.
 *
 * @param {GroupInit} data - The data for creating the group.
 * @throws {AuthenticationError} If there is no authenticated user.
 * @throws {AuthorizationError} If the authenticated user is not an users.
 * @returns {Promise<Group>} A Promise that resolves with the created group.
 */
export async function createGroup(data: GroupInit) {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.group.create({
		data: {
			...data,
			users: {
				connect: [...(data.users ?? []), user.id].map(userId => ({
					id: userId,
				})),
			},
			students: {
				createMany: {
					data: data.students?.map(studentId => (
						{
							studentId,
						}
					)) ?? [],
				},
			},
		},
	});
}

/**
 * Updates a group with the given ID using the provided data.
 *
 * @param {number} id - The ID of the group to update.
 * @param {Partial<GroupInit>} data - The partial data to update the group with.
 * @returns {Promise<Group>} - A promise that resolves with the updated group.
 * @throws {AuthenticationError} - If the user is not authenticated.
 * @throws {AuthorizationError} - If the user is not authorized to perform the update.
 */
export async function updateGroup(id: number, data: Partial<GroupInit>) {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.$transaction(async tx => {
		if ('students' in data) {
			await tx.studentInGroup.deleteMany({
				where: {
					groupId: id,
				},
			});
		}

		if ('users' in data) {
			await tx.group.update({
				where: {
					id,
				},
				data: {
					users: {
						set: [],
					},
				},
			});
		}

		return tx.group.update({
			where: {
				id,
			},
			data: {
				...data,
				users: {
					connect: [...(data.users ?? []), user.id].map(userId => ({
						id: userId,
					})),
				},
				students: {
					connectOrCreate: data.students?.map(studentId => (
						{
							where: {
								// eslint-disable-next-line @typescript-eslint/naming-convention
								studentId_groupId: {
									studentId,
									groupId: id,
								},
							},
							create: {
								studentId,
							},
						}
					)) ?? [],
				},
			},
		});
	});
}

/**
 * Deletes groups with specified groupIds.
 *
 * @param {number[]} groupIds - An array of group ids to be deleted.
 * @throws {AuthenticationError} Throws an error if user is not authenticated.
 * @throws {AuthorizationError} Throws an error if the user is not an users.
 * @returns {Promise<number>} Returns a promise which resolves to the number of groups deleted.
 */
export async function deleteGroups(groupIds: number[]): Promise<number> {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	const {count} = await prisma.group.deleteMany({
		where: {
			id: {
				in: groupIds,
			},
		},
	});

	return count;
}

/**
 * Fetches all groups with their associated colors and student count.
 * @async
 * @function getAllGroupsWithColors
 * @throws {AuthenticationError} If user is not authenticated.
 * @throws {AuthorizationError} If user is not an users.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of group objects, each containing the color and student count.
 */
export const getAllGroupsWithColors = cache(async () => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.group.findMany({
		include: {
			color: true,
			_count: {
				select: {
					students: true,
				},
			},
		},
	});
});

export type GroupWithColor = Awaited<ReturnType<typeof getAllGroupsWithColors>>[number];

/**
 * Retrieves all groups
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of group objects.
 * @throws {AuthenticationError} If user is not authenticated.
 * @throws {AuthorizationError} If user is not an users.
 */
export const getAllGroups = cache(async () => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.group.findMany();
});

/**
 * Retrieves all groups with student count.
 *
 * This function fetches all groups from the database and includes the count of students in each group.
 * Only authenticated admins are allowed to access this information.
 *
 * @async
 * @returns {Promise<Array>} A promise that resolves to an array of groups with their respective student count.
 * @throws {AuthenticationError} If the user is not authenticated.
 * @throws {AuthorizationError} If the user is not an users.
 */
export const getAllGroupsWithStudentCount = cache(async () => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.group.findMany({
		include: {
			_count: {
				select: {
					students: true,
				},
			},
		},
	});
});

export type GroupWithStudentCount = Awaited<ReturnType<typeof getAllGroupsWithStudentCount>>[number];

/**
 * Retrieves a group from the cache by ID. Only returns a match if both the group exists and the current user has access
 * to it.
 *
 * @async
 * @function getGroupById
 * @param {number} id - The ID of the group to retrieve.
 * @throws {AuthenticationError} If the user is not authenticated.
 * @returns {Promise<Group>} The group object that matches the given ID.
 * @throws {Error} If an error occurs while retrieving the group.
 */
export const getGroupById = cache(async (id: number) => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	return prisma.group.findUnique({
		where: {
			id,
			users: user.admin
				? undefined
				: {
					some: {
						id: user.id,
					},
				},
		},
	});
});

/**
 * Retrieves a group by its unique id and includes the count of student in the group.
 *
 * @param {number} id - The id of the group to retrieve.
 * @returns {Promise<Object>} - A Promise that resolves to an object containing the group and its student count.
 */
export const getGroupByIdWithStudentIds = cache(async (id: number) => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	return prisma.group.findUnique({
		where: {
			id,
			users: user.admin
				? undefined
				: {
					some: {
						id: user.id,
					},
				},
		},
		include: {
			_count: {
				select: {
					students: true,
				},
			},
			students: {
				include: {
					student: true,
				},
			},
		},
	});
});

export type GroupByIdWithStudents = Awaited<ReturnType<typeof getGroupByIdWithStudentIds>>;

/**
 * Retrieves the attendance of students in a group.
 *
 * @param {number} id - The id of the group to fetch attendance for.
 * @param {Date} date - The date for which the attendance is being fetched.
 *
 * @throws {AuthenticationError} - If the user is not authenticated.
 * @returns {Promise} - A promise that resolves to the group with student attendance.
 */
export const getGroupWithStudentsAttendance = cache(async (id: number, date: Date) => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	return prisma.group.findUnique({
		where: {
			id,
			users: user.admin
				? undefined
				: {
					some: {
						id: user.id,
					},
				},
		},
		include: {
			students: {
				include: {
					student: {
						select: {
							givenName: true,
							familyName: true,
							registration: true,
							attendances: {
								where: {
									attendanceDate: date,
									groupId: id,
								},
							},
						},
					},
				},
			},
		},
	});
});

export type GroupWithStudentsAttendance = Exclude<Awaited<ReturnType<typeof getGroupWithStudentsAttendance>>, null>;
