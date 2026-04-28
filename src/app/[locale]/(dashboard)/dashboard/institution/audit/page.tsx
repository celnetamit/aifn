import { setRequestLocale } from 'next-intl/server';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasPermission } from '@/lib/rbac';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default async function InstitutionAuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  if (!hasPermission(session.role, 'audit:view')) {
    return <div className="p-12 text-center font-bold text-slate-500">You do not have access to this page.</div>;
  }

  const auditLogs = await prisma.adminAuditLog.findMany({
    where:
      session.role === 'institution_admin'
        ? { user: { institutionId: session.institutionId ?? '__none__' } }
        : {},
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      user: true,
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Audit Logs</h1>
          <p className="text-slate-500 font-medium">Track administrative actions across users and entities.</p>
        </div>
      </div>

      <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-medium italic">
                      No audit activity found.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">
                        {log.createdAt.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{log.user.name}</p>
                        <p className="text-xs text-slate-400">{log.user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">{log.action}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase px-2 py-1 rounded">
                          {log.entityType ?? 'system'}
                        </span>
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

