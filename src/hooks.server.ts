import { sequence } from '@sveltejs/kit/hooks';
import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '$lib/prisma/authUtil';

Sentry.init({
	dsn: 'https://a1ec0dbb12983c6043410a3b86e7c844@o4508846960476161.ingest.de.sentry.io/4508846973190224',

	tracesSampleRate: 1.0

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: import.meta.env.DEV,
});

export const handleAuth: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	if (!token) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session) {
		setSessionTokenCookie(event.cookies, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event.cookies);
	}

	event.locals.session = session;
	event.locals.user = user;

	return resolve(event);
};

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle(), handleAuth);

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
