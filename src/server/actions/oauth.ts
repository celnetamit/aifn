'use server';

export async function getGoogleAuthUrl(locale: string) {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const safeLocale = locale === 'hi' ? 'hi' : 'en';
  
  const options = {
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    state: safeLocale, // Pass locale in state to preserve it after callback
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}
