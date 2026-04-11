# Documentation

## Architecture Decision Records

This folder contains Architecture Decision Records (ADRs) documenting key technical decisions for the Placement Copilot platform.

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](ADR-001-Why-JWT-for-Auth.md) | Why JWT for Authentication | Accepted | 2026-01-15 |
| [ADR-002](ADR-002-Why-Prisma-ORM.md) | Why Prisma over Other ORMs | Accepted | 2026-01-15 |
| [ADR-003](ADR-003-Why-Turborepo.md) | Why Turborepo | Accepted | 2026-01-15 |
| [ADR-004](ADR-004-Why-Next.js-App-Router.md) | Why Next.js App Router | Accepted | 2026-01-15 |

## What is an ADR?

An Architecture Decision Record is a document that captures an important architectural decision made along with its context and consequences. ADRs are used to:

- Record the rationale behind significant decisions
- Provide context for future team members
- Track the evolution of the system's architecture
- Avoid revisiting the same discussions repeatedly

## ADR Format

Each ADR follows this structure:

1. **Status** - Proposed, Accepted, Deprecated, or Superseded
2. **Context** - The situation that requires a decision
3. **Decision Drivers** - Forces that influence the decision
4. **Options Considered** - The alternatives evaluated
5. **Decision** - The chosen option with rationale
6. **Consequences** - Both positive and negative outcomes
7. **Implementation Notes** - Practical guidance for the chosen approach

## Creating a New ADR

1. Create a new file: `docs/ADR-NNN-Title.md`
2. Copy the template above
3. Fill in all sections
4. Set status to "Proposed"
5. Open a PR for review
6. After acceptance, update status to "Accepted" and add to this index

## Maintaining ADRs

ADRs should be updated when:

- A decision is superseded by a new one (mark old as "Superseded")
- The context changes significantly (update and note the change)
- A decision is deprecated (mark as "Deprecated")

Keeping ADRs up-to-date ensures they remain valuable references for the team.
