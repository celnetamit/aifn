'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200 p-10 text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 mb-4">
          <AlertCircle className="h-10 w-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Something went wrong</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            We encountered an unexpected error. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()}
            size="lg"
            className="w-full h-12 rounded-xl premium-gradient text-white border-0 font-bold shadow-lg"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Try again
          </Button>
          
          <Link href="/" className="w-full">
            <Button variant="ghost" size="lg" className="w-full h-12 rounded-xl font-bold">
              Return Home
            </Button>
          </Link>
        </div>

        <p className="text-[10px] text-slate-300 font-mono break-all uppercase tracking-widest">
          Error Digest: {error.digest || 'N/A'}
        </p>
      </div>
    </div>
  );
}
