'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { register } from '@/server/actions/auth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface RegisterFormProps {
  locale: string;
}

export function RegisterForm({ locale }: RegisterFormProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data['confirm-password']) {
      toast({
        title: 'Validation Error',
        description: t('auth.password_mismatch'),
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const result = await register(locale, {
        name: data.name as string,
        email: data.email as string,
        password: data.password as string,
        confirmPassword: data['confirm-password'] as string,
        role: data.role as any,
      });

      if (result?.error) {
        toast({
          title: 'Registration Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success!',
          description: t('auth.register_success'),
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('auth.full_name')}</Label>
          <Input 
            id="name" 
            name="name"
            required
            placeholder="Anjali Verma" 
            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">{t('auth.role')}</Label>
          <select 
            id="role"
            name="role"
            required
            className="flex h-12 w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="learner">Learner (Student)</option>
            <option value="professional_nurse">Working Nurse</option>
            <option value="faculty">Faculty / Educator</option>
            <option value="postgraduate_learner">PG / Research Learner</option>
          </select>
        </div>
      </div>
      
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input 
            id="password" 
            name="password"
            type="password" 
            required
            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">{t('auth.confirm_password')}</Label>
          <Input 
            id="confirm-password" 
            name="confirm-password"
            type="password" 
            required
            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-start gap-2 pt-2">
        <input type="checkbox" id="terms" className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" required />
        <label htmlFor="terms" className="text-xs text-slate-500 font-medium cursor-pointer">
          By creating an account, I agree to the <span className="text-primary font-bold hover:underline">Terms of Use</span> and <span className="text-primary font-bold hover:underline">Privacy Policy</span>.
        </label>
      </div>

      <Button 
        type="submit"
        disabled={loading}
        size="lg" 
        className="w-full h-12 text-base font-bold premium-gradient text-white border-0 rounded-xl shadow-lg hover:shadow-primary/20 transition-all"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('auth.register_btn')}
      </Button>
    </form>
  );
}
