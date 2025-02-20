import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from '$lib/prisma/authUtil';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals }) => {
    if(!locals.user) {
        return redirect(308, "/login")
    }
	const token = cookies.get('session') ?? null;
	if (!token) {
		return new Response(null, {
			status: 401
		});
	}

    const { session } = await validateSessionToken(token);
    if(!session) {
        deleteSessionTokenCookie(cookies)
        return new Response(null, {
            status: 401
        })
    }

    setSessionTokenCookie(cookies, token, session.expiresAt)
};
