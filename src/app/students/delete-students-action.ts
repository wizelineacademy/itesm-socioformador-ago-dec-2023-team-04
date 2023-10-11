'use server';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import prisma from '@/lib/prisma.ts';
import {management} from '@/lib/auth0.ts';

/**
 * Deletes users from the system.
 *
 * @param {number[]} studentIds - An array of user IDs to delete.
 *
 * @returns {Promise<ServerActionResult>} A Promise that resolves to a ServerActionResult object indicating the result of the operation.
 *
 * @throws {Error} If an error occurs during the deletion process.
 */
export default async function deleteUsers(studentIds: number[]): Promise<ServerActionResult> {
	try {
		for (const studentId of studentIds) {
			// This is inefficient. However, the management API will rate limit us if we attempt to
			// delete all users at the same time. As such, we are doing these operations sequentially,
			// with a timeout in between all deletions.
			/* eslint-disable no-await-in-loop */
			await prisma.student.delete({
				where: {
					id: studentId,
				},
			});

			await new Promise(resolve => {
				setTimeout(resolve, 500);
			});
			/* eslint-enable no-await-in-loop */
		}

		return {
			success: true,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				name: error.name,
				message: error.message,
			};
		}

		return {
			success: false,
			message: 'unknown server error',
		};
	}
}
