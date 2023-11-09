import {cache} from 'react';
import prisma from '@/lib/prisma.ts';

export const getAllColors = cache(async () => prisma.color.findMany());
