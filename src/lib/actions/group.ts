'use server';
import {revalidatePath} from 'next/cache';
import {type Group} from '@prisma/client';
import {groupSchema} from '@/lib/schemas/group.ts';
import {internalErrorResult, type ServerActionResult} from '@/lib/server-action-result.ts';
import prisma from '@/lib/prisma.ts';

export async function createOrUpdateGroupAction(group: Omit<Group, 'id'>, id?: number): Promise<ServerActionResult<number>> {
	try {
		if (id === undefined) {
			const validatedGroup = groupSchema.parse(group);
			const result = await prisma.group.create({
				data: validatedGroup,
			});

			revalidatePath('/groups');

			return {
				success: true,
				data: result.id,
			};
		}

		const validatedGroup = groupSchema.partial().parse(group);

		const result = await prisma.group.update({
			where: {
				id,
			},
			data: validatedGroup,
		});

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
