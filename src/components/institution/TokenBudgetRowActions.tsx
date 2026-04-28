'use client';

import { useState, useTransition } from 'react';
import { updateInstitutionTokenBudget } from '@/server/actions/institution-admin';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type TokenBudgetRowActionsProps = {
  locale: string;
  budgetId: string;
  initialDailyLimitTokens: number | null;
  initialMonthlyLimitTokens: number | null;
  initialIsEnabled: boolean;
  canManage: boolean;
};

export function TokenBudgetRowActions({
  locale,
  budgetId,
  initialDailyLimitTokens,
  initialMonthlyLimitTokens,
  initialIsEnabled,
  canManage,
}: TokenBudgetRowActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [dailyValue, setDailyValue] = useState<string>(
    initialDailyLimitTokens === null ? '' : String(initialDailyLimitTokens)
  );
  const [monthlyValue, setMonthlyValue] = useState<string>(
    initialMonthlyLimitTokens === null ? '' : String(initialMonthlyLimitTokens)
  );
  const [isEnabled, setIsEnabled] = useState(initialIsEnabled);
  const [isPending, startTransition] = useTransition();

  if (!canManage) {
    return <p className="text-xs font-medium text-slate-400">View only</p>;
  }

  const onSave = () => {
    const parseLimit = (value: string) => {
      if (!value.trim()) return null;
      const parsed = Number.parseInt(value, 10);
      return Number.isNaN(parsed) ? null : parsed;
    };

    const dailyLimitTokens = parseLimit(dailyValue);
    const monthlyLimitTokens = parseLimit(monthlyValue);

    startTransition(async () => {
      const result = await updateInstitutionTokenBudget(locale, budgetId, {
        dailyLimitTokens,
        monthlyLimitTokens,
        isEnabled,
      });
      if (result?.error) {
        toast({
          title: 'Budget update failed',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Budget updated',
        description: 'Token budget values were saved successfully.',
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2">
        <input
          type="number"
          min={0}
          value={dailyValue}
          onChange={(event) => setDailyValue(event.target.value)}
          placeholder="Daily"
          disabled={isPending}
          className="h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-slate-700"
        />
        <input
          type="number"
          min={0}
          value={monthlyValue}
          onChange={(event) => setMonthlyValue(event.target.value)}
          placeholder="Monthly"
          disabled={isPending}
          className="h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-slate-700"
        />
      </div>
      <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(event) => setIsEnabled(event.target.checked)}
          disabled={isPending}
          className="h-4 w-4 rounded border-slate-300"
        />
        Enabled
      </label>
      <button
        type="button"
        onClick={onSave}
        disabled={isPending}
        className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Save
      </button>
    </div>
  );
}
