import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Download, 
  Share2, 
  ShieldCheck,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { getEnrolledCourses } from '@/server/actions/courses';

export default async function CertificatesPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // We fetch courses and assume the completed ones are eligible for a certificate
  const enrolledCourses = await getEnrolledCourses();
  const completedCourses = enrolledCourses.filter((c: any) => c.progress?.percentage === 100);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">My Certificates</h1>
          <p className="text-slate-500 font-medium">View, download, and verify your earned nursing credentials.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
                type="text" 
                placeholder="Search certificates..." 
                className="h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all w-64"
            />
        </div>
      </div>

      {completedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {completedCourses.map((course: any) => (
                <Card key={course.id} className="rounded-[2rem] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden group">
                    <div className="h-48 bg-slate-900 relative p-8 flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
                        
                        <div className="relative z-10 flex items-start justify-between">
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                                <Award className="h-8 w-8 text-amber-400" />
                            </div>
                            <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-400 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/30">
                                <ShieldCheck className="h-4 w-4" /> INC Verified
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-white leading-tight mb-2">
                                {locale === 'hi' ? (course.titleHi || course.titleEn) : course.titleEn}
                            </h3>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                                Issued: {new Date().toLocaleDateString()} • ID: CERT-{course.id.substring(0, 8).toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <Button className="flex-1 h-12 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 border-0 shadow-lg shadow-slate-200">
                                <Download className="mr-2 h-4 w-4" /> Download PDF
                            </Button>
                            <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold text-slate-700 hover:text-primary hover:bg-primary/5">
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      ) : (
        <Card className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white">
            <CardContent className="p-16 text-center space-y-6">
                <div className="bg-slate-50 h-24 w-24 rounded-[2rem] mx-auto flex items-center justify-center">
                    <Award className="h-12 w-12 text-slate-300" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-2xl font-black text-slate-900">No Certificates Yet</h3>
                    <p className="text-slate-500 font-medium">Complete your enrolled courses to earn verified clinical certificates.</p>
                </div>
                <Link href="/dashboard/courses">
                    <Button className="h-12 px-8 rounded-xl font-bold bg-slate-900 text-white">Continue Learning</Button>
                </Link>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
