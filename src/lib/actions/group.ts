'use server';
import {revalidatePath} from 'next/cache';
import {type GroupCreation, groupCreationSchema, type GroupUpdate, groupUpdateSchema} from '@/lib/schemas/group.ts';
import {internalErrorResult, type ServerActionResult} from '@/lib/server-action-result.ts';
import prisma from '@/lib/prisma.ts';

export async function createGroupAction(groupCreation: GroupCreation): Promise<ServerActionResult<number>> {
	try {
		const validatedData = groupCreationSchema.parse(groupCreation);

		const result = await prisma.group.create({
			data: validatedData,
		});

		revalidatePath('/groups');

		return {
			success: true,
			data: result.id,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				message: error.message,
				name: error.name,
			};
		}

		return internalErrorResult;
	}
}

export async function updateGroupAction(groupId: number, groupUpdate: GroupUpdate): Promise<ServerActionResult<number>> {
	try {
		const validatedData = groupUpdateSchema.parse(groupUpdate);

		const result = await prisma.group.update({
			data: validatedData,
			where: {
				id: groupId,
			},
		});

		revalidatePath('/groups');

		return {
			success: true,
			data: result.id,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				message: error.message,
				name: error.name,
			};
		}

		return internalErrorResult;
	}
}
