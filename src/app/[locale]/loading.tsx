import { GraduationCap } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative bg-primary p-4 rounded-[1.5rem] shadow-2xl shadow-primary/40 animate-bounce">
            <GraduationCap className="h-12 w-12 text-white" />
        </div>
      </div>
      
      <div className="mt-12 text-center space-y-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">AI for Nurses India</h2>
        <div className="flex gap-1.5 justify-center">
            <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0s]" />
            <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Secure Environment</p>
      </div>
    </div>
  );
}
