import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCourses } from '@/server/actions/courses';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, Search, Filter, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function PublicCoursesPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const session = await getSession();

  const courses = await getCourses();

  return (
    <div className="flex flex-col min-h-screen">
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
                <Button size="sm" className="premium-gradient text-white border-0 font-bold px-6 rounded-xl shadow-lg">
                  Dashboard
                </Button>
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

      <main className="flex-1 py-16 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-1">Course Catalog</h1>
              <p className="text-slate-500 font-medium text-lg">Master AI literacy with our specialized nursing curriculum.</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search topics..." 
                        className="h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all w-72 shadow-sm"
                    />
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {courses.map((course: any) => (
              <Link 
                key={course.id} 
                href={`/courses/${course.slug}`}
                className="group"
              >
                <Card className="rounded-[2.5rem] border-0 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden h-full flex flex-col bg-white">
                  <div className="aspect-video bg-slate-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <span className="bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg backdrop-blur-md">
                            {course.track?.titleEn || 'Foundation'}
                        </span>
                    </div>
                  </div>
                  <CardContent className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {locale === 'hi' ? (course.titleHi || course.titleEn) : course.titleEn}
                        </h3>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-3">
                            {locale === 'hi' ? (course.summaryHi || course.summaryEn) : course.summaryEn}
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-5 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4 text-primary/50" /> 
                            {course._count.modules} Modules
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-primary/50" /> 
                            {course.estimatedHours}h
                        </span>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
             <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <h2 className="text-3xl lg:text-5xl font-black">Ready to start your AI journey?</h2>
                <p className="text-slate-400 text-lg">Join over 10,000 nursing professionals in India mastering ethical AI.</p>
                <div className="pt-6">
                    <Link href="/register">
                        <Button size="lg" className="h-14 px-10 text-lg font-bold premium-gradient text-white border-0 rounded-2xl shadow-xl shadow-primary/20">
                            Create Free Account
                        </Button>
                    </Link>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
