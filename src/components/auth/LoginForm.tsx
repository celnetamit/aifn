'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { login } from '@/server/actions/auth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface LoginFormProps {
  locale: string;
}

export function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const result = await login(locale, {
        email: data.email as string,
        password: data.password as string,
      });

      if (result?.error) {
        toast({
          title: 'Login Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success!',
          description: t('auth.login_success'),
        });
        // Redirection is handled in the server action
      }
    } catch {
      toast({
        title: 'Error',
        description: t('common.error_generic'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          required
          placeholder="name@college.edu" 
          className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Link 
            href="/forgot-password" 
            className="text-xs font-bold text-primary hover:underline"
          >
            {t('auth.forgot_password')}
          </Link>
        </div>
        <Input 
          id="password" 
          name="password"
          type="password" 
          required
          className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
        />
      </div>
      <Button 
        type="submit"
        disabled={loading}
        size="lg" 
        className="w-full h-12 text-base font-bold premium-gradient text-white border-0 rounded-xl shadow-lg hover:shadow-primary/20 transition-all"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('auth.login_btn')}
      </Button>
    </form>
  );
}
