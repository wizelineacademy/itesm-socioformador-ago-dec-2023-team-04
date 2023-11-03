import {cache} from 'react';
import prisma from '@/lib/prisma.ts';

export const getTutorById = cache(async (id: number) => prisma.tutor.findUnique({
	where: {
		id,
	},
}));

