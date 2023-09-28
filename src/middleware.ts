import {getSession} from '@auth0/nextjs-auth0/edge';
import {NextRequest, NextResponse} from 'next/server';

export default async function middleware(req: NextRequest) {
    const res = new NextResponse();
    const session = await getSession(req, res);

    if (session == null) {
        return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}

