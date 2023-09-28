import {cache} from 'react';
import prisma from '@/lib/prisma';
import {getAuthUser} from '@/lib/authUser';
import {User} from '@prisma/client';


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
export const getUserByAuthId = cache(async (authId: string) => {
    return prisma.user.findFirstOrThrow({
        where: {
            authId,
        }
    });
});

/**
 * Retrieves the user information associated with the current session.
 *
 * @returns {Promise<User>} A Promise that resolves to the user object.
 */
export async function getUserFromSession(): Promise<User> {
    const session = await getAuthUser();
    return await getUserByAuthId(session.user.sub)
}

export async function getAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
}
