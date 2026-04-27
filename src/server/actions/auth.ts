'use server';

import { prisma } from '@/lib/db';
import { 
  hashPassword, 
  verifyPassword, 
  createSessionToken, 
  setSessionCookie, 
  clearSessionCookie 
} from '@/lib/auth';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validation';
import { redirect } from '@/i18n/navigation';
import { revalidatePath } from 'next/cache';

export async function login(locale: string, data: LoginInput) {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return { error: 'Invalid input' };
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return { error: 'Invalid email or password' };
    }

    if (!user.isActive) {
      return { error: 'Account is disabled. Please contact support.' };
    }

    const token = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      institutionId: user.institutionId,
      preferredLocale: user.preferredLocale as 'en' | 'hi',
    });

    await setSessionCookie(token);
    
    // Log success
    await prisma.securityAuditLog.create({
      data: {
        eventType: 'login_success',
        userId: user.id,
        details: { email },
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }

  revalidatePath('/');
  redirect('/dashboard');
}

export async function register(locale: string, data: RegisterInput) {
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    return { error: 'Invalid input' };
  }

  const { name, email, password, role } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'Email already registered' };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        role: role as any,
        preferredLocale: locale as any,
      },
    });

    const token = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      institutionId: user.institutionId,
      preferredLocale: user.preferredLocale as 'en' | 'hi',
    });

    await setSessionCookie(token);

    // Create profile
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        learnerType: role, // Default to role as learner type for now
      }
    });

    // Log success
    await prisma.securityAuditLog.create({
      data: {
        eventType: 'register_success',
        userId: user.id,
        details: { email, role },
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }

  revalidatePath('/');
  redirect('/dashboard');
}

export async function logout() {
  await clearSessionCookie();
  revalidatePath('/');
  redirect('/login');
}
