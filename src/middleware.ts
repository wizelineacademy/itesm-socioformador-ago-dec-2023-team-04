import {getSession} from '@auth0/nextjs-auth0/edge';
import {type NextRequest, NextResponse} from 'next/server';

export default async function middleware(request: NextRequest) {
	// eslint-disable-next-line n/prefer-global/buffer
	const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
	const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

	const contentSecurityPolicyHeaderValue = cspHeader
		.replaceAll(/\s{2,}/g, ' ')
		.trim();

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-nonce', nonce);

	requestHeaders.set(
		'Content-Security-Policy',
		contentSecurityPolicyHeaderValue,
	);

	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	response.headers.set(
		'Content-Security-Policy',
		contentSecurityPolicyHeaderValue,
	);

	const session = await getSession(request, response);
	if (session === null || session === undefined) {
		return NextResponse.redirect(new URL('/api/auth/login', request.url));
	}

	if (request.nextUrl.pathname.startsWith('/admin') && !session.user.admin) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	// Replace newline characters and spaces

	return response;
}

export const config = {
	matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
	missing: [
		{type: 'header', key: 'next-router-prefetch'},
		{type: 'header', key: 'purpose', value: 'prefetch'},
	],
};

