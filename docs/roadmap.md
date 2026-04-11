# Product Roadmap — Placement Copilot AI

**Last Updated:** 2026-04-11
**Owner:** CPM Agent
**Status:** Active

---

## Current Quarter Focus (Q2 2026)

### P0 — MVP Launch Blockers

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication (login/register) | Shipped | Works at http://localhost:3000/login |
| Dashboard Core Layout | Shipped | Sidebar, header, bottom nav, routing |
| Application Tracker (Kanban) | Partial | UI exists, drag-drop and add not fully wired |
| Resume Upload & ATS Scoring | Partial | Upload works, ATS scoring needs AI service |
| Mock Interview Engine | Partial | Session creation works, real-time AI not wired |
| Job Search & Recommendations | Partial | Listings display, semantic search not wired |
| Skill Gap Analysis | Partial | UI exists, AI analysis not wired |
| Profile/Progress Dashboard | Partial | UI with mock data, real metrics not wired |

### P1 — Core Experience

| Feature | Status | Priority |
|---------|--------|----------|
| Real-time AI Interview (Claude 4) | Not Started | Wire FastAPI agent orchestrator to NestJS |
| Semantic Job Search (Elasticsearch + Weaviate) | Not Started | Wire ES and Weaviate to job listing service |
| Resume ATS Optimization (Claude 4) | Not Started | Wire resume optimization to AI service |
| Drag-and-drop Kanban | Not Started | Implement dnd-kit or react-beautiful-dnd |
| Application add/edit modal | Not Started | Full CRUD on applications |
| Persistent user profile | Not Started | Connect profile wizard to API |

### P2 — Growth

| Feature | Status |
|---------|--------|
| Email/push notifications | Not Started |
| PPS (Placement Profile Score) calculation | Not Started |
| User onboarding wizard | Partial |
| Interview session history & feedback reports | Not Started |
| Saved jobs management | Not Started |
| Role-based roadmap generation | Not Started |

---

## Future Quarters

### Q3 2026
- Multi-resume management (tailored per role)
- LinkedIn import / auto-fill
- Interview calendar integration
- Referral tracking

### Q4 2026
- Cover letter generation
- Salary negotiation assistant
- Offer comparison tool
- Market analytics dashboard

---

## Dependencies

- **Elasticsearch + Weaviate** — in docker-compose but not wired to NestJS
- **AI Service (FastAPI)** — running on 8000 but not called by NestJS endpoints
- **Redis** — running but not used for sessions/caching
- **BullMQ** — in docker-compose but not used for async jobs

---

## Constraints

- Anthropic API key required for Claude 4 features
- Google OAuth requires real credentials for production
- Production deployment needs TLS certificates and proper secrets management

---

## Success Metrics (Target)

| Metric | Current | Target |
|--------|---------|--------|
| Login/Register completion rate | ~80% | 90%+ |
| Dashboard load time | TBD | < 2s |
| Application tracker usage | Not tracked | TBD |
| Interview session completion | TBD | 75%+ |
| PPS score accuracy | N/A | Calibrated vs. real outcomes |

---

## Review Cadence

- **Weekly:** CPM Agent reviews feature status with Team Lead
- **Bi-weekly:** Sprint planning alignment
- **Monthly:** Roadmap prioritization review
