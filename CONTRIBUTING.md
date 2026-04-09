# Contributing to Placement Copilot AI

Thank you for your interest in contributing! Please follow these guidelines to ensure a smooth development experience.

---

## Setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- npm or pnpm

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-org/placement-copilot.git
cd placement-copilot

# Start infrastructure
docker compose up -d

# Install root dependencies
npm install

# Start all apps in development mode
npm run dev
```

### Service Ports

| Service | URL |
|---|---|
| Web (Next.js) | http://localhost:3000 |
| API (NestJS) | http://localhost:3001 |
| AI Service (FastAPI) | http://localhost:3002 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |
| Elasticsearch | http://localhost:9200 |
| Weaviate | http://localhost:8080 |

### App-Specific Setup

**API Service (NestJS):**
```bash
cd apps/api
cp ../../.env.example .env
npx prisma migrate dev
npm run start:dev
```

**AI Service (FastAPI):**
```bash
cd apps/ai
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload --port 3002
```

---

## Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `docs` | Documentation changes |
| `chore` | Build process or auxiliary tool changes |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration changes |

### Examples

```
feat(api): add job search endpoint with Elasticsearch
fix(web): resolve dashboard PPS card rendering issue
docs: update API endpoint documentation
chore(ai): update LangGraph state schema
```

---

## Pull Request Process

1. **Fork & Branch** — Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Implement** — Write code following the project's conventions.

3. **Test** — Ensure all tests pass:
   ```bash
   npm run test
   ```

4. **Lint** — Run linters:
   ```bash
   npm run lint
   ```

5. **Commit** — Commit using conventional commits:
   ```bash
   git commit -m "feat(scope): add feature description"
   ```

6. **Push & PR** — Push your branch and open a pull request against `main`.

7. **Review** — Address review feedback. All checks must pass before merging.

---

## Code Review Checklist

Before requesting review, verify:

- [ ] Code compiles/builds without errors (`npm run build`)
- [ ] All tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] New types have corresponding Zod schemas in `packages/shared/src/schemas/`
- [ ] API endpoints are documented
- [ ] No hardcoded secrets or credentials
- [ ] New environment variables are added to `.env.example`
- [ ] Migration files are generated for database schema changes
- [ ] Unit tests cover new functionality
- [ ] Commit messages follow the conventional commits format

---

## Architecture Guidelines

- **Shared types** — All entity types must live in `packages/shared/src/types/` and have corresponding Zod schemas.
- **API responses** — Always use `ApiResponse<T>` and `PaginatedResponse<T>` envelopes.
- **AI agent tools** — Each LangGraph tool must have a Pydantic input schema.
- **Frontend state** — Use Zustand stores; avoid prop drilling beyond 2 levels.
- **Database** — All schema changes require a Prisma migration.

---

## Questions?

Open an issue or reach out to the maintainers.
