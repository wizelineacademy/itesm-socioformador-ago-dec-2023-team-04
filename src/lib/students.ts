import {type Student} from '@prisma/client';
import {cache} from 'react';
import prisma from '@/lib/prisma.ts';
import {type StudentInit} from '@/lib/schemas/student.ts';
import {getUserFromSession} from '@/lib/users.ts';
import {AuthenticationError, AuthorizationError} from '@/lib/errors.ts';

/**
 * Retrieves all the students from the database.
 *
 * @throws {AuthenticationError} If there is no user in the session.
 * @throws {AuthorizationError} If the user is not an users.
 *
 * @returns {Promise<Array>} A promise that resolves to an array containing all the students.
 */
export const getAllStudents = cache(async () => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.student.findMany();
});

export type StudentWithSimilarity = Omit<Student, 'biometricData'> & {
	similarity: number;
};

/**
 * Finds the best student match based on similarity given a descriptor array.
 * Only authorized admins can access this method.
 * @param {number[]} descriptor - The descriptor array used to calculate similarity.
 * @return {Promise<StudentWithSimilarity | undefined>} - The best student match with similarity or undefined if no match found.
 * @throws {AuthenticationError} - If user is not authenticated.
 * @throws {AuthorizationError} - If user is not authorized.
 */
export async function getBestStudentMatch(descriptor: number[]): Promise<StudentWithSimilarity | undefined> {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	const result = await prisma.$queryRaw<StudentWithSimilarity[]>`select s1.id,
                                                                          s1."givenName",
                                                                          s1."familyName",
                                                                          s1."registration",
                                                                          (select 1 - sqrt(sum(differences.difference) * 60) / 100
                                                                           from (select (bd1 - bd2) ^ 2  as difference
                                                                                 from unnest(s1."biometricData":: float [], ${descriptor}:: float []) as bd(bd1, bd2)) as differences) as similarity
                                                                   from "Student" as s1
                                                                   order by similarity desc;`;

	if (result.length > 0) {
		return result[0];
	}
}

/**
 * Retrieves a student from cache by their ID.
 *
 * @async
 * @function getStudentByIdWithTutors
 * @param {number} id - The ID of the student to retrieve.
 * @returns {Promise<Student | null>} - A promise that resolves with the student object if found, otherwise null.
 * @throws {AuthenticationError} - If the user is not authenticated.
 */
export const getStudentByIdWithTutors = cache(async (id: number) => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	return prisma.student.findUnique({
		where: {
			id,
			groups: user.admin
				? undefined
				: {
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
		include: {
			tutors: true,
		},
	});
});

export type StudentWithTutors = Awaited<ReturnType<typeof getStudentByIdWithTutors>>;

/**
 * Retrieves a list of students that match the given query.
 *
 * @param {string} query - The search query to match against student names.
 * @returns {Promise<Student[]>} - A promise that resolves with an array of Student objects that match the query.
 * @throws {AuthenticationError} if the user session is not valid.
 * @throws {AuthorizationError} if the user session does not have users privileges.
 *
 * @example
 * searchForStudentsByName('John')
 *     .then((students) => {
 *         console.log(students);
 *     })
 *     .catch((error) => {
 *         console.error(error);
 *     });
 */
export const searchForStudentsByName = async (query: string) => {
	const user = await getUserFromSession();
	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.student.findMany({
		take: 10,
		select: {
			id: true,
			givenName: true,
			familyName: true,
		},
		where: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			OR: [
				{
					givenName: {
						contains: query,
						mode: 'insensitive',
					},
				},
				{
					familyName: {
						contains: query,
						mode: 'insensitive',
					},
				},
			],
		},
	});
};

/**
 * Retrieves the student with their attendances by group.
 *
 * @param {number} studentId - The ID of the student.
 * @param {number} groupId - The ID of the group.
 * @returns {Promise<Object | null>} - A promise that resolves to an object representing the student with their attendances.
 * @throws {AuthenticationError} - If the user is not authenticated.
 */
export const getStudentWithGroupAttendances = cache(async (studentId: number, groupId: number) => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	return prisma.student.findUnique({
		where: {
			id: studentId,
			groups: user.admin
				? undefined
				: {
					some: {
						groupId,
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
		include: {
			groups: {
				where: {
					groupId,
					group: user.admin
						? undefined
						: {
							users: {
								some: {
									id: user.id,
								},
							},
						},
				},
				include: {
					group: {
						include: {
							attendances: {
								orderBy: {
									attendanceDate: 'asc',
								},
							},
						},
					},
				},
			},
		},
	});
});

export type StudentWithGroupAttendances = Exclude<Awaited<ReturnType<typeof getStudentWithGroupAttendances>>, null>;

export type StudentSearchResult = Awaited<ReturnType<typeof searchForStudentsByName>>[number];

/**
 * Creates a new student record in the database.
 *
 * @param {StudentInit} data - The data object containing the information of the student to be created.
 * @throws {AuthenticationError} - Thrown if the user is not authenticated.
 * @throws {AuthorizationError} - Thrown if the authenticated user is not an users.
 * @returns {Promise<Student>} - A promise that resolves to the newly created student object.
 */
export async function createStudent(data: StudentInit) {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.student.create({
		data: {
			...data,
			tutors: {
				connect: data.tutors.map(tutorId => ({
					id: tutorId,
				})),
			},
		},
	});
}

/**
 * Updates the student with the given ID and data.
 *
 * @param {number} id - The ID of the student.
 * @param {Partial<StudentInit>} data - The updated data for the student. Only the provided fields will be updated.
 *
 * @return {Promise<Student>} - Returns a promise that resolves to the updated student.
 *
 * @throws {AuthenticationError} - If the user is not authenticated.
 * @throws {AuthorizationError} - If the user is not authorized to update students.
 */
export async function updateStudent(id: number, data: Partial<StudentInit>) {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.student.update({
		where: {
			id,
		},
		data: {
			...data,
			tutors: data.tutors ? {
				set: data.tutors.map(tutorId => ({
					id: tutorId,
				})),
			} : undefined,
		},
	});
}

/**
 * Deletes students from the database.
 *
 * @param {number[]} studentIds - The IDs of the students to delete.
 * @returns {Promise<number>} - The number of students deleted.
 * @throws {AuthenticationError} - If the user is not authenticated.
 * @throws {AuthorizationError} - If the user is not authorized.
 */
export async function deleteStudents(studentIds: number[]): Promise<number> {
	const user = await getUserFromSession();
	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.$transaction(async tx => {
		await tx.studentInGroup.deleteMany({
			where: {
				studentId: {
					in: studentIds,
				},
			},
		});
		const {count} = await tx.student.deleteMany({
			where: {
				id: {
					in: studentIds,
				},
			},
		});
		return count;
	});
}
