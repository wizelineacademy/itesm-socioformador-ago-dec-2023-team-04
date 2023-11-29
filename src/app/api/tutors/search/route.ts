import {type NextRequest, NextResponse} from 'next/server';
import {searchForTutorsByName} from '@/lib/tutors.ts';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GET = async (request: NextRequest) => {
	const searchQuery = request.nextUrl.searchParams.get('query');

	if (searchQuery === null) {
		return new NextResponse('Missing query search param', {
			status: 400,
		});
	}

	const foundTutors = await searchForTutorsByName(searchQuery);

	return NextResponse.json(foundTutors);
};
