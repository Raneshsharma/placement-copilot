# Resume Builder — Full Product PRD
**Status:** Approved
**Owner:** CPM Agent
**Stakeholders:** UX Agent, Team Lead, Engineering, Backend
**Last Updated:** 2026-04-11
**Design System:** Sovereign Careerist (v2.0)
**Implementation Priority:** P0 (MVP) → P1 → P2 → P3

---

## 1. Overview & Vision

The Resume Builder is the **craftsmanship engine** of Placement Copilot AI — where users shape their professional identity into a weapon of opportunity. It is a **guided 10-step journey** from blank canvas to ATS-optimized, downloadable resume — with AI assistance at every step, real-time preview, and role-specific optimization.

The product is split into two primary UIs:
- **`/resume`** — List view of all resumes with management actions (P0)
- **`/resume/builder`** — 10-step guided builder flow (P0-P1)
- **`/resume/[id]`** — Edit existing resume (P1)

---

## 2. The 10-Step User Flow

### Step 0 — Start Method Selector
**Route:** `/resume/builder` (entry point)

Four large cards in a 2×2 grid layout:
| Card | Icon | Description |
|------|------|-------------|
| **Start from Scratch** | `FilePlus` | Build resume manually, full control |
| **AI-Assisted Build** | `Sparkles` | AI asks questions to fill content |
| **Import from PDF** | `Upload` | Upload existing resume, AI parses & formats |
| **Use a Template** | `Layout` | Start with a pre-made template |

Each card: `bg-surface-container-highest rounded-xl shadow-ambient-sm p-8 flex flex-col items-center gap-3 text-center hover:shadow-ambient-md surface-shift cursor-pointer border-2 border-transparent hover:border-primary`

Selected state: `border-primary bg-primary/5`

**Behavior:**
- Clicking "Start from Scratch" → proceed to Step 1 (template selection)
- Clicking "AI-Assisted Build" → show brief onboarding modal, then launch AI interview
- Clicking "Import from PDF" → show file upload dialog, parse PDF, pre-fill builder
- Clicking "Use a Template" → proceed to Step 1 with templates pre-highlighted

---

### Step 1 — Template Selection
**Route:** `/resume/builder?step=1`

6+ templates in a horizontal scroll grid. Each template card shows:
- Mini preview thumbnail (CSS-rendered, not actual PDF)
- Template name
- ATS score estimate badge (e.g., "ATS: 85+")
- "ATS-Friendly" filter badge on qualifying templates

**Filter toggle row** above template grid:
- Toggle: "Show ATS-friendly only" — `Switch` component
- When ON, non-ATS templates fade/grey out with `opacity-40`

Templates (minimum 6):
1. **Modern** — clean, modern, ATS-optimized
2. **Minimal** — whitespace-heavy, simple
3. **Executive** — traditional, formal, serif headers
4. **Creative** — two-column, sidebar layout
5. **Technical** — designed for engineering roles, code/tech keywords prominent
6. **Consulting** — structured, bullet-heavy, leadership focus
7. **Academic** — for research/education roles
8. **Entry-Level** — simplified, single column

Each card: `shrink-0 w-44 h-52 rounded-xl border-2 p-2 transition-all`
- Selected: `border-primary bg-primary/5`
- Unselected: `border-outline-variant bg-surface-container-highest hover:border-primary/30`
- ATS filter ON + not ATS-friendly: `opacity-40 cursor-not-allowed`

Below templates: "Continue" button → Step 2

---

### Step 2 — Profile / Basic Info
**Route:** `/resume/builder?step=2`

Fields:
- **Professional Title** — `Input` with AI suggestion button
- **Full Name** — `Input`
- **Email** — `Input`
- **Phone** — `Input`
- **Location (City, State/Country)** — `Input`
- **LinkedIn URL** — `Input`
- **GitHub URL** — `Input`
- **Portfolio/Website URL** — `Input`

**AI Rewrite button** next to Professional Title:
- Calls `POST /api/resume/ai-suggest-title` with current title
- Shows suggestion in a floating popover
- "Apply" replaces the field value

Progress indicator at top: "Step 2 of 10" with progress bar

Below fields: "Professional Summary" section
- `Textarea min-h-[160px]` with placeholder
- "AI Generate" button → `POST /api/resume/generate-summary`
- Loading state: spinner + "Generating..."

Below: "Add Summary →" expandable section with tips

Navigation: Back (Step 1) | "Continue to Experience →"

---

### Step 3 — Work Experience
**Route:** `/resume/builder?step=3`

**Drag-to-reorder** experience entries using `@dnd-kit/sortable`:
- Drag handle (`GripVertical` icon) on left of each entry
- Smooth reordering animation
- Order persisted to store immediately

Each entry (`Card bg-surface-container-highest shadow-ambient-sm`):
- **Company** (Input)
- **Job Title** (Input) — with AI suggestion
- **Period** — two inputs: "Start Date" + "End Date" (or "Present" toggle checkbox)
- **Location** (Input)
- **Employment Type** — `Select`: Full-time, Part-time, Contract, Intern, Freelance
- **Achievements** — `Textarea min-h-[120px]` one bullet per line
  - "AI Suggest Achievements" button → calls `POST /api/resume/ai-suggest-achievements`
  - Parses achievements and adds them as new bullets (appends, doesn't replace)
  - Loading: "Analyzing role context..."

Entry-level toggle: "Add bullet points using AI" — uses job title + company to suggest 4-5 achievements

**"Add Experience"** button: full-width, `Button variant="outline"`
**"Add Earlier Role"** button: secondary, adds a pre-populated "Previous Company" entry

Empty state: "Add your work history to strengthen your resume" with illustration

Navigation: Back | Continue to Education

---

### Step 4 — Education
**Route:** `/resume/builder?step=4`

Each entry (`Card bg-surface-container-highest shadow-ambient-sm`):
- **Institution** (Input)
- **Degree Type** — `Select`: Bachelor's, Master's, PhD, Associate's, Diploma, Certificate
- **Field of Study** (Input)
- **Graduation Date** — month/year picker
- **GPA** (optional) (Input) — with "out of 4.0" label
- **Honors** (Input) — e.g., "Magna Cum Laude", "Dean's List (3 semesters)"
- **Relevant Coursework** — multi-tag input (Enter to add, × to remove)
- **Extracurriculars** (optional) (Textarea, min-h-[60px])

**"Add Education"** button: full-width

Navigation: Back | Continue to Skills

---

### Step 5 — Skills
**Route:** `/resume/builder?step=5`

Four skill categories in a tabbed layout:
| Tab | Label | Color indicator |
|-----|-------|-----------------|
| `technical` | Technical | Navy dot |
| `soft` | Soft Skills | Cyan dot |
| `tools` | Tools & Software | Emerald dot |
| `languages` | Languages | Amber dot |

Each category:
- **Add skill input**: type + Enter to add
- **Skill tags**: each tag has proficiency level indicator
  - Proficiency: `beginner` (1 dot), `intermediate` (2 dots), `advanced` (3 dots), `expert` (4 dots)
  - Click dots to cycle proficiency level
  - AI Match button: `POST /api/resume/ai-match-skills` — suggests relevant skills based on work experience + target role
  - Shows suggestions in a dropdown with "Add" buttons per skill
- **Remove**: × button on tag

**Target Role field** (at top, above tabs):
- `Input` + `Select` — role title + optional industry filter
- Changing this triggers AI skill matching suggestions
- "View AI Suggestions" button below

At bottom: aggregate skill count badge ("12 skills added")

Navigation: Back | Continue to Additional

---

### Step 6 — Additional Sections
**Route:** `/resume/builder?step=6`

Horizontal tab row: `Certifications` | `Projects` | `Publications` | `Volunteer` | `Awards` | `Interests`

Each section is a list of entries:

**Certifications:**
- Name, Issuing Organization, Date, Credential ID (optional), Credential URL (optional)
- "Add Certification" button

**Projects:**
- Project Name, Description (textarea), Technologies (multi-tag), URL (optional), Role
- "AI Describe Project" button → generates description from project name + technologies

**Publications:**
- Title, Publication/Journal, Date, URL, Description
- "Add Publication" button

**Volunteer:**
- Organization, Role, Period, Description
- "Add Volunteer Experience" button

**Awards:**
- Award Name, Issuer, Date, Description
- "Add Award" button

**Interests:**
- Text tag input (Enter to add) — used for personal interests section
- Examples auto-suggested

Navigation: Back | Continue to Optimization

---

### Step 7 — ATS Optimization
**Route:** `/resume/builder?step=7`

**ATS Score Gauge** — large circular SVG ring (not the existing bar meter):
- 128×128 SVG ring, stroke color by score (red/amber/cyan/green)
- Score number in center: `text-4xl font-bold font-display`
- Label below: "ATS Compatibility Score"
- Color bands:
  - `0–40`: `#dc2626` (red)
  - `41–60`: `#f59e0b` (amber)
  - `61–80`: `#006879` (cyan/secondary)
  - `81–100`: `#2ad760` (green/success)

**Keyword Breakdown Panel** (right of gauge):
- Matched keywords: green tags
- Missing keywords: amber tags with relevance score
- Click keyword to jump to relevant section in resume

**"Link a Role"** section:
- Search input to find roles from `/roles`
- Select role from dropdown → JD is pulled
- ATS score recalculates against selected role's keywords
- "Unlink Role" button to clear

**"Auto-Optimize"** button:
- `POST /api/resume/auto-optimize`
- Shows before/after comparison
- Applies suggestions automatically
- Score re-calculates after

**"View Keyword Suggestions"** accordion:
- Expandable list of all suggested keywords
- Each has "Inject into Summary" / "Add to Skills" / "Add to Experience" action buttons

Navigation: Back | Continue to Preview

---

### Step 8 — Preview & Final Edit
**Route:** `/resume/builder?step=8`

Three view modes (toggle at top):
- **Desktop** — full-width single column
- **Mobile** — simulated phone frame, 375px width
- **PDF** — static PDF preview render

**Inline editing** in preview:
- Click any text in preview → popover with textarea → confirm updates store
- Editable sections: Header, Summary, Experience entries, Education, Skills

**Font & Layout Controls** (collapsible panel, right side):
- Font family selector: `Inter`, `Georgia`, `Arial`, `Calibri`
- Font size slider: 10px – 14px
- Margin slider: 0.5" – 1.5"
- Line spacing: Single, 1.15, 1.5
- Color mode: Light / Dark preview

**"Reorder Sections"** drag-and-drop:
- List of sections (Header, Summary, Experience, Education, Skills, Additional)
- Drag to reorder — order reflected in preview
- "Reset to default" link

Navigation: Back | Continue to Save

---

### Step 9 — Save & Name
**Route:** `/resume/builder?step=9`

**Resume Metadata:**
- **Resume Title** — `Input` (e.g., "Software Engineer — Google Application")
- **Role Linkage** — optional `Select` of saved jobs from `/roles`
  - When linked: badge shows role name + match score
  - "Link to a role" opens a search modal
- **Tags** — multi-tag input (e.g., "tech", "fintech", "startup")
- **Visibility** — `Select`: Private / Public / Shareable link

**Versioning:**
- "Create as new version" checkbox
- If checked: "Version name" input appears
- Previous versions accessible from `/resume` list view
- "Restore this version" on each old version card

**Final actions:**
- "Save Draft" — `PATCH /api/resume`, status = "draft", toast, redirect to `/resume`
- "Save & Download PDF" — save then trigger PDF download
- "Save & Exit" — save, redirect to `/resume` list

---

## 3. Resume List View — `/resume`

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│ Sidebar │  My Resumes                            [+ New] │
│         │  ──────────────────────────────────────────── │
│         │  [Search] [Filter: All | Draft | Complete]  │
│         │  [Sort: Recent | Name | ATS Score]          │
│         │  ──────────────────────────────────────────── │
│         │  [ResumeCard] [ResumeCard] [ResumeCard]      │
│         │  [ResumeCard] [ResumeCard]                    │
│         │  ──────────────────────────────────────────── │
│         │  Empty state when no resumes                  │
└─────────┴────────────────────────────────────────────────┘
```

### Resume Card
`bg-surface-container-highest rounded-xl shadow-ambient-sm p-5 surface-shift hover:shadow-ambient-md`

Card anatomy:
```
┌────────────────────────────────────────────────┐
│ [Modern]  Senior Engineer — Google    [···]   │ ← title, dropdown menu
│ Updated 2 days ago · Draft                  │
│ ──────────────────────────────────────────── │
│ ATS Score: [78] [▓▓▓▓▓▓▓░░░]              │ ← ring + bar
│ Skills: React, TypeScript, Node.js (+4)     │
│ ──────────────────────────────────────────── │
│ [Edit] [Duplicate] [Delete] [PDF] [DOCX]  │ ← quick actions
│ [Match to Role →]                           │ ← link to roles
└────────────────────────────────────────────────┘
```

**Drop-down menu** (three dots `MoreHorizontal`):
- Edit
- Duplicate
- Rename
- Download PDF
- Download DOCX
- View ATS Analysis
- Link to Role
- Set as Primary
- Delete

**Card states:**
- Draft: `Badge variant="warning"` "Draft"
- Complete: `Badge variant="success"` "Complete"
- Linked to role: small linked-role badge with role name + match score

**Hover state:** shows "Edit" button more prominently

### Filters & Sort
- **Status filter**: All / Draft / Complete — pill row
- **Sort**: Recently updated (default) / Alphabetical / ATS Score (desc) / Created date
- **Search**: by resume title — 300ms debounce, `GET /api/resumes?query=...`
- **Role match filter**: "Show matching [RoleName]" — only when a role is linked

### Empty State
- Centered illustration (empty document icon)
- "No resumes yet" heading
- "Create your first resume to get started" subtext
- "Create Resume" button → `/resume/builder`

### Loading State
- 6 skeleton cards matching card dimensions
- Shimmer animation

---

## 4. State Management

### 4.1 Zustand Store — `resume-store.ts` (enhanced)

```typescript
interface ResumeSection {
  id: string;
  type: "header" | "summary" | "experience" | "education" |
        "skills" | "certifications" | "projects" | "publications" |
        "volunteer" | "awards" | "interests";
  visible: boolean;
  order: number;
}

interface Resume {
  id: string;
  name: string;
  title: string;                    // Professional title
  template: TemplateType;
  status: "draft" | "complete";
  linkedJobId?: string;
  tags: string[];
  visibility: "private" | "public" | "shared";
  header: {
    name: string; email: string; phone: string;
    location: string; linkedin?: string; github?: string; website?: string;
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
  sections: ResumeSection[];       // Section visibility + order
  atsScore?: number;
  missingKeywords?: string[];
  createdAt: string;
  updatedAt: string;
  versions: ResumeVersion[];
}

interface ResumeSkill {
  id: string;
  name: string;
  category: "technical" | "soft" | "tools" | "languages";
  proficiency: 1 | 2 | 3 | 4;     // 1=beginner, 4=expert
}
```

**Store methods to add:**
- `setResumeName(name: string)`
- `setStatus(status: "draft" | "complete")`
- `linkJob(jobId: string)`
- `unlinkJob()`
- `reorderSections(sections: ResumeSection[])`
- `addCertification, removeCertification`
- `addPublication, removePublication`
- `addVolunteer, removeVolunteer`
- `addAward, removeAward`
- `addInterest, removeInterest`
- `setSkillProficiency(skillId: string, level: 1|2|3|4)`
- `reorderExperience(fromIndex: number, toIndex: number)`
- `setStep(step: number)` — tracks builder progress

---

## 5. Auto-Save System

| Trigger | Behavior |
|---------|----------|
| Field blur | Save after 2s debounce |
| Section change | Save after 5s debounce |
| Every 30s | Auto-save if dirty |
| Window blur | Immediate save |
| Navigation away | Confirm dialog if unsaved |

**Save indicator states:**
- "Saving..." — spinner + text
- "Saved at HH:MM" — checkmark green
- "Unsaved changes" — amber text
- "Save failed" — red text + retry button

---

## 6. API Contracts

### Resume Management
```
GET    /api/resumes                    → list all resumes (paginated)
POST   /api/resumes                    → create new resume
GET    /api/resumes/:id                → get resume by ID
PATCH  /api/resumes/:id                → update resume
DELETE /api/resumes/:id               → delete resume
POST   /api/resumes/:id/duplicate      → duplicate resume
GET    /api/resumes/:id/versions       → list versions
POST   /api/resumes/:id/restore/:vid   → restore version
```

### Builder Steps
```
POST   /api/resume/ai-suggest-title       → { title: string } → { suggestion: string }
POST   /api/resume/generate-summary       → { prompt, currentSummary } → { summary }
POST   /api/resume/ai-suggest-achievements → { jobTitle, company, bullets } → { suggestions: string[] }
POST   /api/resume/ai-match-skills        → { jobTitle, experience } → { skills: string[] }
POST   /api/resume/ai-describe-project    → { projectName, technologies } → { description }
POST   /api/resume/auto-optimize          → { resumeId, roleId? } → { before, after, applied }
```

### ATS
```
POST   /api/resume/ats-score               → { resumeId, roleId? } → { score, matched, missing }
POST   /api/resumes/optimize               → { resumeId, jobDescription? } → { suggestions, missingKeywords }
```

### Download
```
GET    /api/resumes/:id/pdf                → binary PDF
GET    /api/resumes/:id/docx               → binary DOCX
GET    /api/resumes/:id/txt                → plain text
```

### Import
```
POST   /api/resume/import-pdf              → FormData (file) → { parsed: ResumeData, confidence }
```

---

## 7. Error Handling

| Error | User Message | Action |
|-------|-------------|--------|
| Auto-save fails | "Auto-save failed — changes may not be saved" + retry | Toast + show retry button |
| AI generation fails | "AI generation failed — try again" | Toast, keep existing content |
| PDF download fails | "Failed to download PDF — try again" | Toast |
| Import parse fails | "Could not parse resume — please check the file format" | Show manual fallback |
| Resume not found | "Resume not found — it may have been deleted" | Redirect to /resume |
| Network offline | "You're offline — changes will sync when reconnected" | Show offline banner |
| Version restore fails | "Failed to restore version" | Toast |
| Linked role deleted | "This role is no longer available" | Show unlink option |

---

## 8. Data Model (Backend)

```typescript
// Core entity
interface Resume {
  id: UUID; userId: UUID; name: string; title: string;
  template: "MODERN" | "MINIMAL" | "EXECUTIVE" | "CREATIVE" | "TECHNICAL" | "CONSULTING" | "ACADEMIC" | "ENTRY_LEVEL";
  status: "draft" | "complete";
  visibility: "private" | "public" | "shared";
  linkedJobId?: UUID; linkedRoleScore?: number;
  tags: string[];
  headerJson: JSON;           // Full header object
  summary: string;
  sectionsJson: JSON;        // Section order + visibility
  meta: { atsScore: number; missingKeywords: string[]; matchScore: number; };
  createdAt: Date; updatedAt: Date; deletedAt?: Date;
}

interface ResumeSection {
  id: UUID; resumeId: UUID;
  type: SectionType;
  visible: boolean; order: number;
  dataJson: JSON;            // Section-specific data
}

interface ResumeVersion {
  id: UUID; resumeId: UUID; name: string;
  snapshotJson: JSON;        // Full resume at version time
  createdAt: Date;
}

interface ResumeSkill {
  id: UUID; resumeId: UUID;
  name: string; category: SkillCategory; proficiency: 1|2|3|4;
}
```

---

## 9. Implementation Priority

### P0 — MVP (Must ship)
1. Resume list view (`/resume`) — cards, filters, sort, quick actions
2. Builder Step 0 (Start Method) + Step 1 (Template Selection)
3. Builder Steps 2-4: Profile, Experience, Education — all form fields
4. Builder Step 5: Skills (categorized, proficiency, AI match)
5. Builder Step 7: ATS Score + Keyword Panel
6. Builder Step 9: Save & Name + versioning
7. PDF/DOCX download
8. Auto-save (30s + blur)
9. Enhanced Zustand store with all types

### P1 — Full Builder
1. Builder Step 3: Drag-to-reorder experience
2. Builder Step 3: AI achievement suggestions
3. Builder Step 6: Additional sections (all 6 types)
4. Builder Step 8: Preview (3 modes + inline edit)
5. Builder Step 8: Font/margin controls
6. Import from PDF
7. Role ↔ Resume linkage

### P2 — Polish
1. Builder Step 8: Reorder sections (drag-and-drop)
2. AI-assisted build (Step 0 → interview flow)
3. ATS Auto-Optimize
4. Resume duplication
5. Version history + restore
6. Mobile preview optimization

### P3 — Enhancement
1. Shareable public link
2. Collaborative editing
3. Resume comparison view
4. Batch download
5. Analytics dashboard (which roles each resume was used for)

---

## 10. Acceptance Criteria

### `/resume` List
- [ ] All user resumes display as cards with title, ATS score, last updated
- [ ] Cards have Edit, Duplicate, Delete, PDF, DOCX quick actions
- [ ] Dropdown menu with all 9 actions
- [ ] Status badges (Draft/Complete) shown
- [ ] Filter by status (All/Draft/Complete)
- [ ] Sort by Recent/Name/ATS Score
- [ ] Search by resume title (300ms debounce)
- [ ] Linked role badge shown when job is linked
- [ ] Empty state with "Create Resume" CTA
- [ ] Loading shows 6 skeleton cards
- [ ] "+ New" button opens builder at Step 0

### Builder — All Steps
- [ ] Step indicator shows current step (0-9)
- [ ] "Back" and "Continue" navigation works
- [ ] Each step's form state persists across navigation
- [ ] AI generate/suggest buttons call correct APIs
- [ ] Auto-save fires on changes (30s) and on blur
- [ ] Save status indicator updates correctly
- [ ] Builder completion saves to API and redirects to list

### P0 Feature Completeness
- [ ] All 4 start methods available and functional
- [ ] 6+ templates shown with ATS-friendly filter
- [ ] Profile fields: name, email, phone, location, LinkedIn, GitHub, website, title
- [ ] AI summary generation works
- [ ] Experience: add/remove entries, AI achievement suggestions
- [ ] Education: all fields including GPA, honors, coursework
- [ ] Skills: 4 categories, proficiency levels, AI match suggestions
- [ ] Additional sections: all 6 types
- [ ] ATS score gauge with color-coded ring
- [ ] Missing keywords with inject buttons
- [ ] Save with title, role linkage, tags, versioning
- [ ] PDF and DOCX download working
- [ ] All colors use Sovereign Careerist design tokens — no hardcoded hex
- [ ] No solid 1px borders — tonal depth only