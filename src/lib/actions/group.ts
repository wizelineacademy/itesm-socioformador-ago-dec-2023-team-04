'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import prisma from '@/lib/prisma.ts';
import {handleErrorAction} from '@/lib/actions/util.ts';
import {type FormState} from '@/components/form.tsx';
import groupUpsertSchema, {type GroupUpsert} from '@/lib/schemas/group.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import {getUserFromSession} from '@/lib/user.ts';

export async function upsertGroupAction(previousState: FormState<GroupUpsert>, formData: FormData): Promise<FormState<GroupUpsert>> {
	let newId: number | undefined;
	const user = await getUserFromSession();

	if (user === null || !user.admin) {
		return	{
			...previousState,
			formErrors: ['No estás autorizado para realizar esta acción'],
		};
	}

	try {
		if (previousState.id === undefined) {
			const validatedGroup = await decodeForm(formData, groupUpsertSchema);
			const result = await prisma.group.create({
				data: {
					...validatedGroup,
					students: {
						createMany: {
							data: validatedGroup.students?.map(student => (
								{
									studentId: student,
								}
							)) ?? [],
						},
					},
				},
			});
			newId = result.id;
		} else {
			console.log(Object.fromEntries(formData));
			const validatedGroup = await decodeForm(formData, groupUpsertSchema.partial());
			await prisma.$transaction(async tx => {
				if ('students' in validatedGroup) {
					await tx.studentInGroup.deleteMany({
						where: {
							groupId: previousState.id,
						},
					});
				}

				await tx.group.update({
					where: {
						id: previousState.id,
					},
					data: {
						...validatedGroup,
						students: {
							connectOrCreate: validatedGroup.students?.map(student => (
								{
									where: {
										// eslint-disable-next-line @typescript-eslint/naming-convention
										studentId_groupId: {
											studentId: student,
											groupId: previousState.id!,
										},
									},
									create: {
										studentId: student,
									},
								}
							)) ?? [],
						},
					},
				});
			});
		}

		revalidatePath('/groups');
	} catch (error) {
		return handleErrorAction(previousState, error);
	}

	if (newId) {
		redirect(`/groups/edit/${newId}`);
	}

	return {
		...previousState,
		id: newId ?? previousState.id,
		formErrors: [],
		fieldErrors: {},
	};
}

/**
 * Deletes the groups with the given group IDs.
 *
 * @param {number[]} groupIds - An array of group IDs to delete.
 * @return {Promise<ServerActionResult>} A Promise that resolves to a ServerActionResult object indicating the success or failure of the operation.
 */
export async function deleteGroups(groupIds: number[]): Promise<ServerActionResult> {
	try {
		await prisma.group.deleteMany({
			where: {
				id: {
					in: groupIds,
				},
			},
		});

		revalidatePath('/groups');

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
