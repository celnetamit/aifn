import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getCourseBySlug, getCourseProgress, getLessonProgress } from '@/server/actions/courses';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/auth';
import { Link } from '@/i18n/navigation';
import { redirect } from 'next/navigation';
import { 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ArrowLeft, 
  ChevronRight,
  FileText,
  Video,
  Lock,
  Users,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function CourseDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const session = await getSession();
  if (!session) redirect('/login');

  const progress = await getCourseProgress(course.id);
  
  // Fetch all completed lesson IDs for this course
  const userProgress = await Promise.all(
    course.modules.flatMap((m: any) => m.lessons).map(async (l: any) => {
        const p = await getLessonProgress(l.id);
        return p?.isCompleted ? l.id : null;
    })
  );
  const completedLessonIds = new Set(userProgress.filter((id): id is string => id !== null));

  const totalLessons = course.modules.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0);
  
  // Find first uncompleted lesson to "Start Learning"
  let firstUncompletedLesson = null;
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (!completedLessonIds.has(lesson.id)) {
        firstUncompletedLesson = { moduleSlug: module.slug, lessonSlug: lesson.slug };
        break;
      }
    }
    if (firstUncompletedLesson) break;
  }
  
  // Default to first lesson if all completed
  if (!firstUncompletedLesson && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
    firstUncompletedLesson = { moduleSlug: course.modules[0].slug, lessonSlug: course.modules[0].lessons[0].slug };
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-4">
        <Link 
          href={`/${locale}/dashboard/courses`}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/20 transition-all group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course Detail</span>
            <span className="text-sm font-bold text-slate-900">{course.track?.titleEn}</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden min-h-[400px] flex items-end p-8 lg:p-12">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10" />
        {/* Placeholder for Hero Image */}
        <div className="absolute inset-0 bg-slate-800 opacity-50" />
        
        <div className="relative z-20 w-full flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                        {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-white/60 text-xs font-bold flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {course.estimatedHours} Hours total
                    </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                    {locale === 'hi' ? (course.titleHi || course.titleEn) : course.titleEn}
                </h1>
                <p className="text-white/70 text-lg leading-relaxed mb-0">
                    {locale === 'hi' ? (course.descriptionHi || course.descriptionEn) : course.descriptionEn}
                </p>
            </div>
            

            <div className="shrink-0 flex flex-col gap-4">
                {firstUncompletedLesson && (
                    <Link href={`/dashboard/courses/${slug}/${firstUncompletedLesson.moduleSlug}/${firstUncompletedLesson.lessonSlug}`}>
                        <Button size="lg" className="h-14 px-8 rounded-2xl premium-gradient text-white border-0 shadow-2xl shadow-primary/40 font-black text-lg group w-full">
                            {progress.percentage > 0 ? 'Continue Learning' : 'Start Learning'} <PlayCircle className="ml-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                        </Button>
                    </Link>
                )}
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
        <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-black text-slate-900">Course Syllabus</h2>
            
            <div className="space-y-6">
                {course.modules.map((module: any, mIdx: number) => (
                    <div key={module.id} className="relative">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                                {mIdx + 1}
                            </div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                {locale === 'hi' ? (module.titleHi || module.titleEn) : module.titleEn}
                            </h3>
                        </div>
                        
                        <div className="ml-4 pl-8 border-l-2 border-slate-100 space-y-4">
                            {module.lessons.map((lesson: any, lIdx: number) => (
                                <Link 
                                    key={lesson.id} 
                                    href={`/${locale}/dashboard/courses/${slug}/${module.slug}/${lesson.slug}`}
                                    className="group block"
                                >
                                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/10 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                    {locale === 'hi' ? (lesson.titleHi || lesson.titleEn) : lesson.titleEn}
                                                </h4>

                                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lesson.estimatedMinutes} Mins</span>
                                                    {completedLessonIds.has(lesson.id) && (
                                                        <span className="text-emerald-500 flex items-center gap-1">
                                                            <CheckCircle2 className="h-3 w-3" /> Completed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
            <Card className="rounded-[2rem] border-0 shadow-lg shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b p-8">
                    <CardTitle className="text-xl font-black">Course Information</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</p>
                                <p className="text-sm font-bold text-slate-900">Foundational</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificate</p>
                                <p className="text-sm font-bold text-slate-900">INC Standard QR Verified</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access</p>
                                <p className="text-sm font-bold text-slate-900">Lifetime for Professionals</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Instructor</h4>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm" />
                            <div>
                                <p className="text-sm font-black text-slate-900 leading-tight">Dr. Priya Sharma</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Educator, AIFN</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-0 shadow-lg shadow-slate-200/50 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                <CardContent className="p-8 relative z-10 space-y-6">
                    <div className="bg-primary/20 p-2.5 rounded-2xl w-fit">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black mb-2 leading-tight">Need help with this course?</h4>
                        <p className="text-white/60 text-sm font-medium">Ask our AI Tutor for instant explanations, nursing rationales, and study tips.</p>
                    </div>
                    <Button className="w-full h-11 font-bold rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-all">
                        Launch AI Tutor
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
