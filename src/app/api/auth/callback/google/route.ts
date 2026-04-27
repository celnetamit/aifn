import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const rawState = searchParams.get('state');
  const locale = rawState === 'hi' ? 'hi' : 'en';

  if (!code) {
    return NextResponse.redirect(new URL(`/${locale}/login?error=no_code`, request.url));
  }

  try {
    // 1. Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      console.error('Google token exchange error:', tokens);
      return NextResponse.redirect(new URL(`/${locale}/login?error=token_exchange_failed`, request.url));
    }

    // 2. Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL(`/${locale}/login?error=no_email`, request.url));
    }

    // 3. Find or create user
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      // Create user if not exists
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          role: 'learner', // Default role
          passwordHash: hashPassword(crypto.randomBytes(16).toString('hex')), // Random password for social login
          preferredLocale: locale as any,
          isActive: true,
        },
      });

      // Create profile
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          learnerType: 'learner',
        }
      });
    }

    // 4. Create session and redirect
    const sessionToken = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      institutionId: user.institutionId,
      preferredLocale: user.preferredLocale as 'en' | 'hi',
    });

    // We can't use setSessionCookie directly here because it's for Server Actions/Components
    // We'll set the cookie manually in the response
    const response = NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    
    response.cookies.set('aifn_session', sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 12 * 60 * 60, // 12 hours
    });

    return response;

  } catch (error) {
    console.error('Google Auth Callback Error:', error);
    return NextResponse.redirect(new URL(`/${locale}/login?error=server_error`, request.url));
  }
}
