import { setRequestLocale } from 'next-intl/server';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/rbac';
import { CreditCard } from 'lucide-react';
import { BillingTable } from '@/components/institution/BillingTable';

export default async function InstitutionBillingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  if (!hasPermission(session.role, 'payment:view')) {
    return <div className="p-12 text-center font-bold text-slate-500">You do not have access to billing.</div>;
  }

  const payments = await prisma.payment.findMany({
    where:
      session.role === 'institution_admin'
        ? { subscription: { user: { institutionId: session.institutionId ?? '__none__' } } }
        : {},
    include: {
      subscription: {
        include: {
          user: { select: { name: true, email: true } },
          package: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 1000,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Admin Billing</h1>
          <p className="text-slate-500 font-medium">Track payments and export invoice records.</p>
        </div>
      </div>

      <BillingTable
        payments={payments.map((p) => ({
          id: p.id,
          amountInr: p.amountInr,
          status: p.status,
          createdAt: p.createdAt.toLocaleString(),
          razorpayOrderId: p.razorpayOrderId,
          razorpayPaymentId: p.razorpayPaymentId,
          userName: p.subscription.user?.name ?? 'N/A',
          userEmail: p.subscription.user?.email ?? 'N/A',
          packageName: p.subscription.package?.name ?? 'N/A',
        }))}
      />
    </div>
  );
}

