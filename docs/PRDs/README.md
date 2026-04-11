# Product Documents

This directory contains product management artifacts for Placement Copilot AI.

## Structure

```
docs/
├── PRDs/              # Product Requirement Documents
│   └── README.md      # PRD template and standards
├── roadmap.md         # Product roadmap (prioritized)
└── backlog.md         # Feature backlog (prioritized)
```

## Contents

### PRDs (Product Requirement Documents)
Located in `docs/PRDs/`. Each PRD covers a single feature or feature area with:
- Feature overview, user persona, problem statement
- User stories and detailed flows
- Functional and non-functional requirements
- API contracts
- Acceptance criteria
- Success metrics
- Edge cases

### roadmap.md
Current product roadmap with:
- High-level priorities for the next quarter/quarter
- Major initiatives and their status
- Dependencies and constraints

### backlog.md
Feature backlog organized by priority:
- P0: Must-have (MVP)
- P1: Should-have (next sprint)
- P2: Nice-to-have (future)
- P3: Eventually (backlog)
- Wishlist (no timeline)

## Process

1. **New feature request** → CPM Agent creates/refines a PRD in `docs/PRDs/`
2. **PRD Review** → Team Lead reviews for technical feasibility
3. **Sprint Planning** → Team Lead breaks PRD into tasks and assigns
4. **Development** → Tasks executed, PRD updated as learnings emerge
5. **Sign-off** → CPM Agent signs off on completion against acceptance criteria
