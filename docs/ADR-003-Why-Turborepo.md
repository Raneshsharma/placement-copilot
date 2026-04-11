# ADR-003: Turborepo for Monorepo Orchestration

**Status:** Accepted
**Date:** 2026-01-15
**Deciders:** Architecture Team

## Context

Placement Copilot is a monorepo with three apps (web, api, ai) and a shared package. We needed a build system to manage dependencies, shared builds, caching, and task orchestration across these packages.

## Decision Drivers

- Shared build tooling and caching across apps
- Consistent TypeScript configuration
- Workspace dependency management (apps consuming `packages/shared`)
- Build pipeline orchestration (web depends on api, api depends on shared)
- Local development experience (fast rebuilds, parallel execution)
- CI/CD efficiency (cache test and build results)

## Options Considered

### 1. Turborepo 2

Vercel's open-source build system for monorepos. Uses a task pipeline with intelligent caching.

**Pros:**
- Excellent caching engine (local + remote cache)
- Incremental builds based on task graph
- Task pipeline definition (`turbo.json`)
- Monorepo-aware TypeScript configuration
- Strong integration with npm/yarn/pnpm workspaces
- Remote caching (shared CI cache across team)
- Generous free tier for remote cache
- Open source with active development

**Cons:**
- Requires adopting its task execution model
- Some features locked behind Vercel (though core is open source)
- Learning curve for task graph configuration

### 2. Nx

Powerful monorepo tool with extensive features including code generation, affected commands, and dependency graph visualization.

**Pros:**
- Most mature monorepo tool
- Built-in code generators
- Affected commands (only build/test what changed)
- First-class TypeScript support
- Excellent CI caching
- Rich plugin ecosystem

**Cons:**
- Heavyweight - designed for large enterprise monorepos
- Steeper learning curve
- Can be slow to initialize
- Plugin ecosystem can be a moving target
- More opinionated about project structure
- Overkill for a 3-app monorepo

### 3. Lerna + npm/yarn Workspaces

Classic combination for monorepo management with separate tooling for build orchestration.

**Pros:**
- Simple and well-understood
- Works with any package manager
- Low barrier to entry

**Cons:**
- No built-in caching
- No task pipeline
- Manual coordination of builds between packages
- Lerna has slowed development in recent years
- No remote caching
- CI builds do full rebuilds every time

### 4. Bazel

Google's build system for managing large monorepos.

**Pros:**
- Extremely powerful caching and incremental builds
- Language-agnostic
- Remote execution support

**Cons:**
- Steep learning curve
- Complex configuration
- Heavy infrastructure requirements
- Overhead for small-to-medium monorepos
- Poor TypeScript/NPM ecosystem integration

### 5. pnpm + Manual Scripts

Pure package manager with workspace support, with root-level scripts orchestrating builds.

**Pros:**
- Fast and efficient (content-addressable storage)
- Strict workspace isolation
- No extra tooling

**Cons:**
- No caching infrastructure
- No task pipeline management
- Scripts must be manually coordinated
- Affected builds not possible
- CI still rebuilds everything

## Decision

**Chosen: Turborepo 2**

### Why Turborepo over alternatives:

1. **Intelligent caching** - Turborepo caches build, test, and lint outputs. When code hasn't changed, the cached output is restored instantly. This dramatically reduces CI times and local iteration cycles.

2. **Task pipeline in `turbo.json`** - We define which tasks depend on which, and Turborepo builds the execution graph automatically:
   ```json
   {
     "pipeline": {
       "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
       "test": { "dependsOn": ["build"] },
       "dev": { "cache": false, "persistent": true }
     }
   }
   ```

3. **Workspace-aware builds** - `^build` in `dependsOn` means "build all dependencies first". When `packages/shared` changes, both `apps/web` and `apps/api` rebuild.

4. **Remote cache** - CI and local development can share a remote cache, so CI doesn't rebuild unchanged packages.

5. **Appropriate scope** - Turborepo is designed for small-to-medium monorepos (3-50 packages). It's the right tool for our scale without the enterprise complexity of Nx or Bazel.

6. **pnpm compatibility** - Works seamlessly with pnpm workspaces, which we use for its efficiency advantages.

### Why not the alternatives:

- **Nx**: Excellent but heavyweight for our scale. The code generators are overkill when we have full Next.js and NestJS scaffolding. Steeper learning curve.
- **Lerna**: No caching means no CI optimization. Lerna's maintenance has slowed.
- **Bazel**: Extreme learning curve, heavy infrastructure, designed for Google's scale.
- **Manual scripts**: No caching, no dependency graph, manual coordination. Reinventing what Turborepo does well.

## Consequences

### Positive

- Fast local dev with incremental builds
- CI caching reduces build times dramatically
- Clear task dependency graph in `turbo.json`
- Remote cache accessible across team members and CI
- TypeScript project references work across packages

### Negative

- `turbo.json` configuration must be kept in sync with workspace structure
- Remote cache requires Vercel account (free tier sufficient for most teams)
- Debugging build issues may require understanding Turborepo's caching mechanism

## Implementation Notes

### Root `package.json`

```json
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "clean": "turbo clean"
  }
}
```

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "!.next/cache/**"]
    },
    "dev": { "cache": false, "persistent": true },
    "lint": { "outputs": [] },
    "test": { "dependsOn": ["build"], "outputs": ["coverage/**"] },
    "clean": { "cache": false }
  }
}
```

### Workspace Structure

```
placement-copilot/
├── apps/
│   ├── web/           # Depends on: shared
│   ├── api/           # Depends on: shared
│   └── ai/            # Standalone Python package
├── packages/
│   └── shared/        # No dependencies
├── turbo.json
├── package.json
└── tsconfig.base.json  # Shared TypeScript config
```
