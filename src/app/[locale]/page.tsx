import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ArrowRight, BookOpen, ShieldCheck, GraduationCap, Users } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { FadeIn } from '@/components/ui/fade-in';
import { getSession } from '@/lib/auth';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const session = await getSession();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md" role="banner">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <div className="bg-primary p-1.5 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              AI for Nurses <span className="text-primary">India</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.courses')}
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.pricing')}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {session ? (
              <Link href="/dashboard">
                <Button size="sm" className="premium-gradient text-white border-0">
                  {t('nav.dashboard')}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="premium-gradient text-white border-0">
                    {t('nav.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(59,130,246,0.1)_0%,rgba(255,255,255,0)_100%)]" />
          <div className="container relative text-center">
            <FadeIn>
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8">
                <span className="mr-2">✨</span> {t('hero.badge')}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.1]">
                {t('hero.title')}
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 text-base font-bold premium-gradient text-white border-0 rounded-xl shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-0.5">
                    {t('hero.cta_primary')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base font-bold rounded-xl border-2 hover:bg-slate-50 transition-all">
                    {t('hero.cta_secondary')}
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Hero Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-slate-900">10k+</span>
                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">{t('hero.stats_learners')}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-slate-900">24+</span>
                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">{t('hero.stats_courses')}</span>
              </div>
              <div className="hidden md:flex flex-col gap-1">
                <span className="text-3xl font-black text-slate-900">50+</span>
                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">{t('hero.stats_institutions')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Notice Banner */}
        <div className="bg-amber-50 border-y border-amber-100 py-3">
          <div className="container flex items-center justify-center gap-3 text-sm font-medium text-amber-800">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <p>{t('safety.notice')}</p>
          </div>
        </div>

        {/* Featured Courses Preview */}
        <section className="py-24 bg-slate-50" aria-labelledby="featured-courses-heading">
          <div className="container">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h2 id="featured-courses-heading" className="text-3xl lg:text-4xl font-black tracking-tight mb-4">{t('courses.title')}</h2>
                  <p className="text-slate-600 max-w-xl">{t('courses.subtitle')}</p>
                </div>
                <Link href="/courses" className="text-sm font-bold text-primary hover:text-primary/80 group">
                  {t('courses.view_all')} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="group bg-white rounded-3xl border shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                    <div className="aspect-video bg-slate-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <span className="text-white font-bold text-sm">{t('courses.enroll')}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                          {t('courses.free')}
                        </span>
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                          {t('courses.certificate')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {i === 1 ? 'AI Awareness for Nursing Students' : i === 2 ? 'AI for Nursing Faculty' : 'AI for Postgraduate Research'}
                      </h3>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                        Master the basics of Generative AI, chatbots, and safe practice boundaries.
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t">
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> 5 {t('courses.modules')}</span>
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 4 {t('courses.hours')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="container grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                AI for Nurses <span className="text-primary">India</span>
              </span>
            </div>
            <p className="max-w-sm mb-8 leading-relaxed">
              Empowering Indian nurses with safe, evidence-based AI literacy to enhance education and clinical productivity.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">{t('nav.courses')}</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/dashboard/courses" className="hover:text-white transition-colors">Foundation Track</Link></li>
              <li><Link href="/dashboard/courses" className="hover:text-white transition-colors">Faculty Track</Link></li>
              <li><Link href="/dashboard/courses" className="hover:text-white transition-colors">Clinical Track</Link></li>
              <li><Link href="/dashboard/courses" className="hover:text-white transition-colors">Research Track</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Legal & Safety</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Safety Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">DPDP Compliance</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mt-16 pt-8 border-t border-slate-800 text-xs text-center flex flex-col md:flex-row justify-between gap-4">
          <p>© 2026 AI for Nurses India. All rights reserved.</p>
          <p>Designed for the Indian Nursing Excellence ecosystem.</p>
        </div>
      </footer>
    </div>
  );
}
