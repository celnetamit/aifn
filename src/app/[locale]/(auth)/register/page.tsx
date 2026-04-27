import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
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
          <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">
            The Hub for <span className="text-white/80">Nursing Innovation</span>.
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="bg-emerald-400/20 p-1 rounded-full border border-emerald-400/30 shrink-0">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold">Personalized Learning Paths</h4>
                <p className="text-white/70">Courses tailored for students, faculty, and practitioners.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-emerald-400/20 p-1 rounded-full border border-emerald-400/30 shrink-0">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold">AI Research Support</h4>
                <p className="text-white/70">Advanced tools for literature review and manuscript drafting.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-emerald-400/20 p-1 rounded-full border border-emerald-400/30 shrink-0">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold">Community & Mentoring</h4>
                <p className="text-white/70">Connect with expert nurse educators and mentors across India.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/50 relative z-10 font-medium">
          Supported by leading nursing institutions in India.
        </p>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50">
        <Card className="w-full max-w-lg rounded-3xl border-0 shadow-2xl shadow-slate-200/50">
          <CardHeader className="space-y-2 pb-8">
            <div className="flex items-center justify-between mb-4 md:hidden">
                <Link href={`/${locale}`} className="text-primary flex items-center gap-1 text-sm font-bold">
                    <ArrowLeft className="h-4 w-4" /> {t('common.back')}
                </Link>
            </div>
            <CardTitle className="text-3xl font-black tracking-tight">{t('auth.register_title')}</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Start your journey into AI-enhanced nursing education today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm locale={locale} />
            
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
              {t('auth.has_account')}{' '}
              <Link href={`/${locale}/login`} className="text-primary font-black hover:underline">
                {t('auth.login_btn')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
