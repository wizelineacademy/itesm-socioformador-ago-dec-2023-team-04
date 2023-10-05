'use server';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import {decodeForm} from '@/lib/schemas/util.ts';
import {userRegistrationSchema} from '@/lib/schemas/user.ts';
import prisma from '@/lib/prisma.ts';
import {management} from '@/lib/auth0.ts';

/**
 * Creates a user by decoding the form data and registering the user in the authentication system and database.
 *
 * @param {FormData} formData - The form data containing the user registration details.
 *
 * @returns {Promise<ServerActionResult<number>>} A Promise that resolves to a ServerActionResult object with a success flag and data representing the created user ID, or an error message if user creation fails.
 */
export default async function createUser(formData: FormData): Promise<ServerActionResult<number>> {
	try {
		const registrationData = await decodeForm(formData, userRegistrationSchema);

		const response = await management.users.create({
			email: registrationData.email,
			password: registrationData.password,
			connection: 'Username-Password-Authentication',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			app_metadata: {
				admin: registrationData.admin,
			},
		});

		if (response.status !== 201) {
			return {
				success: false,
				message: 'failed to create user',
			};
		}

		const user = await prisma.user.create({
			data: {
				authId: response.data.user_id,
				givenName: registrationData.givenName,
				familyName: registrationData.familyName,
				admin: registrationData.admin,
				email: registrationData.email,
			},
		});
		return {
			success: true,
			data: user.id,
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
