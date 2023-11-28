import {cache} from 'react';
import prisma from '@/lib/prisma.ts';
import {type TutorInit} from '@/lib/schemas/tutor.ts';
import {getUserFromSession} from '@/lib/users.ts';
import {AuthenticationError, AuthorizationError} from '@/lib/errors.ts';

/**
 * Creates a new tutor
 *
 * @param {TutorInit} data - The data for creating the tutor
 * @throws {AuthenticationError} If there is no user in the current session
 * @throws {AuthorizationError} If the user is not an users
 * @returns {Promise<Tutor>} A promise that resolves to the created tutor
 */
export async function createTutor(data: TutorInit) {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.tutor.create({
		data: {
			...data,
			students: {
				connect: data.students?.map(student => ({id: student})),
			},
		},
	});
}

/**
 * Updates the tutor with the specified ID with the given data.
 * Only administrators can update tutors.
 *
 * @param {number} id - The ID of the tutor to update.
 * @param {Partial<TutorInit>} data - The partial data to update the tutor with.
 * @throws {AuthenticationError} If the user is not authenticated.
 * @throws {AuthorizationError} If the user is not authorized to perform the update.
 * @return {Promise} A promise that resolves to the updated tutor.
 */
export async function updateTutor(id: number, data: Partial<TutorInit>) {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.tutor.update({
		where: {
			id,
		},
		data: {
			...data,
			students: data.students ? {
				set: data.students.map(student => ({id: student})),
			} : undefined,
		},
	});
}

/**
 * Retrieves a tutor by their ID.
 *
 * @param {number} id - The ID of the tutor to retrieve.
 * @throws {AuthenticationError} if the user is not authenticated.
 * @throws {AuthorizationError} if the user is not authorized as an users.
 * @returns {Promise<Tutor>} A promise that resolves to the tutor object if found, or null if not found.
 */
export const getTutorById = cache(async (id: number) => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	return prisma.tutor.findUnique({
		where: {
			id,
			students: user.admin
				? undefined
				: {
					some: {
						groups: {
							some: {
								group: {
									users: {
										some: {
											id: user.id,
										},
									},
								},
							},
						},
					},
				},
		},
	});
});

/**
 * Retrieves a tutor by their ID along with the associated students.
 *
 * @param {number} id - The ID of the tutor to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the tutor object with the associated students.
 * @throws {AuthenticationError} - if the user is not authenticated.
 */
export const getTutorByIdWithStudents = cache(async (id: number) => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	return prisma.tutor.findUnique({
		where: {
			id,
			students: user.admin
				? undefined
				: {
					some: {
						groups: {
							some: {
								group: {
									users: {
										some: {
											id: user.id,
										},
									},
								},
							},
						},
					},
				},
		},
		include: {
			students: true,
		},
	});
});

export type TutorByIdWithStudents = Awaited<ReturnType<typeof getTutorByIdWithStudents>>;

/**
 * Retrieves all tutors from the database.
 *
 * @returns {Promise<Array>} A Promise that resolves to an array of tutors.
 * @throws {AuthenticationError} If the user is not authenticated.
 * @throws {AuthorizationError} If the user is not authorized to perform this action.
 */
export const getAllTutors = cache(async () => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.tutor.findMany();
});

/**
 * Deletes tutors based on the provided tutor IDs.
 *
 * @param {number[]} tutorIds - An array of tutor IDs to delete.
 * @return {Promise<number>} - A Promise that resolves with the number of tutors deleted.
 * @throws {AuthenticationError} - If the user is not authenticated.
 * @throws {AuthorizationError} - If the user does not have users privileges.
 */
export async function deleteTutors(tutorIds: number[]): Promise<number> {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	const {count} = await prisma.tutor.deleteMany({
		where: {
			id: {
				in: tutorIds,
			},
		},
	});

	return count;
}
