'use client';

import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProfileSettingsForm } from '@/components/settings/ProfileSettingsForm';
import {
  changePassword,
  markAllNotificationsRead,
  updatePreferredLocaleSetting,
} from '@/server/actions/settings';

type SettingsWorkspaceProps = {
  locale: string;
  initialName: string;
  initialEmail: string;
  initialRoleTitle: string;
  initialInstitutionName: string;
  initialPreferredLocale: 'en' | 'hi';
  unreadNotificationCount: number;
};

type SettingsTab = 'profile' | 'notifications' | 'security' | 'preferences';

export function SettingsWorkspace({
  locale,
  initialName,
  initialEmail,
  initialRoleTitle,
  initialInstitutionName,
  initialPreferredLocale,
  unreadNotificationCount,
}: SettingsWorkspaceProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isPending, startTransition] = useTransition();

  const [preferredLocale, setPreferredLocale] = useState<'en' | 'hi'>(initialPreferredLocale);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const markRead = () => {
    startTransition(async () => {
      const result = await markAllNotificationsRead(locale);
      if (result.error) {
        toast({ title: 'Failed', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Done', description: result.message ?? 'Notifications updated.' });
    });
  };

  const savePreferences = () => {
    startTransition(async () => {
      const result = await updatePreferredLocaleSetting(locale, preferredLocale);
      if (result.error) {
        toast({ title: 'Failed', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Saved', description: result.message ?? 'Preferences updated.' });
    });
  };

  const savePassword = () => {
    startTransition(async () => {
      const result = await changePassword(locale, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (result.error) {
        toast({ title: 'Password update failed', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Password updated', description: result.message ?? 'Security settings updated.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="space-y-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full text-left px-4 py-2.5 rounded-xl font-black text-sm ${
            activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`w-full text-left px-4 py-2.5 rounded-xl font-black text-sm ${
            activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`w-full text-left px-4 py-2.5 rounded-xl font-black text-sm ${
            activeTab === 'security' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          Security
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`w-full text-left px-4 py-2.5 rounded-xl font-black text-sm ${
            activeTab === 'preferences' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          Preferences
        </button>
      </div>

      <div className="md:col-span-3 space-y-6">
        {activeTab === 'profile' ? (
          <ProfileSettingsForm
            locale={locale}
            initialName={initialName}
            initialEmail={initialEmail}
            initialRoleTitle={initialRoleTitle}
            initialInstitutionName={initialInstitutionName}
          />
        ) : null}

        {activeTab === 'notifications' ? (
          <div className="rounded-[2rem] border-0 shadow-sm bg-white p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Notifications</h3>
            <p className="text-sm text-slate-500">Unread notifications: {unreadNotificationCount}</p>
            <button
              type="button"
              onClick={markRead}
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              Mark All as Read
            </button>
          </div>
        ) : null}

        {activeTab === 'security' ? (
          <div className="rounded-[2rem] border-0 shadow-sm bg-white p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Security</h3>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <button
              type="button"
              onClick={savePassword}
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              Update Password
            </button>
          </div>
        ) : null}

        {activeTab === 'preferences' ? (
          <div className="rounded-[2rem] border-0 shadow-sm bg-white p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Preferences</h3>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Preferred Language</label>
              <select
                value={preferredLocale}
                onChange={(e) => setPreferredLocale(e.target.value as 'en' | 'hi')}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            <button
              type="button"
              onClick={savePreferences}
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              Save Preferences
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

