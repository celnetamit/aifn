import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCourses } from '@/server/actions/courses';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, Search, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function CoursesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const courses = await getCourses();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Explore Courses</h1>
          <p className="text-slate-500 font-medium">Bilingual AI literacy and professional skills for nursing.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl font-bold h-10">
                <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search courses..." 
                    className="h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all w-64"
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {courses.map((course: any) => (
          <Link 
            key={course.id} 
            href={`/${locale}/dashboard/courses/${course.slug}`}
            className="group"
          >
            <Card className="rounded-3xl border-0 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden h-full flex flex-col">
              <div className="aspect-video bg-slate-200 relative overflow-hidden">
                {/* Thumbnail would go here */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg backdrop-blur-md">
                        {course.track?.titleEn || 'Foundation'}
                    </span>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {locale === 'hi' ? (course.titleHi || course.titleEn) : course.titleEn}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                        {locale === 'hi' ? (course.summaryHi || course.summaryEn) : course.summaryEn}
                    </p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> 
                        {course._count.modules} Modules
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> 
                        {course.estimatedHours}h
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg font-bold text-primary group-hover:bg-primary/5">
                    Start <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

