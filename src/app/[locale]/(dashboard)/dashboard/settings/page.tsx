import { setRequestLocale } from 'next-intl/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ProfileSettingsForm } from '@/components/settings/ProfileSettingsForm';

export default async function SettingsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const session = await getSession();
  if (!session) {
    return <div className="p-12 text-center font-bold text-slate-500">Session expired. Please log in again.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      profile: true,
      institution: true,
    },
  });

  if (!user) {
    return <div className="p-12 text-center font-bold text-slate-500">User not found.</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your profile, preferences, and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-2">
            <button className="w-full text-left px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-black text-sm">
                Profile
            </button>
            <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-600 font-bold text-sm transition-colors">
                Notifications
            </button>
            <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-600 font-bold text-sm transition-colors">
                Security
            </button>
            <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-600 font-bold text-sm transition-colors">
                Preferences
            </button>
        </div>

        <ProfileSettingsForm
          locale={locale}
          initialName={user.name}
          initialEmail={user.email}
          initialRoleTitle={user.profile?.learnerType ?? session.role}
          initialInstitutionName={user.institution?.name ?? user.profile?.college ?? ''}
        />
      </div>
    </div>
  );
}
