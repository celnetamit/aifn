'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { completeLesson } from '@/server/actions/courses';
import { useRouter } from '@/i18n/navigation';
import { useToast } from '@/hooks/use-toast';

interface CompleteLessonButtonProps {
  lessonId: string;
  isCompleted: boolean;
}

export function CompleteLessonButton({ lessonId, isCompleted }: CompleteLessonButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleComplete = async () => {
    setLoading(true);
    try {
      const result = await completeLesson(lessonId);
      if (result.success) {
        toast({
          title: 'Lesson Completed!',
          description: 'Moving to the next section.',
        });
        if (result.nextUrl) {
          router.push(result.nextUrl);
        }
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            {isCompleted ? 'Lesson Completed' : 'Mark Lesson as'}
        </p>
        <Button 
            onClick={handleComplete}
            disabled={loading || isCompleted}
            size="lg" 
            className={`h-14 px-10 rounded-2xl font-black transition-all group ${
                isCompleted 
                ? 'bg-emerald-500 text-white cursor-default' 
                : 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200'
            }`}
        >
            {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : isCompleted ? (
                <><CheckCircle2 className="mr-2 h-5 w-5" /> Completed</>
            ) : (
                <><CheckCircle2 className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Complete & Next</>
            )}
        </Button>
    </div>
  );
}
