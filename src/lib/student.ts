import {type Student} from '@prisma/client';
import {cache} from 'react';
import prisma from '@/lib/prisma.ts';
// Import {cache} from "react";
// export const revalidate = 60;

export async function getAllStudents(): Promise<Student[]> {
	return prisma.student.findMany();
}

export type StudentWithSimilarity = Omit<Student, 'biometricData'> & {
	similarity: number;
};

export async function getBestStudentMatch(descriptor: number[]): Promise<StudentWithSimilarity | undefined> {
	const result = await prisma.$queryRaw<StudentWithSimilarity[]>`select s1.id,
                                                                          s1."givenName",
                                                                          s1."familyName",
                                                                          s1."registration",
                                                                          (select 1 - sqrt(sum(differences.difference) * 60) / 100
                                                                           from (select (bd1 - bd2) ^ 2  as difference
                                                                                 from unnest(s1."biometricData":: float [], ${descriptor}:: float []) as bd(bd1, bd2)) as differences) as similarity
                                                                   from "Student" as s1
                                                                   order by similarity desc;`;

	if (result.length > 0) {
		return result[0];
	}
}

export const getStudentById = cache(async (id: number) => prisma.student.findUnique({
	where: {
		id,
	}, include: {
		tutors: true,
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
export const searchForStudentsByName = async (query: string) => prisma.student.findMany({
	take: 10,
	select: {
		id: true,
		givenName: true,
		familyName: true,
	},
	where: {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		OR: [
			{
				givenName: {
					contains: query,
					mode: 'insensitive',
				},
			},
			{
				familyName: {
					contains: query,
					mode: 'insensitive',
				},
			},
		],
	},
});

