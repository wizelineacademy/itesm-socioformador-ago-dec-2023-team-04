'use server';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import {decodeForm} from '@/lib/schemas/util.ts';
import prisma from '@/lib/prisma.ts';
import {management} from '@/lib/auth0.ts';
import {userUpdateSchema} from '@/lib/schemas/userUpdate.ts';

/**
 * Updates a user in the system.
 *
 * @param {FormData} formData - The form data containing the user update details.
 * @param {number} userId - The ID of the user to update.
 *
 * @param authId
 * @returns {Promise<ServerActionResult>} A Promise that resolves to a ServerActionResult object indicating the result of the operation.
 */
export default async function updateUser(formData: FormData, userId: number, authId: string): Promise<ServerActionResult> {
	try {
		const updatedData = await decodeForm(formData, userUpdateSchema);

		const user = await prisma.user.update({
			where: {
				id: userId, // Use the extracted user ID
			},
			data: updatedData,
		});

		if (!user.authId) {
			return {
				success: false,
				message: 'User does not have an authId',
			};
		}

		if (updatedData.email !== undefined || updatedData.password !== undefined) {
			await management.users.update({
				id: authId,
			}, {email: updatedData.email, password: updatedData.password});
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
