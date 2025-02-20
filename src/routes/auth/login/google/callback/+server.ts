import { google, prisma } from '$lib/prisma';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/prisma/authUtil';
import type { RequestEvent } from '@sveltejs/kit';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;

	if (!code || !state || !storedState || !codeVerifier) {
		return new Response(null, {
			status: 400
		});
	}

	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;

	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch {
		return new Response(null, {
			status: 400
		});
	}

	const claims: { sub: string; name: string } = decodeIdToken(tokens.idToken()) as {
		sub: string;
		name: string;
	};
	const googleUserId = claims.sub;
	const username = claims.name;

	const existingUser = await prisma.user.findFirst({
		where: {
			googleId: googleUserId as string
		}
	});

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event.cookies, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	const user = await prisma.user.create({
		data: {
			googleId: googleUserId,
			username
		}
	});

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event.cookies, sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
