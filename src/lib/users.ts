import {cache} from 'react';
import {type User} from '@prisma/client';
import {getSession} from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma.ts';
import {type UserInit} from '@/lib/schemas/user.ts';
import {AuthenticationError, AuthorizationError} from '@/lib/errors.ts';
import {management} from '@/lib/auth0.ts';

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

	return prisma.user.findFirst({
		where: {
			authId: session.user.sub as string,
		},
	});
}

/**
 * A variable that retrieves all users.
 *
 * @async
 * @function getAllUsers
 * @throws {AuthenticationError} If the user is not authenticated.
 * @throws {AuthorizationError} If the user is not authorized.
 * @returns {Promise<Array<User>>} A promise that resolves to an array of user objects.
 */
export const getAllUsers = cache(async () => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.user.findMany();
});

/**
 * Retrieves a user by their ID.
 *
 * @param {number} id - The ID of the user to retrieve.
 * @throws {AuthenticationError} If the user is not authenticated.
 * @throws {AuthorizationError} If the user is not authorized to access the requested user.
 * @returns {Promise<object>} A promise that resolves to the user object.
 */
export const getUserById = cache(async (id: number) => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin && user.id !== id) {
		throw new AuthorizationError();
	}

	return prisma.user.findUnique({
		where: {
			id,
		},
	});
});

/**
 * Updates the user with the given ID using the provided data.
 *
 * @param {number} id - The ID of the user to update.
 * @param {Partial<UserInit>} data - The data to update the user with.
 * @throws {AuthenticationError} - If no user is found in the session.
 * @throws {AuthorizationError} - If the user is not an users and is trying to update another user's users status.
 * @throws {Error} - If the password or email update fails.
 * @returns {Promise<User>} - A Promise that resolves to the updated user.
 */
export async function updateUser(id: number, data: Partial<UserInit>) {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin && (user.id !== id || (user.id === id && 'admin' in data))) {
		throw new AuthorizationError();
	}

	return prisma.$transaction(async tx => {
		const updatedUser = await tx.user.update({
			where: {
				id,
			},
			data: {
				givenName: data.givenName,
				familyName: data.familyName,
				email: data.email,
				admin: data.admin,
			},
		});

		if (data.admin) {
			const response = await management.users.update({
				id: updatedUser.authId,
			}, {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				app_metadata: {
					admin: data.admin,
				},
			});
		}

		if (data.password) {
			const response = await management.users.update({
				id: updatedUser.authId,

			}, {
				password: data.password,
			});

			if (response.status !== 200) {
				throw new Error('No se ha podido actualizar la información del usuario');
			}
		}

		if (data.email) {
			const response = await management.users.update({
				id: updatedUser.authId,

			}, {
				email: data.email,
			});
			if (response.status !== 200) {
				throw new Error('No se ha podido actualizar la información del usuario');
			}
		}

		return updatedUser;
	});
}

/**
 * Creates a new user.
 *
 * @param {UserInit} data - The data required to create a user.
 * @throws {AuthenticationError} If the current user is not authenticated.
 * @throws {AuthorizationError} If the current user does not have users privileges.
 * @returns {Promise<User>} A Promise that resolves to the created User object.
 */
export async function createUser(data: UserInit) {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.$transaction(async tx => {
		const response = await management.users.create({
			email: data.email,
			password: data.password,
			connection: 'Username-Password-Authentication',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			app_metadata: {
				admin: data.admin,
			},
		});

		if (response.status !== 201) {
			throw new Error('No se pudo crear el usuario.');
		}

		return tx.user.create({
			data: {
				givenName: data.givenName,
				familyName: data.familyName,
				admin: data.admin,
				email: response.data.email,
				authId: response.data.user_id,
			},
		});
	});
}

/**
 * Deletes users with the given user IDs.
 *
 * @param {number[]} userIds - An array of user IDs to be deleted.
 *
 * @returns {Promise<number>} - A promise that resolves to the number of deleted records.
 *
 * @throws {AuthenticationError} - If no user is found in the current session.
 * @throws {AuthorizationError} - If the user is not an users and is trying to delete another user's account or multiple user accounts.
 */
export async function deleteUsers(userIds: number[]): Promise<number> {
	const user = await getUserFromSession();
	if (!user) {
		throw new AuthenticationError();
	}

	if (userIds.includes(user.id)) {
		throw new Error('No puedes borrar tu propio usuario.');
	}

	if (!user.admin && ((userIds.length === 1 && userIds[0] !== user.id) || userIds.length > 1)) {
		throw new AuthorizationError();
	}

	let deletedRecords = 0;

	for (const userId of userIds) {
		// This is inefficient. However, the management API will rate limit us if we attempt to
		// delete all users at the same time. As such, we are doing these operations sequentially,
		// with a timeout in between all deletions.
		/* eslint-disable no-await-in-loop */
		await prisma.$transaction(async tx => {
			const {authId} = await tx.user.delete({
				where: {
					id: userId,
				},
			});
			await management.users.delete({
				id: authId,
			});
		});

		deletedRecords++;

		await new Promise(resolve => {
			setTimeout(resolve, 500);
		});
		/* eslint-enable no-await-in-loop */
	}

	return deletedRecords;
}

export const searchForUsersByName = async (query: string) => {
	const user = await getUserFromSession();
	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	return prisma.user.findMany({
		take: 10,
		select: {
			id: true,
			givenName: true,
			familyName: true,
			email: true,
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

export type UsersSearchResult = Awaited<ReturnType<typeof searchForUsersByName>>[number];
