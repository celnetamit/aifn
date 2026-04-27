import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Sparkles, 
  History
} from 'lucide-react';
import { AIChat } from '@/components/AIChat';

export default async function AIUsagePage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1 flex items-center gap-3">
            AI Assistant Hub <Sparkles className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-slate-500 font-medium">Monitor your token usage and chat with your dedicated clinical AI tutor.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Settings */}
        <div className="space-y-8">
            <Card className="rounded-[2rem] border-0 shadow-lg shadow-slate-200/50 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                <CardHeader className="relative z-10 pb-0">
                    <CardTitle className="text-lg flex items-center gap-2 font-black tracking-tight">
                        <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
                        Daily Quota
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-6 relative z-10">
                    <div className="flex items-end gap-1 mb-8">
                        <span className="text-5xl font-black">4.8k</span>
                        <span className="text-slate-400 text-sm font-bold mb-1.5">/ 5,000 tokens</span>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Remaining</span>
                                <span className="text-emerald-400">96% Available</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '96%' }} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-0 shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                    <CardTitle className="flex items-center gap-2 text-lg font-black">
                        <History className="h-5 w-5 text-slate-400" />
                        Recent Conversations
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {[
                            { title: 'Sepsis protocol questions', time: '2 hours ago', tokens: 145 },
                            { title: 'ECG interpretation basics', time: 'Yesterday', tokens: 320 },
                            { title: 'Medication calculation help', time: '3 days ago', tokens: 85 },
                        ].map((chat, i) => (
                            <button key={i} className="w-full text-left p-6 hover:bg-slate-50 transition-colors group">
                                <h4 className="font-bold text-slate-900 group-hover:text-primary mb-1">{chat.title}</h4>
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>{chat.time}</span>
                                    <span className="flex items-center gap-1 text-slate-300">•</span>
                                    <span className="flex items-center gap-1">
                                        <Zap className="h-3 w-3 text-amber-500 fill-amber-500" /> {chat.tokens} tkns
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <Button variant="ghost" className="w-full text-xs font-bold text-slate-500 hover:text-slate-900">
                            View All History
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Active Chat Interface */}
        <div className="lg:col-span-2">
            <AIChat feature="lesson_tutor" />
        </div>
      </div>
    </div>
  );
}
