import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from '$lib/prisma/authUtil';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, locals }) => {
    console.log(locals)
    if(!locals.user) {
        return redirect(308, "/auth/login")
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
