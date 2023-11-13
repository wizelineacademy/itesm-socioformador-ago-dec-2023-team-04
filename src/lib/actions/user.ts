'use server';
import {type User} from '@prisma/client';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import prisma from '@/lib/prisma.ts';
import {management} from '@/lib/auth0.ts';
import {type FormState} from '@/components/form.tsx';
import {userSchema} from '@/lib/schemas/user.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {handleErrorAction} from '@/lib/actions/util.ts';
import {type ServerActionResult} from '@/lib/server-action-result.ts';

async function updateAuth0UserDataAction(previousState: FormState<User>, authId: string, email?: string, password?: string): Promise<FormState<User> | undefined> {
	if (password) {
		const response = await management.users.update({
			id: authId,

		}, {
			password,
		});

		if (response.status !== 200) {
			return {
				...previousState,
				formErrors: ['Could not update user password'],
			};
		}
	}

	if (email) {
		const response = await management.users.update({
			id: authId,

		}, {
			email,
		});
		if (response.status !== 200) {
			return {
				...previousState,
				formErrors: ['Could not update user email'],
			};
		}
	}
}

export async function upsertUserAction(previousState: FormState<User>, formData: FormData): Promise<FormState<User>> {
	let newId: number | undefined;
	try {
		if (previousState.id === undefined) {
			const validatedUser = await decodeForm(formData, userSchema);

			const result = await prisma.$transaction(async tx => {
				const response = await management.users.create({
					email: validatedUser.email,
					password: validatedUser.password,
					connection: 'Username-Password-Authentication',
					// eslint-disable-next-line @typescript-eslint/naming-convention
					app_metadata: {
						admin: validatedUser.admin,
					},
				});
				if (response.status !== 201) {
					return {
						...previousState,
						formErrors: ['Could not create user'],
					};
				}

				const result = await tx.user.create({
					data: {
						givenName: validatedUser.givenName,
						familyName: validatedUser.familyName,
						admin: validatedUser.admin,
						email: response.data.email,
						authId: response.data.user_id,
					},
				});

				newId = result.id;
			});

			if (result) {
				return result;
			}
		} else {
			console.log(formData.get('admin'));
			const validatedUser = await decodeForm(formData, userSchema.partial());
			console.log(validatedUser);
			const existingUser = await prisma.user.findUniqueOrThrow({
				where: {
					id: previousState.id,
				},
				select: {
					authId: true,
				},
			});

			const result = await prisma.$transaction(async tx => {
				await tx.user.update({
					where: {
						id: previousState.id,
					},
					data: {
						givenName: validatedUser.givenName,
						familyName: validatedUser.familyName,
						admin: validatedUser.admin,
					},
				});

				return updateAuth0UserDataAction(previousState, existingUser.authId, validatedUser.email, validatedUser.password);
			});

			if (result) {
				return result;
			}
		}

		revalidatePath('/admin/users');
	} catch (error) {
		console.log(error);
		return handleErrorAction(previousState, error);
	}

	if (newId) {
		redirect(`/admin/users/${newId}`);
	}

	return {
		...previousState,
		id: newId ?? previousState.id,
		formErrors: [],
		fieldErrors: {},
	};
}

/**
 * Deletes users from the system.
 *
 * @param {number[]} userIds - An array of user IDs to delete.
 *
 * @returns {Promise<ServerActionResult>} A Promise that resolves to a ServerActionResult object indicating the result of the operation.
 *
 * @throws {Error} If an error occurs during the deletion process.
 */
export async function deleteUsers(userIds: number[]): Promise<ServerActionResult> {
	try {
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

			await new Promise(resolve => {
				setTimeout(resolve, 500);
			});
			/* eslint-enable no-await-in-loop */
		}

		revalidatePath('/admin/users');

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

