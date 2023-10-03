import prisma from '@/lib/prisma';
import {Student} from '@prisma/client';

export async function getAllStudents(): Promise<Student[]> {
    return prisma.student.findMany();
}
