// Functions used for sessions

import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import type { Session } from '@prisma/client';
import { prisma } from '$lib/prisma/index';
import type { Cookies } from '@sveltejs/kit';

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: number) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};

	await prisma.session.create({
		data: session
	});

	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const result = await prisma.session.findUnique({
		where: {
			id: sessionId
		},
		include: {
			user: true
		}
	});

	if (!result) {
		return { session: null, user: null };
	}

	const { user, ...session } = result;

	if (Date.now() >= session.expiresAt.getTime()) {
		await prisma.session.delete({ where: { id: sessionId } });
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await prisma.session.update({
			where: {
				id: session.id
			},
			data: {
				expiresAt: session.expiresAt
			}
		});
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string) {
	await prisma.session.delete({ where: { id: sessionId } });
}

export async function invalidateAllSessions(userId: number) {
	await prisma.session.deleteMany({
		where: {
			userId
		}
	});
}

// Functions used for cookie stuff

export async function setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date) {
	cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export async function deleteSessionTokenCookie(cookies: Cookies) {
	cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}
