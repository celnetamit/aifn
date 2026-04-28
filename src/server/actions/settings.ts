'use server';

import { prisma } from '@/lib/db';
import { requireSession, createSessionToken, setSessionCookie } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

type UpdateSettingsInput = {
  name: string;
  roleTitle: string;
  institutionName: string;
};

type UpdateSettingsResult = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function updateSettings(
  locale: string,
  payload: UpdateSettingsInput
): Promise<UpdateSettingsResult> {
  const session = await requireSession();

  const name = payload.name.trim();
  const roleTitle = payload.roleTitle.trim();
  const institutionName = payload.institutionName.trim();

  if (name.length < 2) {
    return { error: 'Name must be at least 2 characters.' };
  }

  if (name.length > 100) {
    return { error: 'Name is too long.' };
  }

  if (roleTitle.length > 120) {
    return { error: 'Role / Title is too long.' };
  }

  if (institutionName.length > 120) {
    return { error: 'Institution is too long.' };
  }

  await prisma.user.update({
    where: { id: session.id },
    data: { name },
  });

  await prisma.userProfile.upsert({
    where: { userId: session.id },
    create: {
      userId: session.id,
      learnerType: roleTitle || session.role,
      college: institutionName || null,
    },
    update: {
      learnerType: roleTitle || undefined,
      college: institutionName || null,
    },
  });

  const token = createSessionToken({
    id: session.id,
    email: session.email,
    name,
    role: session.role,
    institutionId: session.institutionId,
    preferredLocale: session.preferredLocale,
  });
  await setSessionCookie(token);

  await prisma.securityAuditLog.create({
    data: {
      eventType: 'settings_updated',
      userId: session.id,
      details: {
        updatedFields: ['name', 'profile.learnerType', 'profile.college'],
      },
    },
  });

  revalidatePath('/');
  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/dashboard/settings`);

  return { success: true, message: 'Settings saved successfully.' };
}

