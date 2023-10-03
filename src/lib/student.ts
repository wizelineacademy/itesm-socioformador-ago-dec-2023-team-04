import {type Student} from '@prisma/client';
import prisma from '@/lib/prisma.ts';

export async function getAllStudents(): Promise<Student[]> {
	return prisma.student.findMany();
}
