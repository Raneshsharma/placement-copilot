# ADR-004: Next.js App Router over Pages Router

**Status:** Accepted
**Date:** 2026-01-15
**Deciders:** Architecture Team

## Context

Placement Copilot's web app is built with Next.js. We chose between the Pages Router (Next.js 12 and earlier approach) and the App Router (introduced in Next.js 13, stable in 14).

## Decision Drivers

- Server Components for reduced client-side JavaScript
- Nested layouts for dashboard shell
- React Server Components (RSC) for data fetching
- Streaming SSR with Suspense
- Future-proofing (App Router is the direction of Next.js)
- Route Groups for organizing auth and dashboard routes
- Middleware for route protection

## Options Considered

### 1. Next.js App Router

The modern React Server Components-based approach using the `app/` directory.

**Pros:**
- React Server Components (RSC) - components that run on the server and send zero JS to the client
- Nested layouts with seamless nested `<head>` management
- Route Groups for organizing `(auth)/` and `(dashboard)/` routes
- Server Actions for form submissions without API routes
- Streaming SSR with Suspense boundaries
- Built-in loading.tsx and error.tsx conventions
- More idiomatic React patterns
- Next.js's recommended direction (heavy investment)
- Better default performance (less client-side JS)

**Cons:**
- Learning curve for Server Components paradigm
- Client components must be explicitly marked (`"use client"`)
- Some third-party libraries don't yet support Server Components
- `async` server components require understanding async patterns
- Migration from Pages Router has friction
- Certain patterns (middleware, ISR) work differently

### 2. Next.js Pages Router

The traditional approach using the `pages/` directory with `getServerSideProps` and `getStaticProps`.

**Pros:**
- Stable and battle-tested (used in production for years)
- Clear data fetching patterns (`getServerSideProps`, `getStaticProps`)
- Simple mental model: pages are server-rendered by default
- Easier migration from CRA (Create React App)
- Extensive community knowledge and examples

**Cons:**
- No Server Components (everything is client-rendered or needs `getServerSideProps`)
- More boilerplate for common patterns
- Layouts must be implemented manually or with third-party solutions
- No built-in streaming with Suspense
- Page-level head management via `_document.tsx`
- Pages Router is in maintenance mode (no new features)

### 3. Vite + React SPA

Single-page application with Vite as the build tool, no SSR.

**Pros:**
- Simple, familiar React patterns
- Fast HMR during development
- No SSR complexity
- Can be deployed as static files

**Cons:**
- No SSR means SEO disadvantages for public pages
- No server-side data fetching (must call APIs from client)
- Poor initial load performance (hydration required)
- No built-in routing (needs react-router)
- Loss of Next.js optimizations (image, font, link prefetching)

## Decision

**Chosen: Next.js App Router (Next.js 14)**

### Why App Router over alternatives:

1. **React Server Components reduce client bundle** - Dashboard pages can fetch data on the server without sending data-fetching libraries to the client. This directly improves Core Web Vitals, especially TTI (Time to Interactive).

2. **Nested layouts match dashboard architecture** - The `(dashboard)/layout.tsx` wraps all dashboard routes with the sidebar, header, and bottom navigation. This layout persists across navigation, providing a seamless single-page-app feel without the complexity of state management for layout state.

3. **Route Groups organize auth vs. protected routes** - `(auth)/` and `(dashboard)/` route groups keep auth pages and protected pages cleanly separated without affecting the URL structure.

4. **`"use client"` is explicit and opt-in** - We choose which components need interactivity (React hooks, browser APIs). Everything else is server-rendered by default, reducing unnecessary JavaScript.

5. **Built-in streaming with Suspense** - Loading states are handled via `loading.tsx` files, providing instant navigation feedback while data fetches. The skeleton components in our pages demonstrate this pattern.

6. **Next.js's recommended direction** - Vercel and the Next.js team have made clear that the App Router is the future. New features are built for App Router first. Pages Router is in maintenance mode.

7. **Dashboard UX requires SSR** - User-specific data (application status, PPS scores, interview history) should render on the server for fast first paint. App Router makes this natural.

### Why not the alternatives:

- **Pages Router**: Stable but in maintenance. Missing Server Components, nested layouts, and streaming SSR. Would require significant rework if we ever wanted to migrate.
- **Vite SPA**: No SSR means poor SEO and slower initial load. We have public-facing pages (landing) and authenticated pages that benefit from SSR.

## Consequences

### Positive

- Smaller client-side JavaScript bundles (Server Components)
- Nested layouts for the dashboard shell without external state management
- Streaming SSR provides fast perceived performance
- Loading and error boundaries per route via conventions
- Route Groups provide clean code organization
- Future-proof with Next.js's investment direction

### Negative

- Must understand Server vs. Client component boundary
- Third-party libraries need verification for RSC compatibility
- `use client` directive required for any component using hooks
- Some patterns (server-side cookies, headers) work differently
- Learning curve for developers new to RSC

## Implementation Notes

### Route Group Organization

```
app/
├── (auth)/              # Route group: auth pages
│   ├── login/
│   └── register/
├── (dashboard)/         # Route group: protected pages
│   ├── layout.tsx       # Dashboard shell with Sidebar + Header + BottomNav
│   ├── dashboard/
│   ├── applications/
│   ├── interview/
│   ├── resume/
│   ├── roles/
│   ├── settings/
│   └── skills/
├── onboarding/
├── layout.tsx           # Root layout (fonts, global providers)
└── page.tsx             # Landing page
```

### Client vs. Server Components

| Component | Type | Reason |
|-----------|------|--------|
| `DashboardLayout` | Client | Uses `useAuthStore`, `useRouter`, `useEffect` |
| `Sidebar` | Client | Interactive state, active route detection |
| Dashboard pages | Client | Use `useState`, `useEffect`, event handlers |
| `KanbanBoard` | Client | Drag-and-drop state management |
| `SessionInterface` | Client | Real-time answer submission, timer |

All data-fetching components can use either:
- Server Components with `async/await` (preferred for initial data)
- Client Components with `useEffect` + API calls (for client-side refresh)

### Middleware Protection

`middleware.ts` at the root level protects all routes except auth pages:

```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value
    || request.headers.get("authorization");
  const isAuthPage = request.nextUrl.pathname.startsWith("/login")
    || request.nextUrl.pathname.startsWith("/register");

  if (!token && !isAuthPage && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```

### Fonts

We use Next.js font optimization with `next/font/google`:
- **Manrope** - UI font (headings, body)
- **Noto Serif** - Display font (special headings)

These are loaded at the root layout level and applied via CSS variables (`--font-manrope`, `--font-noto-serif`), used throughout the Tailwind configuration.
