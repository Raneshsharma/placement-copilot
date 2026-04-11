# Feature Backlog — Placement Copilot AI

**Last Updated:** 2026-04-11
**Owner:** CPM Agent
**Status:** Active

---

## P0 — MVP Must-Have

> Features required for a functional first launch.

| # | Feature | PRD | Notes |
|---|---------|-----|-------|
| 1 | Real user auth flow (login/register/logout) | Existing | Works, but needs polish on error UX |
| 2 | Resume upload with file storage | Existing | Partial — upload works, storage needs S3 or local |
| 3 | Application tracker with CRUD | Existing | Partial — read/list works, add/edit modal needed |
| 4 | Mock interview session flow | Existing | Partial — session create works, AI answers not wired |
| 5 | Job listing display | Existing | Mock data only, real listings from ES/Weaviate needed |
| 6 | Dashboard progress metrics | Existing | Mock data only, real metrics from DB queries needed |
| 7 | Profile wizard completion | Existing | Partial — UI exists, persistence to DB needs wiring |

---

## P1 — Should-Have (Next Sprint)

| # | Feature | PRD | Notes |
|---|---------|-----|-------|
| 8 | Drag-and-drop Kanban board | PRDs/kanban-board.md | dnd-kit integration needed |
| 9 | Resume ATS scoring via Claude | PRDs/resume-ats.md | Wire to FastAPI AI service |
| 10 | Semantic job search (ES + Weaviate) | PRDs/job-search.md | Index listings, vector search |
| 11 | Real-time AI interview with Claude | PRDs/mock-interview.md | Wire session answers to LangGraph |
| 12 | Application status timeline | PRDs/timeline.md | Track history per application |
| 13 | Skill gap analysis with roadmap | PRDs/skill-gap.md | Connect to AI agent |
| 14 | Interview feedback reports | PRDs/interview-reports.md | Scoring, improvement suggestions |

---

## P2 — Nice-to-Have (Future Sprint)

| # | Feature | Notes |
|---|---------|-------|
| 15 | Email notifications | SendGrid or SES integration |
| 16 | Push notifications | FCM or web push |
| 17 | Multi-resume management | Per-role tailored resumes |
| 18 | PPS score calculation | Algorithm from profile completeness |
| 19 | Saved jobs with alerts | Notification when matching new jobs |
| 20 | Google OAuth | Real Google Cloud credentials needed |
| 21 | Social login (LinkedIn) | LinkedIn OAuth |
| 22 | PDF resume generation | Server-side PDF from resume data |
| 23 | Cover letter generation | AI-powered with job context |

---

## P3 — Eventually

| # | Feature | Notes |
|---|---------|-------|
| 24 | LinkedIn profile import | Scraping or LinkedIn API |
| 25 | Interview calendar integration | Google Calendar / Outlook |
| 26 | Salary negotiation assistant | Market data + AI |
| 27 | Offer comparison tool | Side-by-side offer analysis |
| 28 | Referral tracking | Track referral links |
| 29 | Market analytics dashboard | Aggregated industry trends |
| 30 | Collaborative features | Share resumes, get feedback |

---

## Wishlist (No Timeline)

- AI career coach chatbot
- Industry trend predictions
- ATS compatibility checker for companies
- Resume A/B testing
- Mock networking event simulator
- Salary benchmark database

---

## Recently Shipped

| Date | Feature | Notes |
|------|---------|-------|
| 2026-04-11 | Dashboard bypass auth | Mock user for demo |
| 2026-04-11 | Login/Register fix | Now calls NestJS API via axios |
| 2026-04-11 | API server running | NestJS on port 3001 |
| 2026-04-11 | Database synced | All tables via Prisma db push |

---

## Dependencies Map

```
P0 Features (must work together):
├── Resume upload ──→ S3/local file storage
├── App tracker ────→ Job listings, Resume references
├── Interview ──────→ Application link, Profile context
└── Dashboard ───────→ All of the above (metrics)

P1 Features (enhance P0):
├── ATS scoring ─────→ AI service + Resume data
├── Job search ──────→ ES indexer + User profile
├── Interview AI ────→ AI service + Interview sessions
└── Kanban drag ─────→ Application tracker (P0)

P2 Features (expand platform):
├── Notifications ────→ Redis queues
├── Multi-resume ─────→ Resume storage + Versioning
└── PPS score ────────→ Profile wizard + Analytics
```

---

## Criteria for P0 Completion

Before moving to P1, all P0 features must meet:
- [ ] Login/Register works end-to-end with real user in DB
- [ ] Resume uploads and persists (PDF stored)
- [ ] At least 1 application can be created, tracked, status changed
- [ ] Mock interview session can be started and completed (mock AI)
- [ ] Dashboard loads with real user data (not hardcoded mock)
- [ ] No 404 or 500 errors on core user flows
- [ ] Responsive on mobile (bottom nav works)
