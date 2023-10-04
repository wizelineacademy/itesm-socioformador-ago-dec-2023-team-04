'use server';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import {decodeForm} from '@/lib/schemas/util.ts';
import {userRegistrationSchema} from '@/lib/schemas/user.ts';
import prisma from '@/lib/prisma.ts';
import {management} from '@/lib/auth0.ts';

export default async function createUser(formData: FormData): Promise<ServerActionResult<number>> {
	try {
		const registrationData = await decodeForm(formData, userRegistrationSchema);

		const response = await management.users.create({
			email: registrationData.email,
			password: registrationData.password,
			connection: 'Username-Password-Authentication',
		});

		console.log(response);

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
		console.log(error);
		if (error instanceof Error) {
			return {
				success: false,
				name: error.name,
				message: error.message,
			};
		}

		console.error(error);

		return {
			success: false,
			message: 'unknown server error',
		};
	}
}
