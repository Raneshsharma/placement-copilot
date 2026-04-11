# User Flows — Placement Copilot AI

**Owner:** UX Agent
**Last Updated:** 2026-04-11

## Auth Flow

```
┌─────────┐     ┌─────────┐     ┌──────────────┐     ┌───────────┐
│  Login  │────▶│ Dashboard│────▶│ Any protected │────▶│ Dashboard │
│  Page   │     │  Layout  │     │   route       │     │  Layout   │
└─────────┘     └─────────┘     └──────────────┘     └───────────┘
     │               ▲                    │                    │
     │               │                    │                    │
     │         Middleware                │                    │
     │         auth check                │                    │
     │               │                    │                    │
     ▼               │                    ▼                    ▼
┌──────────┐    ┌─────────┐         ┌────────────┐       ┌─────────┐
│ Register │────▶│ Dashboard│         │  /login    │◀──────│ Session │
│  Page   │     │  Layout  │         │  (bypass)  │       │ Expired │
└──────────┘    └─────────┘         └────────────┘       └─────────┘
     │               │
     │               │ (if new user)
     │               ▼
     │         ┌─────────────┐
     └────────▶│ Onboarding  │
               │   Wizard    │
               └─────────────┘
```

### Happy Path
1. User lands on `/login`
2. Can log in with email+password OR continue with Google OAuth
3. On success: JWT stored in localStorage, redirect to `/dashboard`
4. Dashboard layout checks `isAuthenticated` in auth store
5. If auth store empty on dashboard: auto-populates with mock user (current demo bypass)

### Error States
| Scenario | Behavior |
|----------|----------|
| Wrong password | Inline error: "Invalid email or password" |
| Email not found | Same message (don't reveal which) |
| Network failure | Toast: "Couldn't connect — check your internet" |
| Account locked | Redirect to unlock page |

### Edge Cases
- Session expired mid-use → redirect to login with return URL
- User already logged in → redirect from `/login` to `/dashboard`

---

## Application Tracker Flow

```
┌───────────────┐     ┌────────────┐     ┌────────────┐
│  Applications │────▶│  Kanban    │────▶│  Status    │
│    Page       │     │   Board    │     │  Updated   │
└───────────────┘     └────────────┘     └────────────┘
      │                    │                     │
      │                    │                     │
      │                    ▼                     ▼
      │               ┌────────────┐     ┌────────────┐
      │               │  Add App    │     │  Timeline  │
      │               │   Modal     │     │  Updated   │
      │               └────────────┘     └────────────┘
      │
      ▼
┌─────────────┐
│  App Detail  │◀── Click card
│    Page     │
└─────────────┘
```

### Happy Path (Add Application)
1. User clicks "+" button on Applications page
2. Modal opens with form: Company, Position, URL, Resume selection
3. User fills form + clicks "Add Application"
4. Card appears in "Draft" column
5. Toast: "Application added" with "Undo" action

### Drag & Drop Flow
1. User drags card from one column to another
2. Drop zone highlights (blue border)
3. On drop: card animates to new position, status updates
4. PATCH `/api/applications/:id/status` called
5. Timeline entry added with timestamp

### Status Transitions
```
Draft ──▶ Submitted ──▶ Under Review ──▶ Interview ──▶ Offered
  │           │              │               │             │
  ▼           ▼              ▼               ▼             ▼
Withdrawn  Rejected ◀───────┴───────────────┘         Rejected
```

### Error States
| Scenario | Behavior |
|----------|----------|
| Drag fails | Card snaps back to original position, toast error |
| Status update fails | Revert card position, toast with retry |
| Empty state | "No applications yet — start tracking" + CTA |

---

## Resume Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Resume   │────▶│  Upload    │────▶│  Resume    │
│   Page    │     │  Modal     │     │  Created   │
└────────────┘     └────────────┘     └────────────┘
      │                                    │
      │                                    │ (auto-triggered)
      │                                    ▼
      │                              ┌────────────┐
      │                              │  ATS Scan  │
      │                              │  (Claude)  │
      │                              └────────────┘
      │                                    │
      │                                    ▼
      │                              ┌────────────┐
      │                              │  Score +    │
      │                              │  Keywords   │
      │                              └────────────┘
      ▼
┌────────────┐
│  Optimize  │◀── User clicks "Optimize for Role"
│   Modal    │
└────────────┘
```

### Happy Path (Upload)
1. User on Resume page → clicks "Upload Resume"
2. File picker opens (PDF, DOCX only)
3. User selects file → upload progress bar
4. On success: resume appears in list, ATS score shown
5. Toast: "Resume uploaded — ATS score: 72"

### Error States
| Scenario | Behavior |
|----------|----------|
| Wrong file type | "Only PDF and DOCX files supported" |
| File too large (>10MB) | "File too large — maximum 10MB" |
| Upload fails | "Upload failed — tap to retry" |
| ATS scan fails | Resume saved but score shows "Pending" |

---

## Mock Interview Flow

```
┌───────────────┐     ┌────────────┐     ┌────────────┐
│   Interview   │────▶│  Type      │────▶│  Session   │
│     Page      │     │  Picker   │     │  Started   │
└───────────────┘     └────────────┘     └────────────┘
                            │                   │
                            │                   ▼
                            ▼            ┌────────────┐
                      ┌────────────┐      │  Question  │
                      │  History   │      │  Display   │
                      │  List      │      └────────────┘
                      └────────────┘            │
                                               ▼
                                        ┌────────────┐
                                        │  Answer    │
                                        │  Input     │
                                        └────────────┘
                                               │
                                               ▼
                                        ┌────────────┐
                                        │  Submit    │◀── User submits answer
                                        └────────────┘
                                               │
                                               ▼
                                        ┌────────────┐
                                        │  AI Review │◀── Claude evaluates
                                        │  + Next    │
                                        └────────────┘
                                               │
                             ┌─────────────────┼─────────────────┐
                             ▼                 ▼                 ▼
                      ┌────────────┐   ┌────────────┐   ┌────────────┐
                      │  Complete  │   │   Next     │   │   Exit    │
                      │  Session   │   │  Question  │   │   Early   │
                      └────────────┘   └────────────┘   └────────────┘
                             │                                     │
                             ▼                                     ▼
                      ┌────────────┐                         ┌────────────┐
                      │  Report    │                         │  Partial   │
                      │  Generated │                         │  Discarded │
                      └────────────┘                         └────────────┘
```

### Interview Types
- Behavioral (STAR method)
- Technical (system design, coding)
- Case Study
- Situational Judgment
- LeetCode (algorithm)
- Culture Fit
- Executive Mock

### Happy Path
1. User on Interview page → sees type picker cards
2. Selects type → session starts immediately
3. Questions displayed one at a time via AI
4. User types answer in textarea
5. Submits → AI reviews + shows feedback + next question
6. After all questions → completion screen + report

### Error States
| Scenario | Behavior |
|----------|----------|
| AI service unavailable | "AI temporarily unavailable — try again in a moment" |
| Answer too short | "Add more detail for better feedback" warning |
| Session times out | Auto-save answers, prompt to continue or exit |
| Browser closes mid-session | Resume capability (save state to DB) |

---

## Job Search Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│    Jobs    │────▶│  Search    │────▶│  Results   │
│    Page    │     │  Input     │     │   List     │
└────────────┘     └────────────┘     └────────────┘
      │                                      │
      │                                      ▼
      │                                ┌────────────┐
      │                                │  Job Card  │◀── Click to expand
      │                                └────────────┘
      │                                      │
      ▼                                      ▼
┌────────────┐                          ┌────────────┐
│ Recommend │◀── AI-powered matches   │ Job Detail│
│  Tab      │                          │   Page    │
└────────────┘                          └────────────┘
      │                                        │
      │                                        ▼
      │                                  ┌────────────┐
      │                                  │  Apply /   │
      │                                  │   Save     │
      │                                  └────────────┘
```

### Happy Path
1. User on Jobs page → sees search bar + filters
2. Searches "React Developer" → ES returns matching listings
3. Cards show: title, company, location, match %, salary range
4. User clicks card → detail page with full JD
5. User clicks "Save" → saved to user profile
6. User clicks "Apply" → opens apply URL in new tab + creates application

### Semantic Search (Future)
- User profile skills + resume → vector embedding
- Job listings → indexed in Weaviate with vector embeddings
- Similarity search returns ranked results with match percentage

---

## Skill Gap Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Skills   │────▶│ Target     │────▶│  Gap       │
│   Page     │     │  Role      │     │  Analysis  │
└────────────┘     │  Picker   │     └────────────┘
      │            └────────────┘           │
      │                                   │ (AI-powered)
      │                                   ▼
      │                             ┌────────────┐
      │                             │  Gap List  │
      │                             │  + Priority│
      │                             └────────────┘
      │                                   │
      ▼                                   ▼
┌────────────┐                     ┌────────────┐
│   Road-    │◀── Per gap item    │  Learning  │
│   map      │                     │  Resources │
└────────────┘                     └────────────┘
```

### Happy Path
1. User on Skills page → selects target role from picker
2. Submits → AI analyzes (current skills vs required)
3. Results show: gap items ranked by priority, difficulty, learning time
4. User clicks gap → sees roadmap with learning resources

### Error States
| Scenario | Behavior |
|----------|----------|
| AI service unavailable | "Skill analysis unavailable" + retry button |
| No profile skills set | Prompt to complete profile first |
