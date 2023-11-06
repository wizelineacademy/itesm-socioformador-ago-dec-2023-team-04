import {type Student} from '@prisma/client';
import {cache} from 'react';
import prisma from '@/lib/prisma.ts';
// Import {cache} from "react";
// export const revalidate = 60;

export async function getAllStudents(): Promise<Student[]> {
	return prisma.student.findMany();
}

export type StudentWithSimilarity = Student & {
	similarity: number;
};

export async function getBestStudentMatch(studentId: number): Promise<StudentWithSimilarity | undefined> {
	const result = await prisma.$queryRaw<StudentWithSimilarity[]>`select s1.*,
                                                 (select 1 - sqrt(sum(differences.difference) * 60) / 100
                                                  from (select (bd1 - bd2) ^ 2  as difference
                                                        from unnest(s1."biometricData", s3."biometricData") as bd(bd1, bd2)) as differences) as similarity
                                          from "Student" as s1
                                                   join (select s2."biometricData" from "Student" as s2 where s2.id = ${studentId}) as s3
                                                        on true
                                          where s1.id != ${studentId}
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
