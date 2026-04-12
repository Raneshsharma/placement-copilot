import { create } from "zustand";
import type {
  LinkedInProfile,
  RailGroup,
  CoachingCard,
  RoleTarget,
  StatusDimension,
} from "@/types/linkedin-profile";

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_PROFILE: LinkedInProfile = {
  linkedinUrl: "https://linkedin.com/in/alexthompson-eng",
  headline: "Software Engineer",
  about:
    "Experienced software engineer with a passion for building scalable systems. I enjoy solving complex problems and working with cross-functional teams to deliver high-quality products.",
  experience: [
    {
      id: "exp-1",
      title: "Senior Software Engineer",
      company: "TechCorp",
      duration: "2022 - Present",
      bullets: [
        "Led the design and implementation of microservices architecture, improving system throughput by 45%",
        "Mentored 3 junior engineers and conducted code reviews for a team of 8",
        "Reduced deployment time from 2 hours to 15 minutes through CI/CD pipeline optimization",
      ],
    },
    {
      id: "exp-2",
      title: "Software Engineer",
      company: "StartupXYZ",
      duration: "2020 - 2022",
      bullets: [
        "Built and maintained React-based web applications serving 50K+ daily users",
        "Implemented RESTful APIs using Node.js and Express",
        "Collaborated with product managers to ship 12 new features",
      ],
    },
  ],
  skills: ["Python", "JavaScript", "React", "Node.js", "SQL"],
  endorsements: { Python: 12, JavaScript: 8, React: 5 },
  connectionCount: 342,
  creatorMode: false,
};

const MOCK_STATUS_DIMENSIONS: StatusDimension[] = [
  {
    id: "completeness",
    label: "Completeness",
    icon: "clipboard-check",
    status: "in-progress",
    subLabel: "2 sections missing",
  },
  {
    id: "visibility",
    label: "Visibility",
    icon: "eye",
    status: "in-progress",
    subLabel: "Low discoverability",
  },
  {
    id: "keywords",
    label: "Keywords",
    icon: "search",
    status: "missing",
    subLabel: "Thin keyword presence",
  },
  {
    id: "branding",
    label: "Branding",
    icon: "flag",
    status: "in-progress",
    subLabel: "Vague positioning",
  },
  {
    id: "alignment",
    label: "Alignment",
    icon: "target",
    status: "missing",
    subLabel: "No role targeted",
  },
];

const MOCK_RAIL_GROUPS: RailGroup[] = [
  {
    id: "foundations",
    name: "Foundations",
    icon: "building",
    overallStatus: "in-progress",
    sections: [
      {
        id: "headline",
        groupId: "foundations",
        name: "Headline",
        status: "in-progress",
        issueCount: 2,
        icon: "type",
      },
      {
        id: "about",
        groupId: "foundations",
        name: "About Section",
        status: "missing",
        issueCount: 1,
        icon: "user",
      },
      {
        id: "location",
        groupId: "foundations",
        name: "Location & Contact",
        status: "complete",
        issueCount: 0,
        icon: "map-pin",
      },
    ],
  },
  {
    id: "branding",
    name: "Personal Branding",
    icon: "star",
    overallStatus: "in-progress",
    sections: [
      {
        id: "banner",
        groupId: "branding",
        name: "Banner Image",
        status: "missing",
        issueCount: 1,
        icon: "image",
      },
      {
        id: "photo",
        groupId: "branding",
        name: "Profile Photo",
        status: "complete",
        issueCount: 0,
        icon: "camera",
      },
      {
        id: "custom-url",
        groupId: "branding",
        name: "Custom URL",
        status: "in-progress",
        issueCount: 1,
        icon: "link",
      },
    ],
  },
  {
    id: "experience",
    name: "Experience",
    icon: "briefcase",
    overallStatus: "in-progress",
    sections: [
      {
        id: "work-history",
        groupId: "experience",
        name: "Work History",
        status: "in-progress",
        issueCount: 3,
        icon: "building-2",
      },
      {
        id: "bullet-impact",
        groupId: "experience",
        name: "Bullet Impact",
        status: "in-progress",
        issueCount: 4,
        icon: "zap",
      },
      {
        id: "quantification",
        groupId: "experience",
        name: "Quantification",
        status: "missing",
        issueCount: 5,
        icon: "hash",
      },
    ],
  },
  {
    id: "skills",
    name: "Skills & Expertise",
    icon: "tool",
    overallStatus: "in-progress",
    sections: [
      {
        id: "skill-list",
        groupId: "skills",
        name: "Skill List",
        status: "in-progress",
        issueCount: 2,
        icon: "list",
      },
      {
        id: "endorsements",
        groupId: "skills",
        name: "Endorsements",
        status: "missing",
        issueCount: 3,
        icon: "thumbs-up",
      },
    ],
  },
  {
    id: "discoverability",
    name: "Discoverability",
    icon: "globe",
    overallStatus: "missing",
    sections: [
      {
        id: "creator-mode",
        groupId: "discoverability",
        name: "Creator Mode",
        status: "missing",
        issueCount: 1,
        icon: "megaphone",
      },
      {
        id: "keyword-density",
        groupId: "discoverability",
        name: "Keyword Density",
        status: "missing",
        issueCount: 4,
        icon: "search",
      },
      {
        id: "engagement",
        groupId: "discoverability",
        name: "Engagement Strategy",
        status: "missing",
        issueCount: 2,
        icon: "heart",
      },
    ],
  },
  {
    id: "growth",
    name: "Network Growth",
    icon: "users",
    overallStatus: "in-progress",
    sections: [
      {
        id: "connection-strategy",
        groupId: "growth",
        name: "Connection Strategy",
        status: "in-progress",
        issueCount: 2,
        icon: "user-plus",
      },
      {
        id: "invitation-acceptance",
        groupId: "growth",
        name: "Invitation Acceptance",
        status: "in-progress",
        issueCount: 1,
        icon: "mail",
      },
      {
        id: "group-participation",
        groupId: "growth",
        name: "Group Participation",
        status: "missing",
        issueCount: 3,
        icon: "users",
      },
      {
        id: "content-strategy",
        groupId: "growth",
        name: "Content Strategy",
        status: "missing",
        issueCount: 2,
        icon: "file-text",
      },
    ],
  },
];

const MOCK_COACHING_CARDS: CoachingCard[] = [
  {
    id: "c1",
    sectionId: "headline",
    severity: "critical",
    headline: "Your headline lacks keywords recruiters are searching for",
    body: "Recruiters search by skills and job titles. Your headline should include the specific technologies (React, Node.js, Python) and seniority level you want to be known for.",
    linkedSection: "headline",
    actions: [
      {
        id: "a1",
        label: "Rewrite with keywords",
        type: "rewrite",
        isPremium: true,
      },
      {
        id: "a2",
        label: "See keyword suggestions",
        type: "suggest",
        isPremium: false,
      },
    ],
    priority: 1,
  },
  {
    id: "c2",
    sectionId: "about",
    severity: "critical",
    headline: "About section is missing - this is costing you 70% of recruiter views",
    body: "Profiles with an About section get significantly more views. Yours should explain what you do, the scale you work at, and the problems you solve - in 3-4 punchy lines.",
    linkedSection: "about",
    actions: [
      {
        id: "a3",
        label: "Generate About section",
        type: "suggest",
        isPremium: true,
      },
      {
        id: "a4",
        label: "View examples",
        type: "suggest",
        isPremium: false,
      },
    ],
    priority: 2,
  },
  {
    id: "c3",
    sectionId: "bullet-impact",
    severity: "opportunity",
    headline: "Many bullets lead with weak verbs or responsibilities",
    body: 'Strong bullets start with power verbs like "Led," "Built," "Scaled," "Optimized." Weak openings like "Worked on" or "Helped with" don\'t capture attention.',
    linkedSection: "work-history",
    actions: [
      {
        id: "a5",
        label: "Strengthen all bullets",
        type: "improve",
        isPremium: true,
      },
      {
        id: "a6",
        label: "STAR method guide",
        type: "suggest",
        isPremium: false,
      },
    ],
    priority: 3,
  },
  {
    id: "c4",
    sectionId: "quantification",
    severity: "opportunity",
    headline: "Only 2 of 6 bullets include quantifiable impact",
    body: "Quantified achievements are 40% more likely to result in callbacks. Add percentages, dollar amounts, user counts, or time savings wherever possible.",
    linkedSection: "bullet-impact",
    actions: [
      {
        id: "a7",
        label: "Add impact metrics",
        type: "improve",
        isPremium: true,
      },
      {
        id: "a8",
        label: "See quantification tips",
        type: "suggest",
        isPremium: false,
      },
    ],
    priority: 4,
  },
  {
    id: "c5",
    sectionId: "keyword-density",
    severity: "opportunity",
    headline: "Your profile has thin keyword presence for your target roles",
    body: "Recruiters use Boolean searches. Your profile should naturally include terms like 'microservices,' 'CI/CD,' 'REST APIs,' 'agile,' and other terms common in senior engineering roles.",
    linkedSection: "keyword-density",
    actions: [
      {
        id: "a9",
        label: "Tailor to target role",
        type: "tailor",
        isPremium: true,
      },
      {
        id: "a10",
        label: "View keyword analysis",
        type: "suggest",
        isPremium: false,
      },
    ],
    priority: 5,
  },
];

const ROLE_TARGETS: RoleTarget[] = [
  { id: "rt1", title: "Senior Software Engineer", keywords: ["React", "Node.js", "Python", "AWS", "Microservices"] },
  { id: "rt2", title: "Product Manager", keywords: ["Product Strategy", "Roadmapping", "Agile", "User Research", "Analytics"] },
  { id: "rt3", title: "Data Analyst", keywords: ["SQL", "Python", "Tableau", "Data Visualization", "Statistics"] },
  { id: "rt4", title: "UX Designer", keywords: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"] },
  { id: "rt5", title: "Marketing Manager", keywords: ["Digital Marketing", "SEO", "Content Strategy", "Analytics", "Brand"] },
];

// ============================================================================
// STORE INTERFACE & IMPLEMENTATION
// ============================================================================

interface LinkedInOptimizerState {
  status: "loading" | "analyzing" | "ready" | "empty" | "error";
  profile: LinkedInProfile | null;
  statusDimensions: StatusDimension[];
  railGroups: RailGroup[];
  coachingCards: CoachingCard[];
  selectedSectionId: string | null;
  expandedGroupId: string | null;
  roleTarget: RoleTarget | null;
  roleTargets: RoleTarget[];
  previewHighlight: string | null;
  errorMessage: string | null;

  // Actions
  setStatus: (status: LinkedInOptimizerState["status"]) => void;
  setProfile: (profile: LinkedInProfile) => void;
  selectSection: (sectionId: string) => void;
  expandGroup: (groupId: string) => void;
  setRoleTarget: (target: RoleTarget | null) => void;
  setPreviewHighlight: (sectionId: string | null) => void;
  setError: (message: string | null) => void;
  loadMockData: () => void;
}

export const useLinkedInOptimizerStore = create<LinkedInOptimizerState>((set, get) => ({
  status: "loading",
  profile: null,
  statusDimensions: [],
  railGroups: [],
  coachingCards: [],
  selectedSectionId: null,
  expandedGroupId: null,
  roleTarget: null,
  roleTargets: ROLE_TARGETS,
  previewHighlight: null,
  errorMessage: null,

  setStatus: (status) => set({ status }),

  setProfile: (profile) => set({ profile }),

  selectSection: (sectionId) => {
    const { railGroups } = get();
    // Find the parent group of this section
    const parentGroup = railGroups.find((g) =>
      g.sections.some((s) => s.id === sectionId)
    );
    set({
      selectedSectionId: sectionId,
      previewHighlight: sectionId,
      expandedGroupId: parentGroup?.id ?? null,
    });
  },

  expandGroup: (groupId) => {
    const { expandedGroupId } = get();
    // Toggle: if already expanded, collapse it
    set({ expandedGroupId: expandedGroupId === groupId ? null : groupId });
  },

  setRoleTarget: (target) => set({ roleTarget: target }),

  setPreviewHighlight: (sectionId) => set({ previewHighlight: sectionId }),

  setError: (message) => set({ errorMessage: message, status: "error" }),

  loadMockData: () => {
    set({ status: "analyzing" });
    // Simulate analysis phase - show "analyzing" for 2 seconds
    setTimeout(() => {
      set({
        status: "ready",
        profile: MOCK_PROFILE,
        statusDimensions: MOCK_STATUS_DIMENSIONS,
        railGroups: MOCK_RAIL_GROUPS,
        coachingCards: MOCK_COACHING_CARDS,
        selectedSectionId: null,
        expandedGroupId: "foundations",
      });
    }, 2000);
  },
}));
