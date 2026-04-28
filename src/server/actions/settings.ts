'use server';

import { prisma } from '@/lib/db';
import {
  requireSession,
  createSessionToken,
  setSessionCookie,
  hashPassword,
  verifyPassword,
} from '@/lib/auth';
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

export async function markAllNotificationsRead(locale: string): Promise<UpdateSettingsResult> {
  const session = await requireSession();

  await prisma.notification.updateMany({
    where: { userId: session.id, isRead: false },
    data: { isRead: true },
  });

  await prisma.securityAuditLog.create({
    data: {
      eventType: 'notifications_marked_read',
      userId: session.id,
    },
  });

  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/dashboard/settings`);

  return { success: true, message: 'All notifications marked as read.' };
}

export async function updatePreferredLocaleSetting(
  locale: string,
  preferredLocale: 'en' | 'hi'
): Promise<UpdateSettingsResult> {
  const session = await requireSession();

  await prisma.user.update({
    where: { id: session.id },
    data: { preferredLocale },
  });

  const token = createSessionToken({
    id: session.id,
    email: session.email,
    name: session.name,
    role: session.role,
    institutionId: session.institutionId,
    preferredLocale,
  });
  await setSessionCookie(token);

  await prisma.securityAuditLog.create({
    data: {
      eventType: 'preferred_locale_updated',
      userId: session.id,
      details: { preferredLocale },
    },
  });

  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/dashboard/settings`);

  return { success: true, message: 'Language preference updated.' };
}

export async function changePassword(
  locale: string,
  payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
): Promise<UpdateSettingsResult> {
  const session = await requireSession();

  if (!payload.currentPassword || !payload.newPassword || !payload.confirmPassword) {
    return { error: 'All password fields are required.' };
  }
  if (payload.newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters.' };
  }
  if (payload.newPassword !== payload.confirmPassword) {
    return { error: 'New password and confirmation do not match.' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, passwordHash: true },
  });
  if (!user) return { error: 'User not found.' };

  if (!verifyPassword(payload.currentPassword, user.passwordHash)) {
    await prisma.securityAuditLog.create({
      data: {
        eventType: 'password_change_failed',
        userId: session.id,
      },
    });
    return { error: 'Current password is incorrect.' };
  }

  await prisma.user.update({
    where: { id: session.id },
    data: { passwordHash: hashPassword(payload.newPassword) },
  });

  await prisma.securityAuditLog.create({
    data: {
      eventType: 'password_changed',
      userId: session.id,
    },
  });

  revalidatePath(`/${locale}/dashboard/settings`);
  return { success: true, message: 'Password updated successfully.' };
}
