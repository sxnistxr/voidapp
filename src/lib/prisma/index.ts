import { CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PrismaClient } from '@prisma/client';
import { Google } from 'arctic';

export const prisma = new PrismaClient();
export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALLBACK_URL);
