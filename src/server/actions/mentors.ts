'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth';

export async function getMentors() {
  await requireSession();
  
  return await prisma.user.findMany({
    where: { role: 'mentor', isActive: true },
    include: {
      profile: true,
      mentorSessions: {
        where: { status: 'scheduled' }
      }
    }
  });
}

export async function bookMentorSession(mentorId: string, scheduledAt: Date) {
  const session = await requireSession();

  return await prisma.mentorshipSession.create({
    data: {
      mentorId,
      learnerId: session.id,
      scheduledAt,
      status: 'scheduled'
    }
  });
}
