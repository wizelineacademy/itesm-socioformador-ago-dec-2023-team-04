import prisma from '@/lib/prisma.ts';

export async function getAllColors() {
	return prisma.color.findMany();
}
