import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  Zap, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  Award,
  Crown,
  ArrowRight
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function PublicPricingPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { priceInr: 'asc' }
  });

  const t = await getTranslations();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mini Navbar for Public Page */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-black tracking-tight text-slate-900">AI for Nurses</span>
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="sm" className="premium-gradient text-white border-0 font-bold px-6 rounded-xl shadow-lg">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-bold">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-slate-900">
                Elevate Your <span className="text-primary">Nursing Career</span>
            </h1>
            <p className="text-slate-500 text-lg lg:text-xl font-medium max-w-2xl mx-auto">
                Choose a plan that fits your learning journey. All plans include bilingual support and INC-aligned content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
                <Card key={pkg.id} className={cn(
                    "rounded-[3rem] border-0 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden relative",
                    i === 1 ? "ring-4 ring-primary/20 scale-105 z-10" : ""
                )}>
                    {i === 1 && (
                        <div className="absolute top-6 right-6 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                            Most Popular
                        </div>
                    )}
                    <CardHeader className={cn(
                        "p-10 lg:p-12 space-y-4",
                        i === 1 ? "bg-slate-900 text-white" : "bg-slate-50"
                    )}>
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center",
                            i === 0 ? "bg-blue-100 text-blue-600" : 
                            i === 1 ? "bg-primary text-white shadow-lg shadow-primary/40" : 
                            "bg-purple-100 text-purple-600"
                        )}>
                            {i === 0 ? <BookOpen className="h-6 w-6" /> : 
                             i === 1 ? <Crown className="h-6 w-6" /> : 
                             <Sparkles className="h-6 w-6" />}
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tight">{pkg.name}</CardTitle>
                            <CardDescription className={i === 1 ? "text-white/60" : ""}>{pkg.description}</CardDescription>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black">₹{pkg.priceInr}</span>
                            <span className={cn("text-sm font-bold uppercase tracking-widest", i === 1 ? "text-white/40" : "text-slate-400")}>/ month</span>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-10 lg:p-12 flex-1 space-y-6">
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                {pkg.aiDailyTokens.toLocaleString()} Daily AI Tokens
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                {i === 0 ? 'Access to Foundation Courses' : 'Unlimited Course Access'}
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                Bilingual (English/Hindi) Content
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                {i > 0 ? 'Verified Certificates' : 'Digital Badges'}
                            </li>
                        </ul>
                    </CardContent>

                    <CardFooter className="p-10 lg:p-12 pt-0">
                        <Link href="/register" className="w-full">
                            <Button className="w-full h-12 rounded-xl premium-gradient text-white border-0 font-bold shadow-lg">
                                Get Started <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="bg-slate-50 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-around gap-12 border border-slate-100">
            <div className="flex items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-primary" />
                <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Secure Payments</p>
                    <p className="text-xs text-slate-500 font-medium">Encrypted by Razorpay India</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Award className="h-10 w-10 text-primary" />
                <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">INC Aligned</p>
                    <p className="text-xs text-slate-500 font-medium">Curriculum quality assured</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Zap className="h-10 w-10 text-primary" />
                <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Instant Activation</p>
                    <p className="text-xs text-slate-500 font-medium">Start learning immediately</p>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
