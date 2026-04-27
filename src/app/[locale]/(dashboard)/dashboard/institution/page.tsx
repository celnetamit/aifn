import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Settings, 
  BarChart3, 
  UserPlus, 
  Download, 
  Search,
  Activity,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default async function InstitutionAdminPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const session = await requireSession();
  const institution = await prisma.institution.findUnique({
    where: { id: session.institutionId || '' },
    include: {
      _count: {
        select: { users: true, tokenBudgets: true }
      }
    }
  });

  if (!institution) {
    return <div className="p-12 text-center font-bold text-slate-500">Institution not found.</div>;
  }

  // Fetch recent audit logs
  const auditLogs = await prisma.adminAuditLog.findMany({
    where: { user: { institutionId: institution.id } },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">{institution.name}</h1>
                <p className="text-slate-500 font-medium">Institutional Administration & Usage Auditing</p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl font-bold h-10 border-2">
                <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
            <Button className="rounded-xl font-bold h-10 bg-slate-900 text-white hover:bg-slate-800">
                <UserPlus className="h-4 w-4 mr-2" /> Invite Faculty
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[2rem] border-0 shadow-sm bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <CardContent className="p-8 space-y-4 relative z-10">
                <div className="bg-white/20 p-2 rounded-xl w-fit">
                    <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h3 className="text-4xl font-black mb-1">85%</h3>
                    <p className="text-sm font-bold text-white/70 uppercase tracking-widest text-[10px]">AI Quota Utilization</p>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white" style={{ width: '85%' }} />
                </div>
            </CardContent>
        </Card>
        
        <Card className="rounded-[2rem] border-0 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-8 space-y-4">
                <div className="bg-slate-100 p-2 rounded-xl w-fit">
                    <Activity className="h-6 w-6 text-slate-900" />
                </div>
                <div>
                    <h3 className="text-4xl font-black mb-1">{institution._count.users}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">Total Active Users</p>
                </div>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> +12% from last month
                </p>
            </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-8 space-y-4">
                <div className="bg-slate-100 p-2 rounded-xl w-fit">
                    <Lock className="h-6 w-6 text-slate-900" />
                </div>
                <div>
                    <h3 className="text-4xl font-black mb-1">0</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">Compliance Flags</p>
                </div>
                <p className="text-xs font-bold text-slate-400">All users within safe-use guidelines.</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Audit Log */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Recent Admin Audit Logs</h2>
                <Button variant="ghost" size="sm" className="font-bold text-primary">
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                </Button>
            </div>
            
            <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Administrator</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Entity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {auditLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                                            No recent audit activity found.
                                        </td>
                                    </tr>
                                ) : (
                                    auditLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-400 uppercase">{log.createdAt.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-slate-900">{log.user.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-600">{log.action}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                                                    {log.entityType || 'SYSTEM'}
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

        {/* Token Management Card */}
        <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">Token Management</h2>
            <Card className="rounded-[2rem] border-0 shadow-lg shadow-slate-200/50 bg-white overflow-hidden">
                <CardContent className="p-8 space-y-8">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Monthly Quota</h4>
                            <span className="text-xs font-bold text-primary">Manage Budgets</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-black text-slate-900">10.0M</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Capacity</p>
                            </div>
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border shadow-sm">
                                <BarChart3 className="h-5 w-5 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Quota Distribution</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'Faculty Plus', quota: '40%', usage: '32%', color: 'bg-primary' },
                                { name: 'Postgrad Track', quota: '30%', usage: '28%', color: 'bg-emerald-500' },
                                { name: 'Learner Track', quota: '30%', usage: '25%', color: 'bg-blue-500' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-900">{item.name}</span>
                                        <span className="text-slate-400">{item.usage} / {item.quota}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: item.usage }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-2 hover:bg-slate-50">
                        View Detailed Audit
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
