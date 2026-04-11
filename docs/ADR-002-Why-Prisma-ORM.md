# ADR-002: Prisma over Other ORMs

**Status:** Accepted
**Date:** 2026-01-15
**Deciders:** Architecture Team

## Context

Placement Copilot uses PostgreSQL as its primary database. We needed an ORM to bridge the TypeScript API and the database. We evaluated several options.

## Decision Drivers

- TypeScript-first with excellent type inference
- Schema-as-code with automatic migrations
- Query builder with enough flexibility for complex queries
- Performance for production workloads
- Ecosystem and community maturity
- Prisma Client generation from schema (single source of truth)

## Options Considered

### 1. Prisma

Type-safe database client with a schema-first approach. Schema definitions generate a fully-typed Prisma Client.

**Pros:**
- Best-in-class TypeScript integration with full type inference
- Schema-as-code with declarative migrations
- Automatic client generation from schema
- TypeScript enums aligned with Prisma enums
- Excellent documentation and DX
- Good performance with connection pooling
- Strong team backing (Munich-based, well-funded)
- Works seamlessly with NestJS via `nestjs-prisma` or direct injection

**Cons:**
- Migration system is opinionated (uses its own CLI)
- Complex raw queries require falling back to `$queryRaw`
- Schema migrations can be slower than some alternatives for large datasets
- Less flexible than query builders for ad-hoc reporting queries

### 2. TypeORM

Feature-rich ORM with Active Record and Data Mapper patterns. Mature and widely used.

**Pros:**
- Very mature with extensive features
- Supports both Active Record and Repository patterns
- Good migration system
- Works well with NestJS (`@nestjs/typeorm`)
- Extensive documentation

**Cons:**
- TypeScript integration is adequate but not as strong as Prisma
- Requires explicit typing in many places (less inference)
- Runtime behavior diverges from TypeScript types in some cases
- Can be slower than Prisma due to heavy abstraction
- More verbose than Prisma's query API

### 3. Drizzle ORM

Lightweight TypeScript ORM with a query-builder approach. Newer but rapidly growing.

**Pros:**
- Excellent TypeScript support
- Very fast (approaches raw SQL performance)
- Lightweight with minimal abstraction
- Supports multiple databases
- Schema defined in TypeScript code

**Cons:**
- Newer ecosystem (less mature, smaller community)
- Fewer features than Prisma or TypeORM
- Migration tooling less mature
- Less adoption, higher risk for production use
- No native NestJS integration

### 4. Knex.js + Manual Typing

Query builder with raw SQL, manually typed with TypeScript interfaces.

**Pros:**
- Full control over SQL
- Fast (minimal abstraction)
- No ORM overhead

**Cons:**
- Manual type maintenance (not DRY with TypeScript types)
- No automatic migration management
- Higher boilerplate for CRUD operations
- No relationship handling
- Easy to introduce SQL injection if not careful

### 5. Raw SQL (node-postgres / pg)

Direct PostgreSQL access with typed result wrappers.

**Pros:**
- Maximum performance
- Full SQL power

**Cons:**
- No abstraction, lots of boilerplate
- Manual type maintenance
- No migration management
- Error-prone for complex queries

## Decision

**Chosen: Prisma**

### Why Prisma over alternatives:

1. **Type safety as a first-class citizen** - Prisma's generated client provides complete type inference from the schema. Every model, relation, and enum is fully typed with no manual annotation required. This eliminates an entire class of runtime bugs.

2. **Single source of truth** - The `schema.prisma` file defines the entire data model. From this single file, Prisma generates the TypeScript client AND provides migration files. When the schema changes, the client is regenerated.

3. **TypeScript enums matching database enums** - Prisma enums in the schema generate TypeScript enums that can be exported to `packages/shared` and used across the monorepo. This ensures the frontend and backend always agree on enum values.

4. **NestJS integration simplicity** - We use a singleton `PrismaService` that extends `PrismaClient` and can be injected into any NestJS service via dependency injection.

5. **Migration workflow** - `prisma migrate dev` generates migration files from schema changes, versioned in git. `prisma db push` syncs schema without migration files for rapid iteration.

6. **Connection pooling** - Prisma's Data Proxy or built-in connection pooling handles database connection management efficiently.

7. **TypeScript-first culture** - The Prisma team is committed to TypeScript, and the tool shows it in every API design decision.

### Why not the alternatives:

- **TypeORM**: Good ORM but weaker TypeScript integration. Runtime behavior doesn't always match TypeScript types. Heavier abstraction adds overhead.
- **Drizzle**: Promising but too new for a production application. Ecosystem is small. Migration tooling needs maturity.
- **Knex**: No type inference, manual migration management, boilerplate-heavy CRUD.
- **Raw SQL**: Maximum flexibility but no type safety, no schema migrations, high boilerplate.

## Consequences

### Positive

- Full type safety from database schema to API responses
- Easy schema migrations with version control
- TypeScript types in `packages/shared` stay in sync with the database automatically
- Prisma Studio for local database inspection
- Excellent query performance with connection pooling

### Negative

- Must use Prisma CLI for migrations (`prisma migrate`, `prisma db push`, `prisma generate`)
- Complex aggregations and reporting queries may require `$queryRaw`
- Schema changes require regeneration and potential migration
- Must manage `directUrl` vs `DATABASE_URL` for pool-based vs direct connections

## Implementation Notes

```
apps/api/prisma/
├── schema.prisma   # Data model definition
├── seed.ts        # Database seeding script
└── migrations/    # Versioned migration files
```

The schema is the authoritative source for all TypeScript entity types. `packages/shared/src/types/index.ts` re-exports Prisma enums and defines extended TypeScript interfaces that mirror the Prisma models (adding computed fields, transforming JSON fields into typed arrays, etc.).
