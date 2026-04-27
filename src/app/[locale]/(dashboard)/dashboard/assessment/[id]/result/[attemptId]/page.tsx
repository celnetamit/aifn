import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAttemptResult } from '@/server/actions/assessment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  RefreshCcw, 
  ChevronRight,
  Info,
  Trophy,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function AssessmentResultPage({ 
  params 
}: { 
  params: Promise<{ locale: string; id: string; attemptId: string }> 
}) {
  const { locale, id, attemptId } = await params;
  setRequestLocale(locale);
  
  const attempt = await getAttemptResult(attemptId);

  if (!attempt) {
    notFound();
  }

  const isPassed = attempt.passed;
  const score = Math.round(attempt.score || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <Link 
          href={`/${locale}/dashboard/courses`}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Courses
        </Link>
        <div className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
            Completed on {attempt.submittedAt?.toLocaleDateString()}
        </div>
      </div>

      {/* Result Hero Card */}
      <Card className={cn(
        "rounded-[3rem] border-0 shadow-2xl overflow-hidden relative",
        isPassed 
            ? "bg-emerald-600 text-white shadow-emerald-200/50" 
            : "bg-slate-900 text-white shadow-slate-200/50"
      )}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <CardContent className="p-12 lg:p-20 text-center relative z-10 flex flex-col items-center">
            <div className={cn(
                "h-24 w-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl",
                isPassed ? "bg-white text-emerald-600" : "bg-white/10 text-white"
            )}>
                {isPassed ? <Trophy className="h-12 w-12" /> : <AlertCircle className="h-12 w-12" />}
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black mb-4 tracking-tight">
                {isPassed ? 'Congratulations!' : 'Keep Learning!'}
            </h1>
            <p className="text-lg lg:text-xl font-medium text-white/80 max-w-lg mb-12">
                {isPassed 
                    ? `You have successfully passed the assessment for "${attempt.assessment.titleEn}".`
                    : `You were close, but you need a score of ${attempt.assessment.passingScore}% to pass this assessment.`}
            </p>

            <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Your Score</p>
                    <p className="text-4xl font-black">{score}%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Status</p>
                    <p className="text-4xl font-black uppercase tracking-tight">{isPassed ? 'Pass' : 'Fail'}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-md">
                {isPassed ? (
                    <Button size="lg" className="flex-1 h-14 rounded-2xl bg-white text-emerald-700 hover:bg-white/90 font-black text-lg shadow-xl shadow-black/10 border-0">
                        View Certificate <Award className="ml-2 h-5 w-5" />
                    </Button>
                ) : (
                    <Link href={`/${locale}/dashboard/assessment/${id}/attempt`} className="flex-1">
                        <Button size="lg" className="w-full h-14 rounded-2xl bg-white text-slate-900 hover:bg-white/90 font-black text-lg shadow-xl shadow-black/10 border-0">
                            Retry Quiz <RefreshCcw className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                )}
            </div>
        </CardContent>
      </Card>

      {/* Review Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">Question Review & Rationales</h2>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Correct
                </span>
                <span className="flex items-center gap-1.5 text-destructive">
                    <XCircle className="h-4 w-4" /> Incorrect
                </span>
            </div>
        </div>

        <div className="space-y-6">
            {attempt.assessment.questions.map((question: any, idx: number) => {
                const answer = question.answers[0];
                const isCorrect = answer?.isCorrect;
                
                return (
                    <Card key={question.id} className="rounded-3xl border-0 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b p-8 flex flex-row items-start justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {idx + 1}</span>
                                    {isCorrect ? (
                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Correct</span>
                                    ) : (
                                        <span className="bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Incorrect</span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                    {locale === 'hi' ? (question.questionHi || question.questionEn) : question.questionEn}
                                </h3>
                            </div>
                            <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                isCorrect ? "bg-emerald-500 text-white" : "bg-destructive text-white"
                            )}>
                                {isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {/* Rationales */}
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
                                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-1">Expert Rationale</h4>
                                    <p className="text-sm font-medium text-blue-800 leading-relaxed">
                                        {locale === 'hi' ? (question.rationaleHi || question.rationaleEn) : question.rationaleEn}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Options Review */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Options Analysis</h4>
                                {question.options.map((opt: any) => {
                                    const wasSelected = answer?.selectedIds.includes(opt.id);
                                    const isCorrectOpt = opt.isCorrect;
                                    
                                    return (
                                        <div key={opt.id} className={cn(
                                            "p-4 rounded-xl text-sm font-bold flex items-center justify-between border-2",
                                            isCorrectOpt ? "bg-emerald-50/50 border-emerald-100 text-emerald-900" : 
                                            wasSelected && !isCorrectOpt ? "bg-destructive/5 border-destructive/10 text-destructive" :
                                            "bg-white border-slate-50 text-slate-500"
                                        )}>
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-5 w-5 rounded-md flex items-center justify-center border",
                                                    isCorrectOpt ? "bg-emerald-500 border-emerald-500 text-white" :
                                                    wasSelected ? "bg-destructive border-destructive text-white" :
                                                    "bg-white border-slate-200"
                                                )}>
                                                    {isCorrectOpt && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                    {!isCorrectOpt && wasSelected && <XCircle className="h-3.5 w-3.5" />}
                                                </div>
                                                {locale === 'hi' ? (opt.textHi || opt.textEn) : opt.textEn}
                                            </div>
                                            {isCorrectOpt && <span className="text-[10px] font-black uppercase text-emerald-600">Correct Answer</span>}
                                            {wasSelected && !isCorrectOpt && <span className="text-[10px] font-black uppercase text-destructive">Your Choice</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-12 text-center space-y-6">
        <h3 className="text-2xl font-black text-slate-900">What's next?</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 rounded-xl bg-slate-900 text-white font-bold border-0 shadow-lg group">
                Continue to Next Module <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl font-bold border-2 hover:bg-slate-50 transition-all">
                Download Scorecard
            </Button>
        </div>
      </div>
    </div>
  );
}
