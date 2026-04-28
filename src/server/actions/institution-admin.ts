'use server';

import type { Role } from '@/lib/rbac';
import { hasPermission } from '@/lib/rbac';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const INSTITUTION_ADMIN_ASSIGNABLE_ROLES: Role[] = [
  'learner',
  'professional_nurse',
  'postgraduate_learner',
  'faculty',
  'mentor',
  'content_creator',
  'content_reviewer',
  'institution_admin',
];

function canManageUserInScope(
  actor: { role: Role; institutionId: string | null; id: string },
  target: { id: string; role: Role; institutionId: string | null }
) {
  if (actor.role === 'super_admin') return true;
  if (actor.role === 'admin') return target.role !== 'super_admin';
  if (actor.role === 'institution_admin') {
    if (!actor.institutionId || target.institutionId !== actor.institutionId) return false;
    return target.role !== 'admin' && target.role !== 'super_admin' && target.role !== 'finance_admin';
  }
  return false;
}

export async function updateInstitutionUserRole(locale: string, userId: string, nextRole: Role) {
  const session = await requireSession();
  if (!hasPermission(session.role, 'user:manage')) {
    return { error: 'Permission denied.' };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, institutionId: true },
  });
  if (!target) return { error: 'User not found.' };

  if (!canManageUserInScope(session, target)) {
    return { error: 'You cannot manage this user.' };
  }

  if (session.id === userId && nextRole !== session.role) {
    return { error: 'You cannot change your own role.' };
  }

  if (session.role === 'institution_admin' && !INSTITUTION_ADMIN_ASSIGNABLE_ROLES.includes(nextRole)) {
    return { error: 'Selected role is not allowed for institution admins.' };
  }

  if (session.role === 'admin' && nextRole === 'super_admin') {
    return { error: 'Only super admins can assign super admin role.' };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: nextRole },
  });

  await prisma.adminAuditLog.create({
    data: {
      userId: session.id,
      action: 'user:update_role',
      entityType: 'user',
      entityId: userId,
      details: { from: target.role, to: nextRole },
    },
  });

  revalidatePath(`/${locale}/dashboard/institution`);
  revalidatePath(`/${locale}/dashboard/institution/users`);
  return { success: true };
}

export async function setInstitutionUserActive(locale: string, userId: string, isActive: boolean) {
  const session = await requireSession();
  if (!hasPermission(session.role, 'user:manage')) {
    return { error: 'Permission denied.' };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, institutionId: true, isActive: true },
  });
  if (!target) return { error: 'User not found.' };

  if (!canManageUserInScope(session, target)) {
    return { error: 'You cannot manage this user.' };
  }

  if (session.id === userId && !isActive) {
    return { error: 'You cannot disable your own account.' };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  await prisma.adminAuditLog.create({
    data: {
      userId: session.id,
      action: isActive ? 'user:enable' : 'user:disable',
      entityType: 'user',
      entityId: userId,
      details: { previous: target.isActive, next: isActive },
    },
  });

  revalidatePath(`/${locale}/dashboard/institution`);
  revalidatePath(`/${locale}/dashboard/institution/users`);
  return { success: true };
}

export async function updateInstitutionTokenBudget(
  locale: string,
  budgetId: string,
  payload: { dailyLimitTokens: number | null; monthlyLimitTokens: number | null; isEnabled: boolean }
) {
  const session = await requireSession();
  if (!hasPermission(session.role, 'token:manage')) {
    return { error: 'Permission denied.' };
  }

  const budget = await prisma.aITokenBudget.findUnique({
    where: { id: budgetId },
    select: {
      id: true,
      scopeType: true,
      scopeId: true,
      institutionId: true,
      dailyLimitTokens: true,
      monthlyLimitTokens: true,
      isEnabled: true,
    },
  });
  if (!budget) return { error: 'Budget not found.' };

  if (session.role === 'institution_admin') {
    if (!session.institutionId || budget.institutionId !== session.institutionId) {
      return { error: 'You can only update budgets for your institution.' };
    }
  }

  const daily = payload.dailyLimitTokens;
  const monthly = payload.monthlyLimitTokens;
  if (daily !== null && daily < 0) return { error: 'Daily token limit must be 0 or more.' };
  if (monthly !== null && monthly < 0) return { error: 'Monthly token limit must be 0 or more.' };
  if (daily !== null && monthly !== null && daily > monthly) {
    return { error: 'Daily limit cannot exceed monthly limit.' };
  }

  await prisma.aITokenBudget.update({
    where: { id: budgetId },
    data: {
      dailyLimitTokens: daily,
      monthlyLimitTokens: monthly,
      isEnabled: payload.isEnabled,
      updatedBy: session.id,
    },
  });

  await prisma.adminAuditLog.create({
    data: {
      userId: session.id,
      action: 'token_budget:update',
      entityType: 'ai_token_budget',
      entityId: budgetId,
      details: {
        scopeType: budget.scopeType,
        scopeId: budget.scopeId,
        from: {
          dailyLimitTokens: budget.dailyLimitTokens,
          monthlyLimitTokens: budget.monthlyLimitTokens,
          isEnabled: budget.isEnabled,
        },
        to: payload,
      },
    },
  });

  revalidatePath(`/${locale}/dashboard/institution`);
  revalidatePath(`/${locale}/dashboard/institution/tokens`);
  return { success: true };
}

