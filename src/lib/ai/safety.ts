// AI Safety module — pattern-based input screening before calling any AI provider.
// Server-side only.
import 'server-only';

export type SafetyRisk =
  | 'patient_identifiable_data'
  | 'diagnosis_request'
  | 'prescription_request'
  | 'emergency_replacement'
  | 'prompt_injection'
  | 'fabricated_references'
  | 'fabricated_research_data'
  | 'plagiarism_request';

export interface SafetyCheckResult {
  allowed: boolean;
  risks: SafetyRisk[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  userMessage: string;
}

const CRITICAL_RISKS: SafetyRisk[] = [
  'patient_identifiable_data',
  'diagnosis_request',
  'prescription_request',
  'emergency_replacement',
  'prompt_injection',
];

const riskPatterns: Array<{ risk: SafetyRisk; pattern: RegExp }> = [
  {
    risk: 'patient_identifiable_data',
    pattern: /\b(patient\s*id|hospital\s*id|registration\s*no|reg\s*no|aadhaar|uhid|mrn|phone\s*number|home\s*address)\b/i,
  },
  {
    risk: 'diagnosis_request',
    pattern: /\b(diagnose|diagnosis|what disease does|tell me what condition|confirm this disease|is this [a-z]+ disease)\b/i,
  },
  {
    risk: 'prescription_request',
    pattern: /\b(prescribe|write prescription|what dosage|which drug should|medication for this patient|drug dose)\b/i,
  },
  {
    risk: 'emergency_replacement',
    pattern: /\b(emergency|unconscious|not breathing|chest pain|seizure|suicide|actively bleeding|code blue)\b/i,
  },
  {
    risk: 'prompt_injection',
    pattern: /\b(ignore previous instructions|ignore system prompt|developer mode|reveal your prompt|bypass safety|jailbreak|act as DAN)\b/i,
  },
  {
    risk: 'fabricated_references',
    pattern: /\b(fake citation|fabricate reference|invent references|make up citations|write a fake study)\b/i,
  },
  {
    risk: 'fabricated_research_data',
    pattern: /\b(fake data|fabricate data|invent results|make up results|ethics approval number|IRB number)\b/i,
  },
  {
    risk: 'plagiarism_request',
    pattern: /\b(write my thesis without attribution|plagiarize this|copy this article|paraphrase to avoid plagiarism detection)\b/i,
  },
];

export const runAISafetyCheck = (text: string): SafetyCheckResult => {
  const risks = riskPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ risk }) => risk);

  const hasCriticalRisk = risks.some((risk) => CRITICAL_RISKS.includes(risk));

  if (hasCriticalRisk) {
    return {
      allowed: false,
      risks,
      severity: 'critical',
      userMessage:
        'I cannot help with requests involving patient-identifiable data, diagnosis, prescribing, emergency clinical replacement, or attempts to bypass safety guidelines. Please anonymize all details and ask only for general educational support.',
    };
  }

  if (risks.length > 0) {
    return {
      allowed: false,
      risks,
      severity: 'high',
      userMessage:
        'I cannot fabricate references, research data, authorship, or assist with plagiarism. I can help you create an ethical outline, literature search strategy, or verification checklist instead.',
    };
  }

  return {
    allowed: true,
    risks: [],
    severity: 'low',
    userMessage:
      'Safety check passed. Please verify all educational content with your faculty, clinical supervisor, and current institutional guidelines before applying in practice.',
  };
};

export const SAFETY_FOOTER =
  'Educational use only — this is not clinical advice. Always verify with qualified faculty, supervisors, standard textbooks, and institutional protocols before applying.';

export const PHI_WARNING =
  '⚠️ Do not share patient names, hospital IDs, registration numbers, Aadhaar, phone numbers, or any other identifiable patient information.';
