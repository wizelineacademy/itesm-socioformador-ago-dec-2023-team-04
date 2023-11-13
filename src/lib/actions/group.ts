'use server';
import {revalidatePath} from 'next/cache';
import {type Group} from '@prisma/client';
import {redirect} from 'next/navigation';
import prisma from '@/lib/prisma.ts';
import {handleErrorAction} from '@/lib/actions/util.ts';
import {type FormState} from '@/components/form.tsx';
import groupSchema from '@/lib/schemas/group.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {type ServerActionResult} from '@/lib/server-action-result.ts';

export async function upsertGroupAction(previousState: FormState<Group>, formData: FormData): Promise<FormState<Group>> {
	let newId: number | undefined;
	try {
		if (previousState.id === undefined) {
			const validatedGroup = await decodeForm(formData, groupSchema);
			const result = await prisma.group.create({
				data: validatedGroup,
			});
			newId = result.id;
		} else {
			const validatedGroup = await decodeForm(formData, groupSchema.partial());
			const result = await prisma.group.update({
				where: {
					id: previousState.id,
				},
				data: validatedGroup,
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
		id: newId,
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
