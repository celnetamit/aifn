import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getLessonBySlug, getCourseProgress, getLessonProgress } from '@/server/actions/courses';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompleteLessonButton } from '@/components/courses/CompleteLessonButton';
import { AIChat } from '@/components/AIChat';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  PlayCircle,
  FileText,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function LessonPlayerPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string; moduleSlug: string; lessonSlug: string }> 
}) {
  const { locale, slug, moduleSlug, lessonSlug } = await params;
  setRequestLocale(locale);
  
  const lesson = await getLessonBySlug(slug, moduleSlug, lessonSlug);

  if (!lesson) {
    notFound();
  }

  const progress = await getCourseProgress(lesson.module.courseId);
  const currentLessonProgress = await getLessonProgress(lesson.id);
  const isCompleted = !!currentLessonProgress?.isCompleted;

  const course = lesson.module.course;

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-120px)] animate-fade-in">
      {/* Left Column: Lesson Content */}
      <div className="flex-1 space-y-8">
        {/* Navigation / Top Bar */}
        <div className="flex items-center justify-between mb-8">
            <Link 
                href={`/${locale}/dashboard/courses/${slug}`}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors group"
            >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
                Back to Syllabus
            </Link>
            
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Module: {locale === 'hi' ? (lesson.module.titleHi || lesson.module.titleEn) : lesson.module.titleEn}
                </span>
            </div>
        </div>

        <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                {locale === 'hi' ? (lesson.titleHi || lesson.titleEn) : lesson.titleEn}
            </h1>
            <p className="text-slate-500 font-medium">
                {locale === 'hi' ? (lesson.summaryHi || lesson.summaryEn) : lesson.summaryEn}
            </p>
        </div>

        {/* Content Blocks Rendering */}
        <div className="space-y-12">
            {lesson.contentBlocks.length === 0 ? (
                <Card className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                    <CardContent className="p-12 text-center space-y-4">
                        <div className="bg-slate-200 h-12 w-12 rounded-2xl mx-auto flex items-center justify-center">
                            <FileText className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-bold">This lesson is currently being drafted.</p>
                    </CardContent>
                </Card>
            ) : (
                lesson.contentBlocks.map((block: any) => (
                    <div key={block.id} className="prose prose-slate max-w-none prose-headings:font-black prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-lg">
                        {/* 
                            This is where we'd render different block types 
                            For the prototype, I'm assuming contentJson has a 'html' or 'text' field
                        */}
                        <div dangerouslySetInnerHTML={{ __html: (block.contentJson as any).html || (block.contentJson as any).text || '' }} />
                    </div>
                ))
            )}
        </div>


        {/* Lesson Footer Navigation */}
        <div className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            {lesson.prevLesson ? (
                <Link href={`/${locale}/dashboard/courses/${slug}/${moduleSlug}/${lesson.prevLesson.slug}`}>
                    <Button variant="ghost" size="lg" className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:text-slate-900 group">
                        <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" /> Previous Lesson
                    </Button>
                </Link>
            ) : (
                <div className="w-[160px]" /> /* spacer */
            )}
            
            <CompleteLessonButton 
                lessonId={lesson.id} 
                isCompleted={isCompleted} 
            />

            {lesson.nextLesson ? (
                <Link href={`/${locale}/dashboard/courses/${slug}/${moduleSlug}/${lesson.nextLesson.slug}`}>
                    <Button variant="ghost" size="lg" className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:text-primary group">
                        Next Lesson <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            ) : (
                <div className="w-[160px]" /> /* spacer */
            )}
        </div>
      </div>

      {/* Right Column: AI Assistant & Resources Sidebar */}
      <div className="lg:w-80 shrink-0 space-y-8">
        {/* Course Progress Card */}
        <Card className="rounded-[2rem] border-0 shadow-lg shadow-slate-200/50 bg-white overflow-hidden">
            <CardContent className="p-8 space-y-6">

                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Progress</p>
                    <div className="flex items-end justify-between mb-3">
                        <span className="text-2xl font-black text-slate-900">{progress.completed} / {progress.total}</span>
                        <span className="text-sm font-bold text-primary">{progress.percentage}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000" 
                            style={{ width: `${progress.percentage}%` }} 
                        />
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* AI Tutor Integration */}
        <div className="w-full">
            <AIChat feature="lesson_tutor" />
        </div>


        {/* Lesson Resources */}
        <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Resources</h4>
            <div className="space-y-2">
                {[
                    { title: 'INC Guidelines PDF', type: 'doc' },
                    { title: 'Clinical Checklist', type: 'file' },
                ].map((res, i) => (
                    <button key={i} className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all text-left group">
                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-white transition-all">
                            <FileText className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{res.title}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
