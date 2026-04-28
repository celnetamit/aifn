import { setRequestLocale } from 'next-intl/server';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/rbac';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { TokenBudgetRowActions } from '@/components/institution/TokenBudgetRowActions';

export default async function InstitutionTokensPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  if (!hasPermission(session.role, 'token:view')) {
    return <div className="p-12 text-center font-bold text-slate-500">You do not have access to this page.</div>;
  }
  const canManageBudgets = hasPermission(session.role, 'token:manage');

  const budgets = await prisma.aITokenBudget.findMany({
    where:
      session.role === 'institution_admin'
        ? {
            OR: [
              { institutionId: session.institutionId ?? '__none__' },
              { scopeType: 'global', scopeId: null },
            ],
          }
        : {},
    include: {
      institution: true,
    },
    orderBy: [{ scopeType: 'asc' }, { updatedAt: 'desc' }],
    take: 200,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Token Budgets</h1>
          <p className="text-slate-500 font-medium">Review AI token allocation, limits, and active scopes.</p>
        </div>
      </div>

      <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Scope</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Institution</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Daily Limit</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Limit</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {budgets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400 font-medium italic">
                      No token budgets configured.
                    </td>
                  </tr>
                ) : (
                  budgets.map((budget) => (
                    <tr key={budget.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{budget.scopeType}</p>
                        <p className="text-xs text-slate-400">{budget.scopeId ?? 'all'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {budget.institution?.name ?? 'Global'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">
                        {budget.dailyLimitTokens?.toLocaleString() ?? 'Not set'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">
                        {budget.monthlyLimitTokens?.toLocaleString() ?? 'Not set'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                            budget.isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {budget.isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <TokenBudgetRowActions
                          locale={locale}
                          budgetId={budget.id}
                          initialDailyLimitTokens={budget.dailyLimitTokens}
                          initialMonthlyLimitTokens={budget.monthlyLimitTokens}
                          initialIsEnabled={budget.isEnabled}
                          canManage={canManageBudgets}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
