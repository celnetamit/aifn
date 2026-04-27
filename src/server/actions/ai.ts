'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { runAISafetyCheck, SAFETY_FOOTER } from '@/lib/ai/safety';
import { checkTokenLimit } from '@/lib/ai/tokens';
import { askAI } from '@/server/ai';
import type { AIFeatureKey } from '@/lib/ai/system-message';
import { revalidatePath } from 'next/cache';

export async function chatWithAI({
  feature,
  prompt,
  conversationId,
}: {
  feature: AIFeatureKey;
  prompt: string;
  conversationId?: string;
}) {
  const session = await requireSession();

  // 1. Safety Check (Input)
  const safetyResult = runAISafetyCheck(prompt);
  if (!safetyResult.allowed) {
    return { error: safetyResult.userMessage, safetyBlocked: true };
  }

  // 2. Fetch Usage & Quota
  // For the prototype, we fetch the first available package/budget
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { subscriptions: { include: { package: true }, where: { isActive: true } } }
  });

  const pkg = user?.subscriptions[0]?.package;
  const dailyLimit = pkg?.aiDailyTokens || 5000;
  const monthlyLimit = pkg?.aiMonthlyTokens || 50000;

  // Get current usage from logs (simplified for prototype)
  const today = new Date();
  today.setHours(0,0,0,0);
  const usedToday = await prisma.aIUsageLog.aggregate({
    where: { userId: session.id, createdAt: { gte: today } },
    _sum: { totalTokens: true }
  });
  
  const currentUsedToday = usedToday._sum.totalTokens || 0;

  // 3. Quota Check
  const quotaResult = checkTokenLimit({
    userId: session.id,
    feature,
    packageDailyLimit: dailyLimit,
    packageMonthlyLimit: monthlyLimit,
    prompt,
    usedToday: currentUsedToday,
    usedThisMonth: 0, // Simplified
  });

  if (!quotaResult.allowed) {
    return { error: quotaResult.reason, quotaBlocked: true };
  }

  // 4. Call AI
  try {
    const aiResponse = await askAI({
        feature,
        prompt,
        // We could fetch history if conversationId is provided
    });

    const totalTokens = (aiResponse.usage?.promptTokens || 0) + (aiResponse.usage?.completionTokens || 0);

    // 5. Log Usage
    await prisma.aIUsageLog.create({
        data: {
            userId: session.id,
            featureKey: feature,
            provider: 'gemini',
            model: 'gemini-1.5-flash',
            inputTokens: aiResponse.usage?.promptTokens || 0,
            outputTokens: aiResponse.usage?.completionTokens || 0,
            totalTokens,
            institutionId: session.institutionId,
        }
    });

    // 6. Save Conversation if requested
    if (conversationId) {
        await prisma.aIMessage.createMany({
            data: [
                { conversationId, role: 'user', content: prompt },
                { conversationId, role: 'assistant', content: aiResponse.text },
            ]
        });
    }

    revalidatePath('/en/dashboard');
    revalidatePath('/hi/dashboard');
    
    return { 
        text: aiResponse.text, 
        footer: SAFETY_FOOTER,
        usage: { total: totalTokens, remaining: dailyLimit - currentUsedToday - totalTokens }
    };

  } catch (error) {
    console.error('AI Chat Error:', error);
    return { error: 'Failed to connect to AI provider. Please try again later.' };
  }
}
