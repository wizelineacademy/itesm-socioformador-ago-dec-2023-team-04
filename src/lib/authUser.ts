import {cache} from 'react';
import {getSession} from '@auth0/nextjs-auth0';
import {redirect} from 'next/navigation';

export const getAuthUser = cache(async () => {
    const session = await getSession();
    if (session == null) return redirect('/api/auth/login')
    return session;
});
