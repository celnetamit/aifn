import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Bell, 
  Lock, 
  Globe,
  Save
} from 'lucide-react';
import { getSession } from '@/lib/auth';

export default async function SettingsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const session = await getSession();

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

        <div className="md:col-span-3 space-y-6">
            <Card className="rounded-[2rem] border-0 shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                    <CardTitle className="flex items-center gap-2 text-lg font-black">
                        <User className="h-5 w-5 text-slate-400" />
                        Personal Information
                    </CardTitle>
                    <CardDescription>Update your photo and personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center relative group cursor-pointer">
                            <span className="text-3xl font-black text-slate-300">
                                {session?.name?.charAt(0) || 'U'}
                            </span>
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Edit</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-slate-900">Profile Photo</h4>
                            <p className="text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="rounded-xl font-bold h-8">Upload</Button>
                                <Button size="sm" variant="ghost" className="rounded-xl font-bold h-8 text-destructive">Remove</Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                            <input 
                                type="text" 
                                defaultValue={session?.name || ''}
                                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                            <input 
                                type="email" 
                                defaultValue={session?.email || ''}
                                disabled
                                className="w-full h-11 px-4 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-sm font-medium cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Role / Title</label>
                            <input 
                                type="text" 
                                defaultValue="Registered Nurse"
                                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Institution</label>
                            <input 
                                type="text" 
                                defaultValue="AIIMS Delhi"
                                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <Button className="h-11 px-8 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800">
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
