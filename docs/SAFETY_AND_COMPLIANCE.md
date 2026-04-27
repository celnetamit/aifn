# Safety and Compliance

## Clinical Safety Policy
- The platform is strictly for educational and productivity purposes.
- All AI modules must output a disclaimer asserting that they do not replace professional medical judgment.
- AI must refuse any prompt soliciting diagnosis or prescriptive advice.

## AI Use Boundaries
- Admins can globally or selectively disable AI features.
- AI outputs used for teaching or assessment must be marked as "Draft" and require human review before publishing.
- Rate limiting and token usage must be monitored to detect and prevent misuse (e.g., automated scraping or prompt injection).

## Privacy Policy & DPDP Compliance
- **Data Minimization:** Collect only necessary learner data (name, role, institution, email).
- **Consent:** Clear consent required per the Indian Digital Personal Data Protection (DPDP) Act 2023.
- **Data Export/Deletion:** Workflow placeholders must be built to allow users to request data export or deletion.
- **PHI/PII Restrictions:** Clear UI warnings forbidding the upload of identifiable patient data. Prompts should be scrubbed or warnings issued if PII is detected.

## Content Review Checklist
- Is the content evidence-based and aligned with INC standards?
- Are references included and verifiable (not fabricated)?
- Is the language respectful and culturally appropriate for the Indian nursing context?
- Is there an English and Hindi equivalent?

## Hallucination and Citation Policy
- AI features must be instructed not to claim certainty without source support.
- The AI should encourage verification from standard textbooks and institutional guidelines.
- Any fabricated citation detected during human review must be discarded.

## Accessibility Checklist
- Keyboard navigability.
- Semantic HTML tags.
- Screen-reader labels (`aria-label`, alt texts).
- Minimum color contrast ratios.
- Support for reduced motion and text scaling.
- Meets WCAG 2.2 AA standards.

## Security Checklist
- Secure headers and HTTPS enforcement.
- CSRF and XSS protection.
- SQL injection prevention (via Prisma/Drizzle ORM).
- Strict role-based authorization for protected routes.
- File upload MIME type and size validation.
- No exposed secrets or API keys on the frontend.
