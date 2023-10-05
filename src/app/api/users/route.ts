import {withApiAuthRequired} from '@auth0/nextjs-auth0';
import {NextResponse} from 'next/server';
import {getAllUsers} from '@/lib/user.ts';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GET = withApiAuthRequired(async () => NextResponse.json(await getAllUsers()));
