# Architecture

## System Architecture
- **Frontend/Backend:** Next.js 15+ App Router for full-stack capabilities.
- **Styling:** Tailwind CSS + shadcn/ui.
- **Localization:** `next-intl` for bilingual (English-Hindi) routing.
- **Database:** PostgreSQL accessed via Prisma or Drizzle ORM.
- **Authentication:** Better Auth, Auth.js, or Supabase Auth.
- **State/Data Fetching:** TanStack Query where client-side data management is necessary.
- **File Storage:** Object Storage (S3-compatible, Cloudflare R2, or Supabase).

## Data Model (Detailed)
The schema implements a robust multi-tenant (institutional) structure with the following key modules:

### 1. User & Auth Module
- **User:** Central identity with roles (`learner`, `faculty`, `admin`, etc.) and institutional linkage.
- **UserProfile:** Extended learner data (type, specialization, college).
- **Institution:** Multitenancy container for users, subscriptions, and branded certificates.

### 2. LMS & Content Module
- **Track → Course → Module → Lesson → ContentBlock:** 5-level hierarchy for flexible curriculum mapping.
- **Locale Support:** Content fields are structured for English and Hindi support.
- **MediaAsset:** Centralized library with license tracking and approval workflows.

### 3. Assessment & Certification
- **Assessment:** Quizzes, pre/post-tests with passing rules.
- **Question:** Scenarios and MCQs mapped to Bloom's Taxonomy.
- **Certificate:** QR-verified credentials issued on completion or passing scores.

### 4. AI & Token Management
- **AIFeature:** Configuration for specific AI tools (Tutor, Planner, Assistant).
- **AITokenBudget/Limit:** Multi-level quota enforcement (Global, Institutional, Package, User).
- **AIUsageLog:** Granular tracking of tokens, safety flags, and provider costs.
- **AIConversation/Message:** Secure chat history retention.

### 5. Mentoring & Research
- **MentorProfile:** Specialized roles for project/publication guidance.
- **ProjectProposal:** Milestone-based tracking for postgraduate research.

### 6. Admin & Security
- **AdminAuditLog:** Tracks every admin/super-admin action.
- **SecurityAuditLog:** Monitors auth events and permission breaches.

## AI Layer
- Centralized provider abstraction layer (OpenAI/Gemini).
- Server-side token estimation and enforcement.
- Prompts injected securely via server environment, not exposed to client.

## Token Management
- Database-backed tracking of tokens per user, role, package, or institution.
- Global, provider, and model-level budgeting.
- Warning thresholds (50%, 80%, 100%).

## Deployment Plan
- **Platform:** Vercel (preferred for Next.js) or equivalent.
- **Database:** Managed PostgreSQL (Neon, Supabase).
- **CI/CD:** Automated testing (Vitest, Playwright, axe-core) before deployment to Staging/Production environments.
