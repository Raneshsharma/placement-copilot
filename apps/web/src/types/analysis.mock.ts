import type { ProfileStrength, ResumeDocument } from "./analysis";

export const MOCK_RESUME_DOCUMENT: ResumeDocument = {
  id: "resume-001",
  title: "Software Engineer Resume",
  atsScore: 68,
  lastAnalyzed: new Date().toISOString(),
  sections: [
    {
      id: "header",
      type: "header",
      label: "Contact",
      content: "Alex Johnson · alex.j@example.com · (555) 123-4567 · San Francisco, CA",
      bullets: [],
      isEmpty: false,
      isPartial: false,
    },
    {
      id: "summary",
      type: "summary",
      label: "Summary",
      content: "Experienced software engineer with 4 years of experience building scalable web applications.",
      bullets: [
        "Experienced software engineer",
        "4 years of experience",
        "scalable web applications",
      ],
      isEmpty: false,
      isPartial: false,
    },
    {
      id: "exp-1",
      type: "experience",
      label: "Experience",
      content: "",
      bullets: [
        "Helped with building microservices architecture for payment processing",
        "Worked on improving API response times",
        "Assisted team in code reviews",
        "Contributed to documentation updates",
      ],
      isEmpty: false,
      isPartial: false,
    },
    {
      id: "exp-2",
      type: "experience",
      label: "Experience",
      content: "",
      bullets: [
        "Responsible for frontend development using React",
        "Helped users with technical support",
        "Maintained CI/CD pipelines",
      ],
      isEmpty: false,
      isPartial: false,
    },
    {
      id: "edu-1",
      type: "education",
      label: "Education",
      content: "BS Computer Science, State University, 2020",
      bullets: [],
      isEmpty: false,
      isPartial: false,
    },
    {
      id: "skills",
      type: "skills",
      label: "Skills",
      content: "",
      bullets: [
        "JavaScript, TypeScript, React, Node.js",
        "Python, Django, Flask",
        "AWS, Docker, Kubernetes",
        "PostgreSQL, MongoDB",
        "Git, CI/CD",
      ],
      isEmpty: false,
      isPartial: false,
    },
  ],
};

export const MOCK_PROFILE_STRENGTH: ProfileStrength = {
  score: 68,
  label: "Building Up",
  overallHealth: "needs-work",
  missingSections: [],
  partialSections: [],
  categories: [
    {
      id: "impact",
      name: "Impact",
      description: "How well your achievements show results and value",
      section: "resume-quality",
      health: "needs-work",
      issueCount: 2,
      isAnalyzed: true,
      issues: [
        {
          id: "issue-1",
          headline: "Action verbs could be stronger",
          severity: "needs-work",
          context:
            "Here's what we found:\n\"Helped with building microservices\"",
          reason:
            "Here's why it matters:\nRecruiters scan in under 6 seconds. Weak verbs like 'helped' and 'worked on' make them skip past your achievements. ATS systems also weigh action verbs heavily — strong verbs signal leadership and measurable results.",
          action:
            "Here's what to do:\nReplace 'helped with' with 'led' or 'built'. Replace 'worked on' with 'improved' or 'delivered'. Focus on the impact, not the task. Turn \"Helped with building microservices\" into \"Led design and implementation of microservices architecture handling 10K+ requests/day.\"",
          resumeSection: "Experience",
          resumeSectionId: "exp-1",
          actionChips: [
            { label: "Suggest stronger verbs", action: "suggest-verbs", icon: "Wand2" },
            { label: "Show examples", action: "show-examples", icon: "Lightbulb" },
            { label: "Rewrite with AI", action: "rewrite", icon: "Sparkles" },
          ],
        },
        {
          id: "issue-2",
          headline: "Add quantified results to achievements",
          severity: "should-fix",
          context:
            "Here's what we found:\n\"Worked on improving API response times\"",
          reason:
            "Here's why it matters:\nNumbers and metrics make achievements concrete and believable. A resume with quantified results is 40% more likely to get a callback. ATS tools also flag quantified achievements as high-quality content.",
          action:
            "Here's what to do:\nAdd specific numbers to your achievements. Instead of \"improved API response times\", try \"reduced API response time by 45% (from 800ms to 440ms)\". The more specific, the better.",
          resumeSection: "Experience",
          resumeSectionId: "exp-1",
          actionChips: [
            { label: "Add impact metrics", action: "add-metrics", icon: "TrendingUp" },
            { label: "Rewrite with AI", action: "rewrite", icon: "Sparkles" },
          ],
        },
      ],
    },
    {
      id: "clarity",
      name: "Clarity",
      description: "How clear and scannable your resume is",
      section: "resume-quality",
      health: "healthy",
      issueCount: 0,
      isAnalyzed: true,
      issues: [],
    },
    {
      id: "structure",
      name: "Structure",
      description: "How well your resume is organized",
      section: "resume-quality",
      health: "needs-work",
      issueCount: 1,
      isAnalyzed: true,
      issues: [
        {
          id: "issue-3",
          headline: "Experience section ordering could be optimized",
          severity: "quick-win",
          context:
            "Here's what we found:\nYour most recent role is listed but achievements aren't ranked by impact.",
          reason:
            "Here's why it matters:\nRecruiters read top-to-bottom. Your most impressive achievements should appear first in each section — they often stop reading after the first few bullets.",
          action:
            "Here's what to do:\nReorder your bullets in each role so the strongest achievements come first. Use the 'PAR' method: Problem → Action → Result.",
          resumeSection: "Experience",
          resumeSectionId: "exp-1",
          actionChips: [
            { label: "Optimize order", action: "optimize-order", icon: "ArrowUpDown" },
            { label: "Rewrite with AI", action: "rewrite", icon: "Sparkles" },
          ],
        },
      ],
    },
    {
      id: "formatting",
      name: "Formatting",
      description: "Visual and layout consistency",
      section: "resume-quality",
      health: "healthy",
      issueCount: 0,
      isAnalyzed: true,
      issues: [],
    },
    {
      id: "summary-section",
      name: "Summary",
      description: "Your professional summary statement",
      section: "content",
      health: "needs-work",
      issueCount: 1,
      isAnalyzed: true,
      issues: [
        {
          id: "issue-4",
          headline: "Summary could be more specific",
          severity: "needs-work",
          context:
            "Here's what we found:\n\"Experienced software engineer with 4 years of experience building scalable web applications.\"",
          reason:
            "Here's why it matters:\nA generic summary doesn't differentiate you from hundreds of other candidates. Recruiters spend an average of 6 seconds on a resume — your summary needs to make an immediate, specific impression.",
          action:
            "Here's what to do:\nAdd specifics about what you build, the scale you've worked at, and the types of problems you solve. E.g., \"Backend engineer specializing in high-throughput APIs and distributed systems. 4 years building payment infrastructure processing $2M+ daily.\"",
          resumeSection: "Summary",
          resumeSectionId: "summary",
          actionChips: [
            { label: "Rewrite with AI", action: "rewrite", icon: "Sparkles" },
            { label: "Tailor for role", action: "tailor", icon: "Target" },
          ],
        },
      ],
    },
    {
      id: "experience-content",
      name: "Experience",
      description: "Work history and achievements",
      section: "content",
      health: "needs-work",
      issueCount: 0,
      isAnalyzed: true,
      issues: [],
    },
    {
      id: "skills-section",
      name: "Skills",
      description: "Technical and professional skills",
      section: "content",
      health: "healthy",
      issueCount: 0,
      isAnalyzed: true,
      issues: [],
    },
    {
      id: "education-section",
      name: "Education",
      description: "Academic background and qualifications",
      section: "content",
      health: "healthy",
      issueCount: 0,
      isAnalyzed: true,
      issues: [],
    },
    {
      id: "keywords",
      name: "Keywords",
      description: "Industry terms and ATS optimization",
      section: "ats-health",
      health: "needs-work",
      issueCount: 1,
      isAnalyzed: true,
      issues: [
        {
          id: "issue-5",
          headline: "Missing some key terms for your target roles",
          severity: "should-fix",
          context:
            "Here's what we found:\nYour resume lacks terms like 'system design', 'microservices', 'distributed systems', 'CI/CD', and 'cloud infrastructure'.",
          reason:
            "Here's why it matters:\nATS systems scan for keyword matches against the job description. Missing industry terms can get you filtered out before a human ever sees your resume.",
          action:
            "Here's what to do:\nAdd a skills section or adjust existing descriptions to include these terms naturally. E.g., \"Designed microservices\" is better than just \"worked on microservices.\"",
          resumeSection: "Skills",
          resumeSectionId: "skills",
          actionChips: [
            { label: "Optimize keywords", action: "optimize-keywords", icon: "Search" },
            { label: "Check match score", action: "match-score", icon: "Zap" },
            { label: "Tailor for role", action: "tailor", icon: "Target" },
          ],
        },
      ],
    },
    {
      id: "role-alignment",
      name: "Role Alignment",
      description: "How well your resume fits your target roles",
      section: "ats-health",
      health: "needs-work",
      issueCount: 1,
      isAnalyzed: true,
      issues: [
        {
          id: "issue-6",
          headline: "Headline doesn't match your target roles",
          severity: "needs-work",
          context:
            "Here's what we found:\n\"Experienced software engineer\" is too generic for Senior/Staff level applications.",
          reason:
            "Here's why it matters:\nRecruiters and ATS systems use your headline as a primary signal. A generic headline makes it harder to match against specific roles and reduces callback rates.",
          action:
            "Here's what to do:\nBe more specific. \"Software Engineer\" → \"Senior Backend Engineer specializing in distributed systems and API design\"",
          resumeSection: "Summary",
          resumeSectionId: "summary",
          actionChips: [
            { label: "Tailor headline", action: "tailor-headline", icon: "Target" },
            { label: "Rewrite with AI", action: "rewrite", icon: "Sparkles" },
          ],
        },
      ],
    },
    {
      id: "dates",
      name: "Dates",
      description: "Employment timeline and date consistency",
      section: "ats-health",
      health: "healthy",
      issueCount: 0,
      isAnalyzed: true,
      issues: [],
    },
  ],
};
