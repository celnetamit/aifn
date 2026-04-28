import { setRequestLocale } from 'next-intl/server';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/rbac';
import { BookOpen } from 'lucide-react';
import { CourseAdminPanel } from '@/components/institution/CourseAdminPanel';

export default async function InstitutionCoursesAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  if (!hasPermission(session.role, 'course:write')) {
    return <div className="p-12 text-center font-bold text-slate-500">You do not have access to course administration.</div>;
  }

  const courses = await prisma.course.findMany({
    orderBy: [{ updatedAt: 'desc' }],
    select: {
      id: true,
      slug: true,
      titleEn: true,
      summaryEn: true,
      estimatedHours: true,
      isPublished: true,
    },
    take: 300,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Course Admin</h1>
          <p className="text-slate-500 font-medium">Create, edit, and publish course catalog content.</p>
        </div>
      </div>

      <CourseAdminPanel locale={locale} courses={courses} />
    </div>
  );
}

