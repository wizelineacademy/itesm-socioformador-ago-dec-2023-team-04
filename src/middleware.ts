import {getSession} from '@auth0/nextjs-auth0/edge';
import {type NextRequest, NextResponse} from 'next/server';
import {getUserByAuthId} from '@/lib/user.ts';

export default async function middleware(request: NextRequest) {
	const response = new NextResponse();
	const session = await getSession(request, response);

	console.log(session);

	if (session === null || session === undefined) {
		return NextResponse.redirect(new URL('/api/auth/login', request.url));
	}

	if (request.nextUrl.pathname.startsWith('/admin') && !session.user.admin) {
		return NextResponse.redirect(new URL('/', request.url));
	}
}

export const config = {
	matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};

