'use server';
import {revalidatePath} from 'next/cache';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import prisma from '@/lib/prisma.ts';

/**
 * Deletes users from the system.
 *
 * @param {number[]} studentIds - An array of user IDs to delete.
 *
 * @returns {Promise<ServerActionResult>} A Promise that resolves to a ServerActionResult object indicating the result of the operation.
 *
 * @throws {Error} If an error occurs during the deletion process.
 */
export default async function deleteStudents(studentIds: number[]): Promise<ServerActionResult> {
	try {
		await prisma.student.deleteMany({
			where: {
				id: {in: studentIds},
			},
		});

		for (const id of studentIds) {
			revalidatePath(`/students/${id}`);
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
