# Open Questions

*These questions require input from the Product Owner. In the meantime, sensible configurable defaults will be used for MVP development.*

## A. Institution and Business Model
1. Is this for one institution first, or should it support multiple institutions from day one?
   - *Default for MVP: Multi-tenant architecture designed from day one, but starting with a global tenant.*
2. Should pricing be individual learner pricing, institutional licensing, or both?
   - *Default for MVP: Support both via package structure.*
3. Preferred payment gateway: Razorpay, Stripe, manual bank transfer, UPI, or all?
   - *Default for MVP: Razorpay integration structure.*
4. Should certificates be free, paid, or tied to package level?
   - *Default for MVP: Tied to package entitlement.*

## B. Content Depth
5. Should the first launch focus on B.Sc. Nursing, Post Basic B.Sc. Nursing, M.Sc. Nursing, working nurses, faculty, or all tracks?
   - *Default for MVP: Foundational seeds for all to demonstrate capability.*
6. Which specialty modules are priority?
   - *Default for MVP: General introduction and research.*
7. Should Hindi content be full human translation, AI-assisted translation with review, or English-first with Hindi summaries?
   - *Default for MVP: Fully structured fields (capable of manual or AI-assisted entry).*

## C. AI Usage
8. Which AI providers should be enabled initially: OpenAI, Google Gemini, local model, or provider-agnostic?
   - *Default for MVP: Provider-agnostic abstraction, likely starting with OpenAI SDK/Gemini.*
9. Should learner AI usage be capped daily, monthly, per course, or by package?
   - *Default for MVP: Monthly caps tied to package.*
10. Should faculty/admins be able to create AI-generated content drafts?
    - *Default for MVP: Yes, with forced "Draft" status for review.*

## D. Media & Deployment
11. Where should videos be stored?
    - *Default for MVP: YouTube/Vimeo links to save storage initially.*
12. Preferred deployment environment?
    - *Default for MVP: Vercel for web, Neon/Supabase for PostgreSQL.*
