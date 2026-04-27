'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'hi' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="flex items-center gap-2 hover:bg-slate-100 transition-colors"
    >
      <Languages className="h-4 w-4" />
      <span className={locale === 'hi' ? 'font-hindi' : ''}>
        {locale === 'en' ? 'हिन्दी' : 'English'}
      </span>
    </Button>
  );
}
