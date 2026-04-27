# Focus and Scope

## MVP Scope
- **Core Platform:** Bilingual (English/Hindi) mobile-first SaaS/LMS built on Next.js.
- **Authentication:** Email/password and optional Google login with strict RBAC (Learner, Faculty, Admin, Mentor, etc.).
- **Content:** Foundational AI courses for students, working nurses, faculty, and postgraduates.
- **AI Integration:** Secure AI API integration (e.g., OpenAI/Gemini) subject to global safety system prompts and token limits.
- **Assessments:** MCQs, scenarios, assignments, and certificates.
- **Dashboards:** Role-specific portals (Learner, Faculty, Admin, Mentor).

## Excluded Scope (Out of MVP)
- Native mobile apps (iOS/Android) — relying on responsive mobile web instead.
- Automated human-level content translation (using `next-intl` and structured bilingual fields instead).
- Advanced automated clinical decision making.

## Non-Negotiable Constraints
- **Safety First:** No PII/PHI uploads; no clinical diagnostic replacements.
- **Compliance:** Indian DPDP Act alignment; WCAG 2.2 AA accessibility; OWASP Top 10 mitigation.
- **Performance:** Optimized for low-bandwidth usage (mobile-first).

## Future Roadmap
- Deeper integrations with specific hospital EHR systems (if authorized).
- Advanced offline PWA functionality.
- Custom native mobile applications.
