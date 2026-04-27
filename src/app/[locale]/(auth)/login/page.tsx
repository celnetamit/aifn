import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Branding & Info */}
      <div className="hidden md:flex md:w-1/2 premium-gradient p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <Link href={`/${locale}`} className="flex items-center gap-2 relative z-10">
          <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg border border-white/30">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            AI for Nurses <span className="text-white/70">India</span>
          </span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
            Advancing Nursing Through <span className="text-white/80">Ethical AI</span>.
          </h2>
          <p className="text-xl text-white/80 max-w-lg mb-12">
            Join thousands of nursing students and professionals mastering the future of healthcare technology.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2 rounded-full border border-white/30 shrink-0">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <p className="text-white/80 font-medium">Bilingual curriculum in English and Hindi.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2 rounded-full border border-white/30 shrink-0">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <p className="text-white/80 font-medium">INC-aligned educational standards.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2 rounded-full border border-white/30 shrink-0">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <p className="text-white/80 font-medium">Secure, patient-privacy first AI tools.</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/50 relative z-10 font-medium">
          © 2026 AI for Nurses India. Empowering the backbone of Indian healthcare.
        </p>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50">
        <Card className="w-full max-w-md rounded-3xl border-0 shadow-2xl shadow-slate-200/50">
          <CardHeader className="space-y-2 pb-8">
            <div className="flex items-center justify-between mb-4 md:hidden">
                <Link href={`/${locale}`} className="text-primary flex items-center gap-1 text-sm font-bold">
                    <ArrowLeft className="h-4 w-4" /> {t('common.back')}
                </Link>
            </div>
            <CardTitle className="text-3xl font-black tracking-tight">{t('auth.login_title')}</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm locale={locale} />
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold tracking-widest">{t('auth.or')}</span>
              </div>
            </div>

            <GoogleSignInButton locale={locale} text={t('auth.google_login')} />
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <p className="text-sm text-slate-500 font-medium">
              {t('auth.no_account')}{' '}
              <Link href={`/${locale}/register`} className="text-primary font-black hover:underline">
                {t('auth.register_btn')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
