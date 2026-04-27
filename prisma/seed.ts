import { PrismaClient, Role, PackageTier, AIProvider } from '@prisma/client';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

// Simple bcrypt-free hash for seeding — replace with bcrypt in production
const hashPassword = (password: string) =>
  crypto.createHash('sha256').update(password + 'aifn-seed-salt').digest('hex');

async function main() {
  console.log('🌱 Seeding AI for Nurses India database...');

  // ─── Packages ────────────────────────────────────────────────────────────────
  const packages = await Promise.all([
    prisma.package.upsert({
      where: { tier: PackageTier.basic_awareness },
      update: {},
      create: {
        tier: PackageTier.basic_awareness,
        name: 'Basic Awareness',
        nameHi: 'बुनियादी जागरूकता',
        description: 'Introduction to AI concepts for nursing students. Limited quizzes and basic AI quota.',
        descriptionHi: 'नर्सिंग छात्रों के लिए AI की बुनियादी जानकारी।',
        priceInr: 0,
        durationDays: 30,
        aiDailyTokens: 1000,
        aiMonthlyTokens: 10000,
        hasCertificate: false,
        hasMentorAccess: false,
        hasFacultyDashboard: false,
      },
    }),
    prisma.package.upsert({
      where: { tier: PackageTier.professional_skills },
      update: {},
      create: {
        tier: PackageTier.professional_skills,
        name: 'Professional Skills',
        nameHi: 'व्यावसायिक कौशल',
        description: 'Full foundational course, practical AI tools, self-assessments, and standard certificate.',
        descriptionHi: 'संपूर्ण बुनियादी पाठ्यक्रम, व्यावहारिक AI उपकरण, और प्रमाणपत्र।',
        priceInr: 999,
        durationDays: 90,
        aiDailyTokens: 5000,
        aiMonthlyTokens: 50000,
        hasCertificate: true,
        hasMentorAccess: false,
        hasFacultyDashboard: false,
      },
    }),
    prisma.package.upsert({
      where: { tier: PackageTier.advanced_academic },
      update: {},
      create: {
        tier: PackageTier.advanced_academic,
        name: 'Advanced Academic & Research',
        nameHi: 'उन्नत शैक्षणिक और अनुसंधान',
        description: 'Postgraduate/research modules, project templates, publication guidance, and mentor request option.',
        descriptionHi: 'स्नातकोत्तर/अनुसंधान मॉड्यूल, परियोजना टेम्पलेट, और प्रकाशन मार्गदर्शन।',
        priceInr: 2499,
        durationDays: 180,
        aiDailyTokens: 10000,
        aiMonthlyTokens: 100000,
        hasCertificate: true,
        hasMentorAccess: true,
        hasFacultyDashboard: false,
      },
    }),
    prisma.package.upsert({
      where: { tier: PackageTier.institutional_faculty },
      update: {},
      create: {
        tier: PackageTier.institutional_faculty,
        name: 'Institutional / Faculty Plus',
        nameHi: 'संस्थागत / संकाय प्लस',
        description: 'Faculty dashboard, cohort management, content customization, bulk users, and institution certificate branding.',
        descriptionHi: 'संकाय डैशबोर्ड, समूह प्रबंधन, और संस्था प्रमाणपत्र ब्रांडिंग।',
        priceInr: 9999,
        durationDays: 365,
        aiDailyTokens: 50000,
        aiMonthlyTokens: 500000,
        hasCertificate: true,
        hasMentorAccess: true,
        hasFacultyDashboard: true,
      },
    }),
  ]);
  console.log(`✅ Seeded ${packages.length} packages`);

  // ─── AI Token Limits ─────────────────────────────────────────────────────────
  for (const pkg of packages) {
    await prisma.aITokenLimit.upsert({
      where: { packageId: pkg.id },
      update: {},
      create: {
        packageId: pkg.id,
        daily: pkg.aiDailyTokens,
        monthly: pkg.aiMonthlyTokens,
      },
    });
  }
  console.log('✅ Seeded AI token limits');

  // ─── AI Features ─────────────────────────────────────────────────────────────
  const aiFeatures = [
    { key: 'aiTutor', nameEn: 'AI Tutor', description: 'Educational AI chat for nursing learners', maxInputTokens: 2000, maxOutputTokens: 700 },
    { key: 'promptCoach', nameEn: 'AI Prompt Coach', description: 'Helps learners write better AI prompts', maxInputTokens: 1500, maxOutputTokens: 600 },
    { key: 'studyPlanner', nameEn: 'AI Study Planner', description: 'Personalized study schedule assistance', maxInputTokens: 1000, maxOutputTokens: 500 },
    { key: 'facultyAssistant', nameEn: 'AI Faculty Assistant', description: 'Lesson planning and assessment drafting for faculty', maxInputTokens: 3000, maxOutputTokens: 1200 },
    { key: 'researchHelper', nameEn: 'AI Research Assistant', description: 'Literature search, PICO framing, and manuscript support', maxInputTokens: 3000, maxOutputTokens: 1000 },
    { key: 'productivityAssistant', nameEn: 'AI Productivity Assistant', description: 'Documentation templates and shift handover support', maxInputTokens: 2000, maxOutputTokens: 800 },
    { key: 'translationDraft', nameEn: 'AI Translation Draft', description: 'AI-assisted English to Hindi draft translation for review', maxInputTokens: 2000, maxOutputTokens: 1000 },
    { key: 'contentSummarizer', nameEn: 'AI Content Summarizer', description: 'Summarizes lessons and articles', maxInputTokens: 4000, maxOutputTokens: 500 },
    { key: 'quizDraftAssistant', nameEn: 'AI Quiz Draft Assistant', description: 'Generates MCQ and assessment drafts for faculty review', maxInputTokens: 2000, maxOutputTokens: 1000 },
    { key: 'feedbackAssistant', nameEn: 'AI Feedback Assistant', description: 'Formative feedback for assignments', maxInputTokens: 2000, maxOutputTokens: 700 },
  ];

  for (const feature of aiFeatures) {
    await prisma.aIFeature.upsert({
      where: { key: feature.key },
      update: {},
      create: {
        ...feature,
        enabled: true,
        provider: AIProvider.gemini,
        model: 'gemini-1.5-flash',
      },
    });
  }
  console.log(`✅ Seeded ${aiFeatures.length} AI features`);

  // ─── System Prompt ────────────────────────────────────────────────────────────
  await prisma.systemPromptVersion.upsert({
    where: { version: '2026-04-27.v1' },
    update: {},
    create: {
      version: '2026-04-27.v1',
      isActive: true,
      changeNote: 'Initial production system message for AI for Nurses India.',
      content: `You are "AI for Nurses India", an educational AI assistant for nursing students, postgraduate nursing learners, working nurses, and nursing faculty in India.

Your role is to support learning, productivity, teaching, research literacy, responsible AI use, and professional development. Follow evidence-based, ethical, privacy-preserving, and safety-first principles.

You are NOT a doctor, nurse practitioner, prescribing clinician, legal advisor, or substitute for faculty, institutional policy, clinical supervision, or licensed medical judgment.

NEVER provide patient-specific diagnosis, treatment orders, medication prescriptions, or emergency instructions as a replacement for clinical care. For urgent issues, advise the user to contact a qualified clinician or emergency services.

NEVER encourage uploading identifiable patient data. If the user shares names, registration numbers, phone numbers, Aadhaar, hospital IDs, or other identifiable patient data, warn them and ask them to anonymize.

For clinical educational content: be cautious, state limitations, encourage verification from textbooks, institutional protocols, and supervisors. Provide references where possible. Avoid fabricating citations.

For AI literacy: explain concepts clearly for nursing learners. Use examples from nursing education, clinical workflow, and administration.

For faculty: support lesson planning, assessment drafting, rubrics, and academic integrity. Mark all AI-generated content as DRAFT.

For researchers: support research planning, literature strategy, and manuscript structure. Never fabricate data, references, or authorship. Warn against predatory journals.

Tone: Professional, supportive, clear, humanized, culturally appropriate for Indian nursing education. Respond in English or Hindi based on user preference.

Always prioritize: learner safety, patient privacy, evidence-based education, human oversight, transparency, cultural appropriateness, accessibility, and professional accountability.`,
    },
  });
  console.log('✅ Seeded system prompt version');

  // ─── Global Token Budget ─────────────────────────────────────────────────────
  await prisma.aITokenBudget.upsert({
    where: { scopeType_scopeId: { scopeType: 'global', scopeId: 'global' } },
    update: {},
    create: {
      scopeType: 'global',
      scopeId: 'global',
      monthlyLimitTokens: 10_000_000,
      dailyLimitTokens: 500_000,
      isEnabled: true,
      alertThresholds: [50, 80, 95, 100],
    },
  });
  console.log('✅ Seeded global AI token budget');

  // ─── Demo Institution ─────────────────────────────────────────────────────────
  const institution = await prisma.institution.upsert({
    where: { slug: 'demo-nursing-college' },
    update: {},
    create: {
      name: 'Demo Nursing College',
      nameHi: 'डेमो नर्सिंग कॉलेज',
      slug: 'demo-nursing-college',
      city: 'New Delhi',
      state: 'Delhi',
      contactEmail: 'admin@demonursing.edu',
    },
  });
  console.log('✅ Seeded demo institution');

  // ─── Seed Users ───────────────────────────────────────────────────────────────
  const seedUsers = [
    { email: 'admin@aifn.in', name: 'Super Admin', role: Role.super_admin },
    { email: 'amit.rai@celnet.in', name: 'Amit Rai', role: Role.admin },
    { email: 'puneet.mehrotra@celnet.in', name: 'Puneet Mehrotra', role: Role.admin },
    { email: 'faculty@aifn.in', name: 'Dr. Priya Sharma', role: Role.faculty },
    { email: 'learner@aifn.in', name: 'Anjali Verma', role: Role.learner },
    { email: 'mentor@aifn.in', name: 'Dr. Rakesh Nair', role: Role.mentor },
    { email: 'institution@aifn.in', name: 'College Admin', role: Role.institution_admin },
  ];

  for (const u of seedUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        passwordHash: hashPassword('aifn@2026'),
        emailVerified: true,
        preferredLocale: 'en',
        institutionId: u.role === Role.institution_admin ? institution.id : undefined,
      },
    });
  }
  console.log(`✅ Seeded ${seedUsers.length} demo users (password: aifn@2026)`);

  // ─── Course Tracks ────────────────────────────────────────────────────────────
  const tracks = await Promise.all([
    prisma.track.upsert({
      where: { slug: 'ai-foundations' },
      update: {},
      create: {
        slug: 'ai-foundations',
        titleEn: 'AI Foundations for Nursing Students',
        titleHi: 'नर्सिंग छात्रों के लिए AI की बुनियाद',
        summaryEn: 'Core AI literacy, safe use, and practical skills for undergraduate nursing learners.',
        summaryHi: 'स्नातक नर्सिंग शिक्षार्थियों के लिए मूल AI साक्षरता और व्यावहारिक कौशल।',
        sortOrder: 1,
      },
    }),
    prisma.track.upsert({
      where: { slug: 'ai-postgraduate-research' },
      update: {},
      create: {
        slug: 'ai-postgraduate-research',
        titleEn: 'AI for Postgraduate Nursing and Research',
        titleHi: 'स्नातकोत्तर नर्सिंग और अनुसंधान के लिए AI',
        summaryEn: 'Research support, literature search, manuscript writing, and publication ethics for PG learners.',
        summaryHi: 'स्नातकोत्तर शिक्षार्थियों के लिए अनुसंधान सहायता और प्रकाशन नैतिकता।',
        sortOrder: 2,
      },
    }),
    prisma.track.upsert({
      where: { slug: 'ai-working-nurses' },
      update: {},
      create: {
        slug: 'ai-working-nurses',
        titleEn: 'AI for Working Nurses and Clinical Productivity',
        titleHi: 'कार्यरत नर्सों और नैदानिक उत्पादकता के लिए AI',
        summaryEn: 'Documentation productivity, patient education, shift handover, and clinical safety.',
        summaryHi: 'दस्तावेज़ीकरण उत्पादकता, रोगी शिक्षा, और नैदानिक सुरक्षा।',
        sortOrder: 3,
      },
    }),
    prisma.track.upsert({
      where: { slug: 'ai-faculty-educators' },
      update: {},
      create: {
        slug: 'ai-faculty-educators',
        titleEn: 'AI for Nursing Faculty and Educators',
        titleHi: 'नर्सिंग संकाय और शिक्षकों के लिए AI',
        summaryEn: 'Lesson planning, assessment drafting, rubric design, and academic integrity in the AI era.',
        summaryHi: 'पाठ योजना, मूल्यांकन निर्माण, और AI युग में शैक्षणिक सत्यनिष्ठा।',
        sortOrder: 4,
      },
    }),
    prisma.track.upsert({
      where: { slug: 'ai-advanced-mentoring' },
      update: {},
      create: {
        slug: 'ai-advanced-mentoring',
        titleEn: 'Advanced AI, Projects, Mentoring, and Publication Support',
        titleHi: 'उन्नत AI, परियोजनाएँ, मेंटरिंग, और प्रकाशन सहायता',
        summaryEn: 'Advanced AI skills, mentor-guided projects, and manuscript development support.',
        summaryHi: 'उन्नत AI कौशल, मेंटर-निर्देशित परियोजनाएँ, और पांडुलिपि विकास सहायता।',
        sortOrder: 5,
      },
    }),
  ]);
  console.log(`✅ Seeded ${tracks.length} course tracks`);

  // ─── Seed Course 1 ────────────────────────────────────────────────────────────
  const course1 = await prisma.course.upsert({
    where: { slug: 'ai-awareness-nursing-students' },
    update: {},
    create: {
      trackId: tracks[0].id,
      slug: 'ai-awareness-nursing-students',
      titleEn: 'AI Awareness for Nursing Students',
      titleHi: 'नर्सिंग छात्रों के लिए AI जागरूकता',
      summaryEn: 'Understand what AI is, how it works, its benefits and risks in nursing, and how to use it safely.',
      summaryHi: 'AI क्या है, यह कैसे काम करता है, और नर्सिंग में इसके लाभ और जोखिम।',
      estimatedHours: 4,
      status: 'published',
      isPublished: true,
      publishedAt: new Date(),
      sortOrder: 1,
    },
  });

  const course1Modules = [
    { slug: 'intro-to-ai', titleEn: 'Introduction to AI', titleHi: 'AI का परिचय', sortOrder: 1 },
    { slug: 'generative-ai-chatbots', titleEn: 'Generative AI and Chatbots', titleHi: 'जेनेरेटिव AI और चैटबॉट', sortOrder: 2 },
    { slug: 'benefits-risks-ai-nursing', titleEn: 'Benefits and Risks of AI in Nursing', titleHi: 'नर्सिंग में AI के लाभ और जोखिम', sortOrder: 3 },
    { slug: 'safe-prompting-basics', titleEn: 'Safe Prompting Basics', titleHi: 'सुरक्षित प्रॉम्प्टिंग की मूल बातें', sortOrder: 4 },
    { slug: 'patient-privacy-ai', titleEn: 'Patient Privacy and AI', titleHi: 'रोगी गोपनीयता और AI', sortOrder: 5 },
  ];

  for (const mod of course1Modules) {
    await prisma.module.upsert({
      where: { courseId_slug: { courseId: course1.id, slug: mod.slug } },
      update: {},
      create: { courseId: course1.id, ...mod, status: 'published' },
    });
  }

  // ─── Seed Course 2 ────────────────────────────────────────────────────────────
  const course2 = await prisma.course.upsert({
    where: { slug: 'ai-for-nursing-faculty' },
    update: {},
    create: {
      trackId: tracks[3].id,
      slug: 'ai-for-nursing-faculty',
      titleEn: 'AI for Nursing Faculty',
      titleHi: 'नर्सिंग संकाय के लिए AI',
      summaryEn: 'Practical AI tools for lesson planning, assessment drafting, student feedback, and academic integrity.',
      summaryHi: 'पाठ योजना, मूल्यांकन निर्माण, और छात्र प्रतिक्रिया के लिए व्यावहारिक AI उपकरण।',
      estimatedHours: 5,
      status: 'published',
      isPublished: true,
      publishedAt: new Date(),
      sortOrder: 2,
    },
  });

  const course2Modules = [
    { slug: 'ai-lesson-planning', titleEn: 'AI for Lesson Planning', titleHi: 'पाठ योजना के लिए AI', sortOrder: 1 },
    { slug: 'ai-assessment-drafting', titleEn: 'AI for Assessment Drafting', titleHi: 'मूल्यांकन निर्माण के लिए AI', sortOrder: 2 },
    { slug: 'ai-feedback', titleEn: 'AI for Feedback', titleHi: 'प्रतिक्रिया के लिए AI', sortOrder: 3 },
    { slug: 'ai-academic-integrity', titleEn: 'AI and Academic Integrity', titleHi: 'AI और शैक्षणिक सत्यनिष्ठा', sortOrder: 4 },
    { slug: 'college-ai-guidelines', titleEn: 'Building College AI Use Guidelines', titleHi: 'कॉलेज AI उपयोग दिशानिर्देश बनाना', sortOrder: 5 },
  ];

  for (const mod of course2Modules) {
    await prisma.module.upsert({
      where: { courseId_slug: { courseId: course2.id, slug: mod.slug } },
      update: {},
      create: { courseId: course2.id, ...mod, status: 'published' },
    });
  }

  // ─── Seed Course 3 ────────────────────────────────────────────────────────────
  const course3 = await prisma.course.upsert({
    where: { slug: 'ai-postgraduate-nursing-research' },
    update: {},
    create: {
      trackId: tracks[1].id,
      slug: 'ai-postgraduate-nursing-research',
      titleEn: 'AI for Postgraduate Nursing Research',
      titleHi: 'स्नातकोत्तर नर्सिंग अनुसंधान के लिए AI',
      summaryEn: 'Research question framing, literature search, proposal drafting, manuscript structure, and publication ethics.',
      summaryHi: 'अनुसंधान प्रश्न निर्माण, साहित्य खोज, और प्रकाशन नैतिकता।',
      estimatedHours: 6,
      status: 'published',
      isPublished: true,
      publishedAt: new Date(),
      sortOrder: 3,
    },
  });

  const course3Modules = [
    { slug: 'research-question-development', titleEn: 'Research Question Development', titleHi: 'अनुसंधान प्रश्न विकास', sortOrder: 1 },
    { slug: 'literature-search-ai', titleEn: 'Literature Search with AI Support', titleHi: 'AI सहायता से साहित्य खोज', sortOrder: 2 },
    { slug: 'proposal-drafting', titleEn: 'Proposal Drafting Support', titleHi: 'प्रस्ताव प्रारूपण सहायता', sortOrder: 3 },
    { slug: 'manuscript-structure', titleEn: 'Manuscript Structure', titleHi: 'पांडुलिपि संरचना', sortOrder: 4 },
    { slug: 'publication-ethics', titleEn: 'Publication Ethics and Predatory Journals', titleHi: 'प्रकाशन नैतिकता और शिकारी पत्रिकाएँ', sortOrder: 5 },
  ];

  for (const mod of course3Modules) {
    await prisma.module.upsert({
      where: { courseId_slug: { courseId: course3.id, slug: mod.slug } },
      update: {},
      create: { courseId: course3.id, ...mod, status: 'published' },
    });
  }

  // ─── Seed Course 4 ────────────────────────────────────────────────────────────
  const course4 = await prisma.course.upsert({
    where: { slug: 'ai-for-working-nurses' },
    update: {},
    create: {
      trackId: tracks[2].id,
      slug: 'ai-for-working-nurses',
      titleEn: 'AI for Working Nurses',
      titleHi: 'कार्यरत नर्सों के लिए AI',
      summaryEn: 'Documentation productivity, patient education drafting, shift handover, clinical safety, and professional accountability.',
      summaryHi: 'दस्तावेज़ीकरण उत्पादकता, रोगी शिक्षा निर्माण, और नैदानिक सुरक्षा।',
      estimatedHours: 4,
      status: 'published',
      isPublished: true,
      publishedAt: new Date(),
      sortOrder: 4,
    },
  });

  const course4Modules = [
    { slug: 'documentation-productivity', titleEn: 'Documentation Productivity', titleHi: 'दस्तावेज़ीकरण उत्पादकता', sortOrder: 1 },
    { slug: 'patient-education-drafting', titleEn: 'Patient Education Drafting', titleHi: 'रोगी शिक्षा प्रारूपण', sortOrder: 2 },
    { slug: 'shift-handover-structuring', titleEn: 'Shift Handover Structuring', titleHi: 'शिफ्ट हैंडओवर संरचना', sortOrder: 3 },
    { slug: 'clinical-safety-boundaries', titleEn: 'Clinical Safety Boundaries', titleHi: 'नैदानिक सुरक्षा सीमाएँ', sortOrder: 4 },
    { slug: 'professional-accountability', titleEn: 'Professional Accountability', titleHi: 'व्यावसायिक जवाबदेही', sortOrder: 5 },
  ];

  for (const mod of course4Modules) {
    await prisma.module.upsert({
      where: { courseId_slug: { courseId: course4.id, slug: mod.slug } },
      update: {},
      create: { courseId: course4.id, ...mod, status: 'published' },
    });
  }

  console.log('✅ Seeded 4 courses with modules');
  console.log('\n🎉 Seed complete!\n');
  console.log('Demo login credentials:');
  console.log('  super_admin  → admin@aifn.in       / aifn@2026');
  console.log('  faculty      → faculty@aifn.in     / aifn@2026');
  console.log('  learner      → learner@aifn.in     / aifn@2026');
  console.log('  mentor       → mentor@aifn.in      / aifn@2026');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
