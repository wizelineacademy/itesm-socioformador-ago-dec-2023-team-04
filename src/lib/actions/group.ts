'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {type GroupCreation, groupCreationSchema} from '@/lib/schemas/group.ts';
import {internalErrorResult, type ServerActionResult} from '@/lib/server-action-result.ts';
import prisma from '@/lib/prisma.ts';

export default async function createGroupAction(groupCreation: GroupCreation): Promise<ServerActionResult<number>> {
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
