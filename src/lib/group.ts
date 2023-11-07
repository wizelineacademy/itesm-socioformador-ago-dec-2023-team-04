import {type Group} from '@prisma/client';
import prisma from '@/lib/prisma.ts';

export async function getAllGroups(): Promise<Group[]> {
	return prisma.group.findMany();
}
