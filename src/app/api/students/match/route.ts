import {type NextRequest, NextResponse} from 'next/server';
import {withApiAuthRequired} from '@auth0/nextjs-auth0';
import {notFound} from 'next/navigation';
import {getBestStudentMatch} from '@/lib/students.ts';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const POST = withApiAuthRequired(async (request: NextRequest) => {
	const descriptor = await request.json() as number[];

	const match = await getBestStudentMatch(descriptor);

	if (!match || match.similarity < 0.3) {
		notFound();
	}

	return NextResponse.json(match);
});
