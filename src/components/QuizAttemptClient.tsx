'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitAttempt } from '@/server/actions/assessment';

interface QuizAttemptClientProps {
  locale: string;
  assessment: any;
  attemptId: string;
}

export function QuizAttemptClient({ locale, assessment, attemptId }: QuizAttemptClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(assessment.timeLimitMins * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  // Timer logic
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionToggle = (questionId: string, optionId: string) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter(id => id !== optionId) };
      }
      // Assuming single select for now, but structure allows multi
      return { ...prev, [questionId]: [optionId] };
    });
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const result = await submitAttempt(attemptId, answers);
      router.push(`/dashboard/assessment/${assessment.id}/result/${result.id}`);
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
    }
  }, [answers, assessment.id, attemptId, router]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [handleSubmit, timeLeft]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border shadow-sm sticky top-20 z-30">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="h-6 w-6" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Remaining</p>
                <p className={cn(
                    "text-2xl font-black tabular-nums transition-colors",
                    timeLeft < 60 ? "text-destructive animate-pulse" : "text-slate-900"
                )}>
                    {formatTime(timeLeft)}
                </p>
            </div>
        </div>

        <div className="flex-1 max-w-xs space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }} 
                />
            </div>
        </div>

        <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white border-0 h-12 px-6 shadow-lg shadow-slate-200"
        >
            {isSubmitting ? 'Submitting...' : 'Finish Quiz'} <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Question Card */}
      <Card className="rounded-[2.5rem] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <CardHeader className="p-10 lg:p-14 space-y-6">
            <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {currentQuestion.type}
                </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                {locale === 'hi' ? (currentQuestion.questionHi || currentQuestion.questionEn) : currentQuestion.questionEn}
            </h2>
        </CardHeader>

        <CardContent className="p-10 lg:p-14 pt-0 space-y-4">
            {currentQuestion.options.map((option: any) => (
                <button
                    key={option.id}
                    onClick={() => handleOptionToggle(currentQuestion.id, option.id)}
                    className={cn(
                        "w-full flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all group",
                        answers[currentQuestion.id]?.includes(option.id)
                            ? "bg-primary/5 border-primary shadow-lg shadow-primary/10"
                            : "bg-white border-slate-100 hover:border-slate-200"
                    )}
                >
                    <div className={cn(
                        "h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all",
                        answers[currentQuestion.id]?.includes(option.id)
                            ? "bg-primary border-primary text-white"
                            : "bg-slate-50 border-slate-200 text-transparent"
                    )}>
                        <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className={cn(
                        "text-lg font-bold transition-colors",
                        answers[currentQuestion.id]?.includes(option.id) ? "text-primary" : "text-slate-600"
                    )}>
                        {locale === 'hi' ? (option.textHi || option.textEn) : option.textEn}
                    </span>
                </button>
            ))}
        </CardContent>

        <CardFooter className="p-10 lg:p-14 pt-0 flex items-center justify-between gap-4">
            <Button 
                variant="ghost" 
                size="lg"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="h-12 px-6 rounded-xl font-bold text-slate-500"
            >
                <ChevronLeft className="mr-2 h-5 w-5" /> Previous
            </Button>
            
            {currentQuestionIndex === assessment.questions.length - 1 ? (
                <Button 
                    size="lg"
                    onClick={handleSubmit}
                    className="h-12 px-10 rounded-xl premium-gradient text-white border-0 font-bold shadow-lg"
                >
                    Submit Quiz <Send className="ml-2 h-4 w-4" />
                </Button>
            ) : (
                <Button 
                    size="lg"
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="h-12 px-10 rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 border-0 font-bold"
                >
                    Next Question <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
            )}
        </CardFooter>
      </Card>

      {/* Safety Banner */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex gap-4">
        <AlertTriangle className="h-6 w-6 text-blue-600 shrink-0" />
        <p className="text-sm font-medium text-blue-800 leading-relaxed">
            Note: This assessment uses clinical scenarios to test your understanding of AI boundaries. 
            Select the most appropriate professional action based on clinical safety standards.
        </p>
      </div>
    </div>
  );
}
