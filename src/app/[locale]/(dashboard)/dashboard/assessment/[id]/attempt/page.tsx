import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAssessment, createAttempt } from '@/server/actions/assessment';
import { QuizAttemptClient } from '@/components/QuizAttemptClient';

export default async function AssessmentAttemptPage({ 
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

  const attempt = await createAttempt(id);

  return (
    <QuizAttemptClient 
        locale={locale} 
        assessment={assessment} 
        attemptId={attempt.id} 
    />
  );
}
