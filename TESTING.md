# Testing Guide for Placement Copilot

This guide covers how to run tests for the Placement Copilot monorepo.

## Project Structure

```
apps/
  api/          # NestJS backend
  web/          # Next.js frontend
  ai/           # FastAPI AI service
```

## API Tests (NestJS)

### Setup

Install dependencies (from the monorepo root):

```bash
cd apps/api
npm install
```

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:cov

# Run e2e tests
npm run test:e2e

# Run e2e tests in watch mode
npm run test:e2e:watch
```

### Test Structure

```
apps/api/tests/
  setup.ts                    # Jest setup (env vars, globals)
  jest-e2e.config.js          # E2E test configuration
  auth/
    auth.service.spec.ts      # Unit tests for AuthService
    auth.e2e-spec.ts          # E2E tests for auth endpoints
  applications/
    applications.service.spec.ts
  users/
    users.service.spec.ts
  profiles/
    profiles.service.spec.ts
  jobs/
    jobs.service.spec.ts
  interviews/
    interviews.service.spec.ts
  resumes/
    resumes.service.spec.ts
  skill-gaps/
    skill-gaps.service.spec.ts
  progress/
    progress.service.spec.ts
```

### Writing New API Tests

Unit tests use NestJS Testing module:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { MyService } from '../../../src/myservice/myservice.service';
import { PrismaService } from '../../../src/prisma/prisma.service';

describe('MyService', () => {
  let service: MyService;
  const mockPrisma = { /* mock Prisma methods */ };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<MyService>(MyService);
  });

  it('should do something', async () => {
    // test implementation
  });
});
```

E2E tests use supertest against the running application:

```typescript
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';

describe('MyController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/resource (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/resource')
      .expect(200);
    expect(res.body).toHaveProperty('data');
  });
});
```

### Test Configuration

- **jest.config.js**: Unit test configuration
- **jest-e2e.config.js**: E2E test configuration (separate to avoid DB conflicts)

## Web Tests (Next.js)

### Setup

Install dependencies:

```bash
cd apps/web
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run e2e tests only
npm run test:e2e
```

### Test Structure

```
apps/web/src/
  __tests__/
    components/
      button.test.tsx
      input.test.tsx
    pages/
      login.test.tsx
      register.test.tsx
      dashboard.test.tsx
  stores/
    __tests__/
      auth-store.test.ts
  lib/
    __tests__/
      utils.test.ts
```

### Writing New Web Tests

Component tests with React Testing Library:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

Page tests:

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { LoginPage } from '@/app/(auth)/login/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({ login: jest.fn() }),
}));

jest.mock('@/lib/api', () => ({
  authApi: { login: jest.fn() },
}));

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
```

### Test Configuration

- **jest.config.js**: Jest configuration with Next.js preset
- **jest.setup.ts**: Imports `@testing-library/jest-dom` for custom matchers

## AI Tests (FastAPI)

Tests are located in `apps/ai/tests/`. See the existing pytest configuration in `pyproject.toml`.

Run with:

```bash
cd apps/ai
pytest
```

## CI/CD

Tests should be run in CI before merging:

```bash
# API
cd apps/api && npm test && npm run test:e2e

# Web
cd apps/web && npm test
```

## Tips

- Mock external dependencies (Prisma, JWT, APIs) in unit tests
- Use `jest.clearAllMocks()` in `beforeEach` to ensure test isolation
- E2E tests require a running database - they are skipped in local unit test runs
- Component tests should focus on behavior, not implementation details
- Use `userEvent` from `@testing-library/user-event` instead of `fireEvent` for realistic user interactions
