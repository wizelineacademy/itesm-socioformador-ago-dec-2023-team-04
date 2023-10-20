import {type Student} from '@prisma/client';
import {cache} from 'react';
import prisma from '@/lib/prisma.ts';
// Import {cache} from "react";
// export const revalidate = 60;

export async function getAllStudents(): Promise<Student[]> {
	return prisma.student.findMany();
}

export const getStudent = cache(async (id: number) => prisma.student.findUnique({
	where: {
		id,
	},
}));

export const getStudentName = cache(async (id: number) => prisma.student.findUnique({
	where: {
		id,
	}, select: {
		givenName: true,
		familyName: true,
	},
}));
/* Export const getAllStudents = cache(async () => prisma.student.findMany({
		select: {
			registration: true,
			givenName: true,
			familyName: true,
		},
	}),
); */
