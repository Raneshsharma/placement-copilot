import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TemplateType = "MODERN" | "MINIMAL" | "EXECUTIVE" | "CREATIVE" | "TECHNICAL" | "CONSULTING" | "ACADEMIC" | "ENTRY_LEVEL";
export type SectionType = "header" | "summary" | "experience" | "education" | "skills" | "certifications" | "projects" | "publications" | "volunteer" | "awards" | "interests";
export type SkillCategory = "technical" | "soft" | "tools" | "languages";
export type SkillProficiency = 1 | 2 | 3 | 4;

export interface ResumeExperience {
  id: string;
  company: string;
  title: string;
  period: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
  location?: string;
  employmentType?: string;
}

export interface ResumeEducation {
  id: string;
  school: string;
  degreeType: string;
  fieldOfStudy: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
  coursework: string[];
  extracurriculars?: string;
  location?: string;
}

export interface ResumeSkill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  role?: string;
}

export interface ResumePublication {
  id: string;
  title: string;
  publication: string;
  date: string;
  url?: string;
  description?: string;
}

export interface ResumeVolunteer {
  id: string;
  organization: string;
  role: string;
  period: string;
  description: string;
}

export interface ResumeAward {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
}

export interface ResumeVersion {
  id: string;
  name: string;
  createdAt: string;
}

export interface Resume {
  id: string;
  name: string;
  title: string;
  template: TemplateType;
  status: "draft" | "complete";
  linkedJobId?: string;
  linkedRoleScore?: number;
  tags: string[];
  visibility: "private" | "public" | "shared";
  header: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  certifications: ResumeCertification[];
  projects: ResumeProject[];
  publications: ResumePublication[];
  volunteer: ResumeVolunteer[];
  awards: ResumeAward[];
  interests: string[];
  sections: ResumeSection[];
  atsScore?: number;
  missingKeywords?: string[];
  createdAt: string;
  updatedAt: string;
  versions: ResumeVersion[];
}

export interface ResumeState {
  // Multiple resume versions
  resumes: Resume[];
  // Active resume being built/edited
  currentResume: Resume | null;
  // Builder progress
  builderStep: number;
  activeTemplate: TemplateType;
  activeSection: SectionType;
  // Save state
  isSaving: boolean;
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;
  // Actions
  setResumes: (resumes: Resume[]) => void;
  setCurrentResume: (resume: Resume | null) => void;
  setBuilderStep: (step: number) => void;
  setTemplate: (template: TemplateType) => void;
  setActiveSection: (section: SectionType) => void;
  setResumeName: (name: string) => void;
  setResumeTitle: (title: string) => void;
  setStatus: (status: "draft" | "complete") => void;
  setVisibility: (visibility: "private" | "public" | "shared") => void;
  linkJob: (jobId: string, score?: number) => void;
  unlinkJob: () => void;
  updateSection: <K extends keyof Resume>(section: K, data: Resume[K]) => void;
  // Experience
  addExperience: (entry: Omit<ResumeExperience, "id">) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (fromIndex: number, toIndex: number) => void;
  // Education
  addEducation: (entry: Omit<ResumeEducation, "id">) => void;
  removeEducation: (id: string) => void;
  // Skills
  addSkill: (name: string, category: SkillCategory, proficiency?: SkillProficiency) => void;
  removeSkill: (id: string) => void;
  setSkillProficiency: (id: string, proficiency: SkillProficiency) => void;
  // Additional sections
  addCertification: (entry: Omit<ResumeCertification, "id">) => void;
  removeCertification: (id: string) => void;
  addProject: (entry: Omit<ResumeProject, "id">) => void;
  removeProject: (id: string) => void;
  addPublication: (entry: Omit<ResumePublication, "id">) => void;
  removePublication: (id: string) => void;
  addVolunteer: (entry: Omit<ResumeVolunteer, "id">) => void;
  removeVolunteer: (id: string) => void;
  addAward: (entry: Omit<ResumeAward, "id">) => void;
  removeAward: (id: string) => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  // Section management
  reorderSections: (sections: ResumeSection[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  // Save state
  markSaving: () => void;
  markSaved: () => void;
  markUnsaved: () => void;
}

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const defaultResume = (): Resume => ({
  id: "",
  name: "Untitled Resume",
  title: "",
  template: "MODERN",
  status: "draft",
  tags: [],
  visibility: "private",
  header: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  publications: [],
  volunteer: [],
  awards: [],
  interests: [],
  sections: [],
  atsScore: undefined,
  missingKeywords: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  versions: [],
});

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: [],
      currentResume: null,
      builderStep: 0,
      activeTemplate: "MODERN",
      activeSection: "header",
      isSaving: false,
      lastSavedAt: null,
      hasUnsavedChanges: false,

      setResumes: (resumes) => set({ resumes }),
      setCurrentResume: (resume) => set({ currentResume: resume }),
      setBuilderStep: (step) => set({ builderStep: step }),
      setTemplate: (template) =>
        set((state) => ({
          activeTemplate: template,
          hasUnsavedChanges: true,
          currentResume: state.currentResume ? { ...state.currentResume, template } : null,
        })),
      setActiveSection: (section) => set({ activeSection: section }),
      setResumeName: (name) =>
        set((state) => ({
          hasUnsavedChanges: true,
          currentResume: state.currentResume ? { ...state.currentResume, name } : null,
        })),
      setResumeTitle: (title) =>
        set((state) => ({
          hasUnsavedChanges: true,
          currentResume: state.currentResume ? { ...state.currentResume, title } : null,
        })),
      setStatus: (status) =>
        set((state) => ({
          hasUnsavedChanges: true,
          currentResume: state.currentResume ? { ...state.currentResume, status } : null,
        })),
      setVisibility: (visibility) =>
        set((state) => ({
          hasUnsavedChanges: true,
          currentResume: state.currentResume ? { ...state.currentResume, visibility } : null,
        })),
      linkJob: (jobId, score) =>
        set((state) => ({
          hasUnsavedChanges: true,
          currentResume: state.currentResume ? { ...state.currentResume, linkedJobId: jobId, linkedRoleScore: score } : null,
        })),
      unlinkJob: () =>
        set((state) => ({
          hasUnsavedChanges: true,
          currentResume: state.currentResume ? { ...state.currentResume, linkedJobId: undefined, linkedRoleScore: undefined } : null,
        })),
      updateSection: (section, data) =>
        set((state) => ({
          hasUnsavedChanges: true,
          currentResume: state.currentResume ? { ...state.currentResume, [section]: data } : null,
        })),

      addExperience: (entry) =>
        set((state) => {
          const newEntry: ResumeExperience = { ...entry, id: makeId("exp") };
          const updated = state.currentResume
            ? { ...state.currentResume, experience: [...state.currentResume.experience, newEntry] }
            : null;
          return { currentResume: updated, hasUnsavedChanges: true };
        }),
      removeExperience: (id) =>
        set((state) => ({
          currentResume: state.currentResume
            ? { ...state.currentResume, experience: state.currentResume.experience.filter((e) => e.id !== id) }
            : null,
          hasUnsavedChanges: true,
        })),
      reorderExperience: (fromIndex, toIndex) =>
        set((state) => {
          if (!state.currentResume) return {};
          const exp = [...state.currentResume.experience];
          const [moved] = exp.splice(fromIndex, 1);
          exp.splice(toIndex, 0, moved);
          return { currentResume: { ...state.currentResume, experience: exp }, hasUnsavedChanges: true };
        }),

      addEducation: (entry) =>
        set((state) => {
          const newEntry: ResumeEducation = { ...entry, id: makeId("edu") };
          const updated = state.currentResume
            ? { ...state.currentResume, education: [...state.currentResume.education, newEntry] }
            : null;
          return { currentResume: updated, hasUnsavedChanges: true };
        }),
      removeEducation: (id) =>
        set((state) => ({
          currentResume: state.currentResume
            ? { ...state.currentResume, education: state.currentResume.education.filter((e) => e.id !== id) }
            : null,
          hasUnsavedChanges: true,
        })),

      addSkill: (name, category, proficiency = 2) =>
        set((state) => {
          const newSkill: ResumeSkill = { id: makeId("skill"), name, category, proficiency };
          const updated = state.currentResume
            ? { ...state.currentResume, skills: [...state.currentResume.skills, newSkill] }
            : null;
          return { currentResume: updated, hasUnsavedChanges: true };
        }),
      removeSkill: (id) =>
        set((state) => ({
          currentResume: state.currentResume
            ? { ...state.currentResume, skills: state.currentResume.skills.filter((s) => s.id !== id) }
            : null,
          hasUnsavedChanges: true,
        })),
      setSkillProficiency: (id, proficiency) =>
        set((state) => {
          if (!state.currentResume) return {};
          return {
            currentResume: {
              ...state.currentResume,
              skills: state.currentResume.skills.map((s) => s.id === id ? { ...s, proficiency } : s),
            },
            hasUnsavedChanges: true,
          };
        }),

      addCertification: (entry) =>
        set((state) => {
          const newEntry: ResumeCertification = { ...entry, id: makeId("cert") };
          const updated = state.currentResume
            ? { ...state.currentResume, certifications: [...state.currentResume.certifications, newEntry] }
            : null;
          return { currentResume: updated, hasUnsavedChanges: true };
        }),
      removeCertification: (id) =>
        set((state) => ({
          currentResume: state.currentResume
            ? { ...state.currentResume, certifications: state.currentResume.certifications.filter((c) => c.id !== id) }
            : null,
          hasUnsavedChanges: true,
        })),

      addProject: (entry) =>
        set((state) => {
          const newEntry: ResumeProject = { ...entry, id: makeId("proj") };
          const updated = state.currentResume
            ? { ...state.currentResume, projects: [...state.currentResume.projects, newEntry] }
            : null;
          return { currentResume: updated, hasUnsavedChanges: true };
        }),
      removeProject: (id) =>
        set((state) => ({
          currentResume: state.currentResume
            ? { ...state.currentResume, projects: state.currentResume.projects.filter((p) => p.id !== id) }
            : null,
          hasUnsavedChanges: true,
        })),

      addPublication: (entry) =>
        set((state) => {
          const newEntry: ResumePublication = { ...entry, id: makeId("pub") };
          const updated = state.currentResume
            ? { ...state.currentResume, publications: [...state.currentResume.publications, newEntry] }
            : null;
          return { currentResume: updated, hasUnsavedChanges: true };
        }),
      removePublication: (id) =>
        set((state) => ({
          currentResume: state.currentResume
            ? { ...state.currentResume, publications: state.currentResume.publications.filter((p) => p.id !== id) }
            : null,
          hasUnsavedChanges: true,
        })),

      addVolunteer: (entry) =>
        set((state) => {
          const newEntry: ResumeVolunteer = { ...entry, id: makeId("vol") };
          const updated = state.currentResume
            ? { ...state.currentResume, volunteer: [...state.currentResume.volunteer, newEntry] }
            : null;
          return { currentResume: updated, hasUnsavedChanges: true };
        }),
      removeVolunteer: (id) =>
        set((state) => ({
          currentResume: state.currentResume
            ? { ...state.currentResume, volunteer: state.currentResume.volunteer.filter((v) => v.id !== id) }
            : null,
          hasUnsavedChanges: true,
        })),

      addAward: (entry) =>
        set((state) => {
          const newEntry: ResumeAward = { ...entry, id: makeId("awd") };
          const updated = state.currentResume
            ? { ...state.currentResume, awards: [...state.currentResume.awards, newEntry] }
            : null;
          return { currentResume: updated, hasUnsavedChanges: true };
        }),
      removeAward: (id) =>
        set((state) => ({
          currentResume: state.currentResume
            ? { ...state.currentResume, awards: state.currentResume.awards.filter((a) => a.id !== id) }
            : null,
          hasUnsavedChanges: true,
        })),

      addInterest: (interest) =>
        set((state) => {
          if (!state.currentResume || state.currentResume.interests.includes(interest)) return {};
          return {
            currentResume: { ...state.currentResume, interests: [...state.currentResume.interests, interest] },
            hasUnsavedChanges: true,
          };
        }),
      removeInterest: (interest) =>
        set((state) => ({
          currentResume: state.currentResume
            ? { ...state.currentResume, interests: state.currentResume.interests.filter((i) => i !== interest) }
            : null,
          hasUnsavedChanges: true,
        })),

      reorderSections: (sections) =>
        set((state) => ({
          currentResume: state.currentResume ? { ...state.currentResume, sections } : null,
          hasUnsavedChanges: true,
        })),
      toggleSectionVisibility: (sectionId) =>
        set((state) => {
          if (!state.currentResume) return {};
          return {
            currentResume: {
              ...state.currentResume,
              sections: state.currentResume.sections.map((s) =>
                s.id === sectionId ? { ...s, visible: !s.visible } : s
              ),
            },
            hasUnsavedChanges: true,
          };
        }),

      markSaving: () => set({ isSaving: true }),
      markSaved: () => set({ isSaving: false, hasUnsavedChanges: false, lastSavedAt: new Date() }),
      markUnsaved: () => set({ hasUnsavedChanges: true }),
    }),
    {
      name: "resume-storage",
      partialize: (state) => ({
        resumes: state.resumes,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);

export { defaultResume };