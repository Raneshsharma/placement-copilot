# ADR-001: JWT for Authentication

**Status:** Accepted
**Date:** 2026-01-15
**Deciders:** Architecture Team

## Context

Placement Copilot needs a stateless authentication mechanism for its API. The backend (NestJS) serves both the web app and will serve future clients (mobile, third-party integrations). We evaluated several approaches.

## Decision Drivers

- Stateless API (no server-side session storage required)
- Horizontal scalability of the API server
- Support for multiple clients (web, future mobile)
- Security properties (token expiry, refresh rotation)
- Implementation complexity and ecosystem maturity
- Compatibility with NestJS/Passport.js

## Options Considered

### 1. Session-based (express-session + Redis)

Traditional server-side sessions stored in Redis. Session ID in HTTP-only cookie.

**Pros:**
- Easy invalidation (delete from Redis)
- Built-in expiry management
- Well-understood security model

**Cons:**
- Requires Redis for every authenticated request
- Sessions can't be validated without Redis lookup
- Harder to scale horizontally (sticky sessions or shared session store needed)
- Adds latency per request

### 2. JWT (JSON Web Tokens)

Self-contained tokens signed with a secret key. Stored client-side (localStorage or HTTP-only cookie).

**Pros:**
- Stateless validation (no database lookup on every request)
- Scales horizontally with no session store dependency
- Works across multiple API instances
- Built-in expiry and claims structure
- Rich ecosystem (passport-jwt, @nestjs/passport)
- Supports access + refresh token rotation

**Cons:**
- Token revocation is not automatic (requires a denylist or short expiry)
- More complex refresh token lifecycle
- Storing in localStorage has XSS risks (mitigated by HTTP-only cookies)

### 3. OAuth 2.0 / OIDC (Keycloak, Auth0, Firebase Auth)

Managed identity provider with built-in token management.

**Pros:**
- Fully managed, no auth infrastructure to maintain
- Handles MFA, social login, password resets
- Compliance certifications (SOC2, GDPR)

**Cons:**
- External dependency on third-party service
- Adds latency and cost
- Less flexibility for custom auth logic
- Vendor lock-in risk
- Overkill for a single-application internal platform

### 4. PASETO (Platform-Agnostic SEcurity TOKens)

Modern alternative to JWT with stronger cryptographic defaults.

**Pros:**
- Better cryptographic defaults than JWT (no algorithm confusion attacks)
- Simpler API than JWT

**Cons:**
- Smaller ecosystem, fewer library integrations
- NestJS/Passport ecosystem strongly favors JWT
- Less battle-tested in production environments

## Decision

**Chosen: JWT with access + refresh token rotation**

We use the `passport-jwt` strategy in NestJS via `@nestjs/passport`. The implementation includes:

- **Access token**: Short-lived (minutes to hours, no explicit expiry in current impl), signed with `JWT_SECRET`
- **Refresh token**: 7-day expiry, signed with `JWT_REFRESH_SECRET`, stored server-side implicitly via expiry
- **Google OAuth**: Social login via Google OAuth 2.0, tokens exchanged on callback

### Why JWT over alternatives:

1. **Stateless scaling** - API servers can validate tokens without any shared state, enabling true horizontal scaling
2. **NestJS ecosystem** - `@nestjs/passport` and `passport-jwt` are first-class citizens with excellent TypeScript support
3. **Dual-token pattern** addresses revocation** - The 7-day refresh expiry bounds the window of token misuse without requiring a denylist
4. **Multi-client ready** - The same auth system works for web, mobile, and API consumers
5. **Industry standard** - JWT is the dominant choice for REST API auth in the Node.js ecosystem

### Why not the alternatives:

- **Sessions**: Require Redis lookup on every request, harder to scale
- **Managed auth (Auth0/Firebase)**: Adds external dependency, latency, and cost for a single-app platform
- **PASETO**: Excellent choice but immature ecosystem for NestJS

## Consequences

### Positive

- API servers are stateless and scale horizontally
- No session store dependency for auth
- Works seamlessly with the existing NestJS module structure
- Standard approach familiar to most developers

### Negative

- Refresh token revocation is not instant (bounded by 7-day expiry)
- Need to implement token denylist if instant revocation becomes required
- localStorage storage has XSS risk (mitigated by HTTP-only cookie for refresh token)

## Implementation Notes

The current implementation uses `passport-jwt` with:
- Access token extracted from `Authorization: Bearer <token>` header
- Refresh token exchanged via `POST /api/auth/refresh`
- Google OAuth via authorization code flow at `GET /api/auth/google`

Future improvements:
- Add refresh token denylist in Redis for instant revocation
- Consider HTTP-only, Secure, SameSite cookies for token storage
- Add token type hints in JWT `jti` claim for rotation tracking
