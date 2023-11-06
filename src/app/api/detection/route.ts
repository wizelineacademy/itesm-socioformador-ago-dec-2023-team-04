import {type NextRequest, NextResponse} from 'next/server';
import {getBestStudentMatch} from '@/lib/student.ts';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const POST = async (request: NextRequest) => {
	const descriptor = await request.json() as number[];

	const match = await getBestStudentMatch(descriptor);

	return NextResponse.json(match);
};
