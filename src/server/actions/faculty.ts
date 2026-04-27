'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { isFacultyOrAbove } from '@/lib/rbac';

export async function getFacultyStats() {
  const session = await requireSession();
  if (!isFacultyOrAbove(session.role)) throw new Error('Unauthorized');

  const institutionId = session.institutionId;

  // Fetch counts
  const totalStudents = await prisma.user.count({
    where: { institutionId, role: 'learner' }
  });

  const activeEnrollments = await prisma.enrollment.count({
    where: { user: { institutionId } }
  });

  const pendingReviews = await prisma.assignmentSubmission.count({
    where: { 
        user: { institutionId },
        grade: null 
    }
  });


  const completedAssessments = await prisma.assessmentAttempt.count({
    where: { user: { institutionId }, submittedAt: { not: null } }
  });

  return {
    totalStudents,
    activeEnrollments,
    pendingReviews,
    completedAssessments
  };
}

export async function getCohorts() {
  const session = await requireSession();
  if (!isFacultyOrAbove(session.role)) throw new Error('Unauthorized');

  // In this model, cohorts are just groups of users in an institution
  // We can group by specialization or college for now
  const cohorts = await prisma.user.groupBy({
    by: ['role'],
    where: { institutionId: session.institutionId },
    _count: { _all: true }
  });

  return cohorts;
}

export async function getPendingSubmissions() {
  const session = await requireSession();
  if (!isFacultyOrAbove(session.role)) throw new Error('Unauthorized');

  return await prisma.assignmentSubmission.findMany({
    where: { 
        grade: null,
        user: { institutionId: session.institutionId }
    },
    include: {
      user: true,
      assignment: true,
    },
    orderBy: { submittedAt: 'desc' }
  });
}
