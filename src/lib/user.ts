import {cache} from 'react';
import {type User} from '@prisma/client';
import {getSession} from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma.ts';
import {type searchForStudentsByName} from '@/lib/student.ts';

/**
 * Retrieves a user by their authentication ID. It is assumed that if this is executed with a given authId,
 * the user MUST exist. If it doesn't, the function WILL throw.
 *
 * @param {string} authId - The authentication ID of the user to retrieve.
 *
 * @returns {Promise<User>} - A promise that resolves to the user object.
 *
 * @async
 */
export const getUserByAuthId = cache(async (authId: string) => prisma.user.findFirst({
	where: {
		authId,
	},
}));

/**
 * Retrieves the user information associated with the current session.
 *
 * @returns {Promise<User>} A Promise that resolves to the user object.
 */
export async function getUserFromSession(): Promise<User | null> {

	const session = await getSession();
	if (session === null || session === undefined) {
		return null;
	}


	return getUserByAuthId(session.user.sub as string);
}

/**
 * Retrieves all users.
 *
 * @function getAllUsers
 * @returns {Promise<Array>} - A promise that resolves to an array of all users.
 */
export const getAllUsers = cache(async () => prisma.user.findMany());

/**
 * Retrieves a user based on the given id.
 *
 * @param {number} id - The id of the user.
 * @returns {Promise<User>} - A promise that resolves to the user object, or null if user does not exist.
 */
export const getUserById = cache(async (id: number) => prisma.user.findUnique({
	where: {
		id,
	},
}));

export type StudentSearchResult = Awaited<ReturnType<typeof searchForStudentsByName>>[number];

