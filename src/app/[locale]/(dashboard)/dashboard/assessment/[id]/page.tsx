import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAssessment } from '@/server/actions/assessment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlayCircle, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  ArrowLeft, 
  Award,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default async function AssessmentPage({ 
  params 
}: { 
  params: Promise<{ locale: string; id: string }> 
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  
  const assessment = await getAssessment(id);

  if (!assessment) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link 
          href={`/${locale}/dashboard/courses`}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/20 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assessment</span>
            <span className="text-sm font-bold text-slate-900">{assessment.type}</span>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
        <CardHeader className="p-12 pb-8 bg-slate-50 border-b space-y-6">
            <div className="bg-primary/10 text-primary p-3 rounded-2xl w-fit">
                <Award className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-2">
                    {locale === 'hi' ? (assessment.titleHi || assessment.titleEn) : assessment.titleEn}
                </h1>
                <p className="text-slate-500 font-medium">
                    {locale === 'hi' ? assessment.descriptionEn : assessment.descriptionEn}
                </p>
            </div>
            
            <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold">{assessment.timeLimitMins} Minutes</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold">{assessment.questions.length} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold">{assessment.passingScore}% to Pass</span>
                </div>
            </div>
        </CardHeader>
        
        <CardContent className="p-12 space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Instructions</h3>
                <ul className="space-y-3">
                    {[
                        'Ensure you have a stable internet connection.',
                        'Once started, the timer cannot be paused.',
                        'Read each nursing scenario carefully before selecting options.',
                        'Each question may have one or more correct answers.',
                        'You can review your rationales after submitting the quiz.',
                    ].map((step, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 font-medium leading-relaxed">
                            <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black shrink-0">{i+1}</span>
                            {step}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
                <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
                <div>
                    <p className="text-sm font-bold text-amber-900 mb-1">Academic Integrity Policy</p>
                    <p className="text-xs text-amber-800 leading-relaxed">
                        By starting this assessment, you agree to complete it without unauthorized AI assistance or external help. 
                        AIFN monitors academic integrity to ensure your credentials remain valuable.
                    </p>
                </div>
            </div>
        </CardContent>

        <CardFooter className="p-12 pt-0">
            <Link href={`/${locale}/dashboard/assessment/${id}/attempt`} className="w-full">
                <Button size="lg" className="w-full h-16 rounded-2xl premium-gradient text-white border-0 shadow-2xl shadow-primary/30 font-black text-xl group">
                    Start Assessment Now <PlayCircle className="ml-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                </Button>
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
