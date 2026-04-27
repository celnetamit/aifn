import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCourseBySlug, checkEnrollment } from '@/server/actions/courses';
import { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { EnrollButton } from '@/components/courses/EnrollButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = await getCourseBySlug(slug);
  
  if (!course) return { title: 'Course Not Found' };

  const title = locale === 'hi' ? (course.titleHi || course.titleEn) : course.titleEn;
  const description = locale === 'hi' ? (course.summaryHi || course.summaryEn) : course.summaryEn;

  return {
    title: title || undefined,
    description: description || undefined,
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      type: 'website',
    },
  };
}
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlayCircle, 
  Clock, 
  BookOpen, 
  ArrowLeft, 
  ChevronRight,
  FileText,
  Lock,
  Award,
  Users,
  ShieldCheck
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export default async function PublicCourseDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }


  const t = await getTranslations();
  const session = await getSession();
  const isEnrolled = await checkEnrollment(course.id);
  
  const totalLessons = course.modules.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Mini Navbar */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-black tracking-tight text-slate-900">AI for Nurses</span>
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="font-bold">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-bold">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="premium-gradient text-white border-0 font-bold px-6 rounded-xl shadow-lg">Join Now</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
          {/* Breadcrumbs & Back */}
          <div className="flex items-center gap-4">
            <Link 
              href="/courses"
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/20 transition-all group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course Preview</span>
                <span className="text-sm font-bold text-slate-900">{course.track?.titleEn}</span>
            </div>
          </div>

          {/* Hero Header */}
          <div className="relative rounded-[3rem] bg-slate-900 overflow-hidden min-h-[450px] flex items-end p-8 lg:p-16">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_50%)]" />
            
            <div className="relative z-20 w-full flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="bg-primary/20 border border-primary/30 px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase tracking-widest backdrop-blur-md">
                            Professional Track
                        </span>
                        <span className="text-white/60 text-xs font-bold flex items-center gap-1.5">
                            <Clock className="h-4 w-4" /> {course.estimatedHours} Hours total
                        </span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
                        {locale === 'hi' ? (course.titleHi || course.titleEn) : course.titleEn}
                    </h1>
                    <p className="text-white/70 text-lg lg:text-xl leading-relaxed mb-0 max-w-2xl">
                        {locale === 'hi' ? (course.summaryHi || course.summaryEn) : course.summaryEn}
                    </p>
                </div>
                

                <div className="shrink-0 flex flex-col gap-4">
                    <EnrollButton 
                      courseId={course.id} 
                      isLoggedIn={!!session} 
                      isEnrolled={isEnrolled} 
                      locale={locale} 
                    />
                    <div className="flex items-center justify-center gap-4 text-white/50 text-xs font-bold uppercase tracking-widest">
                        <span>{course.modules.length} Modules</span>
                        <span className="h-1 w-1 bg-white/20 rounded-full" />
                        <span>{totalLessons} Lessons</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Syllabus / Modules List */}
            <div className="lg:col-span-2 space-y-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-slate-900">What you'll learn</h2>
                </div>
                
                <div className="space-y-8">
                    {course.modules.map((module: any, mIdx: number) => (
                        <div key={module.id} className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-black">
                                    {String(mIdx + 1).padStart(2, '0')}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                    {locale === 'hi' ? (module.titleHi || module.titleEn) : module.titleEn}
                                </h3>
                            </div>
                            
                            <div className="ml-5 pl-10 border-l-2 border-slate-200/60 space-y-5">
                                {module.lessons.map((lesson: any, lIdx: number) => (
                                    <div 
                                        key={lesson.id} 
                                        className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/10 transition-all flex items-center justify-between group cursor-default"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 group-hover:text-primary transition-colors">
                                                    {locale === 'hi' ? (lesson.titleHi || lesson.titleEn) : lesson.titleEn}
                                                </h4>
                                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {lesson.estimatedMinutes} Mins</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest">
                                            <Lock className="h-4 w-4" /> Locked
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-8">
                <Card className="rounded-[2.5rem] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden sticky top-24">
                    <CardHeader className="bg-slate-50 border-b p-10">
                        <CardTitle className="text-xl font-black">Course Essentials</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-5">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eligibility</p>
                                    <p className="text-sm font-black text-slate-900">Nurses & Nursing Students</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certification</p>
                                    <p className="text-sm font-black text-slate-900">INC Aligned Certificate</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accreditation</p>
                                    <p className="text-sm font-black text-slate-900">Safe AI Practices Verified</p>
                                </div>
                            </div>
                        </div>


                        <div className="pt-8 border-t border-slate-100">
                            <EnrollButton 
                              courseId={course.id} 
                              isLoggedIn={!!session} 
                              isEnrolled={isEnrolled} 
                              locale={locale} 
                              variant="sidebar"
                            />
                            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
                                30-Day Money Back Guarantee
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
