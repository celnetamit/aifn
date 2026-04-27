import { getSession } from '@/lib/auth';
import { redirect } from '@/i18n/navigation';

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect({ href: '/dashboard', locale });
  }

  return <>{children}</>;
}
