import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default async function AssignmentsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Mock data for MVP
  const assignments = [
    {
      id: '1',
      title: 'Clinical Case Study: Sepsis Management',
      course: 'Advanced ICU Protocols',
      dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      status: 'pending',
      type: 'Case Study'
    },
    {
      id: '2',
      title: 'Patient Triage Simulation Quiz',
      course: 'Emergency Nursing Foundations',
      dueDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
      status: 'urgent',
      type: 'Simulation'
    },
    {
      id: '3',
      title: 'Reflective Essay on Ethics',
      course: 'Nursing Ethics & Law',
      dueDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
      status: 'completed',
      type: 'Essay'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Assignments</h1>
          <p className="text-slate-500 font-medium">Manage your clinical tasks, peer reviews, and case studies.</p>
        </div>
      </div>

      {/* Tabs placeholder */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button className="px-4 py-3 text-sm font-black text-primary border-b-2 border-primary">Active Tasks</button>
        <button className="px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">In Review</button>
        <button className="px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Completed</button>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
            <Card key={assignment.id} className="rounded-[1.5rem] border-0 shadow-sm bg-white hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-0 flex flex-col md:flex-row">
                    <div className="w-2 md:w-3 bg-slate-100 group-hover:bg-primary transition-colors" />
                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                assignment.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                assignment.status === 'urgent' ? 'bg-amber-50 text-amber-600' :
                                'bg-blue-50 text-blue-600'
                            }`}>
                                {assignment.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : 
                                 assignment.status === 'urgent' ? <AlertCircle className="h-5 w-5" /> : 
                                 <FileText className="h-5 w-5" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 mb-1">{assignment.title}</h3>
                                <p className="text-sm font-bold text-slate-500 mb-3">{assignment.course}</p>
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Due {assignment.dueDate.toLocaleDateString()}
                                    </span>
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{assignment.type}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="shrink-0">
                            {assignment.status === 'completed' ? (
                                <Button variant="outline" className="w-full md:w-auto rounded-xl font-bold text-slate-500 border-slate-200">
                                    View Feedback
                                </Button>
                            ) : (
                                <Button className={`w-full md:w-auto h-11 px-6 rounded-xl font-bold ${
                                    assignment.status === 'urgent' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                                }`}>
                                    {assignment.status === 'urgent' ? 'Complete Now' : 'Start Task'} <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
