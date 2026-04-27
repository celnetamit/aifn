import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, Zap, Clock, ArrowRight, PlayCircle, GraduationCap } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getEnrolledCourses } from '@/server/actions/courses';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {

  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const session = await getSession();
  if (!session) redirect('/login');
  // @ts-ignore - session is checked above
  const userSession = session;
  const enrolledCourses = await getEnrolledCourses();
  
  // Calculate total stats
  const ongoingCount = enrolledCourses.filter((c: any) => c.progress.percentage < 100).length;
  const completedCount = enrolledCourses.filter((c: any) => c.progress.percentage === 100).length;
  
  // Get the most recent course to highlight
  const latestCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">
            {t('dashboard.welcome', { name: userSession.name })}
          </h1>
          <p className="text-slate-500 font-medium">Here is what is happening with your learning today.</p>
        </div>
        <div className="flex items-center gap-3">
            <Card className="bg-emerald-50 border-emerald-100 flex items-center gap-3 px-4 py-2 rounded-2xl shadow-none">
                <div className="bg-emerald-500 p-1.5 rounded-lg">
                    <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 leading-none mb-1">Tokens</p>
                    <p className="text-sm font-bold text-emerald-700 leading-none">4,850 / 5,000</p>
                </div>
            </Card>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-50 p-2.5 rounded-2xl">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Ongoing</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{ongoingCount}</h3>
                <p className="text-sm font-bold text-slate-500">{t('dashboard.my_courses')}</p>
            </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-emerald-50 p-2.5 rounded-2xl">
                        <Award className="h-6 w-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Earned</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{completedCount}</h3>
                <p className="text-sm font-bold text-slate-500">{t('dashboard.certificates')}</p>
            </CardContent>
        </Card>
        <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-50 p-2.5 rounded-2xl">
                        <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Time</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">12.5h</h3>
                <p className="text-sm font-bold text-slate-500">Learning Hours</p>
            </CardContent>
        </Card>
        <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-amber-50 p-2.5 rounded-2xl">
                        <Zap className="h-6 w-6 text-amber-600" />
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Streak</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">5</h3>
                <p className="text-sm font-bold text-slate-500">Day Streak</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">{t('dashboard.continue_learning')}</h2>
                <Link href={`/${locale}/dashboard/courses`} className="text-sm font-bold text-primary hover:underline">View All</Link>
            </div>
            

            {latestCourse ? (
                <Card className="rounded-3xl border-0 shadow-sm overflow-hidden group">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                        <div className="md:w-1/3 aspect-video md:aspect-auto bg-slate-200 relative">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayCircle className="h-12 w-12 text-white fill-white/20" />
                            </div>
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                                        {latestCourse.track?.titleEn || 'Foundation'}
                                    </span>
                                    <span className="text-slate-400 text-[10px] font-bold">
                                        Progress: {latestCourse.progress.completed} / {latestCourse.progress.total}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">
                                    {locale === 'hi' ? (latestCourse.titleHi || latestCourse.titleEn) : latestCourse.titleEn}
                                </h3>
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                                    {locale === 'hi' ? (latestCourse.summaryHi || latestCourse.summaryEn) : latestCourse.summaryEn}
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold mb-1">
                                    <span className="text-slate-400">Course Progress</span>
                                    <span className="text-slate-900">{latestCourse.progress.percentage}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary rounded-full transition-all duration-1000" 
                                        style={{ width: `${latestCourse.progress.percentage}%` }} 
                                    />
                                </div>
                                <Link href={`/dashboard/courses/${latestCourse.slug}`}>
                                    <Button className="w-full mt-4 h-11 font-bold rounded-xl premium-gradient text-white border-0 shadow-lg shadow-primary/20">
                                        Resume Learning <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="rounded-3xl border-2 border-dashed border-slate-200 bg-white">
                    <CardContent className="p-12 text-center space-y-6">
                        <div className="bg-slate-50 h-16 w-16 rounded-3xl mx-auto flex items-center justify-center">
                            <GraduationCap className="h-8 w-8 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900">No active courses yet</h3>
                            <p className="text-slate-500 font-medium">Explore the catalog to start your AI learning journey.</p>
                        </div>
                        <Link href="/courses">
                            <Button className="h-12 px-8 rounded-xl font-bold bg-slate-900 text-white">Browse Courses</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>

        {/* AI Quota & Tips */}
        <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">AI Tutor Status</h2>
            <Card className="rounded-3xl border-0 shadow-sm bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                <CardHeader className="relative z-10 pb-0">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
                        Daily Quota
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-6 relative z-10">
                    <div className="flex items-end gap-1 mb-8">
                        <span className="text-5xl font-black">4.8k</span>
                        <span className="text-slate-400 text-sm font-bold mb-1.5">/ 5,000 tokens</span>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Remaining</span>
                                <span className="text-emerald-400">97% Available</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '97%' }} />
                            </div>
                        </div>
                        
                        <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-primary/50 pl-4 py-1">
                            "Pro-tip: Use specific nursing scenarios for better AI tutor rationales."
                        </p>
                        
                        <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl font-bold h-10 transition-all">
                            Chat with AI Tutor
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
