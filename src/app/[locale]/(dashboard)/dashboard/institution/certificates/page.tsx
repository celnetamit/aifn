import { setRequestLocale } from 'next-intl/server';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/rbac';
import { Award } from 'lucide-react';
import { CertificateAdminPanel } from '@/components/institution/CertificateAdminPanel';

export default async function InstitutionCertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  if (!hasPermission(session.role, 'certificate:view')) {
    return <div className="p-12 text-center font-bold text-slate-500">You do not have access to certificates.</div>;
  }

  const userWhere =
    session.role === 'institution_admin'
      ? { institutionId: session.institutionId ?? '__none__' }
      : {};

  const certWhere =
    session.role === 'institution_admin'
      ? { user: { institutionId: session.institutionId ?? '__none__' } }
      : {};

  const [users, courses, certificates] = await Promise.all([
    prisma.user.findMany({
      where: userWhere,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, email: true },
      take: 300,
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { titleEn: 'asc' },
      select: { id: true, titleEn: true },
      take: 300,
    }),
    prisma.certificate.findMany({
      where: certWhere,
      orderBy: { issuedAt: 'desc' },
      select: {
        id: true,
        certificateId: true,
        recipientName: true,
        courseName: true,
        issuedAt: true,
        isRevoked: true,
        revokedReason: true,
      },
      take: 800,
    }),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Admin Certificates</h1>
          <p className="text-slate-500 font-medium">Issue, revoke, verify, and download certificates.</p>
        </div>
      </div>

      <CertificateAdminPanel
        locale={locale}
        users={users}
        courses={courses}
        certificates={certificates.map((c) => ({
          ...c,
          issuedAt: c.issuedAt.toLocaleString(),
        }))}
      />
    </div>
  );
}

