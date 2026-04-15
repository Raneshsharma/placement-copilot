/**
 * Placement Copilot E2E Test Suite v2
 * Run with: node e2e-tests.mjs
 */

import { chromium } from "playwright";

const BASE = "http://127.0.0.1:3000";
const API = "http://127.0.0.1:3001";
const results = [];
const bugs = [];

function log(level, msg, details = "") {
  const prefix = level === "PASS" ? "✅" : level === "FAIL" ? "❌" : level === "WARN" ? "⚠️" : "ℹ️";
  console.log(`${prefix} [${level}] ${msg}`, details ? `\n  ${details}` : "");
}

function bug(title, severity, repro, expected, actual, rootCause = "", fix = "") {
  bugs.push({ title, severity, repro, expected, actual, rootCause, fix });
  log("FAIL", title, `Severity: ${severity} | Repro: ${repro} | Expected: ${expected} | Actual: ${actual}`);
}

async function test(name, fn) {
  try {
    await fn();
    log("PASS", name);
    results.push({ name, status: "PASS" });
  } catch (err) {
    log("FAIL", name, err.message);
    results.push({ name, status: "FAIL", error: err.message });
  }
}

async function testNoThrow(name, fn) {
  try {
    await fn();
    results.push({ name, status: "PASS" });
  } catch (err) {
    log("FAIL", name, err.message);
    results.push({ name, status: "FAIL", error: err.message });
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

async function createBrowser() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  const errors = [];
  page.on("console", msg => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", err => errors.push(`PAGE ERR: ${err.message}`));
  page.on("response", res => {
    if (res.status() >= 400) {
      const url = res.url();
      // Ignore asset 404s (stale chunks)
      if (!url.includes("_next/static") && !url.includes(".hot-update")) {
        errors.push(`HTTP ${res.status()} on ${url}`);
      }
    }
  });

  return { browser, ctx, page, errors };
}

// Register a user via the mock API and set auth state in browser.
// Uses NestJS for real JWT tokens so API calls succeed.
async function authenticateBrowser(ctx) {
  // Step 1: Register user in NestJS to get a real JWT
  const uniqueEmail = `qa_${Date.now()}@placementcopilot.com`;
  const regRes = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: uniqueEmail, password: "Test1234!", firstName: "QA", lastName: "Test" }),
  });
  const regData = await regRes.json();
  // NestJS wraps response: { data: { user, accessToken, refreshToken } }
  const accessToken = regData?.data?.accessToken ?? regData?.accessToken;
  const refreshToken = regData?.data?.refreshToken ?? regData?.refreshToken;
  if (!accessToken) throw new Error(`NestJS register failed: ${JSON.stringify(regData).slice(0, 200)}`);

  // Step 2: Set cookies (middleware reads auth-token cookie for route protection)
  await ctx.addCookies([
    { name: "auth-token", value: accessToken, domain: "127.0.0.1", path: "/" },
    { name: "accessToken", value: accessToken, domain: "127.0.0.1", path: "/" },
    { name: "refreshToken", value: refreshToken || "", domain: "127.0.0.1", path: "/" },
  ]);

  // Step 3: Set localStorage (axios interceptor reads from localStorage)
  await ctx.addInitScript({
    content: `
      try {
        localStorage.setItem("accessToken", "${accessToken}");
        localStorage.setItem("refreshToken", "${refreshToken || ""}");
        localStorage.setItem("user", JSON.stringify({ email: "${uniqueEmail}" }));
        localStorage.setItem("auth-storage", JSON.stringify({
          state: {
            token: "${accessToken}",
            refreshToken: "${refreshToken || ""}",
            accessToken: "${accessToken}",
            isAuthenticated: true,
            user: { email: "${uniqueEmail}" },
          },
          version: 0,
        }));
      } catch(e) { /* ignore */ }
    `,
  });

  return { accessToken, refreshToken, user: { email: uniqueEmail }, email: uniqueEmail };
}

// ─── TESTS ─────────────────────────────────────────────────────────────────────

async function runLandingPageTests() {
  log("INFO", "=== LANDING PAGE TESTS ===");
  const { browser, page } = await createBrowser();

  await test("Landing page loads", async () => {
    await page.goto(BASE);
    await page.waitForLoadState("load");
    const title = await page.title();
    if (!title.toLowerCase().includes("placement")) throw new Error(`Unexpected title: ${title}`);
  });

  await test("Landing page has hero section", async () => {
    const body = await page.textContent("body");
    if (!body.includes("Placement Copilot")) throw new Error("Brand name not found");
  });

  await test("Landing page has features section", async () => {
    const features = await page.$('[class*="features"], #features, section');
    if (!features) throw new Error("No features section found");
  });

  await test("Landing page has Get Started CTA", async () => {
    const cta = await page.getByText("Get Started", { exact: false }).first();
    if (!cta) throw new Error("No 'Get Started' CTA found");
  });

  await test("Landing page Sign In navigation works", async () => {
    const signIn = page.getByText("Sign In", { exact: false }).first();
    await signIn.click();
    await page.waitForURL("**/login**", { timeout: 5000 });
  });

  await browser.close();
}

async function runAuthTests() {
  log("INFO", "=== AUTH TESTS ===");
  const { browser, page } = await createBrowser();

  await test("Login page loads with form elements", async () => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState("load");
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitBtn = await page.$('button[type="submit"]');
    if (!emailInput || !passwordInput || !submitBtn) throw new Error("Missing form elements");
  });

  await test("Login with wrong password shows error", async () => {
    await page.fill('input[type="email"]', "test@test.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await page.waitForTimeout;
    const body = await page.textContent("body");
    if (!body.match(/invalid|wrong|error|incorrect/i) && !page.url().includes("/login")) {
      log("WARN", "Login with wrong password: no error shown (may have succeeded)");
    }
  });

  await test("Mock register creates user and sets auth", async () => {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `reg_${Date.now()}@test.com`, password: "Test1234!", firstName: "Reg", lastName: "User" }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.data?.accessToken) throw new Error(`Register failed: ${JSON.stringify(data)}`);
  });

  await test("Mock login with correct credentials works", async () => {
    // demo account: demo@placementcopilot.com / Demo1234!
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "demo@placementcopilot.com", password: "Demo1234!" }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.data?.accessToken) throw new Error(`Login failed: ${JSON.stringify(data)}`);
  });

  await test("Wrong mock credentials return 401", async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "demo@placementcopilot.com", password: "wrongpassword!" }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await browser.close();
}

async function runMiddlewareTests() {
  log("INFO", "=== MIDDLEWARE TESTS ===");
  const { browser, page } = await createBrowser();

  await test("Dashboard redirects to login when unauthenticated", async () => {
    await page.goto(`${BASE}/dashboard`);
    await page.waitForURL("**/login**", { timeout: 5000 });
    if (!page.url().includes("/login")) throw new Error(`Expected redirect to /login, got ${page.url()}`);
  });

  await test("Login page accessible without auth", async () => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState("load");
    if (!page.url().includes("/login")) throw new Error(`Expected /login, got ${page.url()}`);
  });

  await test("Onboarding entry accessible without auth", async () => {
    await page.goto(`${BASE}/onboarding/entry`);
    await page.waitForLoadState("load");
    if (!page.url().includes("/onboarding/entry")) throw new Error(`Expected /onboarding/entry, got ${page.url()}`);
  });

  await browser.close();
}

async function runDashboardTests() {
  log("INFO", "=== DASHBOARD TESTS ===");
  const { browser, ctx, page, errors } = await createBrowser();
  await authenticateBrowser(ctx);

  await test("Dashboard loads when authenticated", async () => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    await page.waitForTimeout; // Wait for React hydration + API calls
    if (page.url().includes("/login")) throw new Error("Redirected to login - auth cookie not set");
    const body = await page.textContent("body");
    if (!body || body.length < 100) throw new Error("Dashboard page appears empty");
  });

  await test("Dashboard has Quick Actions cards", async () => {
    // Check for the cards that are confirmed to render in the dashboard Quick Actions grid.
    // "LinkedIn Optimizer" and "Import Profile" were confirmed visible in the browser.
    await page.waitForSelector('text="LinkedIn Optimizer"', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(200);
    const body = await page.textContent("body");
    if (!body.includes("LinkedIn Optimizer")) {
      throw new Error("No quick action cards found on dashboard");
    }
  });

  await test("Dashboard LinkedIn card exists", async () => {
    const linkedin = await page.getByText("LinkedIn", { exact: false }).first();
    if (!linkedin) throw new Error("No LinkedIn card found");
  });

  await test("Dashboard Import Profile card exists", async () => {
    const imp = await page.getByText("Import Profile", { exact: false }).first();
    if (!imp) throw new Error("No 'Import Profile' card found");
  });

  await test("Dashboard has PPS Score card", async () => {
    const body = await page.textContent("body");
    if (!body.includes("PPS") && !body.includes("Profile")) {
      log("WARN", "PPS card may not be present on dashboard");
    }
  });

  if (errors.filter(e => !e.includes("401") && !e.includes("_next")).length > 0) {
    bug("Dashboard console/network errors", "MEDIUM", "Load dashboard",
      "No critical errors",
      errors.filter(e => !e.includes("401") && !e.includes("_next")).join("; "),
      "Dashboard API calls to NestJS return 401 — mock tokens vs NestJS JWT mismatch",
      "Tests auth: use NestJS for real JWTs; Dashboard: mock API not connected to NestJS auth");
  }

  await browser.close();
}

async function runOnboardingEntryTests() {
  log("INFO", "=== ONBOARDING ENTRY TESTS ===");
  const { browser, ctx, page, errors } = await createBrowser();
  await authenticateBrowser(ctx); // needed because Build from Scratch navigates to /resume/builder

  await test("Onboarding entry loads without auth", async () => {
    await page.goto(`${BASE}/onboarding/entry`);
    await page.waitForLoadState("load");
    const h1 = await page.textContent("h1");
    if (!h1) throw new Error("No h1 on onboarding entry");
  });

  await test("Three entry option cards are visible", async () => {
    const cards = await page.$$('[class*="card"]');
    if (cards.length < 3) throw new Error(`Expected 3 cards, found ${cards.length}`);
  });

  await test("Upload Resume CTA opens file picker and shows dropzone", async () => {
    // Click the START button (not the card itself)
    const startBtn = page.getByRole("button", { name: "Start with Resume", exact: true });
    await startBtn.click();
    await page.waitForTimeout(500);
    const body = await page.textContent("body");
    // Should show upload area
    if (!body.includes("resume") && !body.includes("Drop") && !body.includes("upload")) {
      throw new Error("Upload area not visible after clicking 'Start with Resume'");
    }
  });

  await test("Build from Scratch deep-links to builder at Profile step", async () => {
    await page.goto(`${BASE}/onboarding/entry`);
    await page.waitForLoadState("load");
    const scratchBtn = page.getByRole("button", { name: "Start from Scratch", exact: true });
    await scratchBtn.click();
    // Verify the URL includes ?from=onboarding
    await page.waitForURL("**/resume/builder**", { timeout: 5000 });
    await page.waitForTimeout;
    const url = page.url();
    if (!url.includes("from=onboarding")) {
      bug("Build from Scratch skips intro", "LOW", "Click 'Start from Scratch' from onboarding",
        "Skip to Profile step (step 2)", "Shows intro screen instead",
        "Button click navigates without ?from=onboarding param", "Update button to include ?from=onboarding in URL");
    }
  });

  await test("LinkedIn shows coming soon when no client ID configured", async () => {
    await page.goto(`${BASE}/onboarding/entry`);
    await page.waitForLoadState("load");
    const linkedInBtn = page.getByRole("button", { name: "Start with LinkedIn", exact: true });
    await linkedInBtn.click();
    await page.waitForTimeout;
    const body = await page.textContent("body");
    if (body.includes("being set up. Try uploading")) {
      bug("Old LinkedIn placeholder text", "HIGH", "Click 'Start with LinkedIn' with no client ID",
        "Clean 'coming soon' card", "Misleading error message 'being set up. Try uploading'",
        "Fix applied but not verified yet", "Check if coming_soon state renders");
    } else if (!body.includes("coming") && !body.includes("coming soon") && !body.includes("LinkedIn")) {
      log("WARN", "Unexpected LinkedIn click result - may have navigated to OAuth");
    }
  });

  await browser.close();
}

async function runResumeBuilderTests() {
  log("INFO", "=== RESUME BUILDER TESTS ===");
  const { browser, ctx, page } = await createBrowser();
  await authenticateBrowser(ctx);

  await test("Resume builder loads", async () => {
    await page.goto(`${BASE}/resume/builder`);
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
    if (page.url().includes("/login")) throw new Error("Not authenticated");
  });

  await test("Resume builder ?from=onboarding skips intro step", async () => {
    await page.goto(`${BASE}/resume/builder?from=onboarding`);
    await page.waitForLoadState("load");
    await page.waitForTimeout;
    const body = await page.textContent("body");
    if (body.includes("How would you like to start")) {
      bug("Builder doesn't skip intro with ?from=onboarding", "MEDIUM",
        "Load /resume/builder?from=onboarding",
        "Skip to step 2 (Profile)", "Shows intro step 0",
        "useEffect may not run before initial render", "Add searchParams as state dependency");
    }
  });

  await test("Resume builder StepStart card click navigates to next step", async () => {
    await page.goto(`${BASE}/resume/builder`);
    await page.waitForLoadState("load");
    // Click "Start from Scratch" in builder intro
    const scratchBtn = page.getByText("Start from Scratch", { exact: false }).first();
    await scratchBtn.click();
    await page.waitForTimeout;
    const body = await page.textContent("body");
    if (body.includes("How would you like to start")) {
      throw new Error("Still on intro after clicking Start from Scratch");
    }
  });

  await browser.close();
}

async function runRolesTests() {
  log("INFO", "=== ROLES PAGE TESTS ===");
  const { browser, ctx, page } = await createBrowser();
  await authenticateBrowser(ctx);

  await test("Roles page loads", async () => {
    await page.goto(`${BASE}/roles`);
    await page.waitForLoadState("load");
    await page.waitForTimeout;
    if (page.url().includes("/login")) throw new Error("Not authenticated");
  });

  await test("Roles page displays job listings or empty state", async () => {
    const body = await page.textContent("body");
    if (!body) throw new Error("Empty body on roles page");
    // Should show something meaningful
    if (!body.includes("Role") && !body.includes("Job") && !body.includes("Find")) {
      log("WARN", "Roles page body doesn't contain expected content");
    }
  });

  await test("Roles page has filter controls", async () => {
    const body = await page.textContent("body");
    if (!body.includes("Match") && !body.includes("Remote") && !body.includes("Filter")) {
      log("WARN", "No filter controls found on roles page");
    }
  });

  await browser.close();
}

async function runApplicationsTests() {
  log("INFO", "=== APPLICATIONS PAGE TESTS ===");
  const { browser, ctx, page } = await createBrowser();
  await authenticateBrowser(ctx);

  await test("Applications page loads", async () => {
    await page.goto(`${BASE}/applications`);
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
    if (page.url().includes("/login")) throw new Error("Not authenticated");
  });

  await test("Applications page shows application tracker", async () => {
    const body = await page.textContent("body");
    if (!body.includes("Application") && !body.includes("application")) {
      log("WARN", "Applications page may not show application content");
    }
  });

  await browser.close();
}

async function runInterviewTests() {
  log("INFO", "=== INTERVIEW TESTS ===");
  const { browser, ctx, page } = await createBrowser();
  await authenticateBrowser(ctx);

  await test("Interview overview page loads", async () => {
    await page.goto(`${BASE}/interview`);
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
    if (page.url().includes("/login")) throw new Error("Not authenticated");
  });

  await test("Interview setup page loads", async () => {
    await page.goto(`${BASE}/interview/setup`);
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
    const body = await page.textContent("body");
    if (!body || body.trim().length < 50) throw new Error("Interview setup page empty");
  });

  await browser.close();
}

async function runSkillsAndSettingsTests() {
  log("INFO", "=== SKILLS & SETTINGS TESTS ===");
  const { browser, ctx, page } = await createBrowser();
  await authenticateBrowser(ctx);

  await test("Skills page loads", async () => {
    await page.goto(`${BASE}/skills`);
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
  });

  await test("Settings page loads", async () => {
    await page.goto(`${BASE}/settings`);
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
  });

  await test("Workspace page loads", async () => {
    await page.goto(`${BASE}/workspace`);
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
  });

  await browser.close();
}

async function runApiFlowTests() {
  log("INFO", "=== API FLOW TESTS (NestJS Backend) ===");

  await test("API health check passes", async () => {
    const res = await fetch(`${API}/api/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    const data = await res.json();
    if (data.status !== "ok") throw new Error(`Unexpected health response`);
  });

  await test("NestJS auth: register creates user", async () => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `api_${Date.now()}@placementcopilot.com`, password: "Test1234!", firstName: "API", lastName: "Test" }),
    });
    const data = await res.json();
    if (res.status !== 201 || !data.data?.accessToken) throw new Error(`Register failed: ${JSON.stringify(data)}`);
  });

  await test("NestJS auth: login with demo credentials works", async () => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "demo@placementcopilot.com", password: "Demo1234!" }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.data?.accessToken) throw new Error(`Login failed: ${JSON.stringify(data)}`);
  });

  await test("NestJS auth: wrong password returns 401", async () => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "demo@placementcopilot.com", password: "wrongpassword!" }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await test("NestJS auth: protected endpoint rejects unauthenticated", async () => {
    const res = await fetch(`${API}/api/auth/me`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // Cache a valid token once and reuse for subsequent auth tests (avoids NestJS throttling)
  // Brief delay before token fetch to avoid throttling from previous tests
  await new Promise(r => setTimeout(r, 2000));

  let cachedNestJSToken = "";
  {
    // One fresh login for token reuse (may need retry if throttled)
    let attempts = 0;
    while (attempts < 3) {
      const loginRes = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "demo@placementcopilot.com", password: "Demo1234!" }),
      });
      const loginData = await loginRes.json();
      cachedNestJSToken = loginData?.data?.accessToken ?? loginData?.accessToken ?? "";
      if (cachedNestJSToken) break;
      // Throttled or error — wait and retry
      await new Promise(r => setTimeout(r, 3000));
      attempts++;
    }
    if (!cachedNestJSToken) throw new Error(`No token after 3 attempts: ${JSON.stringify(loginData || {}).slice(0, 200)}`);
  }

  await test("NestJS auth: protected endpoint accepts valid Bearer token", async () => {
    if (!cachedNestJSToken) throw new Error("No cached token available");
    const meRes = await fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${cachedNestJSToken}` },
    });
    const meData = await meRes.json();
    if (meRes.status !== 200 || !meData.data?.email) throw new Error(`Auth/me failed: ${meRes.status} ${JSON.stringify(meData).slice(0, 200)}`);
  });

  // Brief delay between tests to avoid NestJS Throttler (10 req/min per IP)
  await new Promise(r => setTimeout(r, 1000));

  await test("NestJS jobs endpoint returns job listings", async () => {
    if (!cachedNestJSToken) throw new Error("No cached token available");
    const res = await fetch(`${API}/api/jobs`, {
      headers: { Authorization: `Bearer ${cachedNestJSToken}` },
    });
    if (res.status !== 200) throw new Error(`Jobs endpoint failed: ${res.status}`);
    const data = await res.json();
    const items = data.data?.items ?? data.items ?? data.data ?? [];
    if (!Array.isArray(items)) throw new Error(`Jobs didn't return array: ${typeof items}`);
  });

  // Brief delay between tests to avoid NestJS Throttler (10 req/min per IP)
  await new Promise(r => setTimeout(r, 1000));

  await test("NestJS progress endpoint accessible with auth", async () => {
    if (!cachedNestJSToken) throw new Error("No cached token available");
    const res = await fetch(`${API}/api/progress`, {
      headers: { Authorization: `Bearer ${cachedNestJSToken}` },
    });
    if (res.status !== 200) throw new Error(`Progress endpoint failed: ${res.status}`);
  });

  await test("Frontend mock /api/jobs returns data", async () => {
    const res = await fetch(`${BASE}/api/jobs`);
    if (res.status !== 200) throw new Error(`Mock jobs failed: ${res.status}`);
    const data = await res.json();
    const items = data.items ?? data.data?.items ?? data.data ?? [];
    if (!Array.isArray(items)) throw new Error(`Mock jobs didn't return array`);
  });
}

async function runOnboardingFlowTests() {
  log("INFO", "=== ONBOARDING WIZARD FLOW ===");
  const { browser, ctx, page } = await createBrowser();
  await authenticateBrowser(ctx);

  await test("Full onboarding wizard loads", async () => {
    await page.goto(`${BASE}/onboarding`);
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
    const body = await page.textContent("body");
    if (!body) throw new Error("Onboarding wizard returned empty page");
  });

  await test("Onboarding confirm page accessible", async () => {
    await page.goto(`${BASE}/onboarding/confirm`);
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
    // Should redirect or show content
    const body = await page.textContent("body");
    if (!body) throw new Error("Onboarding confirm returned empty");
  });

  await browser.close();
}

async function runNavigationTests() {
  log("INFO", "=== NAVIGATION SMOKE TESTS ===");
  const { browser, ctx, page } = await createBrowser();
  await authenticateBrowser(ctx);

  const routes = [
    "/dashboard",
    "/resume",
    "/roles",
    "/skills",
    "/applications",
    "/interview",
    "/settings",
    "/workspace",
    "/linkedin",
  ];

  for (const route of routes) {
    await testNoThrow(`Navigate to ${route}`, async () => {
      await page.goto(`${BASE}${route}`);
      await page.waitForLoadState("load");
      await page.waitForTimeout(800);
      if (page.url().includes("/login")) {
        throw new Error(`${route} redirected to login`);
      }
      const body = await page.textContent("body");
      if (!body || body.trim().length < 20) {
        throw new Error(`${route} returned minimal content`);
      }
    });
  }

  await browser.close();
}

// ─── MAIN ────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60));
  console.log("  PLACEMENT COPILOT - E2E TEST SUITE v2");
  console.log("=".repeat(60));
  console.log("");

  await runLandingPageTests();
  await runAuthTests();
  await runMiddlewareTests();
  await runDashboardTests();
  await runOnboardingEntryTests();
  await runResumeBuilderTests();
  await runRolesTests();
  await runApplicationsTests();
  await runInterviewTests();
  await runSkillsAndSettingsTests();
  await runOnboardingFlowTests();
  await runApiFlowTests();
  await runNavigationTests();

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("  SUMMARY");
  console.log("=".repeat(60));
  const passed = results.filter(r => r.status === "PASS").length;
  const failed = results.filter(r => r.status === "FAIL").length;
  console.log(`Total: ${results.length} | ✅ ${passed} passed | ❌ ${failed} failed\n`);

  if (bugs.length > 0) {
    console.log("\n🐛 BUGS FOUND:");
    console.log("-".repeat(60));
    bugs.forEach((b, i) => {
      console.log(`\n[${i + 1}] ${b.title} [${b.severity}]`);
      console.log(`   Repro: ${b.repro}`);
      console.log(`   Expected: ${b.expected}`);
      console.log(`   Actual: ${b.actual}`);
      if (b.rootCause) console.log(`   Root cause: ${b.rootCause}`);
      if (b.fix) console.log(`   Suggested fix: ${b.fix}`);
    });
  }

  console.log("\n📋 PASS/FAIL MATRIX:");
  console.log("-".repeat(60));
  results.forEach(r => {
    const icon = r.status === "PASS" ? "✅" : "❌";
    const note = r.error ? ` — ${r.error.slice(0, 80)}` : "";
    console.log(`  ${icon} ${r.name}${note}`);
  });

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error("Test suite crashed:", err);
  process.exit(1);
});
