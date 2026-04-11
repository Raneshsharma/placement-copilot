# Placement Copilot API Documentation

> Comprehensive reference for all REST API endpoints. Base URL: `http://localhost:3001/api`. All endpoints (except auth and health) require a JWT Bearer token.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Profiles](#profiles)
- [Resumes](#resumes)
- [Jobs](#jobs)
- [Applications](#applications)
- [Interviews](#interviews)
- [Skill Gaps](#skill-gaps)
- [Progress](#progress)
- [Notifications](#notifications)

---

## Authentication

### Register

Register a new user account.

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "Alex",
  "lastName": "Johnson"
}
```

**Response (201):**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Alex",
      "lastName": "Johnson",
      "role": "USER"
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

**Errors:**
- `409 Conflict` - Email already in use

---

### Login

Authenticate with email and password.

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Alex",
      "lastName": "Johnson",
      "role": "USER"
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid credentials

---

### Refresh Token

Exchange a refresh token for a new access token.

**Endpoint:** `POST /api/auth/refresh`

**Request:**
```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response (200):**
```json
{
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid or expired refresh token

---

### Google OAuth

Initiate Google OAuth flow.

**Endpoint:** `GET /api/auth/google`

**Response (200):**
```json
{
  "data": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=..."
  }
}
```

---

### Google OAuth Callback

Complete OAuth flow with authorization code.

**Endpoint:** `GET /api/auth/google/callback`

**Request Body:**
```json
{
  "code": "authorization_code_from_google"
}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Alex",
      "lastName": "Johnson",
      "role": "USER"
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

---

### Logout

Invalidate a refresh token.

**Endpoint:** `POST /api/auth/logout`
**Auth:** Required

**Request:**
```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response (200):**
```json
{
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## Users

### Get Current User

**Endpoint:** `GET /api/users/me`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Alex",
    "lastName": "Johnson",
    "role": "USER",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-04-10T00:00:00Z"
  }
}
```

---

### Update Current User

**Endpoint:** `PATCH /api/users/me`
**Auth:** Required

**Request:**
```json
{
  "firstName": "Alex",
  "lastName": "Smith"
}
```

**Response (200):** Returns updated user object.

---

### Delete Current User (Soft Delete)

**Endpoint:** `DELETE /api/users/me`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "message": "User deleted"
  }
}
```

---

## Profiles

### Get Current User Profile

**Endpoint:** `GET /api/profiles`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "headline": "Software Engineer",
    "summary": "Experienced developer...",
    "experience": [
      {
        "title": "Software Engineer",
        "company": "TechCorp",
        "startDate": "2022-01",
        "isCurrent": true,
        "description": "..."
      }
    ],
    "education": [
      {
        "institution": "UC Berkeley",
        "degree": "B.S.",
        "field": "Computer Science",
        "startYear": 2016,
        "endYear": 2020
      }
    ],
    "skills": ["React", "TypeScript", "Node.js"],
    "ppsScore": 78.5,
    "completeness": 85.0,
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-04-10T00:00:00Z"
  }
}
```

**Errors:**
- `404 Not Found` - Profile does not exist

---

### Create Profile

**Endpoint:** `POST /api/profiles`
**Auth:** Required

**Request:**
```json
{
  "headline": "Software Engineer",
  "summary": "Experienced developer...",
  "skills": ["React", "TypeScript"],
  "experience": [],
  "education": [],
  "location": "San Francisco, CA"
}
```

**Response (201):** Returns created profile object.

**Errors:**
- `400 Bad Request` - Profile already exists (use PUT for upsert)

---

### Create or Update Profile (Upsert)

**Endpoint:** `PUT /api/profiles`
**Auth:** Required

**Request:** Same as POST.

**Response (200):** Returns upserted profile object.

---

### Update Profile

**Endpoint:** `PATCH /api/profiles`
**Auth:** Required

**Request:** Any subset of profile fields:
```json
{
  "headline": "Senior Software Engineer",
  "skills": ["React", "TypeScript", "Python", "AWS"],
  "summary": "Updated summary..."
}
```

**Response (200):** Returns updated profile object.

---

### Get Profile by ID

**Endpoint:** `GET /api/profiles/:id`
**Auth:** Required

**Response (200):** Returns profile object.

---

### Get AI Analysis of Profile

**Endpoint:** `GET /api/profiles/:id/analysis`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "strengths": ["Strong frontend skills", "Good communication"],
    "areasForImprovement": ["Cloud experience gap"],
    "ppsScore": 78.5,
    "recommendations": ["Add AWS certification"]
  }
}
```

---

## Resumes

### Upload Resume

Upload a resume file (PDF, DOC, DOCX, TXT). Max size: 10MB.

**Endpoint:** `POST /api/resumes/upload`
**Auth:** Required
**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|---------|-------------|
| file  | File | Yes     | Resume file |
| title | string | Yes  | Resume title |

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "title": "Software Engineer Resume",
    "fileUrl": "/uploads/resumes/filename.pdf",
    "fileKey": "resumes/uuid-filename.pdf",
    "atsScore": 72.5,
    "version": 1,
    "isPrimary": false,
    "createdAt": "2026-04-10T00:00:00Z"
  }
}
```

---

### List User Resumes

**Endpoint:** `GET /api/resumes`
**Auth:** Required

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Software Engineer Resume",
      "atsScore": 72.5,
      "version": 1,
      "isPrimary": false,
      "createdAt": "2026-04-10T00:00:00Z"
    }
  ]
}
```

---

### Get Resume by ID

**Endpoint:** `GET /api/resumes/:id`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "Software Engineer Resume",
    "fileUrl": "/uploads/resumes/filename.pdf",
    "parsedData": {
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "experience": [...],
      "education": [...],
      "skills": [...]
    },
    "atsScore": 72.5,
    "version": 1,
    "isPrimary": false,
    "createdAt": "2026-04-10T00:00:00Z",
    "updatedAt": "2026-04-10T00:00:00Z"
  }
}
```

---

### Delete Resume

**Endpoint:** `DELETE /api/resumes/:id`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "message": "Resume deleted"
  }
}
```

---

### Set Resume as Primary

**Endpoint:** `POST /api/resumes/:id/primary`
**Auth:** Required

**Response (200):** Returns updated resume with `isPrimary: true`.

---

### Analyze Resume with AI

**Endpoint:** `POST /api/resumes/:id/analyze`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "atsScore": 85.0,
    "missingKeywords": ["Kubernetes", "GraphQL"],
    "suggestions": ["Add more quantifiable achievements"]
  }
}
```

---

### Optimize Resume for Target Role

**Endpoint:** `POST /api/resumes/:id/optimize`
**Auth:** Required

**Request:**
```json
{
  "resumeId": "uuid (optional, overrides URL param)",
  "jobDescription": "Looking for a React engineer with TypeScript...",
  "targetRole": "Senior Frontend Engineer"
}
```

**Response (200):**
```json
{
  "data": {
    "optimizedContent": "...",
    "addedKeywords": ["TypeScript", "Redux", "Testing"],
    "newAtsScore": 91.0,
    "suggestions": ["Lead with your React experience"]
  }
}
```

---

## Jobs

### List Jobs

Get paginated list of job listings with optional filters.

**Endpoint:** `GET /api/jobs`
**Auth:** Required

**Query Parameters:**
| Param       | Type   | Default | Description |
|------------|--------|---------|-------------|
| page       | number | 1       | Page number |
| limit      | number | 20      | Items per page (max 100) |
| query      | string | -       | Search query |
| location   | string | -       | Location filter |
| locationType | string | -    | ONSITE, REMOTE, HYBRID |
| salaryMin  | number | -       | Minimum salary |
| salaryMax  | number | -       | Maximum salary |
| skills     | string[] | -     | Required skills |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Software Engineer",
      "company": "Google",
      "location": "Mountain View, CA",
      "locationType": "ONSITE",
      "salaryMin": 120000,
      "salaryMax": 180000,
      "source": "LINKEDIN",
      "status": "ACTIVE",
      "createdAt": "2026-04-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Search Jobs

Full-text search across job titles, companies, and descriptions.

**Endpoint:** `GET /api/jobs/search`
**Auth:** Required

**Query Parameters:** Same as list.

**Response (200):** Same paginated format as list.

---

### Get Recommended Jobs

Get job recommendations based on the current user's profile and skills.

**Endpoint:** `GET /api/jobs/recommended`
**Auth:** Required

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Frontend Engineer",
      "company": "Meta",
      "location": "Menlo Park, CA",
      "matchScore": 91,
      "reasons": ["Strong React match", "TypeScript alignment"]
    }
  ]
}
```

---

### Get Job by ID

**Endpoint:** `GET /api/jobs/:id`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "title": "Software Engineer",
    "company": "Google",
    "location": "Mountain View, CA",
    "locationType": "ONSITE",
    "salaryMin": 120000,
    "salaryMax": 180000,
    "currency": "USD",
    "description": "...",
    "requirements": ["5+ years experience", "React"],
    "benefits": ["Health insurance", "401k"],
    "keywords": ["React", "TypeScript", "Node.js"],
    "source": "LINKEDIN",
    "sourceUrl": "https://linkedin.com/jobs/...",
    "applyUrl": "https://...",
    "status": "ACTIVE",
    "postedAt": "2026-04-01T00:00:00Z",
    "createdAt": "2026-04-01T00:00:00Z"
  }
}
```

---

### Save Job

Save a job listing to the user's saved jobs.

**Endpoint:** `POST /api/jobs/saved`
**Auth:** Required

**Request:**
```json
{
  "jobId": "uuid"
}
```

**Response (201):**
```json
{
  "data": {
    "message": "Job saved"
  }
}
```

---

### Update Saved Job

**Endpoint:** `PATCH /api/jobs/saved/:id`
**Auth:** Required

**Request:** Any subset of job fields.

**Response (200):** Returns updated saved job.

---

### Remove Saved Job

**Endpoint:** `DELETE /api/jobs/saved/:id`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "message": "Job removed"
  }
}
```

---

## Applications

### List User Applications

**Endpoint:** `GET /api/applications`
**Auth:** Required

**Query Parameters:**
| Param | Type   | Default | Description |
|-------|--------|---------|-------------|
| page  | number | 1       | Page number |
| limit | number | 20      | Items per page |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "company": "Google",
      "position": "Software Engineer",
      "status": "INTERVIEW",
      "appliedAt": "2026-04-05T00:00:00Z",
      "timeline": [
        { "status": "DRAFT", "timestamp": "2026-04-01T00:00:00Z" },
        { "status": "SUBMITTED", "timestamp": "2026-04-05T00:00:00Z" },
        { "status": "INTERVIEW", "timestamp": "2026-04-08T00:00:00Z", "note": "Phone screen scheduled" }
      ],
      "notes": "Recruiter contacted me via LinkedIn",
      "createdAt": "2026-04-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 12,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### Create Application

**Endpoint:** `POST /api/applications`
**Auth:** Required

**Request:**
```json
{
  "jobListingId": "uuid (optional)",
  "resumeId": "uuid (optional)",
  "company": "Google",
  "position": "Software Engineer",
  "status": "DRAFT",
  "notes": "Found via LinkedIn"
}
```

**Response (201):** Returns created application.

---

### Get Application by ID

**Endpoint:** `GET /api/applications/:id`
**Auth:** Required

**Response (200):** Returns full application object with timeline.

---

### Update Application

**Endpoint:** `PATCH /api/applications/:id`
**Auth:** Required

**Request:** Any subset of application fields.

**Response (200):** Returns updated application.

---

### Update Application Status

Updates application status with transition validation. See [Status Transitions](#status-transitions).

**Endpoint:** `PATCH /api/applications/:id/status`
**Auth:** Required

**Request:**
```json
{
  "status": "INTERVIEW",
  "note": "Phone screen scheduled for next week"
}
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "status": "INTERVIEW",
    "timeline": [
      { "status": "INTERVIEW", "timestamp": "2026-04-10T00:00:00Z", "note": "Phone screen scheduled" }
    ]
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid status transition

---

### Add Note to Application

**Endpoint:** `POST /api/applications/:id/notes`
**Auth:** Required

**Request:**
```json
{
  "notes": "Recruiter follow-up: asked about salary expectations"
}
```

**Response (200):**
```json
{
  "data": {
    "message": "Note added"
  }
}
```

---

### Get Application Timeline

**Endpoint:** `GET /api/applications/:id/timeline`
**Auth:** Required

**Response (200):**
```json
{
  "data": [
    { "status": "DRAFT", "timestamp": "2026-04-01T00:00:00Z" },
    { "status": "SUBMITTED", "timestamp": "2026-04-05T00:00:00Z" },
    { "status": "INTERVIEW", "timestamp": "2026-04-08T00:00:00Z", "note": "Phone screen" }
  ]
}
```

---

### Delete Application

**Endpoint:** `DELETE /api/applications/:id`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "message": "Application deleted"
  }
}
```

---

### Status Transitions

Valid application status transitions:

```
DRAFT       → SUBMITTED, WITHDRAWN
SUBMITTED   → UNDER_REVIEW, REJECTED, WITHDRAWN
UNDER_REVIEW → INTERVIEW, REJECTED, WITHDRAWN
INTERVIEW   → OFFERED, REJECTED, WITHDRAWN
OFFERED     → WITHDRAWN
REJECTED    → (terminal, no transitions)
WITHDRAWN   → (terminal, no transitions)
```

---

## Interviews

### List User Interviews

**Endpoint:** `GET /api/interviews`
**Auth:** Required

**Query Parameters:**
| Param | Type   | Default | Description |
|-------|--------|---------|-------------|
| page  | number | 1       | Page number |
| limit | number | 20      | Items per page |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "TECHNICAL",
      "status": "COMPLETED",
      "scores": {
        "overall": 78,
        "communication": 85,
        "technical": 72,
        "problemSolving": 80
      },
      "duration": 42,
      "completedAt": "2026-04-05T00:00:00Z",
      "createdAt": "2026-04-05T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### Start Interview Session

Start a new mock interview with generated questions.

**Endpoint:** `POST /api/interviews/start`
**Auth:** Required

**Request:**
```json
{
  "applicationId": "uuid (optional)",
  "interviewType": "TECHNICAL",
  "difficulty": "medium"
}
```

**Interview Types:** `BEHAVIORAL`, `TECHNICAL`, `CASE_STUDY`, `SYSTEM_DESIGN`, `HYBRID`

**Difficulties:** `easy`, `medium`, `hard`

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "type": "TECHNICAL",
    "status": "IN_PROGRESS",
    "questions": [
      {
        "id": "q1",
        "question": "Explain the difference between var, let, and const in JavaScript",
        "category": "JavaScript",
        "difficulty": "medium",
        "timeLimit": 300
      },
      {
        "id": "q2",
        "question": "Implement a function to check if a binary tree is balanced",
        "category": "Algorithms",
        "difficulty": "medium",
        "timeLimit": 600
      }
    ],
    "startedAt": "2026-04-10T00:00:00Z"
  }
}
```

---

### Get Interview by ID

**Endpoint:** `GET /api/interviews/:id`
**Auth:** Required

**Response (200):** Returns full interview object with questions, answers, and scores.

---

### Submit Answer

Submit an answer to a question during an interview.

**Endpoint:** `POST /api/interviews/:id/answer`
**Auth:** Required

**Request:**
```json
{
  "questionId": "q1",
  "answer": "var is function-scoped, let and const are block-scoped..."
}
```

**Response (200):**
```json
{
  "data": {
    "message": "Answer submitted",
    "scores": {
      "communication": 80,
      "technicalAccuracy": 75
    }
  }
}
```

---

### Complete Interview

End an interview session and generate feedback.

**Endpoint:** `POST /api/interviews/:id/complete`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "status": "COMPLETED",
    "scores": {
      "overall": 78,
      "communication": 85,
      "technical": 72,
      "problemSolving": 80
    },
    "feedback": "Good explanation of scope. Consider more concrete examples...",
    "completedAt": "2026-04-10T00:00:00Z"
  }
}
```

---

### Get Interview Feedback

**Endpoint:** `GET /api/interviews/:id/feedback`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "overallScore": 78,
    "categoryScores": {
      "communication": 85,
      "technicalAccuracy": 72,
      "problemSolving": 80,
      "timeManagement": 75
    },
    "strengths": ["Clear communication", "Structured approach"],
    "areasForImprovement": ["Could elaborate on trade-offs"],
    "nextSteps": ["Review system design patterns", "Practice more algorithm problems"]
  }
}
```

---

## Skill Gaps

### Analyze Skill Gaps

Run AI-powered skill gap analysis for a target role.

**Endpoint:** `POST /api/skill-gaps/analyze`
**Auth:** Required

**Request:**
```json
{
  "currentSkills": ["React", "TypeScript", "Node.js", "Python"],
  "targetRole": "Senior Full Stack Engineer"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "targetRole": "Senior Full Stack Engineer",
    "currentSkills": ["React", "TypeScript", "Node.js", "Python"],
    "gaps": [
      {
        "skill": "System Design",
        "gapType": "MISSING",
        "severity": "HIGH",
        "gapPercent": 55,
        "description": "Required for senior roles but not in current profile",
        "estimatedTimeToAcquire": "4-6 weeks"
      },
      {
        "skill": "AWS",
        "gapType": "WEAK",
        "severity": "HIGH",
        "gapPercent": 40,
        "currentLevel": "beginner",
        "requiredLevel": "intermediate",
        "description": "Cloud infrastructure knowledge needed"
      }
    ],
    "recommendations": [
      "Focus on System Design fundamentals first",
      "Add AWS Solutions Architect certification"
    ],
    "roadmap": [
      {
        "title": "System Design Basics",
        "duration": "2 weeks",
        "resources": ["Grok the System Design Interview", "Designing Data-Intensive Applications"]
      }
    ],
    "priorityScore": 85.0,
    "createdAt": "2026-04-10T00:00:00Z"
  }
}
```

---

### Get Current Skill Gap Analysis

**Endpoint:** `GET /api/skill-gaps/current`
**Auth:** Required

**Response (200):** Returns the most recent skill gap analysis for the user, or null if none exists.

---

### Get Skill Gap Recommendations

**Endpoint:** `GET /api/skill-gaps/recommendations`
**Auth:** Required

**Response (200):**
```json
{
  "data": [
    {
      "skill": "System Design",
      "priority": "HIGH",
      "reason": "Required for 85% of target senior roles",
      "resources": 4,
      "estimatedTime": "4-6 weeks"
    }
  ]
}
```

---

### Get Skill Gap Analysis History

**Endpoint:** `GET /api/skill-gaps/history`
**Auth:** Required

**Query Parameters:**
| Param      | Type   | Description |
|------------|--------|-------------|
| targetRole | string | Filter by target role |

**Response (200):** Returns paginated list of past analyses.

---

## Progress

### Get Dashboard Data

**Endpoint:** `GET /api/progress/dashboard`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "stats": {
      "totalApplications": 12,
      "activeApplications": 5,
      "interviewsScheduled": 2,
      "offersReceived": 1,
      "avgResponseRate": 45.2,
      "ppsScore": 78.0
    },
    "weeklyActivity": [
      { "date": "2026-04-07", "count": 3 },
      { "date": "2026-04-08", "count": 1 },
      { "date": "2026-04-09", "count": 2 }
    ],
    "milestones": [
      { "name": "First Application", "achieved": true, "date": "2026-04-03" },
      { "name": "First Interview", "achieved": true, "date": "2026-04-05" }
    ]
  }
}
```

---

### Get Analytics

**Endpoint:** `GET /api/progress/analytics`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "applicationFunnel": {
      "submitted": 12,
      "underReview": 3,
      "interview": 2,
      "offered": 1
    },
    "interviewPerformance": [
      { "date": "2026-04-05", "score": 78 },
      { "date": "2026-04-02", "score": 65 }
    ],
    "skillsProgress": [
      { "skill": "System Design", "progress": 30 }
    ]
  }
}
```

---

### Get Timeline

**Endpoint:** `GET /api/progress/timeline`
**Auth:** Required

**Response (200):**
```json
{
  "data": [
    { "date": "2026-04-09", "event": "Application submitted", "detail": "Google SWE" },
    { "date": "2026-04-08", "event": "Interview completed", "detail": "Behavioral - Stripe" }
  ]
}
```

---

## Notifications

### List Notifications

**Endpoint:** `GET /api/notifications`
**Auth:** Required

**Query Parameters:**
| Param | Type   | Default | Description |
|-------|--------|---------|-------------|
| page  | number | 1       | Page number |
| limit | number | 20      | Items per page |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "APPLICATION_STATUS",
      "title": "Interview Scheduled",
      "message": "Google has scheduled a phone screen for April 15",
      "isRead": false,
      "createdAt": "2026-04-10T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### Get Unread Count

**Endpoint:** `GET /api/notifications/unread-count`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "unreadCount": 5
  }
}
```

---

### Mark Notification as Read

**Endpoint:** `PATCH /api/notifications/:id/read`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "message": "Notification marked as read"
  }
}
```

---

### Mark All as Read

**Endpoint:** `POST /api/notifications/read-all`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "message": "All notifications marked as read"
  }
}
```

---

### Delete Notification

**Endpoint:** `DELETE /api/notifications/:id`
**Auth:** Required

**Response (200):**
```json
{
  "data": {
    "message": "Notification deleted"
  }
}
```

---

## Error Responses

All errors follow a standard format:

```json
{
  "error": {
    "statusCode": 400,
    "message": "Invalid status transition",
    "error": "Bad Request"
  }
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request (validation error, invalid transition) |
| 401  | Unauthorized (missing/invalid JWT) |
| 404  | Not Found |
| 409  | Conflict (duplicate email) |
| 429  | Too Many Requests (rate limit exceeded) |
| 500  | Internal Server Error |
