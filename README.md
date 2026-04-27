# AI for Nurses India — aifn-2

A bilingual (English/Hindi) mobile-first SaaS/LMS platform for Indian nursing education, built with Next.js 15, Prisma, and a secure AI layer.

## Stack

- **Framework:** Next.js 15 App Router + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **i18n:** next-intl (English + Hindi)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Custom HMAC session auth + RBAC
- **AI:** OpenAI / Gemini — provider abstraction with safety system prompt
- **Testing:** Vitest + Playwright + axe-core

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.example .env

# 3. Fill in DATABASE_URL and other secrets in .env

# 4. Generate Prisma client
npm run prisma:generate

# 5. Run migrations
npm run prisma:migrate:dev

# 6. Seed the database
npm run prisma:seed

# 7. Start dev server
npm run dev
```

## Documentation

All project documentation lives in `/docs`:

| File | Purpose |
|------|---------|
| `BRAIN.md` | Product intent & architecture decisions |
| `TASK_MEMORY.md` | Chronological task log |
| `FOCUS_AND_SCOPE.md` | MVP scope & constraints |
| `SYSTEM_MESSAGE.md` | Universal AI safety system message |
| `SAFETY_AND_COMPLIANCE.md` | Clinical safety & DPDP compliance |
| `ARCHITECTURE.md` | System architecture & data model |
| `CONTENT_STRATEGY.md` | Curriculum & content guidelines |
| `OPEN_QUESTIONS.md` | Pending product owner decisions |

## Environment Variables

See `.env.example` for all required variables.

## Safety Notice

This platform is for educational use only. It does not replace professional medical judgment. All AI outputs include safety disclaimers. Patient-identifiable data must never be uploaded.
