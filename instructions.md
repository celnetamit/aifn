You are acting as a senior product architect, full-stack engineer, AI safety engineer, nursing education curriculum designer, medical pedagogy specialist, privacy/security engineer, and QA lead.

Build a production-ready, mobile-first, bilingual English-Hindi web application named:

AI for Nurses India

The application is for Indian nursing graduates, post-basic learners, postgraduate nursing students, working nurses, nurse educators/faculty, mentors, and nursing institutions. The goal is to provide comprehensive AI awareness, AI literacy, practical AI tool skills, responsible use of AI in nursing education and practice, productivity improvement, research support, teaching support, career enhancement, guided mentoring, self-assessment, certification, and advanced project/publication assistance.

This application must be suitable for Indian nursing education contexts and must align conceptually with Indian Nursing Council-approved graduate, post-basic, postgraduate, specialty, PhD, and continuing nursing education expectations. Do not copy restricted curriculum text verbatim. Use official INC curriculum/regulation references only as authoritative mapping sources and create original pedagogical content. All learning content must be humanized, plagiarism-free, evidence-based, medically safe, and cite authentic sources.

Primary build environment:
- Google Antigravity as the agentic development workspace.
- Codex / latest available high-capability coding model as the development agent.
- Follow an agentic workflow: plan → create files → implement → test → document → verify → record decisions.

Do not create a loose prototype. Build a stable, secure, modular, production-oriented MVP that can be expanded into a commercial SaaS/LMS platform.

============================================================
0. FIRST ACTIONS REQUIRED
============================================================

Before coding, create the following files and keep them updated after each major implementation step:

/docs/BRAIN.md
Purpose:
- Permanent project brain.
- Store product intent, target users, architecture decisions, domain assumptions, safety boundaries, content standards, references, terminology, and current implementation status.

/docs/TASK_MEMORY.md
Purpose:
- Chronological task memory.
- Log completed tasks, pending tasks, files changed, bugs found, tests run, test results, assumptions, unresolved questions, and next actions.

/docs/FOCUS_AND_SCOPE.md
Purpose:
- Define current MVP scope, excluded scope, future roadmap, and non-negotiable constraints.
- Prevent feature creep.
- Each phase must refer back to this file.

/docs/SYSTEM_MESSAGE.md
Purpose:
- Store the universal AI system message that must be used across all AI tutor, AI assistant, AI assessment, AI content drafting, AI feedback, AI mentor, and admin AI features.
- This system message must be loaded server-side for every AI call. It must not be editable by ordinary users.

/docs/SAFETY_AND_COMPLIANCE.md
Purpose:
- Clinical safety policy.
- AI use boundaries.
- Privacy policy notes.
- Indian DPDP compliance checklist.
- Content review checklist.
- Hallucination and citation policy.
- Accessibility checklist.
- Security checklist.

/docs/ARCHITECTURE.md
Purpose:
- System architecture, data model, API design, authentication, authorization, storage, AI layer, token management, admin module, deployment plan, and testing strategy.

/docs/CONTENT_STRATEGY.md
Purpose:
- Course taxonomy.
- Nursing learner personas.
- Curriculum mapping.
- Assessment design.
- Bilingual content workflow.
- Reference and licensing policy.
- Media policy for images/videos.

/docs/OPEN_QUESTIONS.md
Purpose:
- Store decisions that need product owner input.
- Do not block MVP unnecessarily. Use sensible defaults and mark them as configurable.

Update TASK_MEMORY.md after every meaningful implementation step.

============================================================
1. QUESTIONS TO ASK THE PRODUCT OWNER BEFORE FINAL PRODUCTION
============================================================

Ask these questions at the beginning, but do not block MVP creation. If answers are unavailable, implement sensible defaults and mark the question in OPEN_QUESTIONS.md.

A. Institution and business model
1. Is this for one institution first, or should it support multiple institutions from day one?
2. Should pricing be individual learner pricing, institutional licensing, or both?
3. Preferred payment gateway: Razorpay, Stripe, manual bank transfer, UPI, or all?
4. Should certificates be free, paid, or tied to package level?

B. Content depth
5. Should the first launch focus on B.Sc. Nursing, Post Basic B.Sc. Nursing, M.Sc. Nursing, working nurses, faculty, or all tracks?
6. Which specialty modules are priority: community health, critical care, mental health, obstetrics, pediatrics, medical-surgical, nursing education, research, administration?
7. Should Hindi content be full human translation, AI-assisted translation with review, or English-first with Hindi summaries?

C. AI usage
8. Which AI providers should be enabled initially: OpenAI, Google Gemini, local model, or provider-agnostic?
9. Should learner AI usage be capped daily, monthly, per course, or by package?
10. Should faculty/admins be able to create AI-generated content drafts?

D. Compliance and safety
11. Should user-uploaded clinical examples be allowed?
12. Should PHI/patient-identifiable data uploads be blocked automatically?
13. Should the platform include a medical disclaimer on every AI interaction page?

E. Media
14. Where should videos be stored: YouTube/Vimeo links, S3-compatible storage, Cloudflare R2, Supabase Storage, or self-hosted?
15. Should admins upload original videos, embed open-access videos, or both?

F. Deployment
16. Preferred deployment: Vercel, AWS, Google Cloud, Azure, or Indian cloud provider?
17. Should the app support PWA/offline mode for low-bandwidth users?
18. Should there be a native mobile app later?

============================================================
2. CORE PRODUCT REQUIREMENTS
============================================================

Build a bilingual mobile-first SaaS/LMS platform with these modules:

2.1 Public website
- Landing page in English and Hindi.
- Clear value proposition:
  “AI literacy, safe AI use, productivity, research, teaching, and career growth for Indian nurses.”
- Course/package overview.
- Pricing page.
- Faculty/institution page.
- Mentor/project/publication assistance page.
- FAQ.
- Contact/enquiry form.
- Login/register.

2.2 Authentication and user management
Support:
- Email/password login.
- Optional Google login.
- Password reset.
- Email verification.
- Role-based access control.
- Institution-based grouping.
- User profile with learner type:
  - B.Sc. Nursing student
  - Post Basic B.Sc. Nursing student
  - M.Sc. Nursing student
  - PhD scholar
  - Working nurse
  - Nurse educator/faculty
  - Administrator
  - Mentor
  - Institutional coordinator

Roles:
- guest
- learner
- professional_nurse
- postgraduate_learner
- faculty
- mentor
- content_creator
- content_reviewer
- institution_admin
- finance_admin
- admin
- super_admin

Use RBAC and, where required, ABAC:
- Users can only access content allowed by their package, role, institution, and enrollment.
- Admins can manage platform-wide data.
- Institution admins can manage only their institution.
- Faculty can manage assigned cohorts and assessments.
- Mentors can access assigned mentees/projects only.

2.3 Bilingual English-Hindi support
- Every learner-facing page must have an English/Hindi toggle.
- Use locale routes:
  /en/...
  /hi/...
- Use next-intl or equivalent.
- Store bilingual content as structured fields:
  title_en, title_hi
  summary_en, summary_hi
  body_en, body_hi
- Do not mix English and Hindi in the same content block unless intentionally shown as glossary.
- Add AI glossary with English term, Hindi explanation, and nursing example.
- Use clear Hindi suitable for nursing students; avoid overly Sanskritized or machine-like Hindi.

2.4 Mobile-first design
- Design first for 360px to 430px mobile screens.
- Responsive breakpoints for tablets and desktop.
- Large readable fonts.
- High contrast.
- Sticky bottom navigation for learner app.
- Accessible touch targets.
- Avoid dense tables on mobile; use cards.
- Support low-bandwidth mode:
  - compressed images
  - transcript-first videos
  - downloadable PDFs where allowed
  - lazy loading
  - resumable video progress

2.5 Course and content system
Content hierarchy:
- Track
- Course
- Module
- Lesson
- Activity
- Assessment
- Certificate

Tracks:
1. AI Foundations for Nursing Students
2. AI for Postgraduate Nursing and Research
3. AI for Working Nurses and Clinical Productivity
4. AI for Nursing Faculty and Educators
5. Advanced AI, Projects, Mentoring, and Publication Support

Each lesson may contain:
- Objectives
- Reading content
- Short video or embedded open-access video
- Image/diagram
- Key terms
- Nursing example
- Safe-use warning
- Practical AI tool demo
- Prompt template
- Reflection activity
- Quiz
- Assignment
- References
- Hindi version
- Downloadable summary
- Estimated time

2.6 Core curriculum topics
Include original content modules covering:

A. AI literacy
- What is AI?
- Machine learning, deep learning, NLP, generative AI, LLMs
- AI versus automation
- Chatbots and clinical decision support
- Prompt engineering basics
- AI hallucinations
- Bias, fairness, explainability, accountability

B. AI in nursing education
- Study planning
- Concept explanation
- Case-based learning
- Simulation preparation
- OSCE preparation
- Reflective writing support
- Ethical academic use
- Plagiarism and citation awareness

C. AI in clinical nursing productivity
- Nursing documentation support
- Patient education drafting
- Discharge instruction simplification
- Shift handover structuring
- Care plan drafting support
- Infection control education
- Medication information support with safety checks
- Clinical escalation boundaries
- Never replace clinical judgment

D. AI for postgraduate nursing
- Literature search strategy
- Research question framing
- PICO/PEO
- Proposal drafting support
- Data cleaning basics
- Quantitative and qualitative research support
- Reference management
- Manuscript structure
- Journal selection awareness
- Publication ethics

E. AI for faculty
- Lesson planning
- Competency-based education
- Bloom’s taxonomy
- Case vignette generation
- Rubric design
- MCQ and SAQ drafting
- OSCE station drafting
- Feedback generation
- Academic integrity in AI era
- AI policy for nursing colleges

F. AI tools and software awareness
- ChatGPT / OpenAI tools
- Gemini
- Claude
- Perplexity
- Elicit / research discovery tools
- Zotero / Mendeley
- Canva / presentation tools
- Grammarly-like writing tools
- Google Workspace AI features
- Microsoft Copilot
- AI transcription tools
- Data analysis tools
- Image/video generation awareness
- No endorsement unless configured by admin
- Tool directory must include safety, cost, privacy, limitations, and use cases

G. Safety and ethics
- Patient privacy
- Data minimization
- Consent
- Avoid uploading identifiable patient data
- AI bias
- Hallucinations
- Verification
- Human oversight
- Professional accountability
- Documentation of AI-assisted work
- Institutional AI policy

H. Career and productivity
- Resume/CV support
- Interview preparation
- Communication skills
- Academic writing
- Teaching portfolio
- CPD planning
- Conference abstract drafting
- Research collaboration readiness

2.7 Assessment engine
Include:
- Pre-test and post-test
- MCQs
- Multi-select questions
- True/false
- Short answer
- Scenario-based questions
- Reflective assignments
- Prompt-practice assignments
- Rubric-based faculty grading
- AI-assisted formative feedback with safety guardrails
- Randomized question banks
- Attempt history
- Progress reports
- Certificate eligibility rules

Assessment design standards:
- Use Bloom’s taxonomy levels.
- Use competency-based learning outcomes.
- Use case-based nursing scenarios.
- Provide rationale for answers.
- Avoid unsafe clinical advice.
- Flag all AI-generated assessment drafts for human review before publishing.

2.8 Dashboards
Learner dashboard:
- Enrolled courses
- Progress
- Scores
- Certificates
- AI token usage
- Saved prompts
- Assignments
- Mentor sessions
- Recommended next module

Faculty dashboard:
- Cohorts
- Student progress
- Assessment results
- At-risk learners
- Assignment review
- Content suggestions
- Discussion moderation

Admin dashboard:
- Users
- Roles
- Institutions
- Packages
- Courses
- Media library
- Content workflow
- Payments
- Certificates
- AI usage
- Token limits
- Audit logs
- Security logs
- Reports
- Support tickets

Mentor dashboard:
- Assigned mentees
- Project proposals
- Manuscript support requests
- Session notes
- Milestones
- Feedback history

2.9 Package and pricing system
Create package system with configurable pricing. Do not hard-code business values.

Default packages:
1. Basic Awareness
   - Intro modules
   - Limited quizzes
   - Low AI usage quota
   - No certificate or basic participation certificate

2. Professional Skills
   - Full foundational course
   - Practical AI tools
   - Self-assessments
   - Standard certificate
   - Moderate AI quota

3. Advanced Academic & Research
   - Postgraduate/research modules
   - Project templates
   - Publication guidance
   - Mentor request option
   - Higher AI quota

4. Institutional / Faculty Plus
   - Faculty dashboard
   - Cohort management
   - Content customization
   - Bulk users
   - Advanced reports
   - Admin token pool
   - Institution certificate branding

5. Optional Premium Mentor Add-on
   - One-to-one mentoring
   - Project assistance
   - Manuscript/publication support
   - Advanced review

Support:
- Coupons
- Free trial
- Manual enrollment
- Payment status
- Invoice metadata
- Institution bulk licenses
- Package expiry
- Renewal reminders

2.10 AI features
Build AI features carefully and safely:
- AI tutor
- AI prompt coach
- AI study planner
- AI faculty assistant
- AI quiz draft assistant
- AI assignment feedback assistant
- AI research assistant
- AI productivity assistant
- AI translation draft assistant
- AI content summarizer
- AI tool recommendation assistant

All AI features must:
- Use /docs/SYSTEM_MESSAGE.md.
- Add feature-specific developer prompt.
- Use retrieval only from approved content where required.
- Refuse diagnosis, prescription, or unsafe patient-specific advice.
- Tell users to verify with faculty, clinical supervisor, institutional policy, or licensed clinician where applicable.
- Never claim certainty without source support.
- Show citations/references for educational or clinical claims.
- Block or warn against identifiable patient data.
- Log usage metadata without storing sensitive prompt content unless user/admin consent and policy permit.
- Respect token limits.

2.11 Token management in admin
Create a complete AI token management module.

Admin must be able to:
- Set global monthly token budget.
- Set provider-level budgets.
- Set model-level budgets.
- Set role-level token limits.
- Set package-level token limits.
- Set institution-level token pools.
- Set per-user daily/monthly token limits.
- Pause AI features globally.
- Pause AI features for one user/institution.
- View usage by:
  - user
  - role
  - package
  - institution
  - feature
  - model
  - date range
- Export token usage CSV.
- Alert when usage reaches 50%, 80%, 95%, 100%.
- Configure fallback models.
- Configure max input/output tokens per feature.
- Configure whether chat history is retained.
- Configure safe truncation/summarization of long conversations.

Token safety:
- Use server-side token estimation before AI call.
- Refuse or shorten request if above limit.
- Summarize long conversations into safe memory.
- Never allow learners to override system prompt.
- Do prompt injection defense.
- Add audit logs for admin changes.

2.12 Media/content management
Admin/content creators must be able to:
- Upload images
- Upload videos
- Add external video links
- Add transcripts
- Add captions
- Add alt text
- Add license metadata
- Add source/reference metadata
- Approve/unapprove media
- Replace media
- Archive media
- Track where media is used

Media rules:
- Store title, description, creator, source URL, license type, commercial-use permission, attribution text, date accessed, and reviewer.
- Do not use images/videos unless license allows intended use.
- Prefer original content, government/open educational resources, public domain, CC0, CC BY, or explicitly permitted institutional content.
- Content marked non-commercial must not be used in paid/commercial packages unless reviewed and allowed by policy.
- Every image needs alt text.
- Every video should have transcript/captions where possible.

2.13 Certificates
Certificate module:
- Completion certificate
- Assessment-based certificate
- Faculty development certificate
- Advanced project certificate
- QR code verification
- Certificate ID
- Issue date
- Learner name
- Course name
- Score/grade if configured
- Institution logo if institutional package
- Admin certificate template editor

2.14 Mentoring and publication support
Build module for advanced users:
- Project idea submission
- Mentor matching
- Milestone tracking
- Literature review checklist
- Proposal checklist
- Ethics committee readiness checklist
- Manuscript structure checklist
- Journal selection warning module
- Predatory journal awareness
- Plagiarism policy
- AI disclosure guidance
- Mentor feedback
- Paid/free status

Do not promise publication acceptance. Use language:
“publication guidance”, “manuscript development support”, “journal readiness support”, “mentor-assisted academic writing”.

============================================================
3. TECHNOLOGY STACK
============================================================

Use the following stack unless a serious technical reason requires change. If changed, document in ARCHITECTURE.md.

Frontend:
- Next.js 15+ App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- lucide-react
- next-intl for bilingual routing
- React Hook Form
- Zod
- TanStack Query where useful
- Recharts for dashboards
- TipTap or MDX editor for content authoring

Backend:
- Next.js server actions/API routes
- PostgreSQL
- Prisma ORM or Drizzle ORM
- Supabase, Neon, or managed PostgreSQL
- Redis/Upstash for rate limits, queues, and token counters
- Object storage: S3-compatible / Cloudflare R2 / Supabase Storage
- Background jobs: BullMQ or serverless-compatible queue
- Email: Resend, SendGrid, or AWS SES
- Payments: Razorpay first for India; Stripe optional

Authentication:
- Better Auth, Auth.js, or Supabase Auth
- Role-based authorization middleware
- Secure session handling
- MFA-ready architecture for admins

AI layer:
- Provider abstraction layer
- OpenAI SDK
- Google GenAI SDK if Gemini is enabled
- Vercel AI SDK optional
- Central prompt registry
- Central system message
- Token accounting
- Prompt injection checks
- Content safety filters
- RAG-ready design using pgvector or external vector store

Testing:
- Vitest
- React Testing Library
- Playwright
- axe-core accessibility checks
- ESLint
- Prettier
- TypeScript strict mode
- Zod validation tests

Security:
- OWASP Top 10 mitigation
- Secure headers
- CSRF protection where applicable
- XSS prevention
- SQL injection prevention through ORM
- Server-side authorization checks
- File upload validation
- MIME type validation
- Virus scan hook placeholder
- Rate limiting
- Audit logs
- Admin action logs
- Secrets via environment variables only

Deployment:
- Vercel or equivalent for web
- Managed PostgreSQL
- Object storage
- Redis
- CI/CD with tests
- Environment-specific config:
  - development
  - staging
  - production

============================================================
4. DATABASE MODEL REQUIREMENTS
============================================================

Design database schema for at least:

User
Profile
Institution
Role
Permission
Package
Subscription
Payment
Course
Track
Module
Lesson
LessonTranslation
ContentBlock
MediaAsset
MediaLicense
Reference
Enrollment
Progress
Assessment
Question
QuestionOption
AssessmentAttempt
Answer
Assignment
AssignmentSubmission
Rubric
RubricScore
Certificate
CertificateTemplate
AIFeature
AIUsageLog
AITokenBudget
AITokenLimit
AIConversation
AIMessage
PromptTemplate
SystemPromptVersion
AdminAuditLog
SecurityAuditLog
SupportTicket
MentorProfile
MentorAssignment
ProjectProposal
ProjectMilestone
Notification
Coupon
InvoiceMetadata
ContentReview
ContentVersion

Important:
- Use soft delete where appropriate.
- Add createdAt, updatedAt, createdBy, updatedBy.
- Add institutionId where multi-tenancy applies.
- Add published/draft/review status for content.
- Add versioning for content and prompts.
- Add audit logs for security-sensitive changes.

============================================================
5. UNIVERSAL SYSTEM MESSAGE TO USE THROUGHOUT APPLICATION
============================================================

Create /docs/SYSTEM_MESSAGE.md with this content and ensure the same policy is implemented in code as a server-side prompt source:

SYSTEM MESSAGE:

You are “AI for Nurses India”, an educational AI assistant for nursing students, postgraduate nursing learners, working nurses, and nursing faculty in India.

Your role is to support learning, productivity, teaching, research literacy, responsible AI use, and professional development. You must follow evidence-based, ethical, privacy-preserving, and safety-first principles.

You are not a doctor, nurse practitioner, prescribing clinician, legal advisor, or substitute for faculty, institutional policy, clinical supervision, or licensed medical judgment.

Never provide patient-specific diagnosis, treatment orders, medication prescriptions, or emergency instructions as a replacement for clinical care. For urgent or patient-specific issues, advise the user to contact a qualified clinician, supervisor, emergency service, or institutional authority.

Never encourage uploading identifiable patient data. If the user shares names, registration numbers, phone numbers, addresses, photos, reports, hospital IDs, or other identifiable patient data, warn them, avoid using it, and ask them to anonymize.

For educational clinical content:
- Be cautious.
- State limitations.
- Encourage verification from standard textbooks, institutional protocols, clinical supervisors, and current guidelines.
- Provide references where possible.
- Avoid fabricating citations.
- Clearly distinguish general education from clinical advice.

For AI literacy:
- Explain concepts clearly for nursing learners.
- Use examples from nursing education, clinical workflow, teaching, research, and administration.
- Discuss benefits, risks, hallucinations, bias, privacy, accountability, and human oversight.

For faculty users:
- Support curriculum planning, lesson planning, assessment drafting, rubrics, feedback, and academic integrity.
- Mark AI-generated content as draft until human reviewed.

For research users:
- Support research planning, literature search strategy, manuscript structure, and ethical writing.
- Do not fabricate data, references, results, or authorship.
- Warn against plagiarism, predatory journals, and undisclosed AI misuse.

Tone:
- Professional
- Supportive
- Clear
- Humanized
- Respectful
- Suitable for Indian nursing education
- Use English or Hindi according to user preference

Always prioritize:
1. Learner safety
2. Patient privacy
3. Evidence-based education
4. Human oversight
5. Transparency
6. Cultural and linguistic appropriateness
7. Accessibility
8. Professional accountability

END SYSTEM MESSAGE.

============================================================
6. CONTENT QUALITY AND PEDAGOGY STANDARDS
============================================================

All content must:
- Be original.
- Be plagiarism-free.
- Be written in clear medical/nursing pedagogy style.
- Use learning objectives.
- Use Bloom’s taxonomy.
- Include practical nursing examples.
- Include safe-use warnings for AI.
- Include references.
- Include Hindi translation or Hindi equivalent.
- Avoid overclaiming AI capabilities.
- Avoid replacing professional judgment.
- Include reflection and assessment.

Use these educational frameworks:
- Competency-based education
- Bloom’s taxonomy
- Miller’s pyramid where applicable
- Kirkpatrick evaluation levels for program evaluation
- Adult learning principles
- Scenario-based learning
- Reflective practice
- Objective Structured Clinical Examination style activities where appropriate

Reference standards to include in docs:
- Indian Nursing Council official regulations/curricula
- WHO ethics and governance of AI for health
- WHO regulatory considerations on AI for health
- India Digital Personal Data Protection Act, 2023
- WCAG 2.2 accessibility
- OWASP Top 10 web application security
- EQUATOR Network reporting guidelines for research education where relevant
- ICMJE publication ethics where relevant
- COPE publication ethics where relevant

Do not auto-copy external content. Summarize, transform, cite, and create original teaching material.

============================================================
7. SECURITY, PRIVACY, AND COMPLIANCE
============================================================

Implement:
- DPDP-aware consent structure.
- Clear privacy notice.
- User data export/delete request workflow placeholder.
- Data minimization.
- Purpose limitation.
- Role-based data access.
- Secure password/session handling.
- Admin audit logs.
- AI prompt/content logging controls.
- User-visible AI safety notice.
- PHI warning before AI chat/upload.
- File upload validation.
- Rate limiting.
- Server-side authorization on every protected route.
- No secrets in client bundle.
- No API keys in frontend.
- No unsafe eval.
- No raw HTML rendering unless sanitized.
- Encryption in transit.
- Encryption at rest where provider supports.
- Backups and restore plan in docs.

Add visible warning in AI tools:
“Do not upload identifiable patient information. Use anonymized educational cases only.”

============================================================
8. ACCESSIBILITY AND UX
============================================================

Follow WCAG 2.2 AA as the target.

Implement:
- Keyboard navigability.
- Proper semantic HTML.
- Screen-reader labels.
- Alt text.
- Captions/transcripts for video where possible.
- Color contrast.
- Focus states.
- Reduced motion support.
- Font scaling.
- Mobile-first layout.
- Hindi font rendering support.
- Avoid text embedded inside images.
- Clear error messages.
- Form validation messages.

============================================================
9. DEVELOPMENT WORKFLOW
============================================================

Work in phases.

PHASE 1: Project setup
- Initialize Next.js TypeScript app.
- Install UI, auth, validation, database, i18n, testing, and linting packages.
- Configure project structure.
- Create docs files.
- Create environment example.
- Add README.

PHASE 2: Architecture and database
- Create schema.
- Add migrations.
- Seed roles, permissions, packages, basic courses.
- Add admin user seed placeholder.
- Document schema.

PHASE 3: UI shell and bilingual routes
- Landing page.
- Auth pages.
- Dashboard shell.
- English/Hindi toggle.
- Mobile navigation.
- Admin navigation.

PHASE 4: Authentication and RBAC
- Register/login.
- Role assignment.
- Protected routes.
- Institution scoping.
- Admin-only areas.

PHASE 5: Course/content system
- Course listing.
- Module pages.
- Lesson viewer.
- Progress tracking.
- Admin content CRUD.
- Content review workflow.
- Media upload/link management.

PHASE 6: Assessment system
- Quiz engine.
- Attempts.
- Scoring.
- Rationales.
- Reports.
- Certificates.

PHASE 7: AI layer
- Provider abstraction.
- System prompt loader.
- Token estimation.
- Token budgets.
- AI tutor MVP.
- AI prompt coach.
- Admin token dashboard.
- Safety filters.

PHASE 8: Dashboards
- Learner dashboard.
- Faculty dashboard.
- Admin dashboard.
- Mentor dashboard.
- Usage reports.

PHASE 9: Payments/packages
- Package system.
- Subscription records.
- Razorpay-ready integration.
- Manual enrollment.
- Institution bulk licensing.

PHASE 10: Mentoring/projects/publication support
- Project proposal.
- Mentor assignment.
- Milestones.
- Feedback.
- Manuscript checklist.

PHASE 11: QA, hardening, documentation
- Unit tests.
- E2E tests.
- Accessibility tests.
- Security review.
- Seed demo content.
- Deployment guide.
- Admin manual.
- Faculty manual.
- Learner manual.

After each phase:
- Update TASK_MEMORY.md.
- Update BRAIN.md if product knowledge changed.
- Update OPEN_QUESTIONS.md.
- Run tests.
- Fix failures.
- Summarize what changed.

============================================================
10. FILE STRUCTURE
============================================================

Use this structure or a clearly documented equivalent:

/app
  /[locale]
    /(public)
    /(auth)
    /(learner)
    /(faculty)
    /(admin)
    /(mentor)
  /api

/components
  /ui
  /layout
  /forms
  /course
  /assessment
  /dashboard
  /ai
  /media
  /admin

/lib
  /auth
  /db
  /i18n
  /ai
  /tokens
  /security
  /rbac
  /validation
  /storage
  /payments
  /analytics
  /content
  /references

/messages
  en.json
  hi.json

/prisma or /db
  schema
  migrations
  seed

/docs
  BRAIN.md
  TASK_MEMORY.md
  FOCUS_AND_SCOPE.md
  SYSTEM_MESSAGE.md
  SAFETY_AND_COMPLIANCE.md
  ARCHITECTURE.md
  CONTENT_STRATEGY.md
  OPEN_QUESTIONS.md
  ADMIN_MANUAL.md
  FACULTY_MANUAL.md
  LEARNER_MANUAL.md
  DEPLOYMENT.md

/tests
  /unit
  /integration
  /e2e
  /accessibility

/public
  /images
  /icons

============================================================
11. ADMIN TOKEN MANAGEMENT IMPLEMENTATION DETAIL
============================================================

Create pages:
- /admin/ai-usage
- /admin/ai-budgets
- /admin/ai-feature-controls
- /admin/ai-prompt-versions
- /admin/ai-safety-logs

Create database tables:
- ai_features
- ai_usage_logs
- ai_token_budgets
- ai_token_limits
- ai_prompt_templates
- system_prompt_versions

AI usage log fields:
- id
- userId
- institutionId
- featureKey
- provider
- model
- inputTokens
- outputTokens
- totalTokens
- estimatedCost
- status
- safetyFlags
- createdAt

Token budget fields:
- id
- scopeType: global | institution | package | role | user | feature
- scopeId
- monthlyLimitTokens
- dailyLimitTokens
- isEnabled
- alertThresholds
- createdBy
- updatedBy

Before every AI request:
1. Authenticate user.
2. Check feature availability.
3. Check package entitlement.
4. Check role permission.
5. Estimate token usage.
6. Check daily/monthly limit.
7. Load system message.
8. Add feature-specific prompt.
9. Apply prompt-injection guard.
10. Call provider.
11. Log usage.
12. Return answer with safety note when relevant.

============================================================
12. CONTENT SEED REQUIREMENTS
============================================================

Create seed content for MVP:

Course 1:
AI Awareness for Nursing Students
Modules:
- Introduction to AI
- Generative AI and Chatbots
- Benefits and Risks of AI in Nursing
- Safe Prompting Basics
- Patient Privacy and AI
- Self-assessment

Course 2:
AI for Nursing Faculty
Modules:
- AI for Lesson Planning
- AI for Assessment Drafting
- AI for Feedback
- AI and Academic Integrity
- Building College AI Use Guidelines

Course 3:
AI for Postgraduate Nursing Research
Modules:
- Research Question Development
- Literature Search with AI Support
- Proposal Drafting Support
- Manuscript Structure
- Publication Ethics and Predatory Journals

Course 4:
AI for Working Nurses
Modules:
- Documentation Productivity
- Patient Education Drafting
- Shift Handover Structuring
- Clinical Safety Boundaries
- Professional Accountability

For each seed lesson:
- English title
- Hindi title
- English summary
- Hindi summary
- Learning objectives
- Main content
- Nursing example
- AI safety note
- 3 quiz questions
- References placeholder
- Estimated duration

============================================================
13. ACCEPTANCE CRITERIA
============================================================

The MVP is acceptable only if:

A. Technical
- App builds successfully.
- TypeScript has no critical errors.
- Lint passes or documented exceptions exist.
- Core routes work.
- Database schema is valid.
- Seed works.
- Auth works.
- RBAC works.
- Course pages work.
- Admin pages work.
- AI token check is enforced server-side.
- No API keys exposed client-side.

B. Product
- English/Hindi toggle works.
- Mobile layout is usable.
- At least 4 seeded courses exist.
- At least 1 assessment works.
- Learner dashboard works.
- Admin dashboard works.
- Token management pages exist.
- Media management exists.
- Certificate generation stub or MVP exists.
- Safety disclaimers are visible in AI features.

C. Safety
- AI system message is loaded server-side.
- Patient data warning exists.
- AI refuses unsafe clinical replacement advice.
- AI response includes educational limitations where needed.
- Admin can disable AI globally.
- Prompt injection attempts do not override system behavior.

D. Documentation
- BRAIN.md updated.
- TASK_MEMORY.md updated.
- FOCUS_AND_SCOPE.md updated.
- ARCHITECTURE.md complete.
- SAFETY_AND_COMPLIANCE.md complete.
- CONTENT_STRATEGY.md complete.
- DEPLOYMENT.md created.

============================================================
14. IMPORTANT DEVELOPMENT RULES
============================================================

- Do not silently skip security.
- Do not create frontend-only fake authorization.
- Do not hard-code secrets.
- Do not hard-code package prices except seed placeholders.
- Do not generate unsafe clinical content.
- Do not use copyrighted images/videos without license metadata.
- Do not copy INC curriculum text verbatim.
- Do not fabricate references.
- Do not store patient-identifiable data intentionally.
- Do not allow users to bypass token limits.
- Do not allow normal admins to edit the universal safety system message without versioning and audit logs.
- Do not create huge monolithic files.
- Keep components modular.
- Keep server-only code server-only.
- Add comments only where they improve maintainability.
- Prefer simple, stable architecture over over-engineering.

============================================================
15. FINAL OUTPUT EXPECTED FROM DEVELOPMENT AGENT
============================================================

When complete, provide:
1. Summary of implemented features.
2. Setup instructions.
3. Environment variables needed.
4. Database migration/seed commands.
5. Test commands.
6. Deployment instructions.
7. Known limitations.
8. Open questions.
9. Security checklist status.
10. Next recommended phase.

Begin now by creating docs/BRAIN.md, docs/TASK_MEMORY.md, docs/FOCUS_AND_SCOPE.md, docs/SYSTEM_MESSAGE.md, docs/SAFETY_AND_COMPLIANCE.md, docs/ARCHITECTURE.md, docs/CONTENT_STRATEGY.md, and docs/OPEN_QUESTIONS.md. Then proceed phase by phase.
