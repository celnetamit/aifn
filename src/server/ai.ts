import { getSystemPromptBundle, type AIFeatureKey } from '@/lib/ai/system-message';

export type AIProvider = 'openai' | 'gemini';

// Mock implementation to avoid missing dependency crashes in the current environment.
export async function askAI({
  feature,
  prompt,
  history = [],
  provider = (process.env.AI_PROVIDER_DEFAULT as AIProvider) || 'gemini',
}: {
  feature: AIFeatureKey;
  prompt: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  provider?: AIProvider;
}) {
  const { systemMessage, developerInstruction } = getSystemPromptBundle(feature);
  void history;
  void provider;
  void systemMessage;
  void developerInstruction;
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate a mock response based on the feature
  let mockText = "";
  if (feature === 'lesson_tutor') {
    mockText = "This is a simulated AI Tutor response. Based on your nursing question regarding '" + prompt + "', I would typically consult the verified nursing knowledge base. In this mock mode, I'm just acknowledging your query. Remember to always double-check clinical protocols with your institution's guidelines.";
  } else {
    mockText = "This is a generic simulated AI response for feature: " + feature + ". Your input was: " + prompt;
  }

  return {
    text: mockText,
    usage: { promptTokens: 15, completionTokens: 45, totalTokens: 60 },
    finishReason: 'stop',
  };
}

// For streaming responses (Mock)
export async function streamAI({
  feature,
  prompt,
  history = [],
  provider = (process.env.AI_PROVIDER_DEFAULT as AIProvider) || 'gemini',
}: {
  feature: AIFeatureKey;
  prompt: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  provider?: AIProvider;
}) {
  void feature;
  void prompt;
  void history;
  void provider;
  // Mocking streaming is complex without the ai sdk, so we'll throw an error 
  // instructing the developer to implement it later or use askAI instead for now.
  throw new Error("Streaming is not supported in the mock implementation. Please use askAI.");
}
