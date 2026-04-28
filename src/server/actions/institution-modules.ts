'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { hasPermission, type Role } from '@/lib/rbac';
import { revalidatePath } from 'next/cache';

type AdminSession = {
  id: string;
  role: Role;
  institutionId: string | null;
};

function canManageInstitutionScopedData(session: AdminSession, institutionId: string | null) {
  if (session.role === 'super_admin' || session.role === 'admin') return true;
  if (session.role === 'institution_admin') {
    return Boolean(session.institutionId && institutionId && session.institutionId === institutionId);
  }
  return false;
}

async function requireAdminPermission(permission: Parameters<typeof hasPermission>[1]) {
  const session = await requireSession();
  if (!hasPermission(session.role, permission)) {
    throw new Error('PERMISSION_DENIED');
  }
  return session;
}

function csvEscape(value: string | number | null | undefined) {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function createAdminCourse(
  locale: string,
  payload: {
    titleEn: string;
    slug: string;
    summaryEn?: string;
    estimatedHours?: number | null;
    isPublished?: boolean;
  }
) {
  const session = await requireAdminPermission('course:write');

  const titleEn = payload.titleEn.trim();
  const slug = payload.slug.trim().toLowerCase();
  if (!titleEn || !slug) return { error: 'Title and slug are required.' };

  const existing = await prisma.course.findUnique({ where: { slug } });
  if (existing) return { error: 'Slug already exists.' };

  const shouldPublish = Boolean(payload.isPublished);
  const course = await prisma.course.create({
    data: {
      titleEn,
      slug,
      summaryEn: payload.summaryEn?.trim() || null,
      estimatedHours: payload.estimatedHours ?? null,
      status: shouldPublish ? 'published' : 'draft',
      isPublished: shouldPublish,
      publishedAt: shouldPublish ? new Date() : null,
      createdBy: session.id,
      updatedBy: session.id,
    },
  });

  await prisma.adminAuditLog.create({
    data: {
      userId: session.id,
      action: 'course:create',
      entityType: 'course',
      entityId: course.id,
      details: { slug: course.slug, titleEn: course.titleEn, isPublished: shouldPublish },
    },
  });

  revalidatePath(`/${locale}/dashboard/institution/courses`);
  revalidatePath('/en/courses');
  revalidatePath('/hi/courses');
  return { success: true };
}

export async function updateAdminCourse(
  locale: string,
  courseId: string,
  payload: {
    titleEn: string;
    summaryEn?: string;
    estimatedHours?: number | null;
  }
) {
  const session = await requireAdminPermission('course:write');
  const titleEn = payload.titleEn.trim();
  if (!titleEn) return { error: 'Title is required.' };

  const existing = await prisma.course.findUnique({ where: { id: courseId } });
  if (!existing) return { error: 'Course not found.' };

  await prisma.course.update({
    where: { id: courseId },
    data: {
      titleEn,
      summaryEn: payload.summaryEn?.trim() || null,
      estimatedHours: payload.estimatedHours ?? null,
      updatedBy: session.id,
    },
  });

  await prisma.adminAuditLog.create({
    data: {
      userId: session.id,
      action: 'course:update',
      entityType: 'course',
      entityId: courseId,
      details: { titleEn },
    },
  });

  revalidatePath(`/${locale}/dashboard/institution/courses`);
  if (existing.slug) {
    revalidatePath(`/en/courses/${existing.slug}`);
    revalidatePath(`/hi/courses/${existing.slug}`);
  }
  return { success: true };
}

export async function setAdminCoursePublished(
  locale: string,
  courseId: string,
  isPublished: boolean
) {
  const session = await requireAdminPermission('course:publish');

  const existing = await prisma.course.findUnique({ where: { id: courseId } });
  if (!existing) return { error: 'Course not found.' };

  await prisma.course.update({
    where: { id: courseId },
    data: {
      isPublished,
      status: isPublished ? 'published' : 'draft',
      publishedAt: isPublished ? new Date() : null,
      updatedBy: session.id,
    },
  });

  await prisma.adminAuditLog.create({
    data: {
      userId: session.id,
      action: isPublished ? 'course:publish' : 'course:unpublish',
      entityType: 'course',
      entityId: courseId,
      details: { slug: existing.slug },
    },
  });

  revalidatePath(`/${locale}/dashboard/institution/courses`);
  revalidatePath('/en/courses');
  revalidatePath('/hi/courses');
  return { success: true };
}

export async function assignUserToCourse(locale: string, userId: string, courseId: string) {
  const session = await requireAdminPermission('user:manage');

  const [user, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, institutionId: true } }),
    prisma.course.findUnique({ where: { id: courseId }, select: { id: true, titleEn: true } }),
  ]);
  if (!user || !course) return { error: 'User or course not found.' };

  if (session.role === 'institution_admin' && user.institutionId !== session.institutionId) {
    return { error: 'Cannot enroll users outside your institution.' };
  }

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: { isActive: true, enrolledAt: new Date(), completedAt: null },
    create: { userId, courseId, isActive: true },
  });

  await prisma.adminAuditLog.create({
    data: {
      userId: session.id,
      action: 'enrollment:assign',
      entityType: 'enrollment',
      entityId: `${userId}:${courseId}`,
      details: { userId, courseId, courseTitle: course.titleEn },
    },
  });

  revalidatePath(`/${locale}/dashboard/institution/enrollments`);
  return { success: true };
}

export async function unassignUserFromCourse(locale: string, userId: string, courseId: string) {
  const session = await requireAdminPermission('user:manage');
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, institutionId: true },
  });
  if (!user) return { error: 'User not found.' };

  if (session.role === 'institution_admin' && user.institutionId !== session.institutionId) {
    return { error: 'Cannot unenroll users outside your institution.' };
  }

  await prisma.enrollment.deleteMany({
    where: { userId, courseId },
  });

  await prisma.adminAuditLog.create({
    data: {
      userId: session.id,
      action: 'enrollment:unassign',
      entityType: 'enrollment',
      entityId: `${userId}:${courseId}`,
      details: { userId, courseId },
    },
  });

  revalidatePath(`/${locale}/dashboard/institution/enrollments`);
  return { success: true };
}

export async function exportInvoicesCsv() {
  const session = await requireAdminPermission('payment:view');

  const payments = await prisma.payment.findMany({
    where:
      session.role === 'institution_admin'
        ? { subscription: { user: { institutionId: session.institutionId ?? '__none__' } } }
        : {},
    include: {
      subscription: {
        include: {
          user: { select: { name: true, email: true, institutionId: true } },
          package: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 2000,
  });

  const header = ['invoice_no', 'payment_id', 'order_id', 'status', 'amount_inr', 'date', 'user_name', 'user_email', 'package'];
  const rows = payments.map((payment) => {
    const invoiceNo = `INV-${payment.id.slice(0, 8).toUpperCase()}`;
    return [
      invoiceNo,
      payment.razorpayPaymentId ?? '',
      payment.razorpayOrderId ?? '',
      payment.status,
      payment.amountInr,
      payment.createdAt.toISOString(),
      payment.subscription.user?.name ?? '',
      payment.subscription.user?.email ?? '',
      payment.subscription.package?.name ?? '',
    ]
      .map((col) => csvEscape(col))
      .join(',');
  });

  return [header.join(','), ...rows].join('\n');
}

export async function issueAdminCertificate(
  locale: string,
  payload: {
    userId: string;
    courseId: string;
    score?: number | null;
    grade?: string | null;
    expiresAt?: string | null;
  }
) {
  const session = await requireAdminPermission('certificate:issue');
  const [user, course] = await Promise.all([
    prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, institutionId: true },
    }),
    prisma.course.findUnique({
      where: { id: payload.courseId },
      select: { id: true, titleEn: true, titleHi: true },
    }),
  ]);
  if (!user || !course) return { error: 'User or course not found.' };

  if (!canManageInstitutionScopedData(session, user.institutionId)) {
    return { error: 'You cannot issue certificates outside your scope.' };
  }

  const cert = await prisma.certificate.create({
    data: {
      userId: user.id,
      institutionId: user.institutionId,
      type: 'completion',
      recipientName: user.name,
      courseName: course.titleEn,
      courseNameHi: course.titleHi ?? null,
      score: payload.score ?? null,
      grade: payload.grade?.trim() || null,
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
      qrPayload: `CERT-${Date.now()}-${user.id.slice(0, 6)}`,
    },
  });

  await prisma.adminAuditLog.create({
    data: {
      userId: session.id,
      action: 'certificate:issue',
      entityType: 'certificate',
      entityId: cert.id,
      details: { userId: user.id, courseId: course.id, courseName: course.titleEn },
    },
  });

  revalidatePath(`/${locale}/dashboard/institution/certificates`);
  revalidatePath(`/${locale}/dashboard/certificates`);
  return { success: true, certificateId: cert.certificateId };
}

export async function revokeAdminCertificate(locale: string, certificateId: string, reason: string) {
  const session = await requireAdminPermission('certificate:revoke');
  const cert = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: { user: { select: { institutionId: true } } },
  });
  if (!cert) return { error: 'Certificate not found.' };

  if (!canManageInstitutionScopedData(session, cert.user.institutionId)) {
    return { error: 'You cannot revoke certificates outside your scope.' };
  }

  await prisma.certificate.update({
    where: { id: certificateId },
    data: {
      isRevoked: true,
      revokedReason: reason.trim() || 'Revoked by admin',
      revokedAt: new Date(),
    },
  });

  await prisma.adminAuditLog.create({
    data: {
      userId: session.id,
      action: 'certificate:revoke',
      entityType: 'certificate',
      entityId: certificateId,
      details: { reason },
    },
  });

  revalidatePath(`/${locale}/dashboard/institution/certificates`);
  revalidatePath(`/${locale}/dashboard/certificates`);
  return { success: true };
}

export async function verifyCertificateByPublicId(publicCertificateId: string) {
  const session = await requireAdminPermission('certificate:view');
  const cert = await prisma.certificate.findUnique({
    where: { certificateId: publicCertificateId.trim() },
    include: { user: { select: { institutionId: true } } },
  });
  if (!cert) return { error: 'Certificate not found.' };

  if (!canManageInstitutionScopedData(session, cert.user.institutionId)) {
    return { error: 'You cannot verify certificates outside your scope.' };
  }

  return {
    success: true,
    certificate: {
      id: cert.id,
      certificateId: cert.certificateId,
      recipientName: cert.recipientName,
      courseName: cert.courseName,
      issuedAt: cert.issuedAt.toISOString(),
      isRevoked: cert.isRevoked,
      revokedReason: cert.revokedReason,
    },
  };
}

export async function downloadCertificateText(certificateId: string) {
  const session = await requireAdminPermission('certificate:view');
  const cert = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: { user: { select: { institutionId: true, email: true } } },
  });
  if (!cert) return { error: 'Certificate not found.' };

  if (!canManageInstitutionScopedData(session, cert.user.institutionId)) {
    return { error: 'You cannot download certificates outside your scope.' };
  }

  const body = [
    'AI for Nurses India - Certificate Record',
    `Certificate ID: ${cert.certificateId}`,
    `Recipient: ${cert.recipientName}`,
    `Recipient Email: ${cert.user.email}`,
    `Course: ${cert.courseName}`,
    `Issued At: ${cert.issuedAt.toISOString()}`,
    `Status: ${cert.isRevoked ? 'REVOKED' : 'ACTIVE'}`,
    `Revocation Reason: ${cert.revokedReason ?? ''}`,
  ].join('\n');

  return { success: true, filename: `certificate-${cert.certificateId}.txt`, content: body };
}

