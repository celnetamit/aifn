import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileSearch, 
  BookMarked, 
  Stethoscope, 
  PenTool, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { AIChat } from '@/components/AIChat';

export default async function ResearchPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Research & Manuscript Assistant</h1>
          <p className="text-slate-500 font-medium">Advanced AI tools for nursing research, literature review, and clinical analysis.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">DPDP Compliant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Research Chat */}
        <div className="lg:col-span-2 space-y-8">
            <AIChat feature="research_assistant" />
            
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex gap-4">
                <Info className="h-6 w-6 text-blue-600 shrink-0" />
                <div>
                    <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-1">Research Ethics Advisory</h4>
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                        While AI can help draft and analyze, it cannot replace the ethical responsibility of the primary researcher. 
                        Always verify AI-generated citations against original sources (PubMed/Cochrane) and ensure adherence to INC research guidelines.
                    </p>
                </div>
            </div>
        </div>

        {/* Specialized Tools Sidebar */}
        <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">Research Toolkits</h2>
            
            <div className="space-y-4">
                {[
                    { 
                        title: 'Literature Reviewer', 
                        desc: 'Summarize nursing journals and extract key findings.',
                        icon: FileSearch,
                        color: 'text-blue-600',
                        bg: 'bg-blue-50'
                    },
                    { 
                        title: 'Manuscript Drafter', 
                        desc: 'Structure your research papers based on Vancouver style.',
                        icon: PenTool,
                        color: 'text-purple-600',
                        bg: 'bg-purple-50'
                    },
                    { 
                        title: 'Clinical Case Study', 
                        desc: 'Analyze clinical scenarios and generate nursing care plans.',
                        icon: Stethoscope,
                        color: 'text-emerald-600',
                        bg: 'bg-emerald-50'
                    },
                    { 
                        title: 'Citation Formatter', 
                        desc: 'Convert references to APA, MLA, or Vancouver styles.',
                        icon: BookMarked,
                        color: 'text-amber-600',
                        bg: 'bg-amber-50'
                    },
                ].map((tool, i) => (
                    <button key={i} className="w-full group text-left">
                        <Card className="rounded-[2rem] border-0 shadow-sm hover:shadow-xl hover:translate-x-1 transition-all overflow-hidden bg-white">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", tool.bg, tool.color)}>
                                    <tool.icon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{tool.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </button>
                ))}
            </div>

            <Card className="rounded-[2rem] border-0 shadow-2xl shadow-primary/20 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                <CardContent className="p-8 relative z-10 space-y-6">
                    <div className="bg-primary/20 p-2.5 rounded-2xl w-fit">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black mb-2 leading-tight">Postgraduate Premium</h4>
                        <p className="text-white/60 text-sm font-medium">Unlock advanced research models and higher token limits for PhD & M.Sc. support.</p>
                    </div>
                    <Button className="w-full h-11 font-bold rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-all">
                        Upgrade Plan
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
