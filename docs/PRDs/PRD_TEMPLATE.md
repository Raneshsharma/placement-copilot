# PRD Template

Use this template for every Product Requirement Document.

---

## Feature Name

**Status:** Draft | In Review | Approved | In Development | Shipped
**Last Updated:** YYYY-MM-DD
**Owner:** CPM Agent
**Stakeholders:** (list anyone who needs to sign off)

---

## 1. Overview

### Summary
One paragraph that describes what this feature does and why it matters.

### User Persona
Who is the target user?
- Role, experience level, goals, pain points

### Problem Statement
What problem does this solve? What is the user unable to do today?

### Solution Overview
How does this feature solve the problem?

### Value Proposition
- **User benefit:** What does the user gain?
- **Business impact:** What metric does this move?
- **Differentiation:** How does this set us apart?

---

## 2. User Stories & Flows

### User Story Template
```
As a [user type]
I want to [action]
so that [benefit]
```

### Happy Path Flow
Step-by-step flow from user intent to goal completion.

### Variation Flows
Alternative paths (errors, edge cases, cancellations).

### Abandonment Points
Where users might drop off and why.

---

## 3. Functional Requirements

### Core Features (In Scope)
Numbered list of must-have features.

### Out of Scope
Explicitly what this feature does NOT include.

### Nice-to-Have (Future)
Features deferred to future iterations.

---

## 4. Non-Functional Requirements

- **Performance:** Response time targets, load handling
- **Availability:** Uptime requirements, error thresholds
- **Security:** Authentication, authorization, data handling
- **Accessibility:** WCAG level, screen reader support
- **Compatibility:** Browser support, mobile responsiveness

---

## 5. API Contracts

### Endpoints

#### `METHOD /api/resource`
**Request:**
```json
{}
```

**Response (Success - 200):**
```json
{}
```

**Response (Error - 4xx):**
```json
{}
```

### Data Models
Entity schemas, validation rules, relationships.

---

## 6. Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Validation Checkpoints
How to verify each criterion is met.

---

## 7. Success Metrics

| Metric | Target | Measurement |
|-------|--------|-------------|
| Adoption rate | X% of users | Weekly |
| Task completion | X% | Session analysis |
| Error rate | < X% | APM |
| NPS change | +X points | User survey |

---

## 8. Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Network failure mid-action | Graceful retry with clear message |
| Empty state (no data) | Helpful empty state UI |
| Rate limit hit | Clear retry-after message |
| Permission denied | Redirect with explanation |

---

## 9. Dependencies & Constraints

### Dependencies
- Internal: (list dependent services, features)
- External: (APIs, third-party services)

### Assumptions
- User has completed onboarding
- User has at least one resume uploaded
- etc.

### Constraints
- Timeline, budget, technical limitations

---

## 10. Open Questions

- [ ] Question 1 — Owner: ?
- [ ] Question 2 — Owner: ?

---

## 11. Sign-off Checklist

- [ ] All user stories have clear acceptance criteria
- [ ] All API contracts are defined and reviewed
- [ ] Success metrics are measurable and agreed upon
- [ ] Edge cases are identified and handled
- [ ] Out-of-scope boundaries are explicit
- [ ] Design review completed
- [ ] Team Lead technical feasibility confirmed
- [ ] CPM Agent sign-off: Pending / Approved
