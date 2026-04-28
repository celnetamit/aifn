'use client';

import { useState, useTransition } from 'react';
import type { Role } from '@/lib/rbac';
import { updateInstitutionUserRole, setInstitutionUserActive } from '@/server/actions/institution-admin';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type UserRowActionsProps = {
  locale: string;
  userId: string;
  currentRole: Role;
  isActive: boolean;
  canManage: boolean;
  isSelf: boolean;
  assignableRoles?: Role[];
};

export function UserRowActions({
  locale,
  userId,
  currentRole,
  isActive,
  canManage,
  isSelf,
  assignableRoles,
}: UserRowActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);
  const [isPending, startTransition] = useTransition();

  const roles = assignableRoles?.length ? assignableRoles : [currentRole];

  if (!canManage) {
    return <p className="text-xs font-medium text-slate-400">View only</p>;
  }

  const onRoleSave = () => {
    startTransition(async () => {
      const result = await updateInstitutionUserRole(locale, userId, selectedRole);
      if (result?.error) {
        toast({
          title: 'Role update failed',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Role updated',
        description: 'User role has been saved successfully.',
      });
      router.refresh();
    });
  };

  const onStatusToggle = () => {
    startTransition(async () => {
      const result = await setInstitutionUserActive(locale, userId, !isActive);
      if (result?.error) {
        toast({
          title: 'Status update failed',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: !isActive ? 'User enabled' : 'User disabled',
        description: 'Account status has been updated.',
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={selectedRole}
          onChange={(event) => setSelectedRole(event.target.value as Role)}
          disabled={isPending || isSelf}
          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onRoleSave}
          disabled={isPending || isSelf || selectedRole === currentRole}
          className="h-9 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
      <button
        type="button"
        onClick={onStatusToggle}
        disabled={isPending || isSelf}
        className="h-8 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isActive ? 'Disable' : 'Enable'}
      </button>
    </div>
  );
}
