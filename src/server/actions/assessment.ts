'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getAssessment(id: string) {
  await requireSession();
  
  return await prisma.assessment.findUnique({
    where: { id },
    include: {
      questions: {
        include: { options: true },
        orderBy: { sortOrder: 'asc' },
      },
      lesson: {
        include: { module: { include: { course: true } } },
      },
    },
  });
}

export async function createAttempt(assessmentId: string) {
  const session = await requireSession();

  const attempt = await prisma.assessmentAttempt.create({
    data: {
      userId: session.id,
      assessmentId,
      startedAt: new Date(),
    },
  });

  return attempt;
}

export async function submitAttempt(attemptId: string, answers: Record<string, string[]>) {
  const session = await requireSession();

  const attempt = await prisma.assessmentAttempt.findUnique({
    where: { id: attemptId },
    include: { assessment: { include: { questions: { include: { options: true } } } } },
  });

  if (!attempt || attempt.userId !== session.id) {
    throw new Error('Unauthorized');
  }

  let correctCount = 0;
  const questionAnswers = [];

  for (const question of attempt.assessment.questions) {
    const selectedIds = answers[question.id] || [];
    const correctOptions = question.options.filter(o => o.isCorrect).map(o => o.id);
    
    // Check if correct (assuming simple exact match for now)
    const isCorrect = 
        selectedIds.length === correctOptions.length && 
        selectedIds.every(id => correctOptions.includes(id));

    if (isCorrect) correctCount++;

    questionAnswers.push({
      attemptId,
      questionId: question.id,
      selectedIds,
      isCorrect,
    });
  }

  const score = (correctCount / attempt.assessment.questions.length) * 100;
  const passed = score >= attempt.assessment.passingScore;

  // Save answers and update attempt
  await prisma.answer.createMany({ data: questionAnswers });
  
  const updatedAttempt = await prisma.assessmentAttempt.update({
    where: { id: attemptId },
    data: {
      score,
      passed,
      submittedAt: new Date(),
    },
  });

  // Log progress if linked to lesson
  if (attempt.assessment.lessonId && passed) {
    await prisma.progress.upsert({
        where: { userId_lessonId: { userId: session.id, lessonId: attempt.assessment.lessonId } },
        update: { isCompleted: true, completedAt: new Date() },
        create: { userId: session.id, lessonId: attempt.assessment.lessonId, isCompleted: true, completedAt: new Date() },
    });
  }

  revalidatePath('/en/dashboard');
  revalidatePath('/hi/dashboard');
  return updatedAttempt;
}

export async function getAttemptResult(attemptId: string) {
  const session = await requireSession();

  const attempt = await prisma.assessmentAttempt.findUnique({
    where: { id: attemptId },
    include: {
      assessment: {
        include: {
          questions: {
            include: {
              options: true,
              answers: { where: { attemptId } }
            }
          }
        }
      }
    }
  });

  if (!attempt || attempt.userId !== session.id) {
    throw new Error('Unauthorized');
  }

  return attempt;
}
