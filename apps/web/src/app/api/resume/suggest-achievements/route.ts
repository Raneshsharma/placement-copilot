import { NextRequest, NextResponse } from "next/server";

// Call Anthropic Claude API
async function callClaude(system: string, user: string, apiKey?: string) {
  if (!apiKey) return null;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-20250514",
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!response.ok) return null;
  const result = await response.json();
  return result.content?.[0]?.text?.trim() || null;
}

const FALLBACK_ACHIEVEMENTS: Record<string, string[]> = {
  "Software Engineer": [
    "Designed and implemented RESTful APIs serving 10K+ daily requests with 99.9% uptime",
    "Reduced application load time by 35% through code optimization and lazy loading",
    "Led migration of legacy monolith to microservices architecture, improving deployment frequency by 4x",
  ],
  "Frontend Developer": [
    "Built responsive UI components reducing page load time by 40% and improving Core Web Vitals scores",
    "Implemented design system adopted by 5 engineers, reducing UI development time by 30%",
    "Integrated analytics tracking that provided actionable insights leading to 15% conversion increase",
  ],
  "Product Manager": [
    "Launched feature that increased user retention by 25% through data-driven product decisions",
    "Managed roadmap for $2M product line, aligning engineering capacity with business priorities",
    "Conducted 50+ user interviews to gather insights that shaped product direction",
  ],
  default: [
    "Delivered project on time and under budget, exceeding stakeholder expectations",
    "Improved team productivity by implementing streamlined workflows and automation",
    "Reduced operational costs by identifying and eliminating process bottlenecks",
  ],
};

const FALLBACK_SKILLS: Record<string, string[]> = {
  "Software Engineer": ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS", "Docker", "Git", "REST APIs"],
  "Frontend Developer": ["React", "TypeScript", "CSS", "HTML", "Next.js", "Tailwind", "GraphQL", "Jest"],
  "Full Stack Developer": ["React", "Node.js", "PostgreSQL", "MongoDB", "AWS", "TypeScript", "Docker", "Redis"],
  "Data Scientist": ["Python", "SQL", "Pandas", "Scikit-learn", "TensorFlow", "Tableau", "AWS", "Statistics"],
  "Product Manager": ["Product Strategy", "Agile", "User Research", "Data Analysis", "Jira", "Roadmapping", "A/B Testing"],
  default: ["Communication", "Problem Solving", "Leadership", "Project Management", "Analytical Skills"],
};

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, company, bullets, existingAchievements } = await request.json();
    const apiKey = process.env.ANthropic_API_KEY || process.env.ANTHROPIC_API_KEY;

    const systemPrompt = `You are an expert resume writer specializing in achievement-focused bullet points. Generate 3 specific, quantifiable achievement bullets for the given job title. Each bullet should:
1. Start with an action verb
2. Include metrics/numbers where possible
3. Show impact/result
4. Be ATS-friendly (include relevant keywords)
Return ONLY a JSON array of strings, no markdown, no numbering. Example: ["Led team of 5 to deliver project 2 weeks early","Reduced costs by 20% through process improvement"]`;

    const userPrompt = `Job Title: ${jobTitle || "Professional"}
Company: ${company || "Company"}
Existing achievements: ${(existingAchievements || bullets || []).join(" | ")}
${jobTitle ? "" : "Note: Job title not specified, generate general professional achievements."}`;

    const text = await callClaude(systemPrompt, userPrompt, apiKey);

    if (text) {
      // Try to parse as JSON array
      try {
        // Claude might wrap in code blocks
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const achievements = JSON.parse(cleaned);
        if (Array.isArray(achievements)) {
          return NextResponse.json({ data: { achievements } });
        }
      } catch {
        // Try extracting lines
        const lines = text.split("\n").map((l: string) => l.replace(/^[-*]\s*/, "").replace(/^\d+[.)]\s*/, "").trim()).filter(Boolean);
        if (lines.length > 0) {
          return NextResponse.json({ data: { achievements: lines } });
        }
      }
    }

    // Fallback based on job title
    const key = Object.keys(FALLBACK_ACHIEVEMENTS).find(k =>
      jobTitle?.toLowerCase().includes(k.toLowerCase())
    ) || "default";

    return NextResponse.json({ data: { achievements: FALLBACK_ACHIEVEMENTS[key] } });
  } catch (error: any) {
    console.error("Suggest achievements error:", error?.message || error);
    return NextResponse.json({
      data: { achievements: FALLBACK_ACHIEVEMENTS.default },
    });
  }
}
