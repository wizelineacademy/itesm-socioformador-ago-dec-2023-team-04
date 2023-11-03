import {type Student} from '@prisma/client';
import {cache} from 'react';
import prisma from '@/lib/prisma.ts';
// Import {cache} from "react";
// export const revalidate = 60;

export async function getAllStudents(): Promise<Student[]> {
	return prisma.student.findMany();
}

<<<<<<< HEAD
export const getStudentById = cache(async (id: number) => prisma.student.findUnique({
	where: {
		id,
	}, include: {
		tutors: true,
	},
}));

=======
export const getStudent = cache(async (id: number) => prisma.student.findUnique({
	where: {
		id,
	}, include: {
		tutors: {
			select: {
				id: true,
			},
		},
	},
}));
>>>>>>> 5897b48 (student info view)
/* Export const getAllStudents = cache(async () => prisma.student.findMany({
		select: {
			registration: true,
			givenName: true,
			familyName: true,
		},
	}),
); */
