import { setRequestLocale } from 'next-intl/server';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/rbac';
import { Link2 } from 'lucide-react';
import { EnrollmentManager } from '@/components/institution/EnrollmentManager';

export default async function InstitutionEnrollmentMappingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  if (!hasPermission(session.role, 'user:manage')) {
    return <div className="p-12 text-center font-bold text-slate-500">You do not have access to enrollment mapping.</div>;
  }

  const userWhere =
    session.role === 'institution_admin'
      ? { institutionId: session.institutionId ?? '__none__' }
      : {};

  const [users, courses, enrollments] = await Promise.all([
    prisma.user.findMany({
      where: userWhere,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        institution: { select: { name: true } },
      },
      take: 300,
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { titleEn: 'asc' },
      select: { id: true, titleEn: true, slug: true },
      take: 300,
    }),
    prisma.enrollment.findMany({
      where: session.role === 'institution_admin' ? { user: { institutionId: session.institutionId ?? '__none__' } } : {},
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { titleEn: true } },
      },
      take: 500,
    }),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <Link2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">User-Course Mapping</h1>
          <p className="text-slate-500 font-medium">Manually assign or remove course access for users.</p>
        </div>
      </div>

      <EnrollmentManager
        locale={locale}
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          institutionName: u.institution?.name ?? 'Unassigned',
        }))}
        courses={courses}
        enrollments={enrollments.map((e) => ({
          id: e.id,
          userId: e.userId,
          courseId: e.courseId,
          userName: e.user.name,
          userEmail: e.user.email,
          courseTitle: e.course.titleEn,
          enrolledAt: e.enrolledAt.toLocaleString(),
        }))}
      />
    </div>
  );
}

