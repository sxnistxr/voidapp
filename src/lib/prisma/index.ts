import {
	// BASE_ADRESS,
	// CALLBACK_ROUTE,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
	// HTTPS
} from '$env/static/private';
import { PrismaClient } from '@prisma/client';
import { Google } from 'arctic';

export const prisma = new PrismaClient();
export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	`http://localhost:5173/auth/login/google/callback`
);
