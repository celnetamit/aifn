import { setRequestLocale } from 'next-intl/server';
import { getFacultyStats, getPendingSubmissions } from '@/server/actions/faculty';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default async function FacultyDashboardPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const stats = await getFacultyStats();
  const pendingSubmissions = await getPendingSubmissions();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Faculty Command Center</h1>
          <p className="text-slate-500 font-medium">Monitor cohorts, grade assignments, and track AI-assisted learning.</p>
        </div>
        <div className="flex gap-2">
            <Button className="rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800">
                Generate Report
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: 'Total Learners', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Enrollments', value: stats.activeEnrollments, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pending Reviews', value: stats.pendingReviews, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Avg. Quiz Score', value: '78%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((item, i) => (
            <Card key={i} className="rounded-3xl border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`${item.bg} p-2.5 rounded-2xl`}>
                            <item.icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-1">{item.value}</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">{item.label}</p>
                </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Reviews Table */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Assignments Awaiting Review</h2>
                <Link href={`/${locale}/dashboard/faculty/reviews`} className="text-sm font-bold text-primary hover:underline">View All</Link>
            </div>
            
            <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Assignment</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Submitted</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pendingSubmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                                            No pending submissions to review.
                                        </td>
                                    </tr>
                                ) : (
                                    pendingSubmissions.slice(0, 5).map((sub) => (
                                        <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-200" />
                                                    <span className="text-sm font-bold text-slate-900">{sub.user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-600">{sub.assignment.titleEn}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-400 uppercase">{sub.submittedAt.toLocaleDateString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button variant="ghost" size="sm" className="font-black text-primary hover:bg-primary/5">
                                                    Grade <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                                </Button>
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

        {/* Institution AI Insights */}
        <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">AI Usage Insights</h2>
            <Card className="rounded-[2rem] border-0 shadow-lg shadow-slate-200/50 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                <CardHeader className="relative z-10 pb-0">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                        AI Literacy Uptake
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-6 relative z-10 space-y-8">
                    <div>
                        <div className="flex items-end gap-1 mb-2">
                            <span className="text-4xl font-black">2.4M</span>
                            <span className="text-slate-400 text-xs font-bold mb-1.5">tokens used / institution</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '48%' }} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">48% of monthly budget</p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Top AI Features</h4>
                        <div className="space-y-3">
                            {[
                                { name: 'AI Tutor', usage: '62%', color: 'bg-blue-500' },
                                { name: 'Prompt Coach', usage: '24%', color: 'bg-emerald-500' },
                                { name: 'Research Helper', usage: '14%', color: 'bg-purple-500' },
                            ].map((feat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span>{feat.name}</span>
                                        <span className="text-slate-400">{feat.usage}</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${feat.color}`} style={{ width: feat.usage }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
