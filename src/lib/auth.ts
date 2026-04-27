// Server-side auth utilities — HMAC session-based authentication.
// Do NOT import in client components.
import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import type { Role } from '@/lib/rbac';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  institutionId: string | null;
  preferredLocale: 'en' | 'hi';
  expiresAt: number;
}

const SESSION_COOKIE = 'aifn_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const getSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET environment variable is not set.');
  return secret;
};

const b64 = (input: string) => Buffer.from(input, 'utf8').toString('base64url');
const unb64 = (input: string) => Buffer.from(input, 'base64url').toString('utf8');
const sign = (value: string) =>
  crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');

export const createSessionToken = (user: Omit<SessionUser, 'expiresAt'>): string => {
  const payload: SessionUser = { ...user, expiresAt: Date.now() + SESSION_TTL_MS };
  const encodedPayload = b64(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
};

export const parseSessionToken = (token?: string | null): SessionUser | null => {
  if (!token) return null;
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1) return null;
  const encodedPayload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  if (!encodedPayload || !signature) return null;

  try {
    if (sign(encodedPayload) !== signature) return null;
    const payload = JSON.parse(unb64(encodedPayload)) as SessionUser;
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

export const getSession = async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  return parseSessionToken(cookieStore.get(SESSION_COOKIE)?.value ?? null);
};

export const requireSession = async (): Promise<SessionUser> => {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHENTICATED');
  return session;
};

export const setSessionCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
};

export const clearSessionCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' });
};

// Password hashing (use bcrypt in production; this is a dev-safe fallback)
export const hashPassword = (password: string): string =>
  crypto
    .createHash('sha256')
    .update(password + (process.env.AUTH_SECRET ?? 'aifn-seed-salt'))
    .digest('hex');

export const verifyPassword = (password: string, hash: string): boolean =>
  hashPassword(password) === hash;
