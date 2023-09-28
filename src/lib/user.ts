import React, {cache} from 'react';
import prisma from '@/lib/prisma';

export const getUserByAuthId = cache(async (authId: string) => {
    prisma.user.
});
