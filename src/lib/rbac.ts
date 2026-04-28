// Role and permission definitions for AI for Nurses India platform.
// Server-side only — do NOT import in client components.

export type Role =
  | 'guest'
  | 'learner'
  | 'professional_nurse'
  | 'postgraduate_learner'
  | 'faculty'
  | 'mentor'
  | 'content_creator'
  | 'content_reviewer'
  | 'institution_admin'
  | 'finance_admin'
  | 'admin'
  | 'super_admin';

export type Permission =
  | 'course:read'
  | 'course:write'
  | 'course:publish'
  | 'assessment:attempt'
  | 'assessment:grade'
  | 'assignment:submit'
  | 'assignment:review'
  | 'certificate:view'
  | 'certificate:issue'
  | 'certificate:revoke'
  | 'ai:use'
  | 'ai:admin'
  | 'token:manage'
  | 'token:view'
  | 'user:manage'
  | 'user:view'
  | 'media:upload'
  | 'media:manage'
  | 'payment:view'
  | 'payment:manage'
  | 'institution:manage'
  | 'cohort:manage'
  | 'cohort:view'
  | 'mentor:assign'
  | 'mentor:use'
  | 'content:review'
  | 'system_prompt:view'
  | 'system_prompt:edit'
  | 'audit:view'
  | 'support:manage';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: ['course:read'],

  learner: [
    'course:read',
    'assessment:attempt',
    'assignment:submit',
    'certificate:view',
    'ai:use',
  ],

  professional_nurse: [
    'course:read',
    'assessment:attempt',
    'assignment:submit',
    'certificate:view',
    'ai:use',
  ],

  postgraduate_learner: [
    'course:read',
    'assessment:attempt',
    'assignment:submit',
    'certificate:view',
    'ai:use',
    'mentor:use',
  ],

  faculty: [
    'course:read',
    'course:write',
    'assessment:attempt',
    'assessment:grade',
    'assignment:submit',
    'assignment:review',
    'certificate:view',
    'ai:use',
    'cohort:view',
    'cohort:manage',
    'media:upload',
    'content:review',
  ],

  mentor: [
    'course:read',
    'ai:use',
    'mentor:assign',
    'mentor:use',
  ],

  content_creator: [
    'course:read',
    'course:write',
    'media:upload',
    'media:manage',
  ],

  content_reviewer: [
    'course:read',
    'course:write',
    'content:review',
    'media:upload',
    'media:manage',
  ],

  institution_admin: [
    'course:read',
    'course:write',
    'course:publish',
    'user:view',
    'user:manage',
    'institution:manage',
    'cohort:view',
    'cohort:manage',
    'payment:view',
    'certificate:view',
    'certificate:issue',
    'certificate:revoke',
    'audit:view',
    'token:view',
    'token:manage',
  ],

  finance_admin: [
    'course:read',
    'payment:view',
    'payment:manage',
    'audit:view',
  ],

  admin: [
    'course:read',
    'course:write',
    'course:publish',
    'assessment:grade',
    'assignment:review',
    'certificate:view',
    'certificate:issue',
    'ai:use',
    'ai:admin',
    'token:manage',
    'token:view',
    'user:view',
    'user:manage',
    'media:upload',
    'media:manage',
    'payment:view',
    'payment:manage',
    'institution:manage',
    'cohort:manage',
    'cohort:view',
    'mentor:assign',
    'content:review',
    'system_prompt:view',
    'audit:view',
    'support:manage',
  ],

  super_admin: [
    'course:read',
    'course:write',
    'course:publish',
    'assessment:attempt',
    'assessment:grade',
    'assignment:submit',
    'assignment:review',
    'certificate:view',
    'certificate:issue',
    'certificate:revoke',
    'ai:use',
    'ai:admin',
    'token:manage',
    'token:view',
    'user:view',
    'user:manage',
    'media:upload',
    'media:manage',
    'payment:view',
    'payment:manage',
    'institution:manage',
    'cohort:manage',
    'cohort:view',
    'mentor:assign',
    'mentor:use',
    'content:review',
    'system_prompt:view',
    'system_prompt:edit',
    'audit:view',
    'support:manage',
  ],
};

export const hasPermission = (role: Role, permission: Permission): boolean =>
  ROLE_PERMISSIONS[role]?.includes(permission) ?? false;

export const getPermissions = (role: Role): Permission[] =>
  ROLE_PERMISSIONS[role] ?? [];

export const isAdminRole = (role: Role): boolean =>
  ['admin', 'super_admin', 'institution_admin'].includes(role);

export const isFacultyOrAbove = (role: Role): boolean =>
  ['faculty', 'content_creator', 'content_reviewer', 'admin', 'super_admin'].includes(role);
