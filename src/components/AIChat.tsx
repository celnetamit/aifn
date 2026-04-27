'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  ShieldCheck, 
  Trash2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatWithAI } from '@/server/actions/ai';
import type { AIFeatureKey } from '@/lib/ai/system-message';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

export function AIChat({ feature }: { feature: AIFeatureKey }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI for Nurses Tutor. How can I help you today? Please remember not to share any patient-identifiable information." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithAI({ feature, prompt: userMessage });

      if (response.error) {
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: response.error as string, 
            isError: true 
        }]);
      } else {
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: response.text as string 
        }]);
      }
    } catch {
      setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Sorry, I encountered an error connecting to the server.", 
          isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
      <CardHeader className="p-6 border-b bg-slate-900 text-white flex flex-row items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-black tracking-tight text-white">AI Tutor</CardTitle>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Active & Secure
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white/40 hover:text-white" onClick={() => setMessages([messages[0]])}>
            <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/50">
        <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
            >
                <div className={cn(
                    "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === 'user' ? "bg-slate-900 text-white" : "bg-white border text-primary"
                )}>
                    {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className={cn(
                    "p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm",
                    msg.role === 'user' 
                        ? "bg-slate-900 text-white rounded-tr-none" 
                        : msg.isError 
                            ? "bg-destructive/10 text-destructive border-2 border-destructive/20 rounded-tl-none"
                            : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                )}>
                    {msg.content}
                    {msg.role === 'assistant' && !msg.isError && i > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <ShieldCheck className="h-3 w-3 text-emerald-500" />
                            Verified Educational Content
                        </div>
                    )}
                </div>
            </motion.div>
            ))}
        </AnimatePresence>
        {isLoading && (
            <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 max-w-[85%] animate-pulse"
            >
                <div className="h-10 w-10 rounded-2xl bg-white border flex items-center justify-center shrink-0">
                    <Bot className="h-5 w-5 text-slate-300" />
                </div>
                <div className="p-5 bg-white border border-slate-100 rounded-[2rem] rounded-tl-none flex gap-2">
                    <span className="h-1.5 w-1.5 bg-slate-200 rounded-full animate-bounce" />
                    <span className="h-1.5 w-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
            </motion.div>
        )}
      </CardContent>

      <CardFooter className="p-6 border-t bg-white shrink-0">
        <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="w-full flex flex-col gap-3"
        >
            <div className="relative">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about a nursing concept, study tip, or rationale..."
                    className="w-full h-14 pl-6 pr-14 bg-slate-100 border-0 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-2 h-10 w-10 rounded-xl premium-gradient text-white border-0 shadow-lg shadow-primary/20"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
            
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500 fill-amber-500" /> Token Safe</span>
                    <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> No PII/PHI</span>
                </div>
                <p className="text-[9px] font-bold text-slate-400 italic">
                    Always verify with textbooks and faculty.
                </p>
            </div>
        </form>
      </CardFooter>
    </Card>
  );
}
