import { setRequestLocale } from 'next-intl/server';
import { getMentors } from '@/server/actions/mentors';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Video, 
  Calendar, 
  Star, 
  ShieldCheck, 
  MessageSquare,
  Search,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default async function MentoringPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const mentors = await getMentors();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Nursing Mentors</h1>
          <p className="text-slate-500 font-medium">Connect with experts for career guidance, research, and clinical excellence.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
                type="text" 
                placeholder="Search by specialization..." 
                className="h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all w-64"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {mentors.map((mentor) => (
            <Card key={mentor.id} className="rounded-[2.5rem] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden group">
                <CardHeader className="p-8 pb-4 flex flex-row items-start gap-4">
                    <div className="h-20 w-20 rounded-3xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden relative">
                        {/* Avatar */}
                        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-xl font-black text-slate-900">{mentor.name}</h3>
                            <ShieldCheck className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {mentor.profile?.specialization || 'Clinical Expert'}
                        </p>
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star className="h-3 w-3 fill-current" />
                            <Star className="h-3 w-3 fill-current" />
                            <Star className="h-3 w-3 fill-current" />
                            <Star className="h-3 w-3 fill-current" />
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-[10px] font-black text-slate-400 ml-1">5.0</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                        {mentor.profile?.bio || 'Dedicated nursing professional with over 10 years of experience in clinical practice and education.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                        {['Research', 'Clinical Skills', 'Career'].map((tag, i) => (
                            <span key={i} className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border border-slate-100">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</span>
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Next: Tue, 4 PM
                            </span>
                        </div>
                        <Button size="sm" className="h-10 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800">
                            Book Session
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ))}

        {/* Community Card */}
        <Card className="rounded-[2.5rem] border-0 shadow-xl shadow-primary/10 bg-primary text-white overflow-hidden relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <CardHeader className="p-8 relative z-10">
                <CardTitle className="text-2xl font-black">Join Mentor Network</CardTitle>
                <CardDescription className="text-white/70">Are you an expert nurse educator or clinical specialist?</CardDescription>
            </CardHeader>
            <CardContent className="p-8 relative z-10">
                <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-sm font-bold">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Help shape the next generation
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Share your clinical research
                    </li>
                </ul>
                <Button className="w-full h-12 bg-white text-primary hover:bg-slate-50 rounded-xl font-black shadow-lg shadow-black/10">
                    Apply as Mentor <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
