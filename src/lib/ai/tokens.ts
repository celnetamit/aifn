// Token estimation and quota enforcement — server-side only.
import 'server-only';

export interface TokenCheckInput {
  userId: string;
  feature: string;
  packageDailyLimit: number;
  packageMonthlyLimit: number;
  prompt: string;
  usedToday: number;
  usedThisMonth: number;
  globalShutdown?: boolean;
}

export interface TokenCheckResult {
  allowed: boolean;
  reason: string;
  estimatedTokens: number;
}

/** Rough token estimation: ~4 chars = 1 token */
export const estimateInputTokens = (text: string): number =>
  Math.max(1, Math.ceil(text.trim().length / 4));

/** Feature-specific expected output token limit */
const FEATURE_OUTPUT_LIMITS: Record<string, number> = {
  aiTutor: 700,
  promptCoach: 600,
  studyPlanner: 500,
  facultyAssistant: 1200,
  researchHelper: 1000,
  productivityAssistant: 800,
  translationDraft: 1000,
  contentSummarizer: 500,
  quizDraftAssistant: 1000,
  feedbackAssistant: 700,
};

export const estimateOutputTokens = (feature: string): number =>
  FEATURE_OUTPUT_LIMITS[feature] ?? 600;

export const checkTokenLimit = ({
  feature,
  packageDailyLimit,
  packageMonthlyLimit,
  prompt,
  usedToday,
  usedThisMonth,
  globalShutdown = false,
}: TokenCheckInput): TokenCheckResult => {
  if (globalShutdown || process.env.AI_GLOBAL_SHUTDOWN === 'true') {
    return {
      allowed: false,
      reason: 'AI features are currently disabled by the administrator. Please try again later.',
      estimatedTokens: 0,
    };
  }

  const estimatedTokens =
    estimateInputTokens(prompt) + estimateOutputTokens(feature);

  if (usedToday + estimatedTokens > packageDailyLimit) {
    return {
      allowed: false,
      reason: `Your daily AI token limit (${packageDailyLimit.toLocaleString()} tokens) has been reached. Please try again tomorrow.`,
      estimatedTokens,
    };
  }

  if (usedThisMonth + estimatedTokens > packageMonthlyLimit) {
    return {
      allowed: false,
      reason: `Your monthly AI token limit (${packageMonthlyLimit.toLocaleString()} tokens) has been reached. Consider upgrading your package.`,
      estimatedTokens,
    };
  }

  return {
    allowed: true,
    reason: 'Within token budget.',
    estimatedTokens,
  };
};
