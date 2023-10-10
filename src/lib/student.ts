import {type Student} from '@prisma/client';
import prisma from '@/lib/prisma.ts';
// Import {cache} from "react";
// export const revalidate = 60;

export async function getAllStudents(): Promise<Student[]> {
	return prisma.student.findMany();
}

/* Export const getAllStudents = cache(async () => prisma.student.findMany({
		select: {
			registration: true,
			givenName: true,
			familyName: true,
		},
	}),
); */
