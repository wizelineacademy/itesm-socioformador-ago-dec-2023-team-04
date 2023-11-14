import {type NextRequest, NextResponse} from 'next/server';
import {searchForStudentsByName} from '@/lib/student.ts';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GET = async (request: NextRequest) => {
	const searchQuery = request.nextUrl.searchParams.get('query');

	if (searchQuery === null) {
		return new NextResponse('Missing query search param', {
			status: 400,
		});
	}

	const foundStudents = await searchForStudentsByName(searchQuery);

	return NextResponse.json(foundStudents);
};
