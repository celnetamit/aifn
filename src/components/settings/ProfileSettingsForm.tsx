'use client';

import { useState, useTransition } from 'react';
import { User, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateSettings } from '@/server/actions/settings';

type ProfileSettingsFormProps = {
  locale: string;
  initialName: string;
  initialEmail: string;
  initialRoleTitle: string;
  initialInstitutionName: string;
};

export function ProfileSettingsForm({
  locale,
  initialName,
  initialEmail,
  initialRoleTitle,
  initialInstitutionName,
}: ProfileSettingsFormProps) {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '');
    const roleTitle = String(formData.get('roleTitle') ?? '');
    const institutionName = String(formData.get('institutionName') ?? '');

    startTransition(async () => {
      const result = await updateSettings(locale, { name, roleTitle, institutionName });
      if (result.error) {
        setStatus({ type: 'error', message: result.error });
        return;
      }
      setStatus({
        type: 'success',
        message: result.message ?? 'Settings updated.',
      });
    });
  }

  return (
    <form onSubmit={onSubmit} className="md:col-span-3 space-y-6">
      <Card className="rounded-[2rem] border-0 shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
          <CardTitle className="flex items-center gap-2 text-lg font-black">
            <User className="h-5 w-5 text-slate-400" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal profile details here.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
              <input
                type="text"
                name="name"
                defaultValue={initialName}
                required
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
              <input
                type="email"
                defaultValue={initialEmail}
                disabled
                className="w-full h-11 px-4 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-sm font-medium cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Role / Title</label>
              <input
                type="text"
                name="roleTitle"
                defaultValue={initialRoleTitle}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Institution</label>
              <input
                type="text"
                name="institutionName"
                defaultValue={initialInstitutionName}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {status ? (
            <p
              className={`text-sm font-bold ${
                status.type === 'success' ? 'text-emerald-600' : 'text-destructive'
              }`}
            >
              {status.message}
            </p>
          ) : null}

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 px-8 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800"
            >
              <Save className="mr-2 h-4 w-4" />
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

