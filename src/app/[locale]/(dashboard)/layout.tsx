import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth';
import { redirect } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';

// Force all dashboard pages to be dynamic (server-rendered at request time)
// so they never try to connect to the DB during the Docker build stage.
export const dynamic = 'force-dynamic';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  MessageSquare, 
  GraduationCap, 
  LogOut, 
  Menu, 
  X, 
  Award,
  Calendar,
  Users,
  Search,
  Bell,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  // If no session, redirect to login
  if (!session) {
    redirect({ href: '/login', locale });
  }

  const t = await getTranslations();

  const navItems = [
    { label: t('dashboard.my_courses'), icon: BookOpen, href: '/dashboard/courses' },
    { label: t('dashboard.ai_usage'), icon: MessageSquare, href: '/dashboard/ai' },
    { label: t('dashboard.progress'), icon: LayoutDashboard, href: '/dashboard' },
    { label: t('dashboard.certificates'), icon: Award, href: '/dashboard/certificates' },
    { label: t('dashboard.assignments'), icon: Calendar, href: '/dashboard/assignments' },
    { label: t('dashboard.mentor_sessions'), icon: Users, href: '/dashboard/mentoring' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r sticky top-0 h-screen">
        <div className="p-6 border-b">
          <Link href={`/`} className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              AIFN <span className="text-primary">India</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all group"
            >
              <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {item.label}
              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-4">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <div className="px-4 py-3 flex items-center justify-between bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Learner</span>
                    <span className="text-xs font-bold text-slate-900">Anjali V.</span>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-destructive">
                <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t('common.search')} 
                className="w-full h-10 pl-10 pr-4 bg-slate-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" className="relative text-slate-600">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
            </Button>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />
            <Button className="hidden sm:flex h-9 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white border-0 px-4">
              {t('hero.cta_primary')}
            </Button>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
