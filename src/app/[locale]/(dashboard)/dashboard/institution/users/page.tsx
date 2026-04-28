import { setRequestLocale } from 'next-intl/server';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { Role } from '@/lib/rbac';
import { hasPermission } from '@/lib/rbac';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { UserRowActions } from '@/components/institution/UserRowActions';

export default async function InstitutionUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireSession();
  if (!hasPermission(session.role, 'user:view')) {
    return <div className="p-12 text-center font-bold text-slate-500">You do not have access to this page.</div>;
  }
  const canManageUsers = hasPermission(session.role, 'user:manage');
  const baseAssignableRoles: Role[] =
    session.role === 'institution_admin'
      ? [
          'learner',
          'professional_nurse',
          'postgraduate_learner',
          'faculty',
          'mentor',
          'content_creator',
          'content_reviewer',
          'institution_admin',
        ]
      : session.role === 'admin'
      ? [
          'learner',
          'professional_nurse',
          'postgraduate_learner',
          'faculty',
          'mentor',
          'content_creator',
          'content_reviewer',
          'institution_admin',
          'finance_admin',
          'admin',
        ]
      : [
          'learner',
          'professional_nurse',
          'postgraduate_learner',
          'faculty',
          'mentor',
          'content_creator',
          'content_reviewer',
          'institution_admin',
          'finance_admin',
          'admin',
          'super_admin',
        ];

  const users = await prisma.user.findMany({
    where:
      session.role === 'institution_admin'
        ? { institutionId: session.institutionId ?? '__none__' }
        : {},
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      profile: true,
      institution: true,
    },
  });

  const canManageUserRow = (target: { id: string; role: Role; institutionId: string | null }) => {
    if (!canManageUsers) return false;
    if (session.role === 'super_admin') return true;
    if (session.role === 'admin') return target.role !== 'super_admin';
    if (session.role === 'institution_admin') {
      if (!session.institutionId || target.institutionId !== session.institutionId) return false;
      return target.role !== 'admin' && target.role !== 'super_admin' && target.role !== 'finance_admin';
    }
    return false;
  };

  const getAssignableRolesForUser = (target: { id: string; role: Role; institutionId: string | null }) => {
    if (!canManageUserRow(target)) return [] as Role[];
    if (target.id === session.id) return [target.role] as Role[];
    return baseAssignableRoles;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Users & Roles</h1>
          <p className="text-slate-500 font-medium">Manage your institution users and role visibility.</p>
        </div>
      </div>

      <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Institution</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400 font-medium italic">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.profile?.learnerType ?? 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase px-2 py-1 rounded">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {user.institution?.name ?? 'Unassigned'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                            user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const assignableRoles = getAssignableRolesForUser({
                            id: user.id,
                            role: user.role,
                            institutionId: user.institutionId,
                          });
                          return (
                        <UserRowActions
                          locale={locale}
                          userId={user.id}
                          currentRole={user.role}
                          isActive={user.isActive}
                          canManage={assignableRoles.length > 0}
                          isSelf={session.id === user.id}
                          assignableRoles={assignableRoles}
                        />
                          );
                        })()}
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
