'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Loader2, ArrowRight } from 'lucide-react';
import { enrollInCourse } from '@/server/actions/courses';
import { useRouter } from '@/i18n/navigation';
import { useToast } from '@/hooks/use-toast';

interface EnrollButtonProps {
  courseId: string;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  locale: string;
  variant?: 'primary' | 'sidebar';
}

export function EnrollButton({ courseId, isLoggedIn, isEnrolled, locale, variant = 'primary' }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAction = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (isEnrolled) {
      router.push('/dashboard'); // Or to the first lesson
      return;
    }

    setLoading(true);
    try {
      const result = await enrollInCourse(courseId);
      if (result.success) {
        toast({
          title: 'Successfully Enrolled!',
          description: 'You can now start learning.',
        });
        router.push('/dashboard');
      } else {
        toast({
          title: 'Enrollment Failed',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'sidebar') {
    return (
      <Button 
        onClick={handleAction}
        disabled={loading}
        className="w-full h-14 rounded-2xl premium-gradient text-white border-0 font-black shadow-lg shadow-primary/20"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isEnrolled ? (
          'Continue Learning'
        ) : (
          'Get Full Access'
        )}
      </Button>
    );
  }

  return (
    <Button 
      size="lg" 
      onClick={handleAction}
      disabled={loading}
      className="h-16 px-10 rounded-2xl premium-gradient text-white border-0 shadow-2xl shadow-primary/40 font-black text-lg group w-full"
    >
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : isEnrolled ? (
        <>Go to Dashboard <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" /></>
      ) : (
        <>Enroll Now <PlayCircle className="ml-2 h-6 w-6 group-hover:scale-110 transition-transform" /></>
      )}
    </Button>
  );
}
